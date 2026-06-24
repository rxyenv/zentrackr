import { Ionicons } from "@expo/vector-icons";
import { Link, Redirect } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card, Field, Screen } from "../components/screen";
import { useAuth } from "../lib/auth";
import { colors } from "../lib/theme";

export default function SignUpScreen() {
  const { session, isConfigured, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Screen title="" subtitle="">
      <View style={styles.hero}>
        <View style={styles.avatarCircle}>
          <Ionicons color={colors.primary} name="person-add-outline" size={56} />
        </View>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Back up your workouts and sync across devices</Text>
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
            placeholder="At least 8 characters"
            secureTextEntry
            style={styles.inputField}
            value={password}
          />
        </View>

        {notice ? <Text style={styles.notice}>{notice}</Text> : null}

        <Pressable
          disabled={submitting || !isConfigured}
          onPress={async () => {
            setSubmitting(true);
            const nextError = await signUp(email.trim(), password);
            setNotice(nextError ?? "Check your email if confirmation is enabled.");
            setSubmitting(false);
          }}
          style={[styles.primaryButton, !isConfigured && styles.disabled]}
        >
          <Text style={styles.primaryText}>{submitting ? "Creating..." : "Create Account"}</Text>
        </Pressable>
      </Card>

      <Text style={styles.linkText}>
        Already have an account? <Link href="/signin" style={styles.inlineLink}>Sign In</Link>
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
    textAlign: "center",
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
  notice: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  disabled: {
    opacity: 0.5,
  },
});
