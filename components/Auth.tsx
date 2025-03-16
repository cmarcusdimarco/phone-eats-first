import React, { useState } from "react";
import { Alert, View, Text } from "react-native";
import { supabase } from "~/lib/supabase";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View className="mt-10 p-3">
      <Text className="text-h2 text-secondary mb-6 text-center">
        Welcome Back
      </Text>

      <View className="flex gap-4">
        <View>
          <Text className="text-small text-foreground mb-1">Email</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="email@address.com"
            autoCapitalize="none"
            className="bg-background-alt"
          />
        </View>

        <View>
          <Text className="text-small text-foreground mb-1">Password</Text>
          <Input
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            className="bg-background-alt"
          />
        </View>

        <View className="flex gap-4 mt-5">
          <Button
            disabled={loading}
            onPress={signInWithEmail}
            className="bg-primary"
          >
            <Text className="text-body text-primary-foreground font-semibold">
              Sign in
            </Text>
          </Button>

          <Button
            disabled={loading}
            onPress={signUpWithEmail}
            variant="outline"
            className="border-secondary"
          >
            <Text className="text-body text-secondary font-semibold">
              Sign up
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
