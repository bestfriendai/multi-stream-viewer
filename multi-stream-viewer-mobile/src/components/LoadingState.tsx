import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../constants/theme';

interface LoadingStateProps {
  count?: number;
  itemHeight?: number;
}

function LoadingCard({ delay = 0 }: { delay?: number }) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmer.value,
      [0, 0.5, 1],
      [0.3, 0.6, 0.3],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <LinearGradient
        colors={[colors.background.tertiary, colors.background.secondary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.thumbnailPlaceholder} />
        <View style={styles.infoContainer}>
          <View style={styles.avatarPlaceholder} />
          <View style={styles.textContainer}>
            <View style={styles.titlePlaceholder} />
            <View style={styles.subtitlePlaceholder} />
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

export default function LoadingState({ count = 6, itemHeight = 180 }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCard key={index} delay={index * 100} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  card: {
    width: '45%',
    height: 180,
    margin: '2.5%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    padding: spacing.sm,
  },
  thumbnailPlaceholder: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.primary,
    marginRight: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  titlePlaceholder: {
    height: 14,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
    width: '80%',
  },
  subtitlePlaceholder: {
    height: 12,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.sm,
    width: '60%',
  },
});

// Helper function for animation delay
function withDelay(delay: number, animation: any) {
  'worklet';
  return withSequence(
    withTiming(0, { duration: delay }),
    animation
  );
}