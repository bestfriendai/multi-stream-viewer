import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  Directions,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stream } from '../types';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

interface SwipeableStreamViewProps {
  streams: Stream[];
  currentIndex: number;
  onSwipe: (direction: 'left' | 'right') => void;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SwipeableStreamView({
  streams,
  currentIndex,
  onSwipe,
  onClose,
}: SwipeableStreamViewProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const currentStream = streams[currentIndex];

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    triggerHaptic();
    onSwipe(direction);
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.LEFT | Directions.RIGHT)
    .onEnd((event) => {
      'worklet';
      if (event.absoluteX < screenWidth / 2) {
        runOnJS(handleSwipe)('left');
      } else {
        runOnJS(handleSwipe)('right');
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      const distance = Math.sqrt(
        event.translationX ** 2 + event.translationY ** 2
      );
      scale.value = 1 - distance / 1000;
    })
    .onEnd((event) => {
      'worklet';
      const threshold = screenWidth * 0.3;
      
      if (Math.abs(event.translationX) > threshold) {
        if (event.translationX > 0) {
          runOnJS(handleSwipe)('right');
        } else {
          runOnJS(handleSwipe)('left');
        }
      }
      
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
    });

  const composedGesture = Gesture.Simultaneous(flingGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const getEmbedUrl = () => {
    if (!currentStream) return '';
    
    switch (currentStream.platform) {
      case 'twitch':
        return `https://player.twitch.tv/?channel=${currentStream.channelName}&parent=localhost`;
      case 'youtube':
        return `https://www.youtube.com/embed/live_stream?channel=${currentStream.channelName}&autoplay=1`;
      default:
        return currentStream.streamUrl;
    }
  };

  if (!currentStream) {
    return (
      <View style={styles.container}>
        <Text style={styles.noStreamsText}>No streams available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={30} color={colors.text.primary} />
      </TouchableOpacity>

      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.streamContainer, animatedStyle]}>
          <WebView
            source={{ uri: getEmbedUrl() }}
            style={styles.webView}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
          />
          
          <View style={styles.streamInfo}>
            <Text style={styles.channelName}>{currentStream.displayName}</Text>
            <Text style={styles.streamTitle} numberOfLines={2}>
              {currentStream.title}
            </Text>
            <View style={styles.metaInfo}>
              <Ionicons name="eye" size={16} color={colors.text.secondary} />
              <Text style={styles.viewerCount}>
                {currentStream.viewerCount.toLocaleString()}
              </Text>
              <View style={styles.platformBadge}>
                <Text style={styles.platformText}>
                  {currentStream.platform.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>

      <View style={styles.navigationHints}>
        <View style={styles.hint}>
          <Ionicons name="arrow-back" size={24} color={colors.text.secondary} />
          <Text style={styles.hintText}>Previous</Text>
        </View>
        <Text style={styles.counter}>
          {currentIndex + 1} / {streams.length}
        </Text>
        <View style={styles.hint}>
          <Text style={styles.hintText}>Next</Text>
          <Ionicons name="arrow-forward" size={24} color={colors.text.secondary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: borderRadius.full,
    padding: spacing.sm,
  },
  streamContainer: {
    flex: 1,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xl,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
  },
  webView: {
    flex: 1,
  },
  streamInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: spacing.lg,
  },
  channelName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  streamTitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
    marginRight: spacing.md,
  },
  platformBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  platformText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  navigationHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginHorizontal: spacing.sm,
  },
  counter: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  noStreamsText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});