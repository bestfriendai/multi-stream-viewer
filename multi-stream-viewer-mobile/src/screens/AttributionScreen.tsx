import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

interface Attribution {
  name: string;
  description: string;
  license: string;
  url: string;
}

const attributions: Attribution[] = [
  {
    name: 'React Native',
    description: 'A framework for building native apps using React',
    license: 'MIT License',
    url: 'https://reactnative.dev',
  },
  {
    name: 'Expo',
    description: 'Platform for making universal native apps',
    license: 'MIT License',
    url: 'https://expo.dev',
  },
  {
    name: 'React Navigation',
    description: 'Routing and navigation for React Native apps',
    license: 'MIT License',
    url: 'https://reactnavigation.org',
  },
  {
    name: 'Zustand',
    description: 'State management solution',
    license: 'MIT License',
    url: 'https://github.com/pmndrs/zustand',
  },
  {
    name: 'React Native Reanimated',
    description: 'Animations library for React Native',
    license: 'MIT License',
    url: 'https://docs.swmansion.com/react-native-reanimated',
  },
  {
    name: 'Ionicons',
    description: 'Premium icon set',
    license: 'MIT License',
    url: 'https://ionic.io/ionicons',
  },
];

export default function AttributionScreen() {
  const navigation = useNavigation();

  const handleOpenUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Open Source Licenses</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.disclaimer}>
          This app uses the following open source libraries. We are grateful to
          the open source community for their contributions.
        </Text>

        {attributions.map((attr, index) => (
          <TouchableOpacity
            key={index}
            style={styles.attributionCard}
            onPress={() => handleOpenUrl(attr.url)}
          >
            <View style={styles.attributionHeader}>
              <Text style={styles.attributionName}>{attr.name}</Text>
              <Ionicons
                name="open-outline"
                size={16}
                color={colors.text.secondary}
              />
            </View>
            <Text style={styles.attributionDescription}>
              {attr.description}
            </Text>
            <Text style={styles.attributionLicense}>{attr.license}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.streamingNotice}>
          <Ionicons
            name="information-circle"
            size={24}
            color={colors.info}
          />
          <Text style={styles.streamingNoticeText}>
            Stream content is provided by third-party platforms. This app does
            not host or control the content. All trademarks and copyrights
            belong to their respective owners.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Multi-Stream Viewer is not affiliated with Twitch, YouTube, Kick,
            or any other streaming platform. All platform names and logos are
            trademarks of their respective owners.
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
    padding: spacing.md,
  },
  disclaimer: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
  attributionCard: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  attributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  attributionName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  attributionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  attributionLicense: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  streamingNotice: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.info,
  },
  streamingNoticeText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
  footer: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: typography.fontSize.xs * typography.lineHeight.relaxed,
  },
});