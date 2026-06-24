import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { Card, Field, Screen } from "../../components/screen";
import { useAuth } from "../../lib/auth";
import { DaySnapshot, ensureUserSeed, getDaySnapshot, guestUserId, today } from "../../lib/db";
import { colors } from "../../lib/theme";

const initialSnapshot: DaySnapshot = {
  sessions: [],
  meals: [],
  bodyweight: null,
  sleep: null,
  steps: null,
};

export default function CalendarScreen() {
  const db = useSQLiteContext();
  const { userId } = useAuth();
  const activeUserId = userId ?? guestUserId;
  const [date, setDate] = useState(today());
  const [snapshot, setSnapshot] = useState(initialSnapshot);

  const refresh = useCallback(() => {
    return Promise.all([
      ensureUserSeed(db, activeUserId),
      getDaySnapshot(db, activeUserId, date).then(setSnapshot),
    ]);
  }, [activeUserId, date, db]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  return (
    <Screen title="Calendar" subtitle="Inspect everything logged for a single day.">
      <Card>
        <Field onChangeText={setDate} placeholder="YYYY-MM-DD" value={date} />
      </Card>
      <Card>
        <Text style={styles.title}>Sessions</Text>
        {snapshot.sessions.length === 0 ? <Text style={styles.body}>No sessions.</Text> : null}
        {snapshot.sessions.map((session) => (
          <Text key={session.id} style={styles.body}>
            {session.split_name}
          </Text>
        ))}
      </Card>
      <Card>
        <Text style={styles.title}>Meals</Text>
        {snapshot.meals.length === 0 ? <Text style={styles.body}>No meals.</Text> : null}
        {snapshot.meals.map((meal) => (
          <Text key={meal.id} style={styles.body}>
            {meal.meal_name} • {Math.round(meal.calories)} kcal
          </Text>
        ))}
      </Card>
      <Card>
        <Text style={styles.title}>Recovery</Text>
        <Text style={styles.body}>
          Weight: {snapshot.bodyweight ? `${snapshot.bodyweight.weight_kg} kg` : "No entry"}
        </Text>
        <Text style={styles.body}>
          Sleep: {snapshot.sleep ? `${snapshot.sleep.hours}h, quality ${snapshot.sleep.quality}/5` : "No entry"}
        </Text>
        <Text style={styles.body}>
          Steps: {snapshot.steps ? snapshot.steps.total_steps : "No entry"}
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700",
  },
  body: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 24,
  },
});
