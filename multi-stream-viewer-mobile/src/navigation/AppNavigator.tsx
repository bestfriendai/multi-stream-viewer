import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '../constants/theme';

import StreamsScreen from '../screens/StreamsScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import FeaturesScreen from '../screens/FeaturesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StreamDetailScreen from '../screens/StreamDetailScreen';
import AddStreamModal from '../screens/AddStreamModal';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function StreamsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontWeight: typography.fontWeight.semibold,
          fontSize: typography.fontSize.headline,
        },
        headerBackTitleVisible: false,
        headerTransparent: true,
        headerBackground: () => (
          <BlurView 
            intensity={80} 
            tint="dark" 
            style={{ flex: 1 }} 
          />
        ),
      }}
    >
      <Stack.Screen 
        name="StreamsList" 
        component={StreamsScreen} 
        options={{ 
          title: 'Streams',
          headerTransparent: false,
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
        }}
      />
      <Stack.Screen 
        name="StreamDetail" 
        component={StreamDetailScreen} 
        options={{ 
          title: '',
          headerTransparent: true,
        }}
      />
      <Stack.Screen 
        name="AddStream" 
        component={AddStreamModal} 
        options={{ 
          title: 'Add Stream',
          presentation: 'modal',
          gestureEnabled: true,
          cardOverlayEnabled: true,
          headerShown: true,
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Streams') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Features') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'alert-circle-outline';
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons 
                name={iconName} 
                size={focused ? 26 : 24} 
                color={color} 
                style={{ 
                  transform: [{ scale: focused ? 1.1 : 1 }],
                }}
              />
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.background.secondary,
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.sm,
          paddingTop: spacing.sm,
          height: Platform.OS === 'ios' ? 90 : 65,
        },
        tabBarBackground: () => Platform.OS === 'ios' ? (
          <BlurView 
            intensity={100} 
            tint="dark" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        ) : null,
        tabBarLabelStyle: {
          fontSize: typography.fontSize.caption2,
          fontWeight: typography.fontWeight.medium,
          marginTop: -spacing.xs,
          marginBottom: spacing.xs,
        },
        headerShown: false,
        tabBarButton: (props) => (
          <View 
            {...props} 
            onTouchStart={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
        ),
      })}
    >
      <Tab.Screen 
        name="Streams" 
        component={StreamsStack}
        options={{
          tabBarLabel: 'Streams',
        }}
      />
      <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen}
        options={{
          tabBarLabel: 'Discover',
          headerShown: true,
          headerTransparent: true,
          headerBackground: () => (
            <BlurView 
              intensity={80} 
              tint="dark" 
              style={{ flex: 1 }} 
            />
          ),
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: typography.fontWeight.semibold,
            fontSize: typography.fontSize.headline,
          },
        }}
      />
      <Tab.Screen 
        name="Features" 
        component={FeaturesScreen}
        options={{
          tabBarLabel: 'Features',
          headerShown: true,
          headerTransparent: true,
          headerBackground: () => (
            <BlurView 
              intensity={80} 
              tint="dark" 
              style={{ flex: 1 }} 
            />
          ),
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: typography.fontWeight.semibold,
            fontSize: typography.fontSize.headline,
          },
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          headerShown: true,
          headerTransparent: true,
          headerBackground: () => (
            <BlurView 
              intensity={80} 
              tint="dark" 
              style={{ flex: 1 }} 
            />
          ),
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: typography.fontWeight.semibold,
            fontSize: typography.fontSize.headline,
          },
        }}
      />
    </Tab.Navigator>
  );
}