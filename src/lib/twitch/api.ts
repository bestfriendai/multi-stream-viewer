import { tokenManager } from './tokenManager';

export interface StreamData {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: 'live';
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  tags: string[];
  is_mature: boolean;
}

export interface UserData {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}

export interface GameData {
  id: string;
  name: string;
  box_art_url: string;
  igdb_id: string;
}

class TwitchAPI {
  private baseUrl = 'https://api.twitch.tv/helix';

  private async makeRequest<T>(endpoint: string, params?: URLSearchParams): Promise<T> {
    const token = await tokenManager.getValidToken();
    const url = params ? `${this.baseUrl}${endpoint}?${params}` : `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID!
      }
    });

    if (!response.ok) {
      throw new Error(`Twitch API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async getStreams(userLogins: string[]): Promise<StreamData[]> {
    if (userLogins.length === 0) return [];

    const params = new URLSearchParams();
    
    // API allows max 100 user_login parameters
    userLogins.slice(0, 100).forEach(login => {
      params.append('user_login', login.toLowerCase());
    });

    const response = await this.makeRequest<{ data: StreamData[] }>('/streams', params);
    return response.data;
  }

  async getUsers(userLogins: string[]): Promise<UserData[]> {
    if (userLogins.length === 0) return [];

    const params = new URLSearchParams();
    
    userLogins.slice(0, 100).forEach(login => {
      params.append('login', login.toLowerCase());
    });

    const response = await this.makeRequest<{ data: UserData[] }>('/users', params);
    return response.data;
  }

  async getGames(gameIds: string[]): Promise<GameData[]> {
    if (gameIds.length === 0) return [];

    const params = new URLSearchParams();
    
    gameIds.slice(0, 100).forEach(id => {
      params.append('id', id);
    });

    const response = await this.makeRequest<{ data: GameData[] }>('/games', params);
    return response.data;
  }

  // Get top games/categories
  async getTopGames(first: number = 20): Promise<GameData[]> {
    const params = new URLSearchParams({
      first: Math.min(first, 100).toString()
    });

    const response = await this.makeRequest<{ data: GameData[] }>('/games/top', params);
    return response.data;
  }

  // Search for channels
  async searchChannels(query: string, first: number = 20): Promise<{
    id: string;
    broadcaster_login: string;
    display_name: string;
    game_id: string;
    game_name: string;
    is_live: boolean;
    thumbnail_url: string;
    title: string;
    started_at: string;
  }[]> {
    const params = new URLSearchParams({
      query,
      first: Math.min(first, 100).toString()
    });

    const response = await this.makeRequest<{ data: any[] }>('/search/channels', params);
    return response.data;
  }
}

export const twitchAPI = new TwitchAPI();