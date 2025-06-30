import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { StreamDetailScreenRouteProp } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import useStreamStore from '../store/streamStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function StreamDetailScreen() {
  const route = useRoute<StreamDetailScreenRouteProp>();
  const navigation = useNavigation();
  const webViewRef = useRef<WebView>(null);
  const { stream } = route.params;
  const {
    streamStates,
    setVolume,
    toggleMute,
    setQuality,
  } = useStreamStore();

  const streamState = streamStates[stream.id] || {
    volume: 100,
    isMuted: false,
    quality: 'auto',
  };

  const [showControls, setShowControls] = useState(true);

  const qualities = ['auto', '1080p', '720p', '480p', '360p'] as const;

  const getEmbedUrl = () => {
    switch (stream.platform) {
      case 'twitch':
        return `https://player.twitch.tv/?channel=${stream.channelName}&parent=localhost&muted=${streamState.isMuted}`;
      case 'youtube':
        return `https://www.youtube.com/embed/live_stream?channel=${stream.channelName}&autoplay=1&mute=${streamState.isMuted ? 1 : 0}&enablejsapi=1`;
      case 'kick':
        return `https://kick.com/${stream.channelName}/embed`;
      default:
        return stream.streamUrl;
    }
  };

  // Force WebView reload when mute state changes
  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }, [streamState.isMuted]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.channelName} numberOfLines={1}>
            {stream.displayName}
          </Text>
          <Text style={styles.viewerCount}>
            {stream.viewerCount.toLocaleString()} viewers
          </Text>
        </View>
        <TouchableOpacity
          style={styles.fullscreenButton}
          onPress={() => {
            // Handle fullscreen
          }}
        >
          <Ionicons name="expand" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.playerContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: getEmbedUrl() }}
          style={styles.webView}
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
          onTouchStart={() => setShowControls(!showControls)}
        />
      </View>

      {showControls && (
        <View style={styles.controls}>
          <View style={styles.volumeControl}>
            <TouchableOpacity
              style={styles.muteButton}
              onPress={() => toggleMute(stream.id)}
            >
              <Ionicons
                name={streamState.isMuted ? 'volume-mute' : 'volume-high'}
                size={24}
                color={colors.text.primary}
              />
            </TouchableOpacity>
            <Slider
              style={styles.volumeSlider}
              minimumValue={0}
              maximumValue={100}
              value={streamState.volume}
              onValueChange={(value) => setVolume(stream.id, value)}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border.primary}
              thumbTintColor={colors.primary}
            />
          </View>

          <View style={styles.qualityControl}>
            <Text style={styles.qualityLabel}>Quality:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.qualityOptions}
            >
              {qualities.map((quality) => (
                <TouchableOpacity
                  key={quality}
                  style={[
                    styles.qualityButton,
                    streamState.quality === quality && styles.qualityButtonActive,
                  ]}
                  onPress={() => setQuality(stream.id, quality)}
                >
                  <Text
                    style={[
                      styles.qualityButtonText,
                      streamState.quality === quality && styles.qualityButtonTextActive,
                    ]}
                  >
                    {quality}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      <ScrollView style={styles.infoContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.streamTitle}>{stream.title}</Text>
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Ionicons name="game-controller" size={16} color={colors.text.secondary} />
            <Text style={styles.metaText}>{stream.category}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="language" size={16} color={colors.text.secondary} />
            <Text style={styles.metaText}>{stream.language.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.tags}>
          {stream.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.secondary,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  channelName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  viewerCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  fullscreenButton: {
    padding: spacing.sm,
  },
  playerContainer: {
    width: screenWidth,
    height: screenWidth * (9 / 16),
    backgroundColor: colors.background.tertiary,
  },
  webView: {
    flex: 1,
  },
  controls: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    ...shadows.md,
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  muteButton: {
    padding: spacing.sm,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: spacing.sm,
  },
  qualityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qualityLabel: {
    color: colors.text.secondary,
    marginRight: spacing.md,
  },
  qualityOptions: {
    flexDirection: 'row',
  },
  qualityButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
  },
  qualityButtonActive: {
    backgroundColor: colors.primary,
  },
  qualityButtonText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
  qualityButtonTextActive: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  infoContainer: {
    flex: 1,
    padding: spacing.md,
  },
  streamTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  metaInfo: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  metaText: {
    color: colors.text.secondary,
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
  },
});