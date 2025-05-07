import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Image, ActivityIndicator, TouchableOpacity, Animated, Dimensions, Keyboard } from "react-native";
import Camera from "~/components/Camera";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { handleMealSubmission } from "~/services/mealsService";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDashboard } from "~/app/context/DashboardContext";

export default function AddMealScreen() {
  const { markAsStale } = useDashboard();
  const [showCamera, setShowCamera] = useState(true);
  const [mealName, setMealName] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [mealResponse, setMealResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const caloriesOpacity = useRef(new Animated.Value(0)).current;
  const servingSizeOpacity = useRef(new Animated.Value(0)).current;
  const servingsOpacity = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');
  const dialogWidth = width * 0.9;
  const dialogHeight = height * 0.7;

  useEffect(() => {
    if (showProperties) {
      Animated.sequence([
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(caloriesOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(servingSizeOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(servingsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations when dialog closes
      nameOpacity.setValue(0);
      caloriesOpacity.setValue(0);
      servingSizeOpacity.setValue(0);
      servingsOpacity.setValue(0);
    }
  }, [showProperties]);

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
      {photoUri && (
        <View className="relative flex-1">
          <Image 
            source={{ uri: photoUri }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
          <TouchableOpacity 
            className="absolute bottom-4 right-4 bg-black/50 rounded-full w-14 h-14 items-center justify-center"
            onPress={() => setShowCamera(true)}
          >
            <MaterialIcons name="refresh" size={32} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {photoUri && (
        <>
          <TextInput
            className="border p-2 my-4 rounded"
            placeholder="What did you eat?"
            value={mealName}
            onChangeText={setMealName}
          />

          <TextInput
            className="border p-2 my-4 rounded"
            placeholder="Describe the ingredients, portion size, etc."
            value={mealDescription}
            onChangeText={setMealDescription}
            multiline
          />

          <Button 
            onPress={async () => {
              Keyboard.dismiss();
              setShowDialog(true);
              setIsLoading(true);
              const response = await handleMealSubmission(photoUri, mealName, mealDescription);
              setMealResponse(response);
              setIsLoading(false);
              setShowProperties(true);
              // Mark dashboard as stale when we get the response
              markAsStale();
            }}
          >
            <Text>Do the AI thing</Text>
          </Button>

          <Dialog open={showDialog} onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) {
              setShowProperties(false);
            }
          }}>
            <DialogContent style={{ width: dialogWidth, height: dialogHeight }}>
              <DialogHeader className="items-center">
                <DialogTitle>Meal Analysis</DialogTitle>
              </DialogHeader>
              <DialogDescription className="flex-1 justify-between">
                {isLoading ? (
                  <View className="items-center py-4">
                    <ActivityIndicator size="large" />
                    <Text className="mt-2">Processing your meal...</Text>
                  </View>
                ) : mealResponse ? (
                  <View className="flex-1 justify-between">
                    <View className="items-center space-y-6">
                      <Text className="text-xl font-semibold text-center">Meal logged!</Text>
                      <View className="space-y-4">
                        <Animated.View style={{ opacity: nameOpacity }}>
                          <Text className="text-lg">Name: {mealResponse.meal.name ?? mealResponse.estimate.name}</Text>
                        </Animated.View>
                        <Animated.View style={{ opacity: caloriesOpacity }}>
                          <Text className="text-lg">Calories: {mealResponse.estimate.calories}</Text>
                        </Animated.View>
                        <Animated.View style={{ opacity: servingSizeOpacity }}>
                          <Text className="text-lg">Serving Size: {mealResponse.estimate["serving_size"]}</Text>
                        </Animated.View>
                        <Animated.View style={{ opacity: servingsOpacity }}>
                          <Text className="text-lg">Servings: {mealResponse.estimate["servings_present"]}</Text>
                        </Animated.View>
                      </View>
                    </View>
                    <Button 
                      className="self-center mb-4"
                      onPress={() => {
                        // Clear all state
                        setMealName("");
                        setMealDescription("");
                        setPhotoUri(null);
                        setMealResponse(null);
                        setShowProperties(false);
                        setShowDialog(false);
                        setShowCamera(true);
                        // Navigate to dashboard
                        router.replace("/dashboard");
                      }}
                    >
                      <Text>Nice!</Text>
                    </Button>
                  </View>
                ) : null}
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </>
      )}
    </View>
  );
}
