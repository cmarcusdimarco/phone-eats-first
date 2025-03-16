import "react-native-url-polyfill/auto";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "~/lib/supabase";
import Auth from "~/components/Auth";
import { View, Text } from "react-native";
import { Session } from "@supabase/supabase-js";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";

// Keep the splash screen visible while we fetch the resources
SplashScreen.preventAutoHideAsync();

// Set the animation options for the splash screen
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        router.replace("/dashboard");
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Remove this if you copy and paste the code!
        // await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView}>
      <Auth />
      {session && session.user && <Text>{session.user.id}</Text>}
    </View>
  );
}
