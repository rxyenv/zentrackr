import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card, Screen } from "../../components/screen";
import { DashboardSummary, getSummary } from "../../lib/db";
import { colors } from "../../lib/theme";

const initialSummary: DashboardSummary = {
  todayCalories: 0,
  weeklySessions: 0,
  avgSleepHours: 0,
  latestWeightKg: null,
};

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [summary, setSummary] = useState(initialSummary);

  useFocusEffect(
    useCallback(() => {
      getSummary(db).then(setSummary);
    }, [db])
  );

  return (
    <Screen title="Dashboard" subtitle="Recovered training and nutrition overview.">
      <View style={styles.grid}>
        <Metric label="Calories today" value={String(summary.todayCalories)} />
        <Metric label="Sessions this week" value={String(summary.weeklySessions)} />
        <Metric label="Avg sleep" value={`${summary.avgSleepHours}h`} />
        <Metric
          label="Latest weight"
          value={summary.latestWeightKg ? `${summary.latestWeightKg} kg` : "No data"}
        />
      </View>
      <Card>
        <Text style={styles.sectionTitle}>Recovery notes</Text>
        <Text style={styles.copy}>
          The original build exposed sessions, nutrition, bodyweight, sleep, steps, and
          templates. This rebuild keeps those domains intact with a clean local-first model.
        </Text>
      </Card>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
  metricValue: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "800",
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700",
  },
  copy: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
  },
});
