import { tokenManager } from './tokenManager';
import { TwitchRateLimitHandler } from './rateLimitHandler';

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
  private rateLimitHandler = new TwitchRateLimitHandler();

  private async makeRequest<T>(endpoint: string, params?: URLSearchParams): Promise<T> {
    const token = await tokenManager.getValidToken();
    const url = params ? `${this.baseUrl}${endpoint}?${params}` : `${this.baseUrl}${endpoint}`;

    return this.rateLimitHandler.executeRequest<T>(async () => {
      return fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID!
        }
      });
    });
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

  // Get top streams
  async getTopStreams(options: {
    first?: number;
    game_id?: string;
    language?: string;
    user_id?: string[];
  } = {}): Promise<StreamData[]> {
    const params = new URLSearchParams();
    
    if (options.first) {
      params.append('first', Math.min(options.first, 100).toString());
    }
    if (options.game_id) {
      params.append('game_id', options.game_id);
    }
    if (options.language) {
      params.append('language', options.language);
    }
    if (options.user_id) {
      options.user_id.forEach(id => params.append('user_id', id));
    }

    const response = await this.makeRequest<{ data: StreamData[] }>('/streams', params);
    return response.data;
  }

  // Get clips for a specific game or channel
  async getClips(options: {
    broadcaster_id?: string;
    game_id?: string;
    first?: number;
    started_at?: string;
    ended_at?: string;
  } = {}): Promise<{
    id: string;
    url: string;
    embed_url: string;
    broadcaster_id: string;
    broadcaster_name: string;
    creator_id: string;
    creator_name: string;
    video_id: string;
    game_id: string;
    language: string;
    title: string;
    view_count: number;
    created_at: string;
    thumbnail_url: string;
    duration: number;
    vod_offset: number;
  }[]> {
    const params = new URLSearchParams();
    
    if (options.broadcaster_id) {
      params.append('broadcaster_id', options.broadcaster_id);
    }
    if (options.game_id) {
      params.append('game_id', options.game_id);
    }
    if (options.first) {
      params.append('first', Math.min(options.first, 100).toString());
    }
    if (options.started_at) {
      params.append('started_at', options.started_at);
    }
    if (options.ended_at) {
      params.append('ended_at', options.ended_at);
    }

    const response = await this.makeRequest<{ data: any[] }>('/clips', params);
    return response.data;
  }

  // Get stream tags
  async getStreamTags(): Promise<{
    tag_id: string;
    is_auto: boolean;
    localization_names: Record<string, string>;
    localization_descriptions: Record<string, string>;
  }[]> {
    const response = await this.makeRequest<{ data: any[] }>('/tags/streams');
    return response.data;
  }

  // Get videos (VODs, highlights, uploads)
  async getVideos(options: {
    user_id?: string;
    game_id?: string;
    first?: number;
    type?: 'archive' | 'highlight' | 'upload';
  } = {}): Promise<{
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    title: string;
    description: string;
    created_at: string;
    published_at: string;
    url: string;
    thumbnail_url: string;
    viewable: string;
    view_count: number;
    language: string;
    type: string;
    duration: string;
  }[]> {
    const params = new URLSearchParams();
    
    if (options.user_id) {
      params.append('user_id', options.user_id);
    }
    if (options.game_id) {
      params.append('game_id', options.game_id);
    }
    if (options.first) {
      params.append('first', Math.min(options.first, 100).toString());
    }
    if (options.type) {
      params.append('type', options.type);
    }

    const response = await this.makeRequest<{ data: any[] }>('/videos', params);
    return response.data;
  }

  // Get channel information
  async getChannelInfo(broadcaster_ids: string[]): Promise<{
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    broadcaster_language: string;
    game_id: string;
    game_name: string;
    title: string;
    delay: number;
    tags: string[];
  }[]> {
    if (broadcaster_ids.length === 0) return [];

    const params = new URLSearchParams();
    broadcaster_ids.slice(0, 100).forEach(id => {
      params.append('broadcaster_id', id);
    });

    const response = await this.makeRequest<{ data: any[] }>('/channels', params);
    return response.data;
  }

  // Get user follows
  async getUserFollows(options: {
    from_id?: string;
    to_id?: string;
    first?: number;
  } = {}): Promise<{
    from_id: string;
    from_login: string;
    from_name: string;
    to_id: string;
    to_login: string;
    to_name: string;
    followed_at: string;
  }[]> {
    const params = new URLSearchParams();
    
    if (options.from_id) {
      params.append('from_id', options.from_id);
    }
    if (options.to_id) {
      params.append('to_id', options.to_id);
    }
    if (options.first) {
      params.append('first', Math.min(options.first, 100).toString());
    }

    const response = await this.makeRequest<{ data: any[] }>('/channels/followers', params);
    return response.data;
  }
}

export const twitchAPI = new TwitchAPI();