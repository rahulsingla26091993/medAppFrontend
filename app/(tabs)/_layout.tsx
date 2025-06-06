import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: { 
          backgroundColor: colorScheme === 'dark' ? colors.background : colors.surface,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingHorizontal: Platform.OS === 'ios' ? 8 : 0,
        },
        tabBarBackground: TabBarBackground,
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
        },
      } as BottomTabNavigationOptions}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="document-text-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="doctor-recommendations"
        options={{
          title: 'Doctor Recommendations',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="medical-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
