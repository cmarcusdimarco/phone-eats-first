import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useEffect, useState } from "react";
import { fetchMealsForDate, calculateTotalCalories, markCacheStale } from "~/services/mealsService";
import { useDashboard } from "~/app/context/DashboardContext";
import { MealCard } from "~/components/MealCard";

interface Meal {
  meal_id: string;
  meal_name: string;
  estimate_name?: string;
  description: string;
  meal_created_at: string;
  calories: number;
  serving_size: string;
  servings_present: number;
  uri: string;
}

export default function DashboardScreen() {
  const { isStale, markAsFresh } = useDashboard();
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
      markAsFresh();
    } catch (err) {
      console.error('[Dashboard] Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isStale) {
      console.log('[Dashboard] Cache is stale, refreshing data...');
      loadData();
    }
  }, [isStale]);

  useEffect(() => {
    loadData();
  }, []);

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
            <View className="space-y-4 gap-2">
              {meals.map((meal) => (
                <MealCard key={meal.meal_id} meal={meal} />
              ))}
            </View>
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
