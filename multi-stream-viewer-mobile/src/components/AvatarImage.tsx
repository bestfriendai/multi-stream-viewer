import React, { useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet, ImageStyle, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius } from '../constants/theme';
import { getTwitchProfileImage } from '../lib/twitchApi';

interface AvatarImageProps {
  uri?: string;
  name: string;
  size?: number;
  style?: ImageStyle;
  platform?: 'twitch' | 'youtube' | 'kick' | 'custom';
  username?: string; // For Twitch usernames
}

const AvatarImage: React.FC<AvatarImageProps> = ({
  uri,
  name,
  size = 40,
  style,
  platform = 'custom',
  username
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [twitchImageUrl, setTwitchImageUrl] = useState<string | null>(null);

  // Load Twitch profile image if platform is Twitch and username is provided
  useEffect(() => {
    let isMounted = true;

    const loadTwitchImage = async () => {
      if (platform === 'twitch' && username) {
        try {
          setIsLoading(true);
          const url = await getTwitchProfileImage(username);
          if (isMounted) {
            setTwitchImageUrl(url);
            setIsLoading(false);
          }
        } catch (error) {
          console.warn(`Failed to load Twitch profile image for ${username}:`, error);
          if (isMounted) {
            setImageError(true);
            setIsLoading(false);
          }
        }
      } else {
        setIsLoading(false);
      }
    };

    loadTwitchImage();

    return () => {
      isMounted = false;
    };
  }, [platform, username]);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPlatformColor = (platform: string): string => {
    const platformColors = {
      twitch: colors.twitch,
      youtube: colors.youtube,
      kick: colors.kick,
      custom: colors.primary,
    };
    return platformColors[platform as keyof typeof platformColors] || colors.primary;
  };

  const getFallbackAvatar = (name: string, platform: string, size: number): string => {
    const bgColor = getPlatformColor(platform).replace('#', '');
    const initials = getInitials(name);
    
    // Use a service like UI Avatars for consistent fallback avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff&size=${size}&bold=true&format=png`;
  };

  const avatarStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    ...style,
  };

  const fallbackStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: getPlatformColor(platform),
    justifyContent: 'center',
    alignItems: 'center',
    ...style,
  };

  const textStyle: TextStyle = {
    color: '#fff',
    fontSize: size * 0.4,
    fontWeight: 'bold',
  };

  // Show loading state
  if (isLoading && platform === 'twitch' && username) {
    return (
      <View style={[fallbackStyle, { backgroundColor: '#666' }]}>
        <Text style={[textStyle, { fontSize: size * 0.3 }]}>...</Text>
      </View>
    );
  }

  // Determine which image URL to use
  const imageUri = twitchImageUrl || uri;

  // If no URI provided or image failed to load, show fallback
  if (!imageUri || imageError) {
    return (
      <View style={fallbackStyle}>
        <Text style={textStyle}>{getInitials(name)}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUri }}
      style={avatarStyle}
      onError={() => {
        setImageError(true);
        setIsLoading(false);
      }}
      onLoad={() => setIsLoading(false)}
      onLoadStart={() => setIsLoading(true)}
    />
  );
};

export default AvatarImage;
