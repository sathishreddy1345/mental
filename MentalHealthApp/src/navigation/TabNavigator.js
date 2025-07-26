import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import HomeScreen from '../screens/Home/HomeScreen';
import MoodScreen from '../screens/Mood/MoodScreen';
import BreathingScreen from '../screens/Breathing/BreathingScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import MusicScreen from '../screens/Music/MusicScreen';

import { COLORS } from '../constants/colors';
import { DIMENSIONS } from '../constants/dimensions';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const getTabBarIcon = (routeName, focused, color, size) => {
    let iconName;

    switch (routeName) {
      case 'Home':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Mood':
        iconName = focused ? 'happy' : 'happy-outline';
        break;
      case 'Breathing':
        iconName = focused ? 'leaf' : 'leaf-outline';
        break;
      case 'Chat':
        iconName = focused ? 'chatbubble' : 'chatbubble-outline';
        break;
      case 'Music':
        iconName = focused ? 'musical-notes' : 'musical-notes-outline';
        break;
      default:
        iconName = 'circle';
    }

    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: DIMENSIONS.spacing.xs,
      }}>
        {focused && (
          <LinearGradient
            colors={COLORS.gradients.primary}
            style={{
              position: 'absolute',
              width: 40,
              height: 40,
              borderRadius: 20,
              opacity: 0.2,
            }}
          />
        )}
        <Ionicons 
          name={iconName} 
          size={size} 
          color={focused ? COLORS.primary : color} 
        />
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: COLORS.text,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: DIMENSIONS.font.tiny,
          fontWeight: '600',
          marginBottom: DIMENSIONS.spacing.xs,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen 
        name="Mood" 
        component={MoodScreen}
        options={{
          title: 'Mood',
        }}
      />
      <Tab.Screen 
        name="Breathing" 
        component={BreathingScreen}
        options={{
          title: 'Breathe',
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          title: 'Chat',
        }}
      />
      <Tab.Screen 
        name="Music" 
        component={MusicScreen}
        options={{
          title: 'Music',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;