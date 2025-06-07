import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function DrawerLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? colors.background : colors.surface,
          },
          headerTintColor: colors.text,
          drawerStyle: {
            backgroundColor: colorScheme === 'dark' ? colors.background : colors.surface,
          },
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.tabIconDefault,
          headerLeft: () => <DrawerToggleButton tintColor={colors.text} />,
        }}
      >        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Report Analysis',
            title: 'Report Analysis',
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="doctor-recommendations"
          options={{
            drawerLabel: 'Doctor Recommendations',
            title: 'Doctor Recommendations',
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="medical-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
