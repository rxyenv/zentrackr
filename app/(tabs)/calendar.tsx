import { StyleSheet, Text } from "react-native";

import { Card, Screen } from "../../components/screen";
import { colors } from "../../lib/theme";

export default function CalendarScreen() {
  return (
    <Screen
      title="Calendar"
      subtitle="The bundle exposed a calendar route and date-based queries for sessions, steps, sleep, and nutrition."
    >
      <Card>
        <Text style={styles.body}>
          This screen is the right place to rebuild daily history, streaks, and activity
          rollups once the original Supabase sync contract is restored.
        </Text>
      </Card>
      <Card>
        <Text style={styles.body}>
          Suggested next step: add a date picker and consolidate entries from sessions,
          nutrition, sleep, bodyweight, and steps into one daily timeline.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 24,
  },
});
