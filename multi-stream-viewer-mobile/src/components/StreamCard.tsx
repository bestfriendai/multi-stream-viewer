import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Stream } from '../types';
import { colors, spacing, borderRadius, typography, shadows, haptics } from '../constants/theme';
import AvatarImage from './AvatarImage';

interface StreamCardProps {
  stream: Stream;
  onPress: () => void;
  onRemove?: () => void;
  width?: number;
  height?: number;
  showLivePreview?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export default function StreamCard({
  stream,
  onPress,
  onRemove,
  width = screenWidth / 2 - spacing.md * 1.5,
  height = 160,
  showLivePreview = true,
}: StreamCardProps) {
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const platformIcon = {
    twitch: 'logo-twitch',
    youtube: 'logo-youtube',
    kick: 'game-controller',
    custom: 'link',
  };

  const platformColor = {
    twitch: colors.twitch,
    youtube: colors.youtube,
    kick: colors.kick,
    custom: colors.primary,
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleRemove = async () => {
    if (onRemove) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onRemove();
    }
  };

  const getEmbedUrl = () => {
    switch (stream.platform) {
      case 'twitch':
        return `https://player.twitch.tv/?channel=${stream.channelName}&parent=localhost&muted=true&autoplay=true&controls=false`;
      case 'youtube':
        // YouTube doesn't allow autoplay in iframes on mobile without user interaction
        return `https://www.youtube.com/embed/live_stream?channel=${stream.channelName}&autoplay=0&mute=1&controls=0&modestbranding=1`;
      default:
        return stream.streamUrl;
    }
  };

  const embedHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          body { margin: 0; padding: 0; background: #000; overflow: hidden; }
          iframe { width: 100vw; height: 100vh; border: none; }
          .preview-container { position: relative; width: 100vw; height: 100vh; }
          .overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <iframe 
            src="${getEmbedUrl()}"
            allowfullscreen="false"
            scrolling="no"
            allow="autoplay; encrypted-media"
          ></iframe>
          <div class="overlay" onclick="return false;"></div>
        </div>
      </body>
    </html>
  `;

  return (
    <TouchableOpacity
      style={[styles.container, { width, height }]}
      onPress={handlePress}
      activeOpacity={0.95}
    >
      {/* Live Preview or Thumbnail */}
      {showLivePreview && stream.isLive ? (
        <View style={styles.previewContainer}>
          <WebView
            ref={webViewRef}
            source={{ html: embedHtml }}
            style={styles.webView}
            scrollEnabled={false}
            bounces={false}
            onLoad={() => setIsPreviewLoaded(true)}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
            injectedJavaScript={`
              document.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              });
              true;
            `}
          />
          {!isPreviewLoaded && (
            <View style={styles.loadingOverlay}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.thumbnail, { backgroundColor: colors.fill.tertiary }]}>
          <Ionicons 
            name="videocam-off" 
            size={40} 
            color={colors.text.tertiary} 
          />
        </View>
      )}
      
      {/* Glass morphism overlay */}
      <View style={styles.overlay}>
        {/* Top gradient for better visibility */}
        <View style={styles.topGradient}>
          <View style={styles.topRow}>
            <View style={[styles.liveBadge, !stream.isLive && styles.offlineBadge]}>
              {stream.isLive && <View style={styles.liveDot} />}
              <Text style={styles.liveText}>
                {stream.isLive ? 'LIVE' : 'OFFLINE'}
              </Text>
            </View>
            
            {onRemove && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemove}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <BlurView intensity={80} tint="dark" style={styles.blurButton}>
                  <Ionicons name="close" size={20} color={colors.text.primary} />
                </BlurView>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Bottom info with blur effect */}
        <BlurView intensity={80} tint="dark" style={styles.bottomInfo}>
          <View style={styles.channelInfo}>
            <AvatarImage
              uri={stream.avatarUrl}
              name={stream.displayName}
              size={36}
              platform={stream.platform}
              username={stream.platform === 'twitch' ? stream.channelName : undefined}
              style={styles.avatar}
            />
            <View style={styles.textInfo}>
              <Text style={styles.channelName} numberOfLines={1}>
                {stream.displayName}
              </Text>
              <View style={styles.metaRow}>
                <Ionicons
                  name={platformIcon[stream.platform] as keyof typeof Ionicons.glyphMap}
                  size={12}
                  color={platformColor[stream.platform]}
                />
                <Text style={styles.viewerCount}>
                  {stream.viewerCount.toLocaleString()} watching
                </Text>
              </View>
            </View>
          </View>
        </BlurView>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    margin: spacing.sm,
    ...shadows.card,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.caption1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topGradient: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
    // Note: background gradients need to be implemented with LinearGradient component in React Native
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    gap: spacing.xs,
  },
  offlineBadge: {
    backgroundColor: colors.fill.secondary,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text.primary,
  },
  liveText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.caption2,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.5,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  blurButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomInfo: {
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    padding: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? spacing.sm : spacing.md,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: colors.separator.nonOpaque,
  },
  textInfo: {
    flex: 1,
  },
  channelName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.subheadline,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.tight,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: spacing.xs,
  },
  viewerCount: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.caption1,
  },
});