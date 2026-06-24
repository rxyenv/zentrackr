import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card, Field, Screen } from "../../components/screen";
import { useAuth } from "../../lib/auth";
import { addNutritionEntry, addWorkoutSession, ensureUserSeed, getSummary, guestUserId, today } from "../../lib/db";
import { colors } from "../../lib/theme";

const splitOptions = [
  { name: "Push", subtitle: "Chest, shoulders, triceps", icon: "heart-outline" },
  { name: "Pull", subtitle: "Back, biceps", icon: "body-outline" },
  { name: "Legs", subtitle: "Quads, hamstrings, calves", icon: "walk-outline" },
  { name: "Upper", subtitle: "Full upper body", icon: "barbell-outline" },
  { name: "Lower", subtitle: "Full lower body", icon: "accessibility-outline" },
];

export default function TodayScreen() {
  const db = useSQLiteContext();
  const { userId } = useAuth();
  const activeUserId = userId ?? guestUserId;
  const [summary, setSummary] = useState({
    todayCalories: 0,
    weeklySessions: 0,
    avgSleepHours: 0,
    latestWeightKg: null as number | null,
    todaySteps: 0,
  });
  const [selectedSplit, setSelectedSplit] = useState("Push");
  const [sessionNotes, setSessionNotes] = useState("");
  const [foodText, setFoodText] = useState("");
  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }, []);

  const refresh = useCallback(() => {
    return Promise.all([
      ensureUserSeed(db, activeUserId),
      getSummary(db, activeUserId).then(setSummary),
    ]);
  }, [activeUserId, db]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  return (
    <Screen title="" subtitle="">
      <Text style={styles.date}>{formattedDate}</Text>
      <Text style={styles.heading}>Good afternoon</Text>

      <View style={styles.metricsRow}>
        <Metric icon="water-outline" label={`/${2000} kcal`} value={String(summary.todayCalories)} />
        <Metric icon="barbell-outline" label="sets logged" value={String(summary.weeklySessions)} />
        <Metric icon="trophy-outline" label="day streak" value="0" />
      </View>

      <Card>
        <Pressable
          onPress={async () => {
            await addWorkoutSession(db, activeUserId, {
              split_name: selectedSplit,
              date: today(),
              notes: sessionNotes,
            });
            void refresh();
          }}
          style={styles.bigPrimary}
        >
          <Ionicons color="#1D1E24" name="add-circle-outline" size={28} />
          <Text style={styles.bigPrimaryText}>Start a Workout</Text>
        </Pressable>

        <View style={styles.splitList}>
          {splitOptions.map((split) => (
            <Pressable
              key={split.name}
              onPress={() => setSelectedSplit(split.name)}
              style={[styles.splitItem, selectedSplit === split.name && styles.splitItemActive]}
            >
              <View style={styles.splitIcon}>
                <Ionicons color={colors.primary} name={split.icon as never} size={22} />
              </View>
              <View style={styles.splitText}>
                <Text style={styles.splitTitle}>{split.name}</Text>
                <Text style={styles.splitSubtitle}>{split.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Field onChangeText={setSessionNotes} placeholder="Session notes..." value={sessionNotes} />
        <Pressable style={styles.bigPrimary}>
          <Ionicons color="#1D1E24" name="add-circle-outline" size={28} />
          <Text style={styles.bigPrimaryText}>Add Exercise</Text>
        </Pressable>
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLead}>
            <View style={styles.appleIconWrap}>
              <Ionicons color={colors.ink} name="nutrition-outline" size={22} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Nutrition</Text>
              <Text style={styles.sectionSubtitle}>Log food, track macros & calories</Text>
            </View>
          </View>
          <View style={styles.sectionAction}>
            <Ionicons color={colors.primary} name="create-outline" size={22} />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.macroRow}>
          <MacroCard label="Protein" value="0g" />
          <MacroCard label="Carbs" value="0g" />
          <MacroCard label="Fat" value="0g" />
        </View>

        <Card>
          <Text style={styles.helper}>Add food (e.g. "200g rice" or "1 banana")</Text>
          <View style={styles.foodRow}>
            <View style={styles.foodInput}>
              <Ionicons color={colors.muted} name="search-outline" size={22} />
              <Field
                onChangeText={setFoodText}
                placeholder="200g chicken..."
                style={styles.foodField}
                value={foodText}
              />
            </View>
            <Pressable
              onPress={async () => {
                await addNutritionEntry(db, activeUserId, {
                  date: today(),
                  meal_name: foodText || "Quick add",
                  calories: 0,
                  protein_g: 0,
                  carbs_g: 0,
                  fats_g: 0,
                });
                setFoodText("");
                void refresh();
              }}
              style={styles.plusButton}
            >
              <Ionicons color="#1D1E24" name="add" size={28} />
            </Pressable>
          </View>
        </Card>
      </Card>
    </Screen>
  );
}

function Metric({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricIconWrap}>
        <Ionicons color={colors.primary} name={icon} size={28} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricBar} />
    </View>
  );
}

function MacroCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.macroCard}>
      <Text style={styles.macroValue}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    color: colors.muted,
    fontSize: 20,
    marginTop: 4,
  },
  heading: {
    color: colors.ink,
    fontSize: 44,
    fontWeight: "300",
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
  },
  metricCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    flex: 1,
    gap: 8,
    padding: 14,
  },
  metricIconWrap: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.cardSoft,
    borderRadius: 999,
    height: 86,
    justifyContent: "center",
    width: 86,
  },
  metricValue: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
  },
  metricBar: {
    backgroundColor: colors.divider,
    borderRadius: 999,
    height: 6,
    marginTop: 10,
  },
  bigPrimary: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 28,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    minHeight: 74,
  },
  bigPrimaryText: {
    color: "#1D1E24",
    fontSize: 22,
    fontWeight: "700",
  },
  splitList: {
    gap: 12,
  },
  splitItem: {
    alignItems: "center",
    backgroundColor: colors.cardSoft,
    borderRadius: 22,
    flexDirection: "row",
    gap: 14,
    padding: 16,
  },
  splitItemActive: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  splitIcon: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 18,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  splitText: {
    flex: 1,
  },
  splitTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700",
  },
  splitSubtitle: {
    color: colors.muted,
    fontSize: 14,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionLead: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
  appleIconWrap: {
    alignItems: "center",
    backgroundColor: "#6B6B71",
    borderRadius: 18,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "600",
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: 14,
  },
  sectionAction: {
    alignItems: "center",
    backgroundColor: colors.cardSoft,
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  divider: {
    backgroundColor: colors.divider,
    borderRadius: 999,
    height: 8,
  },
  macroRow: {
    flexDirection: "row",
    gap: 10,
  },
  macroCard: {
    backgroundColor: colors.cardSoft,
    borderRadius: 22,
    flex: 1,
    padding: 16,
  },
  macroValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  macroLabel: {
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
  },
  helper: {
    color: colors.muted,
    fontSize: 14,
  },
  foodRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  foodInput: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    paddingLeft: 16,
  },
  foodField: {
    backgroundColor: "transparent",
    borderWidth: 0,
    flex: 1,
    paddingHorizontal: 0,
  },
  plusButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 66,
    justifyContent: "center",
    width: 66,
  },
});
