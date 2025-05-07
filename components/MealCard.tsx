import { View, Text, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { getImageUrl } from "~/services/storage";
import { useEffect, useState } from "react";
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

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      const url = await getImageUrl(meal.meal_id);
      setImageUrl(url);
    };
    fetchImageUrl();
  }, [meal.uri]);


  let formattedTime = 'Unknown time';
  try {
    if (meal.meal_created_at) {
      formattedTime = format(new Date(meal.meal_created_at), 'h:mm a');
    }
  } catch (error) {
    console.error(`[MealCard] Error formatting time for meal ${meal.meal_id}:`, error);
  }

  return (
    <View className="flex-row items-center justify-between p-4 bg-card rounded-lg border border-border">
      <Image 
        source={{ uri: imageUrl ?? undefined }}
        className="w-16 h-16 rounded-lg mr-4"
        resizeMode="cover"
      />
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
} 