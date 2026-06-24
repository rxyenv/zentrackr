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
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: colors.tab,
          borderTopColor: "transparent",
          height: 88,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Today", tabBarIcon: tabIcon("barbell-outline") }} />
      <Tabs.Screen name="workouts" options={{ title: "Workouts", tabBarIcon: tabIcon("barbell-outline") }} />
      <Tabs.Screen name="stats" options={{ title: "Stats", tabBarIcon: tabIcon("stats-chart-outline") }} />
      <Tabs.Screen name="account" options={{ title: "Account", tabBarIcon: tabIcon("person-outline") }} />
      <Tabs.Screen name="nutrition" options={{ href: null }} />
      <Tabs.Screen name="calendar" options={{ href: null }} />
    </Tabs>
  );
}
