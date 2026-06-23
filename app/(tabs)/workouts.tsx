import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { Card, Screen } from "../../components/screen";
import { addQuickSession, getSessions, WorkoutSession } from "../../lib/db";
import { colors } from "../../lib/theme";

export default function WorkoutsScreen() {
  const db = useSQLiteContext();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  const refresh = useCallback(() => {
    getSessions(db).then(setSessions);
  }, [db]);

  useFocusEffect(refresh);

  return (
    <Screen title="Workouts" subtitle="Sessions, exercises, sets, and split tracking were present in the release build.">
      <Pressable
        onPress={async () => {
          await addQuickSession(db, "Upper / Lower");
          refresh();
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add quick session</Text>
      </Pressable>
      {sessions.map((session) => (
        <Card key={session.id}>
          <Text style={styles.title}>{session.split_name}</Text>
          <Text style={styles.meta}>{session.date}</Text>
          <Text style={styles.meta}>Sync state: {session.sync_status}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  title: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700",
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
  },
});
