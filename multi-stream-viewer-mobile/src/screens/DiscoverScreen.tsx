import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';
import { Stream, DiscoveryCategory } from '../types';
import AnimatedStreamCard from '../components/AnimatedStreamCard';
import LoadingState from '../components/LoadingState';
import useStreamStore from '../store/streamStore';
import streamService from '../services/streamService';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addStream } = useStreamStore();

  const { data: streams = [], isLoading, error, refetch } = useQuery({
    queryKey: ['discover', searchQuery, selectedCategory],
    queryFn: async () => {
      return streamService.fetchStreams('all', searchQuery);
    },
    retry: 2,
    retryDelay: 1000,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // This would fetch real categories from your API
      return [
        { id: '1', name: 'Just Chatting', viewerCount: 543210, thumbnailUrl: 'https://via.placeholder.com/150' },
        { id: '2', name: 'Gaming', viewerCount: 432100, thumbnailUrl: 'https://via.placeholder.com/150' },
        { id: '3', name: 'Music', viewerCount: 123456, thumbnailUrl: 'https://via.placeholder.com/150' },
        { id: '4', name: 'Art', viewerCount: 98765, thumbnailUrl: 'https://via.placeholder.com/150' },
      ];
    },
  });

  const handleAddStream = (stream: Stream) => {
    addStream(stream);
    // Show success feedback
  };

  const renderCategory = ({ item }: { item: DiscoveryCategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategory === item.id && styles.categoryCardActive,
      ]}
      onPress={() => setSelectedCategory(item.id === selectedCategory ? null : item.id)}
    >
      <Image source={{ uri: item.thumbnailUrl }} style={styles.categoryImage} />
      <Text style={styles.categoryName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.categoryViewers}>
        {item.viewerCount.toLocaleString()} viewers
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={colors.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search streams..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={styles.streamsSection}>
        <Text style={styles.sectionTitle}>
          {selectedCategory ? 'Category Streams' : 'Popular Streams'}
        </Text>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={colors.error} />
            <Text style={styles.errorText}>Unable to load streams</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : isLoading ? (
          <LoadingState />
        ) : (
          <FlatList
            data={streams}
            renderItem={({ item, index }) => (
              <View style={styles.streamItem}>
                <AnimatedStreamCard
                  stream={item}
                  onPress={() => {}}
                  width={undefined}
                  height={180}
                  index={index}
                />
                <TouchableOpacity
                  style={styles.addStreamButton}
                  onPress={() => handleAddStream(item)}
                >
                  <Ionicons name="add-circle" size={24} color={colors.primary} />
                  <Text style={styles.addStreamText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={refetch}
                tintColor={colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  errorText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },
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
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
  },
  categoriesSection: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  categoriesList: {
    paddingHorizontal: spacing.md,
  },
  categoryCard: {
    width: 120,
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
    ...shadows.sm,
  },
  categoryCardActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  categoryImage: {
    width: '100%',
    height: 80,
    backgroundColor: colors.background.tertiary,
  },
  categoryName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
  },
  categoryViewers: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
  },
  streamsSection: {
    flex: 1,
  },
  loader: {
    marginTop: spacing.xl,
  },
  streamItem: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  addStreamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: -spacing.sm,
    ...shadows.sm,
  },
  addStreamText: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.xs,
  },
});