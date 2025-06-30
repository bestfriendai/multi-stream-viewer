import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { config } from '../constants/config';
import useAppStore from '../store/appStore';
import useStreamStore from '../store/streamStore';
import iapService from '../services/iapService';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  value?: string | boolean;
  onPress?: () => void;
  showArrow?: boolean;
  isSwitch?: boolean;
}

function SettingItem({
  icon,
  title,
  subtitle,
  value,
  onPress,
  showArrow = true,
  isSwitch = false,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={isSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color={colors.text.secondary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {isSwitch ? (
        <Switch
          value={value as boolean}
          onValueChange={onPress}
          trackColor={{ false: colors.border.secondary, true: colors.primary }}
          thumbColor={colors.text.primary}
        />
      ) : (
        <View style={styles.settingRight}>
          {value && typeof value === 'string' && (
            <Text style={styles.settingValue}>{value}</Text>
          )}
          {showArrow && (
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { preferences, updatePreferences, resetApp } = useAppStore();
  const { clearAllStreams } = useStreamStore();

  const handleQualityChange = () => {
    const qualities = ['auto', '1080p', '720p', '480p', '360p'] as const;
    const currentIndex = qualities.indexOf(preferences.defaultQuality);
    const nextIndex = (currentIndex + 1) % qualities.length;
    updatePreferences({ defaultQuality: qualities[nextIndex] });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all streams and reset the app. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearAllStreams();
            resetApp();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Playback</Text>
          <SettingItem
            icon="play-circle"
            title="Autoplay"
            subtitle="Automatically play streams when opened"
            value={preferences.autoplay}
            onPress={() => updatePreferences({ autoplay: !preferences.autoplay })}
            isSwitch
          />
          <SettingItem
            icon="speedometer"
            title="Low Latency Mode"
            subtitle="Reduce stream delay for live content"
            value={preferences.lowLatencyMode}
            onPress={() => updatePreferences({ lowLatencyMode: !preferences.lowLatencyMode })}
            isSwitch
          />
          <SettingItem
            icon="options"
            title="Default Quality"
            value={preferences.defaultQuality}
            onPress={handleQualityChange}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interface</Text>
          <SettingItem
            icon="grid"
            title="Default Grid Layout"
            value={preferences.gridLayout}
            onPress={() => {}}
          />
          <SettingItem
            icon="chatbubbles"
            title="Show Chat"
            subtitle="Display chat alongside streams"
            value={preferences.chatEnabled}
            onPress={() => updatePreferences({ chatEnabled: !preferences.chatEnabled })}
            isSwitch
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Get notified when streams go live"
            value={preferences.notificationsEnabled}
            onPress={() => updatePreferences({ notificationsEnabled: !preferences.notificationsEnabled })}
            isSwitch
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          <SettingItem
            icon="star"
            title="Upgrade to Premium"
            subtitle="Remove ads, unlock all features"
            onPress={async () => {
              const products = await iapService.getProducts();
              // Show purchase modal
            }}
          />
          <SettingItem
            icon="refresh"
            title="Restore Purchases"
            onPress={async () => {
              const restored = await iapService.restorePurchases();
              Alert.alert(
                restored ? 'Success' : 'No Purchases',
                restored 
                  ? 'Your purchases have been restored.'
                  : 'No previous purchases found.'
              );
            }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <SettingItem
            icon="information-circle"
            title="Version"
            value={config.appVersion}
            showArrow={false}
          />
          <SettingItem
            icon="document-text"
            title="Terms of Service"
            onPress={() => {
              // Open terms URL
              Alert.alert('Terms of Service', config.termsOfServiceUrl);
            }}
          />
          <SettingItem
            icon="shield-checkmark"
            title="Privacy Policy"
            onPress={() => {
              // Open privacy URL
              Alert.alert('Privacy Policy', config.privacyPolicyUrl);
            }}
          />
          <SettingItem
            icon="help-circle"
            title="Support"
            onPress={() => {
              // Open support URL
              Alert.alert('Support', config.supportUrl);
            }}
          />
          <SettingItem
            icon="heart"
            title="Rate Us"
            onPress={() => {
              // Open App Store review page
              Alert.alert('Rate Us', 'Thank you for your support!');
            }}
          />
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearData}
          >
            <Ionicons name="trash" size={20} color={colors.error} />
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Multi-Stream Viewer v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            Made with ❤️ for streamers
          </Text>
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
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.primary,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  dangerButtonText: {
    color: colors.error,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  footerSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});