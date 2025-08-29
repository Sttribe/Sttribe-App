import { Redirect, Tabs } from 'expo-router';
import { Home, Users, Search, CreditCard, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { storeApiKey } from '../openaiService';
import { getAuth, getIdToken, onAuthStateChanged } from 'firebase/auth';

export default function TabLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_KEY

  useEffect(() => {
    // ✅ Store API key once when this layout is mounted
    storeApiKey(OPENAI_KEY)
      .then(() => console.log("API key stored successfully"))
      .catch(err => console.error("Error storing API key", err));

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const idToken = await getIdToken(currentUser, true); // fetch Firebase token
          setToken(idToken);
          console.log("Firebase Token:", idToken); // 👀 here’s your token
        } catch (err) {
          console.error("Error getting Firebase token", err);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null; // or show splash

  // ✅ If no token/user, redirect to auth page
  if (!token) {
    return <Redirect href="/auth" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recharge"
        options={{
          title: 'Recharge',
          tabBarIcon: ({ size, color }) => (
            <CreditCard size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}