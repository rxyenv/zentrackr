import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";

import { runMigrations } from "../lib/db";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="zentrackr.db" onInit={runMigrations}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SQLiteProvider>
  );
}
