import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { MaterialIcons, Feather } from "@expo/vector-icons";

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
    <Tabs
      screenOptions={{
        headerRight: () => (
          <MaterialIcons
            name="logout"
            size={24}
            color="black"
            style={{ marginRight: 16 }}
            onPress={() => supabase.auth.signOut()}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tabs.Screen
        name="add-meal"
        options={{
          title: "Add Meal",
          tabBarLabel: "Add Meal",
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-circle" color={color} size={size} />
          ),
          tabBarHideOnKeyboard: true,
        }}
      />
    </Tabs>
  );
}
