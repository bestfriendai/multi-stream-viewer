interface TwitchToken {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  obtained_at: number;
}

class TokenManager {
  private static instance: TokenManager;
  private token: TwitchToken | null = null;

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async getValidToken(): Promise<string> {
    if (!this.token || this.isTokenExpired()) {
      this.token = await this.refreshToken();
    }
    return this.token.access_token;
  }

  private isTokenExpired(): boolean {
    if (!this.token) return true;
    const expiryTime = this.token.obtained_at + (this.token.expires_in * 1000);
    return Date.now() >= expiryTime - 300000; // Refresh 5 minutes early
  }

  private async refreshToken(): Promise<TwitchToken> {
    if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
      throw new Error('Missing Twitch API credentials. Please set TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET environment variables.');
    }

    const params = new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials'
    });

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      body: params
    });

    if (!response.ok) {
      throw new Error(`Failed to get Twitch token: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      ...data,
      obtained_at: Date.now()
    };
  }

  // Validate token with Twitch
  async validateToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      const response = await fetch('https://id.twitch.tv/oauth2/validate', {
        headers: {
          'Authorization': `Bearer ${this.token.access_token}`
        }
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  // Revoke current token
  async revokeToken(): Promise<void> {
    if (!this.token) return;

    const params = new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      token: this.token.access_token
    });

    await fetch('https://id.twitch.tv/oauth2/revoke', {
      method: 'POST',
      body: params
    });

    this.token = null;
  }
}

export const tokenManager = TokenManager.getInstance();