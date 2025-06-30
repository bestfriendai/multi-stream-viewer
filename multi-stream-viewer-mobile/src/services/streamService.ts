import { Stream } from '../types';
import { config } from '../constants/config';

class StreamService {
  private baseUrl = config.api.baseUrl;
  private timeout = config.api.timeout;

  /**
   * Fetch streams from official APIs
   * This replaces mock data with real API calls
   */
  async fetchStreams(platform: string, query?: string): Promise<Stream[]> {
    try {
      const response = await fetch(`${this.baseUrl}/streams/${platform}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch streams: ${response.statusText}`);
      }

      const data = await response.json();
      return this.validateStreams(data.streams || []);
    } catch (error) {
      console.error('Error fetching streams:', error);
      throw new Error('Unable to load streams. Please check your connection and try again.');
    }
  }

  /**
   * Validate stream data to ensure it meets Apple's content guidelines
   */
  private validateStreams(streams: any[]): Stream[] {
    return streams
      .filter(stream => {
        // Filter out streams that don't meet content guidelines
        return (
          stream.id &&
          stream.channelName &&
          stream.platform &&
          !this.containsInappropriateContent(stream)
        );
      })
      .map(stream => ({
        id: stream.id,
        platform: stream.platform,
        channelName: stream.channelName,
        displayName: stream.displayName || stream.channelName,
        title: this.sanitizeTitle(stream.title || ''),
        category: stream.category || 'General',
        viewerCount: parseInt(stream.viewerCount) || 0,
        thumbnailUrl: this.validateImageUrl(stream.thumbnailUrl),
        avatarUrl: this.validateImageUrl(stream.avatarUrl),
        streamUrl: stream.streamUrl || '',
        isLive: Boolean(stream.isLive),
        startedAt: stream.startedAt || new Date().toISOString(),
        language: stream.language || 'en',
        tags: this.sanitizeTags(stream.tags || []),
      }));
  }

  /**
   * Check for inappropriate content based on title and tags
   */
  private containsInappropriateContent(stream: any): boolean {
    const prohibited = [
      // Add prohibited terms based on Apple's guidelines
      'adult',
      'nsfw',
      '18+',
      'gambling',
      'casino',
    ];

    const content = `${stream.title} ${stream.tags?.join(' ')}`.toLowerCase();
    return prohibited.some(term => content.includes(term));
  }

  /**
   * Sanitize stream titles to remove inappropriate content
   */
  private sanitizeTitle(title: string): string {
    // Remove excessive punctuation and clean up
    return title
      .replace(/[^\w\s\-\.,:;!?'"]/g, '')
      .trim()
      .substring(0, 200); // Limit length
  }

  /**
   * Validate and sanitize image URLs
   */
  private validateImageUrl(url?: string): string {
    if (!url || !this.isValidUrl(url)) {
      return 'https://via.placeholder.com/300x169?text=No+Preview';
    }
    
    // Ensure HTTPS
    return url.replace(/^http:/, 'https:');
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch {
      return false;
    }
  }

  /**
   * Sanitize tags to ensure they're appropriate
   */
  private sanitizeTags(tags: string[]): string[] {
    return tags
      .filter(tag => tag && tag.length > 0 && tag.length < 50)
      .slice(0, 10); // Limit number of tags
  }

  /**
   * Report inappropriate content
   */
  async reportStream(streamId: string, reason: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/streams/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          streamId,
          reason,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error reporting stream:', error);
    }
  }
}

export default new StreamService();