import { View, Text, TextInput } from "react-native";
import { useState } from "react";
import Camera from "~/components/Camera";
import { Button } from "~/components/ui/button";
export default function AddMealScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [mealDescription, setMealDescription] = useState("");

  if (showCamera) {
    return (
      <View className="flex-1">
        <Camera onCapture={() => setShowCamera(false)} />
      </View>
    );
  }

  return (
    <View className="p-4 flex-1">
      <Text className="text-xl font-bold mb-4">Add a new meal</Text>
      
      <Button
        onPress={() => setShowCamera(true)} 
      >
        <Text>Take Photo of Meal</Text>
      </Button>

      <TextInput
        className="border p-2 mt-4 rounded"
        placeholder="Describe your meal..."
        value={mealDescription}
        onChangeText={setMealDescription}
        multiline
      />
    </View>
  );
}
