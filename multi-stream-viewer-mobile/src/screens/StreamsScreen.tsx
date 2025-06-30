import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StreamsScreenNavigationProp } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import StreamGrid from '../components/StreamGrid';
import useStreamStore from '../store/streamStore';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { Stream } from '../types';

export default function StreamsScreen() {
  const navigation = useNavigation<StreamsScreenNavigationProp>();
  const { streams, gridLayout, setGridLayout } = useStreamStore();

  const handleStreamPress = (stream: Stream) => {
    navigation.navigate('StreamDetail', { stream });
  };

  const handleAddStream = () => {
    // Navigate to add stream modal
    navigation.navigate('AddStream');
  };

  const gridLayouts = ['1x1', '2x2', '3x3'] as const;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Streams</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.layoutButton}
            onPress={() => {
              const currentIndex = gridLayouts.indexOf(gridLayout as any);
              const nextIndex = (currentIndex + 1) % gridLayouts.length;
              setGridLayout(gridLayouts[nextIndex]);
            }}
          >
            <Ionicons name="grid-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddStream}
          >
            <Ionicons name="add" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {streams.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="tv-outline"
            size={64}
            color={colors.text.tertiary}
          />
          <Text style={styles.emptyTitle}>No streams added</Text>
          <Text style={styles.emptySubtitle}>
            Tap the + button to add your first stream
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleAddStream}
          >
            <Text style={styles.ctaButtonText}>Add Stream</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <StreamGrid
          streams={streams}
          onStreamPress={handleStreamPress}
        />
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.secondary,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  layoutButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  ctaButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});