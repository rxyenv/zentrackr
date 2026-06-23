import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Card, Screen } from "../components/screen";
import { colors, spacing } from "../lib/theme";

export default function OnboardingScreen() {
  return (
    <Screen
      title="ZenTrackr"
      subtitle="Recovered from the shipped bundle and rebuilt as a clean Expo Router app."
    >
      <Card>
        <Text style={styles.kicker}>Recovered feature map</Text>
        <Text style={styles.copy}>
          Workouts, nutrition, bodyweight, sleep, step tracking, Supabase auth hooks,
          notifications, and a calorie widget were all visible in the released build.
        </Text>
      </Card>
      <Card>
        <Text style={styles.kicker}>Start here</Text>
        <Text style={styles.copy}>
          This first pass keeps the local-first fitness flows working even if Supabase
          keys have not been restored yet.
        </Text>
      </Card>
      <View style={styles.actions}>
        <Link href="/signin" style={styles.primary}>
          Sign in
        </Link>
        <Link href="/signup" style={styles.secondary}>
          Create account
        </Link>
        <Link href="/(tabs)" style={styles.ghost}>
          Continue offline
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  copy: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
    color: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  secondary: {
    backgroundColor: colors.accent,
    color: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  ghost: {
    color: colors.ink,
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
});
