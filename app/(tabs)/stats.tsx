import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card, Screen } from "../../components/screen";
import { useAuth } from "../../lib/auth";
import { ensureUserSeed, getSummary, guestUserId } from "../../lib/db";
import { colors } from "../../lib/theme";

export default function StatsScreen() {
  const db = useSQLiteContext();
  const { userId } = useAuth();
  const activeUserId = userId ?? guestUserId;
  const [tab, setTab] = useState<"activity" | "progress" | "calendar">("activity");
  const [steps, setSteps] = useState(0);

  useFocusEffect(
    useCallback(() => {
      void Promise.all([
        ensureUserSeed(db, activeUserId),
        getSummary(db, activeUserId).then((summary) => setSteps(summary.todaySteps)),
      ]);
    }, [activeUserId, db])
  );

  return (
    <Screen title="" subtitle="">
      <View style={styles.segment}>
        <Segment active={tab === "activity"} icon="footsteps-outline" label="Activity" onPress={() => setTab("activity")} />
        <Segment active={tab === "progress"} icon="trending-up-outline" label="Progress" onPress={() => setTab("progress")} />
        <Segment active={tab === "calendar"} icon="calendar-outline" label="Calendar" onPress={() => setTab("calendar")} />
      </View>

      {tab === "activity" ? (
        <>
          <Card>
            <View style={styles.ringWrap}>
              <View style={styles.ringOuter}>
                <View style={styles.ringInner}>
                  <Ionicons color={colors.primary} name="footsteps-outline" size={28} />
                  <Text style={styles.ringValue}>{steps}</Text>
                  <Text style={styles.ringTarget}>/ 10,000</Text>
                </View>
              </View>
            </View>
            <View style={styles.activityStats}>
              <View>
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>0.0 km</Text>
              </View>
              <View style={styles.separator} />
              <View>
                <Text style={styles.statLabel}>Calories</Text>
                <Text style={styles.statValue}>0</Text>
              </View>
            </View>
            <Pressable style={styles.primaryButton}>
              <Ionicons color="#1D1E24" name="play-circle-outline" size={28} />
              <Text style={styles.primaryText}>Start Tracking</Text>
            </Pressable>
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Last 7 Days</Text>
            <View style={styles.sparklineStub} />
            <View style={styles.daysRow}>
              {["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"].map((day, index) => (
                <View key={day} style={styles.dayItem}>
                  <View style={[styles.dayBar, index === 6 && styles.dayBarActive]} />
                  <Text style={[styles.dayLabel, index === 6 && styles.dayLabelActive]}>{day}</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card>
            <View style={styles.rowBetween}>
              <View style={styles.titleWithIcon}>
                <Ionicons color={colors.primary} name="moon-outline" size={24} />
                <Text style={styles.cardTitle}>Sleep</Text>
              </View>
              <Pressable style={styles.smallPrimary}>
                <Text style={styles.smallPrimaryText}>Log Sleep</Text>
              </Pressable>
            </View>
            <View style={styles.emptyBlock}>
              <Ionicons color={colors.muted} name="bed-outline" size={42} />
              <Text style={styles.emptyCopy}>No sleep logged today</Text>
            </View>
          </Card>

          <Card>
            <View style={styles.rowBetween}>
              <View style={styles.titleWithIcon}>
                <Ionicons color={colors.primary} name="accessibility-outline" size={24} />
                <Text style={styles.cardTitle}>BMI Calculator</Text>
              </View>
              <Ionicons color={colors.ink} name="chevron-down-outline" size={24} />
            </View>
          </Card>
        </>
      ) : null}

      {tab === "progress" ? (
        <View style={styles.emptyProgress}>
          <Ionicons color={colors.ink} name="trending-up-outline" size={60} />
          <Text style={styles.progressTitle}>No Data Yet</Text>
          <Text style={styles.progressBody}>Log some workouts to see your progress charts</Text>
        </View>
      ) : null}

      {tab === "calendar" ? (
        <>
          <View style={styles.calendarHeader}>
            <Ionicons color={colors.primary} name="chevron-back-outline" size={26} />
            <Text style={styles.calendarMonth}>June 2026</Text>
            <Ionicons color={colors.primary} name="chevron-forward-outline" size={26} />
          </View>
          <Card>
            <Text style={styles.calendarStub}>Su   Mo   Tu   We   Th   Fr   Sa{"\n\n"}1    2    3    4    5    6{"\n\n"}7    8    9   10   11   12   13{"\n\n"}14   15   16   17   18   19   20{"\n\n"}21   22  (23)  24   25   26   27{"\n\n"}28   29   30</Text>
          </Card>
          <Text style={styles.cardTitle}>Recent Workouts</Text>
          <Card>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.cardTitle}>Tue, Jun 23</Text>
                <Text style={styles.cardBody}>Push • 0 exercises</Text>
              </View>
              <View style={styles.rowButtons}>
                <View style={styles.iconButton}>
                  <Ionicons color={colors.primary} name="chevron-down-outline" size={22} />
                </View>
                <View style={[styles.iconButton, styles.deleteButton]}>
                  <Ionicons color={colors.warning} name="close-circle-outline" size={22} />
                </View>
              </View>
            </View>
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

function Segment({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.segmentItem, active && styles.segmentItemActive]}>
      <Ionicons color={active ? "#1D1E24" : colors.ink} name={icon} size={24} />
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
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
  segmentItem: {
    alignItems: "center",
    borderRadius: 20,
    flex: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    paddingVertical: 18,
  },
  segmentItemActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    color: colors.ink,
    fontSize: 18,
  },
  segmentTextActive: {
    color: "#1D1E24",
    fontWeight: "700",
  },
  ringWrap: {
    alignItems: "center",
  },
  ringOuter: {
    alignItems: "center",
    borderColor: colors.primary,
    borderRadius: 140,
    borderWidth: 18,
    height: 280,
    justifyContent: "center",
    width: 280,
  },
  ringInner: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 120,
    height: 220,
    justifyContent: "center",
    width: 220,
  },
  ringValue: {
    color: colors.ink,
    fontSize: 54,
    fontWeight: "700",
  },
  ringTarget: {
    color: colors.muted,
    fontSize: 18,
  },
  activityStats: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  statLabel: {
    color: colors.muted,
    fontSize: 18,
    textAlign: "center",
  },
  statValue: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  separator: {
    backgroundColor: colors.divider,
    height: 90,
    marginHorizontal: 34,
    width: 2,
  },
  primaryButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.primary,
    borderRadius: 28,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    minHeight: 74,
    paddingHorizontal: 30,
  },
  primaryText: {
    color: "#1D1E24",
    fontSize: 22,
    fontWeight: "700",
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "500",
  },
  sparklineStub: {
    flex: 1,
    minHeight: 170,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayItem: {
    alignItems: "center",
    gap: 10,
  },
  dayBar: {
    backgroundColor: colors.divider,
    borderRadius: 999,
    height: 8,
    width: 78,
  },
  dayBarActive: {
    backgroundColor: colors.primary,
  },
  dayLabel: {
    color: colors.muted,
    fontSize: 16,
  },
  dayLabelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  rowBetween: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleWithIcon: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  smallPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  smallPrimaryText: {
    color: "#1D1E24",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyBlock: {
    alignItems: "center",
    gap: 16,
    paddingVertical: 34,
  },
  emptyCopy: {
    color: colors.muted,
    fontSize: 16,
  },
  emptyProgress: {
    alignItems: "center",
    flex: 1,
    gap: 24,
    justifyContent: "center",
    minHeight: 700,
  },
  progressTitle: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: "500",
  },
  progressBody: {
    color: colors.muted,
    fontSize: 17,
  },
  calendarHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calendarMonth: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "400",
  },
  calendarStub: {
    color: colors.ink,
    fontSize: 24,
    lineHeight: 52,
    textAlign: "center",
  },
  rowButtons: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: colors.cardSoft,
    borderRadius: 18,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  deleteButton: {
    backgroundColor: "#3A2A2D",
  },
  cardBody: {
    color: colors.muted,
    fontSize: 18,
  },
});
