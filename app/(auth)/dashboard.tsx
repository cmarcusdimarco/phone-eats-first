import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useEffect, useState } from "react";
import { fetchMealsForDate, calculateTotalCalories, markCacheStale } from "~/services/mealsService";
import { format } from "date-fns";
import { MaterialIcons } from "@expo/vector-icons";

interface Meal {
  meal_id: string;
  meal_name: string;
  estimate_name?: string;
  description: string;
  meal_created_at: string;
  calories: number;
  serving_size: string;
  servings_present: number;
}

export default function DashboardScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      console.log('[Dashboard] Loading data...');
      setIsLoading(true);
      setError(null);
      
      const [mealsData, calories] = await Promise.all([
        fetchMealsForDate(),
        calculateTotalCalories()
      ]);
      
      console.log(`[Dashboard] Loaded ${mealsData.length} meals with ${calories} total calories`);
      setMeals(mealsData);
      setTotalCalories(calories);
    } catch (err) {
      console.error('[Dashboard] Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      console.log('[Dashboard] Clearing cache...');
      await markCacheStale();
      console.log('[Dashboard] Cache cleared, reloading data...');
      await loadData();
    } catch (err) {
      console.error('[Dashboard] Error clearing cache:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear cache');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-lg">Loading your meals...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg text-error mb-4">{error}</Text>
        <Button onPress={loadData}>
          <Text>Try Again</Text>
        </Button>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4">
      <View className="flex-row justify-end mb-4">
        <TouchableOpacity 
          onPress={handleClearCache}
          className="bg-muted p-2 rounded-lg"
        >
          <Text className="text-muted-foreground">Clear Cache</Text>
        </TouchableOpacity>
      </View>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Today's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold">{totalCalories}</Text>
            <Text className="text-lg">calories</Text>
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Meals</CardTitle>
        </CardHeader>
        <CardContent>
          {meals.length === 0 ? (
            <View className="items-center py-4">
              <Text className="text-lg text-muted-foreground">No meals logged today</Text>
              <Link href="/add-meal" asChild>
                <Button className="mt-4">
                  <Text>Add Your First Meal</Text>
                </Button>
              </Link>
            </View>
          ) : (
            <View className="space-y-4">
              {meals.map((meal) => {
                let formattedTime = 'Unknown time';
                try {
                  if (meal.meal_created_at) {
                    formattedTime = format(new Date(meal.meal_created_at), 'h:mm a');
                  }
                } catch (error) {
                  console.error(`[Dashboard] Error formatting time for meal ${meal.meal_id}:`, error);
                }

                return (
                  <View key={meal.meal_id} className="flex-row items-center justify-between p-4 bg-card rounded-lg border border-border">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold">{meal.meal_name ?? meal.estimate_name ?? 'Unnamed Meal'}</Text>
                      <Text className="text-muted-foreground">{meal.calories || 0} calories</Text>
                      <Text className="text-sm text-muted-foreground">
                        {formattedTime}
                      </Text>
                      {meal.description && (
                        <Text className="text-sm text-muted-foreground mt-1">
                          {meal.description}
                        </Text>
                      )}
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#666" />
                  </View>
                );
              })}
              <Link href="/add-meal" asChild>
                <Button className="mt-4">
                  <Text>Add Another Meal</Text>
                </Button>
              </Link>
            </View>
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
