import { View, Text } from "react-native";
import { Link } from "expo-router";
import { Button } from "~/components/ui/button";

export default function DashboardScreen() {
  return (
    <View className="p-4">
      <Text>Welcome to your Dashboard!</Text>

      <Link href="/add-meal" asChild>
        <Button className="mt-4">
          <Text>Add New Meal</Text>
        </Button>
      </Link>
    </View>
  );
}
