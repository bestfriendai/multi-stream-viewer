import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import useAppStore from '../store/appStore';

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  isPremium?: boolean;
  isActive?: boolean;
  onPress: () => void;
}

function FeatureCard({
  icon,
  title,
  description,
  isPremium = false,
  isActive = false,
  onPress,
}: FeatureCardProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.featureCard, isActive && styles.featureCardActive]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {isPremium && (
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.premiumBadge}
        >
          <Text style={styles.premiumText}>PRO</Text>
        </LinearGradient>
      )}
      <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
        <Ionicons name={icon} size={32} color={isActive ? colors.primary : colors.text.secondary} />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

export default function FeaturesScreen() {
  const {
    watchParty,
    isRecording,
    isPremium,
    startWatchParty,
    leaveWatchParty,
    toggleRecording,
    setPremium,
  } = useAppStore();

  const features = [
    {
      icon: 'people' as const,
      title: 'Watch Party',
      description: 'Watch streams together with friends in real-time',
      action: () => watchParty ? leaveWatchParty() : startWatchParty([]),
      isActive: !!watchParty,
    },
    {
      icon: 'recording' as const,
      title: 'Stream Recording',
      description: 'Record your favorite moments from any stream',
      action: toggleRecording,
      isActive: isRecording,
    },
    {
      icon: 'analytics' as const,
      title: 'Analytics Dashboard',
      description: 'Track your viewing habits and statistics',
      action: () => {},
    },
    {
      icon: 'mic' as const,
      title: 'Voice Chat',
      description: 'Talk with friends while watching streams',
      action: () => {},
      isPremium: true,
    },
    {
      icon: 'videocam' as const,
      title: 'Virtual Camera',
      description: 'Use streams as virtual camera in other apps',
      action: () => {},
      isPremium: true,
    },
    {
      icon: 'color-palette' as const,
      title: 'Custom Themes',
      description: 'Personalize the app with custom colors',
      action: () => {},
      isPremium: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Features</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {!isPremium && (
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.premiumBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="star" size={48} color={colors.text.primary} />
            <View style={styles.premiumContent}>
              <Text style={styles.premiumTitle}>Unlock Premium Features</Text>
              <Text style={styles.premiumSubtitle}>
                Get access to exclusive features and enhance your streaming experience
              </Text>
              <TouchableOpacity
                style={styles.premiumButton}
                onPress={() => setPremium(true)}
              >
                <Text style={styles.premiumButtonText}>Upgrade to Pro</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              isPremium={feature.isPremium}
              isActive={feature.isActive}
              onPress={feature.action}
            />
          ))}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12.5h</Text>
              <Text style={styles.statLabel}>Watch Time</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>47</Text>
              <Text style={styles.statLabel}>Streams Watched</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.secondary,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  premiumBanner: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.lg,
  },
  premiumContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  premiumTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  premiumSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  premiumButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  premiumButtonText: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
  },
  featureCard: {
    width: '48%',
    backgroundColor: colors.background.secondary,
    margin: '1%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  featureCardActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  premiumBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  premiumText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#000',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainerActive: {
    backgroundColor: `${colors.primary}20`,
  },
  featureTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statsSection: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});