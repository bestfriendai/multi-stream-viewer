import React, { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StreamsScreenNavigationProp } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { WebView } from 'react-native-webview';
import useStreamStore from '../store/streamStore';
import { colors, spacing, typography, borderRadius, shadows, animations } from '../constants/theme';
import { Stream } from '../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function StreamsScreen() {
  const navigation = useNavigation<StreamsScreenNavigationProp>();
  const { streams, streamStates, gridLayout, setGridLayout, removeStream, toggleMute, setVolume } = useStreamStore();

  const handleAddStream = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('AddStream');
  };

  const handleLayoutChange = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const layouts = ['1x1', '2x2', '3x3', 'custom'] as const;
    const currentIndex = layouts.indexOf(gridLayout as any);
    const nextIndex = (currentIndex + 1) % layouts.length;
    setGridLayout(layouts[nextIndex]);
  };

  const handleRemoveStream = async (streamId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    removeStream(streamId);
  };

  const { itemWidth, itemHeight, numColumns } = useMemo(() => {
    let cols = 2;
    let rows = 2;
    
    switch (gridLayout) {
      case '1x1':
        cols = 1;
        rows = 1;
        break;
      case '2x2':
        cols = 2;
        rows = 2;
        break;
      case '3x3':
        cols = 3;
        rows = 3;
        break;
      case 'custom':
        // Focus mode - one large stream with smaller ones
        cols = 2;
        rows = 2;
        break;
    }

    const headerHeight = 100;
    const tabBarHeight = 90;
    const availableHeight = screenHeight - headerHeight - tabBarHeight;
    
    const totalHorizontalSpacing = spacing.md * (cols + 1);
    const totalVerticalSpacing = spacing.md * (rows + 1);
    
    const width = (screenWidth - totalHorizontalSpacing) / cols;
    const height = Math.min(
      (availableHeight - totalVerticalSpacing) / rows,
      width * 0.75
    );

    return {
      itemWidth: width,
      itemHeight: height,
      numColumns: cols,
    };
  }, [gridLayout, streams.length]);

  const getEmbedUrl = (stream: Stream) => {
    const isMuted = streamStates[stream.id]?.isMuted ?? true;
    switch (stream.platform) {
      case 'twitch':
        return `https://player.twitch.tv/?channel=${stream.channelName}&parent=localhost&muted=${isMuted}&autoplay=true`;
      case 'youtube':
        return `https://www.youtube.com/embed/live_stream?channel=${stream.channelName}&autoplay=1&mute=${isMuted ? 1 : 0}&controls=1`;
      default:
        return stream.streamUrl;
    }
  };

  const renderStream = (stream: Stream, index: number) => {
    const isLargeStream = gridLayout === 'custom' && index === 0;
    const width = isLargeStream ? screenWidth - spacing.md * 2 : itemWidth;
    const height = isLargeStream ? itemHeight * 1.5 : itemHeight;
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(animatedValue, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }, []);

    return (
      <Animated.View
        key={stream.id}
        style={[
          styles.streamContainer,
          {
            width,
            height,
            opacity: animatedValue,
            transform: [{
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            }],
          },
        ]}
      >
        <WebView
          source={{ uri: getEmbedUrl(stream) }}
          style={styles.webView}
          scrollEnabled={false}
          bounces={false}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          injectedJavaScript={`
            document.body.style.margin = '0';
            document.body.style.padding = '0';
            true;
          `}
        />
        
        {/* Stream Overlay Controls */}
        <View style={styles.streamOverlay}>
          {/* Top Controls */}
          <BlurView intensity={80} tint="dark" style={styles.topControls}>
            <View style={styles.streamInfo}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <Text style={styles.channelName} numberOfLines={1}>
                {stream.displayName}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveStream(stream.id)}
            >
              <Ionicons name="close" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </BlurView>

          {/* Bottom Controls */}
          <View style={styles.bottomControlsContainer}>
            <BlurView intensity={80} tint="dark" style={styles.bottomControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => toggleMute(stream.id)}
              >
                <Ionicons 
                  name={streamStates[stream.id]?.isMuted ? "volume-mute" : "volume-high"} 
                  size={20} 
                  color={colors.text.primary} 
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => {
                  // Navigate to detail view for full screen
                  navigation.navigate('StreamDetail', { stream });
                }}
              >
                <Ionicons name="expand" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
      </Animated.View>
    );
  };

  const layoutIcons = {
    '1x1': '1',
    '2x2': '4',
    '3x3': '9',
    'custom': 'F',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <BlurView intensity={100} tint="dark" style={styles.header}>
        <Text style={styles.title}>Live Streams</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.layoutButton}
            onPress={handleLayoutChange}
          >
            <Text style={styles.layoutButtonText}>
              {layoutIcons[gridLayout as keyof typeof layoutIcons]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddStream}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Content */}
      {streams.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons
              name="tv-outline"
              size={64}
              color={colors.text.tertiary}
            />
          </View>
          <Text style={styles.emptyTitle}>No streams added</Text>
          <Text style={styles.emptySubtitle}>
            Add streams to watch multiple channels at once
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleAddStream}
          >
            <Text style={styles.ctaButtonText}>Add First Stream</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.streamGrid}
          showsVerticalScrollIndicator={false}
        >
          {streams.map((stream, index) => renderStream(stream, index))}
        </ScrollView>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator.nonOpaque,
  },
  title: {
    fontSize: typography.fontSize.largeTitle,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: typography.letterSpacing.tight,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  layoutButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.fill.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  layoutButtonText: {
    fontSize: typography.fontSize.headline,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  scrollView: {
    flex: 1,
  },
  streamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
    paddingBottom: 100,
  },
  streamContainer: {
    margin: spacing.sm,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.background.primary,
    ...shadows.card,
  },
  webView: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  streamOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  streamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
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
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  liveText: {
    color: 'white',
    fontSize: typography.fontSize.caption2,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  channelName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.callout,
    fontWeight: typography.fontWeight.semibold,
    flex: 1,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.fill.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControlsContainer: {
    padding: spacing.md,
  },
  bottomControls: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start',
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.fill.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.fill.quaternary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.fontSize.title1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.pill,
    ...shadows.md,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: typography.fontSize.headline,
    fontWeight: typography.fontWeight.semibold,
  },
});