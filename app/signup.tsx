import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { Card, Screen } from "../components/screen";
import { colors } from "../lib/theme";

export default function SignUpScreen() {
  return (
    <Screen title="Create account" subtitle="Auth screens were present in the shipped route tree.">
      <Card>
        <Text style={styles.body}>
          This placeholder keeps the route structure intact while you reconnect the
          original Supabase schema, email templates, and auth callbacks.
        </Text>
      </Card>
      <Link href="/signin" style={styles.link}>
        Back to sign in
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
  link: {
    backgroundColor: colors.accent,
    color: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    padding: 16,
    textAlign: "center",
    fontWeight: "700",
  },
});
