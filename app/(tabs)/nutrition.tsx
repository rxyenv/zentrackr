import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card, Screen } from "../../components/screen";
import { addNutritionEntry, getNutrition, NutritionEntry } from "../../lib/db";
import { colors } from "../../lib/theme";

export default function NutritionScreen() {
  const db = useSQLiteContext();
  const [entries, setEntries] = useState<NutritionEntry[]>([]);

  const refresh = useCallback(() => {
    getNutrition(db).then(setEntries);
  }, [db]);

  useFocusEffect(refresh);

  return (
    <Screen
      title="Nutrition"
      subtitle='Recovered route match for "/(tabs)/nutrition.tsx" and nutrition table schema.'
    >
      <Pressable
        onPress={async () => {
          await addNutritionEntry(db, {
            meal_name: "Recovery shake",
            calories: 320,
            protein_g: 32,
            carbs_g: 26,
            fats_g: 8,
          });
          refresh();
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add sample meal</Text>
      </Pressable>
      {entries.map((entry) => (
        <Card key={entry.id}>
          <View style={styles.row}>
            <Text style={styles.title}>{entry.meal_name}</Text>
            <Text style={styles.calories}>{Math.round(entry.calories)} kcal</Text>
          </View>
          <Text style={styles.meta}>
            P {entry.protein_g}g • C {entry.carbs_g}g • F {entry.fats_g}g
          </Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  title: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
  },
  calories: {
    color: colors.primary,
    fontWeight: "800",
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
  },
});
