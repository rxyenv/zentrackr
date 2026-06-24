import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Card, Field, Screen } from "../../components/screen";
import { useAuth } from "../../lib/auth";
import { addTemplate, ensureUserSeed, getTemplates, guestUserId, TemplateEntry } from "../../lib/db";
import { colors } from "../../lib/theme";

const programCards = [
  ["Push / Pull / Legs", "Classic 3-day split targeting push, pull, and leg movements", "3 days"],
  ["Upper / Lower", "4-day split alternating upper and lower body", "4 days"],
  ["Bro Split", "5-day split with one muscle group per day", "5 days"],
  ["Full Body", "3-day full body routine hitting all muscle groups", "3 days"],
  ["Arnold Split", "Classic Arnold Schwarzenegger 3-day split", "3 days"],
] as const;

const exerciseCards = [
  ["Barbell Bench Press", "Barbell"],
  ["Incline Bench Press", "Barbell"],
  ["Decline Bench Press", "Barbell"],
  ["Dumbbell Bench Press", "Dumbbell"],
  ["Incline Dumbbell Press", "Dumbbell"],
  ["Dumbbell Flyes", "Dumbbell"],
];

export default function WorkoutsScreen() {
  const db = useSQLiteContext();
  const { userId } = useAuth();
  const activeUserId = userId ?? guestUserId;
  const [tab, setTab] = useState<"splits" | "exercises" | "templates">("splits");
  const [templates, setTemplates] = useState<TemplateEntry[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [templateExercises, setTemplateExercises] = useState("");
  const muscleFilters = useMemo(() => ["All", "Chest", "Back", "Shoulders"], []);

  const refresh = useCallback(() => {
    return Promise.all([
      ensureUserSeed(db, activeUserId),
      getTemplates(db, activeUserId).then(setTemplates),
    ]);
  }, [activeUserId, db]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  return (
    <Screen title="" subtitle="">
      <View style={styles.segment}>
        <SegmentButton active={tab === "splits"} label="Splits" onPress={() => setTab("splits")} />
        <SegmentButton active={tab === "exercises"} label="Exercises" onPress={() => setTab("exercises")} />
        <SegmentButton active={tab === "templates"} label="My Templates" onPress={() => setTab("templates")} />
      </View>

      {tab === "splits" ? (
        <>
          <Text style={styles.heading}>Popular Split Programs</Text>
          {programCards.map(([title, description, duration]) => (
            <Card key={title}>
              <View style={styles.rowBetween}>
                <View style={styles.flex1}>
                  <Text style={styles.cardTitle}>{title}</Text>
                  <Text style={styles.cardBody}>{description}</Text>
                  <Text style={styles.duration}>{duration}</Text>
                </View>
                <Ionicons color={colors.ink} name="chevron-down-outline" size={28} />
              </View>
            </Card>
          ))}
        </>
      ) : null}

      {tab === "exercises" ? (
        <>
          <Field placeholder="Search exercises, muscles, equipment..." />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {muscleFilters.map((filter, index) => (
                <View key={filter} style={[styles.filterChip, index === 0 && styles.filterChipActive]}>
                  <Text style={[styles.filterLabel, index === 0 && styles.filterLabelActive]}>{filter}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
          <Text style={styles.heading}>Chest</Text>
          {exerciseCards.map(([title, equipment]) => (
            <Card key={title}>
              <View style={styles.rowBetween}>
                <View style={styles.exerciseLead}>
                  <View style={styles.exerciseIcon}>
                    <Ionicons color={colors.primary} name="body-outline" size={22} />
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardBody}>{equipment}</Text>
                  </View>
                </View>
                <View style={styles.playCircle}>
                  <Ionicons color={colors.primary} name="play-circle-outline" size={28} />
                </View>
              </View>
            </Card>
          ))}
        </>
      ) : null}

      {tab === "templates" ? (
        <>
          <Pressable
            onPress={async () => {
              await addTemplate(db, activeUserId, {
                name: templateName || "Custom Template",
                split_name: "Custom",
                exercises: templateExercises.split(",").map((item) => item.trim()).filter(Boolean),
              });
              setTemplateName("");
              setTemplateExercises("");
              void refresh();
            }}
            style={styles.createButton}
          >
            <Ionicons color="#1D1E24" name="add-circle-outline" size={28} />
            <Text style={styles.createText}>Create Custom Template</Text>
          </Pressable>
          <Field onChangeText={setTemplateName} placeholder="Template name" value={templateName} />
          <Field onChangeText={setTemplateExercises} placeholder="Exercises, comma separated" value={templateExercises} />
          {templates.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.bookmarkCircle}>
                <Ionicons color={colors.muted} name="bookmark-outline" size={44} />
              </View>
              <Text style={styles.emptyTitle}>No templates yet</Text>
              <Text style={styles.emptyBody}>
                Save a split program or build your own custom template
              </Text>
            </View>
          ) : (
            templates.map((template) => (
              <Card key={template.id}>
                <Text style={styles.cardTitle}>{template.name}</Text>
                <Text style={styles.cardBody}>{JSON.parse(template.exercises).join(" • ")}</Text>
              </Card>
            ))
          )}
        </>
      ) : null}
    </Screen>
  );
}

function SegmentButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.segmentButton, active && styles.segmentButtonActive]}>
      <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  segment: {
    backgroundColor: colors.card,
    borderRadius: 24,
    flexDirection: "row",
    padding: 8,
  },
  segmentButton: {
    borderRadius: 20,
    flex: 1,
    paddingVertical: 18,
  },
  segmentButtonActive: {
    backgroundColor: colors.primary,
  },
  segmentLabel: {
    color: colors.ink,
    fontSize: 18,
    textAlign: "center",
  },
  segmentLabelActive: {
    color: "#1D1E24",
    fontWeight: "700",
  },
  heading: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "500",
  },
  rowBetween: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flex1: {
    flex: 1,
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "700",
  },
  cardBody: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  duration: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
  },
  filterChip: {
    backgroundColor: colors.card,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterLabel: {
    color: colors.ink,
    fontSize: 16,
  },
  filterLabelActive: {
    color: "#1D1E24",
    fontWeight: "700",
  },
  exerciseLead: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
  exerciseIcon: {
    alignItems: "center",
    backgroundColor: colors.cardSoft,
    borderRadius: 18,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  playCircle: {
    alignItems: "center",
    backgroundColor: colors.cardSoft,
    borderRadius: 18,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  createButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 28,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    minHeight: 80,
  },
  createText: {
    color: "#1D1E24",
    fontSize: 22,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    gap: 12,
    marginTop: 48,
  },
  bookmarkCircle: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 999,
    height: 120,
    justifyContent: "center",
    width: 120,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "700",
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 16,
    textAlign: "center",
  },
});
