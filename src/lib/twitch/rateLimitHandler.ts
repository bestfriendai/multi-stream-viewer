/**
 * Twitch API Rate Limit Handler
 * Implements token-bucket algorithm as per Twitch documentation
 */

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export class TwitchRateLimitHandler {
  private rateLimitInfo: RateLimitInfo = {
    limit: 800,
    remaining: 800,
    reset: Date.now() + 60000
  };
  
  private waitingQueue: Array<() => void> = [];
  private isWaiting = false;

  /**
   * Extract rate limit info from response headers
   */
  updateFromHeaders(headers: Headers) {
    const limit = headers.get('Ratelimit-Limit');
    const remaining = headers.get('Ratelimit-Remaining');
    const reset = headers.get('Ratelimit-Reset');

    if (limit) this.rateLimitInfo.limit = parseInt(limit);
    if (remaining) this.rateLimitInfo.remaining = parseInt(remaining);
    if (reset) this.rateLimitInfo.reset = parseInt(reset) * 1000; // Convert to milliseconds
  }

  /**
   * Check if we can make a request
   */
  canMakeRequest(): boolean {
    // Reset if time has passed
    if (Date.now() > this.rateLimitInfo.reset) {
      this.rateLimitInfo.remaining = this.rateLimitInfo.limit;
      this.rateLimitInfo.reset = Date.now() + 60000;
    }

    return this.rateLimitInfo.remaining > 0;
  }

  /**
   * Wait until rate limit resets
   */
  async waitForReset(): Promise<void> {
    if (this.isWaiting) {
      // Already waiting, join the queue
      return new Promise(resolve => {
        this.waitingQueue.push(resolve);
      });
    }

    this.isWaiting = true;
    const waitTime = Math.max(0, this.rateLimitInfo.reset - Date.now() + 100); // Add 100ms buffer
    
    console.log(`Rate limited. Waiting ${Math.ceil(waitTime / 1000)}s until reset`);
    
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Reset the limit
    this.rateLimitInfo.remaining = this.rateLimitInfo.limit;
    this.isWaiting = false;

    // Resolve all waiting requests
    while (this.waitingQueue.length > 0) {
      const resolve = this.waitingQueue.shift();
      if (resolve) resolve();
    }
  }

  /**
   * Execute a request with rate limit handling
   */
  async executeRequest<T>(
    request: () => Promise<Response>
  ): Promise<T> {
    // Wait if we're rate limited
    if (!this.canMakeRequest()) {
      await this.waitForReset();
    }

    // Decrement available requests
    this.rateLimitInfo.remaining--;

    try {
      const response = await request();
      
      // Update rate limit info from response
      this.updateFromHeaders(response.headers);

      // Handle rate limit response
      if (response.status === 429) {
        // Parse retry-after if available
        const retryAfter = response.headers.get('Retry-After');
        if (retryAfter) {
          this.rateLimitInfo.reset = Date.now() + (parseInt(retryAfter) * 1000);
        }
        
        // Wait and retry
        await this.waitForReset();
        return this.executeRequest(request);
      }

      if (!response.ok) {
        throw new Error(`Twitch API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Restore the request count on error (except for rate limits)
      if (!(error instanceof Error && error.message.includes('429'))) {
        this.rateLimitInfo.remaining++;
      }
      throw error;
    }
  }

  /**
   * Get current rate limit status
   */
  getStatus(): RateLimitInfo {
    return { ...this.rateLimitInfo };
  }
}