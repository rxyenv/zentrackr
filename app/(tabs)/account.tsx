import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card, Field, Screen } from "../../components/screen";
import { useAuth } from "../../lib/auth";
import { colors } from "../../lib/theme";

export default function AccountScreen() {
  const { session, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (session) {
    return (
      <Screen title="" subtitle="">
        <View style={styles.hero}>
          <View style={styles.avatarCircle}>
            <Ionicons color={colors.primary} name="person-outline" size={60} />
          </View>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>{session.user.email ?? "Signed in"}</Text>
        </View>
        <Card>
          <Text style={styles.fieldLabel}>Signed in</Text>
          <Text style={styles.meta}>Your workouts can sync across devices now.</Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen title="" subtitle="">
      <View style={styles.hero}>
        <View style={styles.avatarCircle}>
          <Ionicons color={colors.primary} name="person-outline" size={60} />
        </View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to sync your workouts</Text>
      </View>

      <Card>
        <Text style={styles.fieldLabel}>Email</Text>
        <View style={styles.inputRow}>
          <Ionicons color={colors.muted} name="mail-outline" size={28} />
          <Field
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            style={styles.inputField}
            value={email}
          />
        </View>

        <Text style={styles.fieldLabel}>Password</Text>
        <View style={styles.inputRow}>
          <Ionicons color={colors.muted} name="lock-closed-outline" size={28} />
          <Field
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            style={styles.inputField}
            value={password}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          onPress={async () => {
            setBusy(true);
            const nextError = await signIn(email.trim(), password);
            setError(nextError);
            setBusy(false);
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryText}>{busy ? "Signing In..." : "Sign In"}</Text>
        </Pressable>
      </Card>

      <Text style={styles.linkText}>Forgot password?</Text>
      <Text style={styles.linkText}>
        Don&apos;t have an account? <Link href="/signup" style={styles.inlineLink}>Sign Up</Link>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    marginTop: 40,
  },
  avatarCircle: {
    alignItems: "center",
    backgroundColor: colors.cardSoft,
    borderRadius: 84,
    height: 168,
    justifyContent: "center",
    marginBottom: 34,
    width: 168,
  },
  title: {
    color: colors.ink,
    fontSize: 36,
    fontWeight: "400",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 18,
    marginTop: 10,
  },
  fieldLabel: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "600",
  },
  inputRow: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 18,
  },
  inputField: {
    backgroundColor: "transparent",
    borderWidth: 0,
    flex: 1,
    fontSize: 20,
    paddingHorizontal: 0,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 74,
    marginTop: 12,
  },
  primaryText: {
    color: "#1D1E24",
    fontSize: 22,
    fontWeight: "700",
  },
  linkText: {
    color: colors.muted,
    fontSize: 18,
    textAlign: "center",
  },
  inlineLink: {
    color: colors.primary,
    fontWeight: "700",
  },
  error: {
    color: colors.warning,
    fontSize: 14,
  },
  meta: {
    color: colors.muted,
    fontSize: 16,
  },
});
