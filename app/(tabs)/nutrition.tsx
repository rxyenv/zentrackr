import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card, Field, Screen } from "../../components/screen";
import { useAuth } from "../../lib/auth";
import { addNutritionEntry, ensureUserSeed, getNutrition, guestUserId, NutritionEntry, today } from "../../lib/db";
import { colors } from "../../lib/theme";

export default function NutritionScreen() {
  const db = useSQLiteContext();
  const { userId } = useAuth();
  const activeUserId = userId ?? guestUserId;
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [notes, setNotes] = useState("");

  const refresh = useCallback(() => {
    return Promise.all([
      ensureUserSeed(db, activeUserId),
      getNutrition(db, activeUserId).then(setEntries),
    ]);
  }, [activeUserId, db]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  return (
    <Screen title="Nutrition" subtitle="Track meals with calories and macros.">
      <Card>
        <Field onChangeText={setMealName} placeholder="Meal name" value={mealName} />
        <Field keyboardType="numeric" onChangeText={setCalories} placeholder="Calories" value={calories} />
        <Field keyboardType="numeric" onChangeText={setProtein} placeholder="Protein (g)" value={protein} />
        <Field keyboardType="numeric" onChangeText={setCarbs} placeholder="Carbs (g)" value={carbs} />
        <Field keyboardType="numeric" onChangeText={setFats} placeholder="Fats (g)" value={fats} />
        <Field onChangeText={setNotes} placeholder="Notes" value={notes} />
        <Pressable
          onPress={async () => {
            await addNutritionEntry(db, activeUserId, {
              date: today(),
              meal_name: mealName.trim() || "Meal",
              calories: Number(calories || 0),
              protein_g: Number(protein || 0),
              carbs_g: Number(carbs || 0),
              fats_g: Number(fats || 0),
              notes,
            });
            setMealName("");
            setCalories("");
            setProtein("");
            setCarbs("");
            setFats("");
            setNotes("");
            refresh();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Save meal</Text>
        </Pressable>
      </Card>
      {entries.map((entry) => (
        <Card key={entry.id}>
          <View style={styles.row}>
            <Text style={styles.title}>{entry.meal_name}</Text>
            <Text style={styles.calories}>{Math.round(entry.calories)} kcal</Text>
          </View>
          <Text style={styles.meta}>
            P {entry.protein_g}g • C {entry.carbs_g}g • F {entry.fats_g}g
          </Text>
          {entry.notes ? <Text style={styles.meta}>{entry.notes}</Text> : null}
          <Text style={styles.meta}>{entry.date}</Text>
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
