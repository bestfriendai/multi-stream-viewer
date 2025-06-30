import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stream } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../constants/theme';
import AvatarImage from './AvatarImage';

interface AnimatedStreamCardProps {
  stream: Stream;
  onPress: () => void;
  onRemove?: () => void;
  width?: number;
  height?: number;
  index: number;
}

const { width: screenWidth } = Dimensions.get('window');

export default function AnimatedStreamCard({
  stream,
  onPress,
  onRemove,
  width = screenWidth / 2 - spacing.md * 1.5,
  height = 160,
  index,
}: AnimatedStreamCardProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
      mass: 1,
    });
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      'worklet';
      scale.value = withSpring(0.95);
      runOnJS(triggerHaptic)();
    })
    .onEnd(() => {
      'worklet';
      scale.value = withSpring(1);
      if (onRemove) {
        runOnJS(onRemove)();
      }
    });

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      'worklet';
      scale.value = withSpring(0.98);
    })
    .onEnd(() => {
      'worklet';
      scale.value = withSpring(1);
      runOnJS(onPress)();
    });

  const composedGesture = Gesture.Simultaneous(tapGesture, longPressGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

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

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.container,
          { width, height },
          animatedStyle,
        ]}
      >
        <Image
          source={{ uri: stream.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        
        <View style={styles.overlay}>
          <View style={styles.topRow}>
            <Animated.View style={[styles.liveBadge, !stream.isLive && styles.offlineBadge]}>
              <Text style={styles.liveText}>
                {stream.isLive ? 'LIVE' : 'OFFLINE'}
              </Text>
            </Animated.View>
            
            {onRemove && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={onRemove}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.bottomInfo}>
            <View style={styles.channelInfo}>
              <AvatarImage
                uri={stream.avatarUrl}
                name={stream.displayName}
                size={32}
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
                    size={14}
                    color={platformColor[stream.platform]}
                  />
                  <Text style={styles.viewerCount}>
                    {stream.viewerCount.toLocaleString()} viewers
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    margin: spacing.sm,
    ...shadows.md,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.tertiary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  offlineBadge: {
    backgroundColor: colors.background.tertiary,
  },
  liveText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  removeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: borderRadius.full,
  },
  bottomInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  textInfo: {
    flex: 1,
  },
  channelName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  viewerCount: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginLeft: spacing.xs,
  },
});