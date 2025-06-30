import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import useStreamStore from '../store/streamStore';
import { Stream } from '../types';

export default function AddStreamModal() {
  const navigation = useNavigation();
  const { addStream } = useStreamStore();
  
  const [platform, setPlatform] = useState<Stream['platform']>('twitch');
  const [channelName, setChannelName] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  const platforms = [
    { id: 'twitch', name: 'Twitch', icon: 'logo-twitch', color: colors.twitch },
    { id: 'youtube', name: 'YouTube', icon: 'logo-youtube', color: colors.youtube },
    { id: 'kick', name: 'Kick', icon: 'game-controller', color: colors.kick },
    { id: 'custom', name: 'Custom URL', icon: 'link', color: colors.primary },
  ];

  const handleAddStream = async () => {
    if (platform === 'custom' && !customUrl) {
      Alert.alert('Error', 'Please enter a custom URL');
      return;
    }
    
    if (platform !== 'custom' && !channelName) {
      Alert.alert('Error', 'Please enter a channel name');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Create stream data from user input
    const streamUrl = platform === 'custom' 
      ? customUrl 
      : `https://${platform}.tv/${channelName}`;
    
    const newStream: Stream = {
      id: `${platform}-${channelName || Date.now()}-${Date.now()}`,
      platform,
      channelName: channelName || 'custom',
      displayName: channelName || 'Custom Stream',
      title: 'Stream', // Will be updated when stream loads
      category: 'Live',
      viewerCount: 0, // Will be updated if available
      thumbnailUrl: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channelName}-320x180.jpg`,
      avatarUrl: 'https://via.placeholder.com/50',
      streamUrl,
      isLive: true, // Assume live when adding
      startedAt: new Date().toISOString(),
      language: 'en',
      tags: [],
    };

    addStream(newStream);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Add Stream</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Choose Platform</Text>
          <View style={styles.platformGrid}>
            {platforms.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.platformCard,
                  platform === p.id && styles.platformCardActive,
                  { borderColor: platform === p.id ? p.color : colors.border },
                ]}
                onPress={() => {
                  setPlatform(p.id as Stream['platform']);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons
                  name={p.icon as keyof typeof Ionicons.glyphMap}
                  size={32}
                  color={platform === p.id ? p.color : colors.text.secondary}
                />
                <Text
                  style={[
                    styles.platformName,
                    platform === p.id && { color: p.color },
                  ]}
                >
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {platform !== 'custom' ? (
            <>
              <Text style={styles.sectionTitle}>Channel Name</Text>
              <TextInput
                style={styles.input}
                value={channelName}
                onChangeText={setChannelName}
                placeholder={`Enter ${platform} channel name`}
                placeholderTextColor={colors.text.tertiary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Stream URL</Text>
              <TextInput
                style={styles.input}
                value={customUrl}
                onChangeText={setCustomUrl}
                placeholder="https://example.com/stream"
                placeholderTextColor={colors.text.tertiary}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </>
          )}

          <TouchableOpacity
            style={[
              styles.addButton,
              (!channelName && platform !== 'custom') || (platform === 'custom' && !customUrl)
                ? styles.addButtonDisabled
                : {},
            ]}
            onPress={handleAddStream}
            disabled={(!channelName && platform !== 'custom') || (platform === 'custom' && !customUrl)}
          >
            <Text style={styles.addButtonText}>Add Stream</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.secondary,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  platformCard: {
    width: '48%',
    marginHorizontal: '1%',
    padding: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  platformCardActive: {
    backgroundColor: colors.background.tertiary,
  },
  platformName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.xl,
    ...shadows.md,
  },
  addButtonDisabled: {
    backgroundColor: colors.background.tertiary,
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});