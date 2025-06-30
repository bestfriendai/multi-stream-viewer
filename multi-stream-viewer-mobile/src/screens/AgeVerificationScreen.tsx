import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { config } from '../constants/config';

interface AgeVerificationScreenProps {
  onVerified: () => void;
}

export default function AgeVerificationScreen({ onVerified }: AgeVerificationScreenProps) {
  const [birthYear, setBirthYear] = useState('');

  const verifyAge = async () => {
    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (isNaN(year) || year < 1900 || year > currentYear) {
      Alert.alert('Invalid Year', 'Please enter a valid birth year.');
      return;
    }

    if (age < config.minimumAge) {
      Alert.alert(
        'Age Requirement',
        `You must be at least ${config.minimumAge} years old to use this app.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Save age verification
    await AsyncStorage.setItem('ageVerified', 'true');
    await AsyncStorage.setItem('userBirthYear', birthYear);
    onVerified();
  };

  const yearButtons = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - 13 - i * 10;
    return year;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={80} color={colors.primary} />
        </View>

        <Text style={styles.title}>Age Verification Required</Text>
        <Text style={styles.subtitle}>
          To comply with online safety regulations, we need to verify your age.
          You must be at least {config.minimumAge} years old to use {config.appName}.
        </Text>

        <Text style={styles.questionText}>What year were you born?</Text>

        <View style={styles.yearGrid}>
          {yearButtons.map((year) => (
            <TouchableOpacity
              key={year}
              style={[
                styles.yearButton,
                birthYear === year.toString() && styles.yearButtonActive,
              ]}
              onPress={() => setBirthYear(year.toString())}
            >
              <Text
                style={[
                  styles.yearButtonText,
                  birthYear === year.toString() && styles.yearButtonTextActive,
                ]}
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            !birthYear && styles.verifyButtonDisabled,
          ]}
          onPress={verifyAge}
          disabled={!birthYear}
        >
          <Text style={styles.verifyButtonText}>Verify Age</Text>
        </TouchableOpacity>

        <Text style={styles.privacyText}>
          We take your privacy seriously. Your age information is only stored
          locally on your device and is never shared with third parties.
        </Text>

        <TouchableOpacity
          onPress={() => {
            // Open privacy policy
          }}
        >
          <Text style={styles.privacyLink}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
  questionText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  yearButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    margin: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  yearButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  yearButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  yearButtonTextActive: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  verifyButtonDisabled: {
    backgroundColor: colors.background.tertiary,
    opacity: 0.5,
  },
  verifyButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  privacyText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
  privacyLink: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});