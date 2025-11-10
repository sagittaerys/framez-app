import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // If user is authenticated, redirect to tabs
  if (user) {
    return <Redirect href="/" />; // Changed from "/(tabs)"
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}