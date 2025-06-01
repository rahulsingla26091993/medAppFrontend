import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: { 
          backgroundColor: colorScheme === 'dark' ? colors.background : colors.surface
        },
        tabBarBackground: TabBarBackground,
        tabBarButton: (props) => <HapticTab {...props} />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="doctor-recommendations"
        options={{
          title: 'Doctor Recommendations',
          tabBarIcon: ({ color }) => <Ionicons name="medical-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
