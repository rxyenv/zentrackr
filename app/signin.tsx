import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { Card, Screen } from "../components/screen";
import { hasSupabaseConfig } from "../lib/supabase";
import { colors } from "../lib/theme";

export default function SignInScreen() {
  return (
    <Screen title="Sign in" subtitle="Supabase auth was present in the release bundle.">
      <Card>
        <Text style={styles.body}>
          {hasSupabaseConfig
            ? "Supabase keys are configured. The auth client is ready to be wired to your original tables and policies."
            : "Supabase keys are not configured yet. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable live auth."}
        </Text>
      </Card>
      <Link href="/(tabs)" style={styles.cta}>
        Open the app
      </Link>
      <Link href="/signup" style={styles.link}>
        Need an account?
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 24,
  },
  cta: {
    backgroundColor: colors.primary,
    color: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    padding: 16,
    textAlign: "center",
    fontWeight: "700",
  },
  link: {
    color: colors.accent,
    textAlign: "center",
    fontWeight: "700",
  },
});
