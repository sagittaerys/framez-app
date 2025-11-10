import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';
import { Home, Plus, User, Heart, Search } from 'lucide-react-native';

export default function TabsLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // If not authenticated, redirect to auth
  if (!user) {
    return <Redirect href="/login" />; 
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}> <Home />  </Text>,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create Post',
          tabBarLabel: 'Create',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}> <Plus />  </Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}> <User /> </Text>,
        }}
      />
    </Tabs>
  );
}