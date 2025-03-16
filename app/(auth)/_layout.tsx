import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { supabase } from "~/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Button } from "~/components/ui/button";

export default function AuthLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Show loading indicator while checking auth status
  if (loading) return null;

  // Redirect to login if not authenticated
  if (!session) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1">
      <Stack>
        <Stack.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="add-meal"
          options={{
            title: "Add New Meal",
          }}
        />
      </Stack>
      <Button className="mx-4" onPress={() => supabase.auth.signOut()}>
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}
