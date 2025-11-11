import { Tabs, Redirect } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { View, ActivityIndicator, Text } from "react-native";
import { Home, Plus, User } from "lucide-react-native";

export default function TabsLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#a78bfa" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
        },
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTitleStyle: {
          fontSize: 18,
          color: "#a78bfa",
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Framez",
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          headerTitleStyle: {
            fontFamily: "Blacksword",
            fontSize: 24,
            color: "#a78bfa",
          },
        }}
      />

      {/* Create Post Tab */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Create Post",

          tabBarIcon: ({ color }) => <Plus color={color} size={24} />,
          headerTitleStyle: {
            fontFamily: "Sora_300SemiBold",
            fontSize: 24,
            color: "#a78bfa",
          },
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ color }) => <User color={color} size={24} />,
          headerTitleStyle: {
            fontFamily: "Sora_300SemiBold",
            fontSize: 24,
            color: "#a78bfa",
          },
        }}
      />
    </Tabs>
  );
}
