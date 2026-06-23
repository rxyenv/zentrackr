import * as Notifications from "expo-notifications";
import { Pressable, StyleSheet, Text } from "react-native";

import { Card, Screen } from "../../components/screen";
import { hasSupabaseConfig } from "../../lib/supabase";
import { colors } from "../../lib/theme";

export default function AccountScreen() {
  return (
    <Screen title="Account" subtitle="Auth, notifications, and account settings were all inferred from the bundle.">
      <Card>
        <Text style={styles.label}>Supabase</Text>
        <Text style={styles.body}>
          {hasSupabaseConfig ? "Configured" : "Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY"}
        </Text>
      </Card>
      <Pressable
        onPress={async () => {
          await Notifications.requestPermissionsAsync();
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Enable notifications</Text>
      </Pressable>
      <Card>
        <Text style={styles.label}>Widget note</Text>
        <Text style={styles.body}>
          The Android bundle exposed a calorie widget. The routing and data hooks are in
          place, but the actual native widget package still needs to be reintroduced.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  body: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});
