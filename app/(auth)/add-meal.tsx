import React, { useState } from "react";
import { View, Text, TextInput, Image, ActivityIndicator } from "react-native";
import Camera from "~/components/Camera";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { handleMealSubmission } from "~/services/mealsService";

export default function AddMealScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [mealResponse, setMealResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

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
            placeholder="Name of the meal..."
            value={mealName}
            onChangeText={setMealName}
          />

          <TextInput
            className="border p-2 my-4 rounded"
            placeholder="Describe your meal..."
            value={mealDescription}
            onChangeText={setMealDescription}
            multiline
          />

          <Button 
            onPress={async () => {
              setIsLoading(true);
              const response = await handleMealSubmission(photoUri, mealName, mealDescription);
              setMealResponse(response);
              setIsLoading(false);
              setShowDialog(true);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="white" />
                <Text className="ml-2">Processing...</Text>
              </View>
            ) : (
              <Text>Do the AI thing</Text>
            )}
          </Button>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Analysis Results</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <Text className="text-base">{JSON.stringify(mealResponse, null, 2)}</Text>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </>
      )}
    </View>
  );
}
