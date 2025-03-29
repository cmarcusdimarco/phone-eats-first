import { View, Text, TextInput, Image } from "react-native";
import { useState } from "react";
import Camera from "~/components/Camera";
import { Button } from "~/components/ui/button";

export default function AddMealScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [mealDescription, setMealDescription] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  if (showCamera) {
    return (
      <View className="flex-1">
        <Camera onCapture={(uri) => {
          setPhotoUri(uri);
          setShowCamera(false);
        }} />
      </View>
    );
  }

  return (
    <View className="p-4 flex-1">
      <Text className="text-xl font-bold mb-4">Add a new meal</Text>
      
      {photoUri && (
        <Image 
          source={{ uri: photoUri }}
          className="w-full h-1/2 rounded-lg mb-4"
        />
      )}

      <Button
        onPress={() => setShowCamera(true)} 
      >
        <Text>{photoUri ? "Retake Photo" : "Take Photo of Meal"}</Text>
      </Button>

      {photoUri && (
        <>
          <TextInput
            className="border p-2 my-4 rounded"
            placeholder="Describe your meal..."
            value={mealDescription}
            onChangeText={setMealDescription}
            multiline
          />

          <Button><Text>Do the AI thing</Text></Button>
        </>
      )}
    </View>
  );
}
