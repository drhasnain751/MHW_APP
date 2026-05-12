import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MoodTrackerScreen from '../screens/MoodTrackerScreen';
import MoodHistoryScreen from '../screens/MoodHistoryScreen';
import JournalScreen from '../screens/JournalScreen';
import WellnessScreen from '../screens/WellnessScreen';
import BreathingScreen from '../screens/BreathingScreen';
import CrisisSupportScreen from '../screens/CrisisSupportScreen';
import TherapyListScreen from '../screens/TherapyListScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SleepScreen from '../screens/SleepScreen';
import MedsScreen from '../screens/MedsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true, title: 'My Profile' }} />
            <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} options={{ headerShown: true, title: 'Log Mood' }} />
            <Stack.Screen name="MoodHistory" component={MoodHistoryScreen} options={{ headerShown: true, title: 'Mood Trends' }} />
            <Stack.Screen name="Journal" component={JournalScreen} options={{ headerShown: true, title: 'My Journal' }} />
            <Stack.Screen name="Wellness" component={WellnessScreen} options={{ headerShown: true, title: 'Guided Wellness' }} />
            <Stack.Screen name="Sleep" component={SleepScreen} options={{ headerShown: true, title: 'Sleep & Relaxation' }} />
            <Stack.Screen name="Meds" component={MedsScreen} options={{ headerShown: true, title: 'Medication Tracker' }} />
            <Stack.Screen name="Breathing" component={BreathingScreen} options={{ headerShown: true, title: 'Breathing Exercise' }} />
            <Stack.Screen name="CrisisSupport" component={CrisisSupportScreen} options={{ headerShown: true, title: 'Crisis Support', headerStyle: { backgroundColor: '#fef2f2' }, headerTintColor: '#dc2626' }} />
            <Stack.Screen name="Therapy" component={TherapyListScreen} options={{ headerShown: true, title: 'Therapists' }} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
