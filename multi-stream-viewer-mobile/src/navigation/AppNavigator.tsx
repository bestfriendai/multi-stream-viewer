import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

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
          backgroundColor: '#0a0a0a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="StreamsList" 
        component={StreamsScreen} 
        options={{ title: 'Streams' }}
      />
      <Stack.Screen 
        name="StreamDetail" 
        component={StreamDetailScreen} 
        options={{ title: 'Stream' }}
      />
      <Stack.Screen 
        name="AddStream" 
        component={AddStreamModal} 
        options={{ 
          title: 'Add Stream',
          presentation: 'modal',
          headerShown: false,
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

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: '#1f2937',
          paddingBottom: Platform.OS === 'ios' ? 0 : 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Streams" component={StreamsStack} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Features" component={FeaturesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}