import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../lib/theme";

const slides = [
  {
    icon: "barbell-outline",
    title: "Track Your Workouts",
    body: "Log exercises, sets, and reps with ease. Organize by splits and supersets to match your routine.",
  },
  {
    icon: "trending-up-outline",
    title: "See Your Progress",
    body: "Charts show your weight and rep progression over time. PRs are automatically detected and highlighted.",
  },
  {
    icon: "sync-outline",
    title: "Sync Everywhere",
    body: "Create an account to sync your data across devices. Your workouts are always backed up and safe.",
  },
  {
    icon: "person-circle-outline",
    title: "Ready to go",
    body: "Sign in or create an account to sync your data. You can also continue without an account.",
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Ionicons color={colors.primary} name={slide.icon as never} size={56} />
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>

      <View style={styles.dots}>
        {slides.map((_, itemIndex) => (
          <View key={itemIndex} style={[styles.dot, itemIndex === index && styles.dotActive]} />
        ))}
      </View>

      {isLast ? (
        <View style={styles.actions}>
          <Link href="/signin" style={styles.primaryButton}>
            Sign In
          </Link>
          <Link href="/signup" style={styles.secondaryButton}>
            Create Account
          </Link>
          <Pressable onPress={() => setShowGuestModal(true)}>
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.actions}>
          <Pressable onPress={() => setIndex(index + 1)} style={styles.primaryButton}>
            <Text style={styles.primaryText}>Next</Text>
          </Pressable>
          <Pressable onPress={() => setIndex(slides.length - 1)}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
      )}

      <Modal transparent animationType="fade" visible={showGuestModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <View style={styles.modalIconCircle}>
              <Ionicons color={colors.primary} name="cloud-offline-outline" size={40} />
            </View>
            <Text style={styles.modalTitle}>Guest Mode</Text>
            <Text style={styles.modalBody}>
              Syncing across devices won&apos;t work in guest mode. Your data stays on this device only.
            </Text>
            <Pressable
              onPress={() => {
                setShowGuestModal(false);
                router.replace("/(tabs)");
              }}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryText}>Continue as Guest</Text>
            </Pressable>
            <Pressable onPress={() => setShowGuestModal(false)} style={styles.primaryButton}>
              <Text style={styles.primaryText}>Sign In Instead</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingVertical: 56,
  },
  hero: {
    alignItems: "center",
    marginTop: 80,
  },
  iconCircle: {
    alignItems: "center",
    backgroundColor: colors.cardSoft,
    borderRadius: 84,
    height: 168,
    justifyContent: "center",
    marginBottom: 30,
    width: 168,
  },
  title: {
    color: colors.ink,
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 29,
    marginTop: 22,
    textAlign: "center",
  },
  dots: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  dot: {
    backgroundColor: colors.cardSoft,
    borderRadius: 999,
    height: 14,
    width: 14,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 46,
  },
  actions: {
    gap: 22,
    marginBottom: 18,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 74,
    paddingHorizontal: 20,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: colors.cardSoft,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 74,
    paddingHorizontal: 20,
  },
  primaryText: {
    color: "#1D1E24",
    fontSize: 19,
    fontWeight: "700",
  },
  secondaryText: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: "700",
  },
  skipText: {
    color: colors.muted,
    fontSize: 18,
    textAlign: "center",
  },
  modalBackdrop: {
    backgroundColor: "rgba(0,0,0,0.45)",
    flex: 1,
    justifyContent: "center",
    padding: 26,
  },
  modal: {
    backgroundColor: colors.card,
    borderRadius: 32,
    gap: 22,
    padding: 28,
  },
  modalIconCircle: {
    alignItems: "center",
    backgroundColor: colors.cardSoft,
    borderRadius: 999,
    height: 88,
    justifyContent: "center",
    marginHorizontal: "auto",
    width: 88,
  },
  modalTitle: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  modalBody: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 28,
    textAlign: "center",
  },
});
