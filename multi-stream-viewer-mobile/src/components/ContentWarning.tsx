import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

interface ContentWarningProps {
  visible: boolean;
  streamTitle: string;
  streamCategory: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ContentWarning({
  visible,
  streamTitle,
  streamCategory,
  onAccept,
  onDecline,
}: ContentWarningProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="warning"
              size={48}
              color={colors.warning}
            />
          </View>

          <Text style={styles.title}>Content Warning</Text>
          
          <Text style={styles.message}>
            This stream may contain content that some viewers find inappropriate.
          </Text>

          <View style={styles.streamInfo}>
            <Text style={styles.streamTitle} numberOfLines={2}>
              {streamTitle}
            </Text>
            <Text style={styles.streamCategory}>
              Category: {streamCategory}
            </Text>
          </View>

          <Text style={styles.disclaimer}>
            By continuing, you confirm that you are of appropriate age and wish
            to view this content. Viewer discretion is advised.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={onDecline}
            >
              <Text style={styles.declineButtonText}>Go Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={onAccept}
            >
              <Text style={styles.acceptButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.xl,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    maxWidth: 400,
    width: '90%',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
  streamInfo: {
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  streamTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  streamCategory: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  disclaimer: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: colors.background.tertiary,
    marginRight: spacing.sm,
  },
  acceptButton: {
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  declineButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  acceptButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});