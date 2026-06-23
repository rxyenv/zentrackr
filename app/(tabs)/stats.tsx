import { StyleSheet, Text } from "react-native";

import { Card, Screen } from "../../components/screen";
import { colors } from "../../lib/theme";

export default function StatsScreen() {
  return (
    <Screen
      title="Stats"
      subtitle="The shipped app included bodyweight, sleep, and steps tables alongside workouts and nutrition."
    >
      <Card>
        <Text style={styles.title}>Rebuilt metrics surface</Text>
        <Text style={styles.body}>
          This tab is ready for trend charts around weight, weekly session count, calorie
          adherence, sleep consistency, and step volume.
        </Text>
      </Card>
      <Card>
        <Text style={styles.title}>Recovered clues</Text>
        <Text style={styles.body}>
          The bundle referenced upper/lower and push-pull-legs splits, calorie goals, and
          multiple health metrics. Those are the safest product assumptions to keep.
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
