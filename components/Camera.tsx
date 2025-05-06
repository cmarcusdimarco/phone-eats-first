import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button } from '~/components/ui/button';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialIcons, Feather } from "@expo/vector-icons";

export default function Camera({ onCapture }: { onCapture: (uri: string | null) => void }) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [uri, setUri] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);

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

  async function handleCapture() {
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo?.uri) {
      setUri(photo.uri);
      onCapture(photo.uri);
    } else {
      setUri(null);
      onCapture(null);
    }
  }

    return (
      <View className="flex-1 justify-center mx-4 rounded-lg">
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <View style={styles.iconBackground}>
                <MaterialIcons name="flip-camera-ios" size={32} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCapture}>
              <View style={styles.iconBackground}>
                <Feather name="camera" size={32} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
      gap: 32
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
      padding: 10,
    },
    iconBackground: {
      backgroundColor: 'rgba(60, 60, 60, 0.5)',
      borderRadius: 35,
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });