import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ColorValue } from "react-native";

import { colors } from "../../lib/theme";

const tabIcon =
  (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: ColorValue; size: number }) =>
    <Ionicons name={name} size={size} color={color} />;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: tabIcon("home-outline") }} />
      <Tabs.Screen name="workouts" options={{ title: "Workouts", tabBarIcon: tabIcon("barbell-outline") }} />
      <Tabs.Screen name="nutrition" options={{ title: "Nutrition", tabBarIcon: tabIcon("nutrition-outline") }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar", tabBarIcon: tabIcon("calendar-outline") }} />
      <Tabs.Screen name="stats" options={{ title: "Stats", tabBarIcon: tabIcon("stats-chart-outline") }} />
      <Tabs.Screen name="account" options={{ title: "Account", tabBarIcon: tabIcon("person-outline") }} />
    </Tabs>
  );
}
