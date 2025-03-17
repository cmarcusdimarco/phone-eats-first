import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Camera({ onCapture }: { onCapture: () => void }) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center pb-2.5">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </Button>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View className="flex-1 justify-center">
      <CameraView className="flex-1" facing={facing}>
        <View className="flex-1 flex-row bg-transparent mx-16">
          <TouchableOpacity 
            className="flex-1 self-end items-center" 
            onPress={toggleCameraFacing}
          >
            <Text className="text-2xl font-bold text-white">
              Flip Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 self-end items-center" 
            onPress={onCapture}
          >
            <Text className="text-2xl font-bold text-white">
              Take Photo
            </Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
