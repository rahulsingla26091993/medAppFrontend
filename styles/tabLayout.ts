import { Platform } from 'react-native';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

export const createTabLayoutStyles = (colors: any, colorScheme: string, insets: any): Partial<BottomTabNavigationOptions> => ({
  tabBarActiveTintColor: colors.tabIconSelected,
  tabBarInactiveTintColor: colors.tabIconDefault,
  tabBarStyle: { 
    backgroundColor: colorScheme === 'dark' ? colors.background : colors.surface,
    height: Platform.select({
      ios: 49 + insets.bottom, // Standard tab bar height (49) + safe area
      android: 56 + insets.bottom, // Material Design standard height + safe area
    }),
    paddingBottom: insets.bottom, // Dynamic bottom padding based on device
    paddingHorizontal: Platform.OS === 'ios' ? 8 : 0,
  },
  tabBarIconStyle: {
    marginTop: Platform.OS === 'ios' ? 0 : 4,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    marginBottom: Platform.OS === 'ios' ? 0 : 8,
  },
});
