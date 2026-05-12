import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [recommendation, setRecommendation] = useState({
    title: 'Welcome Back!',
    text: 'Log your mood today to receive personalized wellness recommendations.',
    action: 'Log Mood',
    screen: 'MoodTracker'
  });

  useEffect(() => {
    fetchLatestMood();
  }, []);

  const fetchLatestMood = async () => {
    try {
      const res = await api.get('/moods');
      if (res.data && res.data.length > 0) {
        const latest = res.data[0];
        if (latest.intensity >= 8 && ['Anxious', 'Angry', 'Sad'].includes(latest.mood)) {
          setRecommendation({
            title: 'Feeling Overwhelmed?',
            text: 'It looks like your stress levels are high. Try our Box Breathing exercise or contact a therapist.',
            action: 'Start Breathing',
            screen: 'Breathing'
          });
        } else if (latest.mood === 'Tired') {
          setRecommendation({
            title: 'Need some rest?',
            text: 'You seem tired. Consider listening to our calming sleep sounds tonight.',
            action: 'Listen to Sounds',
            screen: 'Sleep'
          });
        } else if (latest.intensity >= 7 && latest.mood === 'Happy') {
          setRecommendation({
            title: 'Looking Good!',
            text: 'You are having a great day! Keep up the positive momentum with a journal entry.',
            action: 'Open Journal',
            screen: 'Journal'
          });
        }
      }
    } catch (e) {
      console.log('Error fetching latest mood', e);
    }
  };

  const handleSOS = () => {
    Alert.alert(
      "EMERGENCY SOS",
      "This will notify your emergency contacts and share your location. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "SEND SOS", style: "destructive", onPress: () => {
          const message = "I am in an emergency and need help. My current location is: https://maps.google.com/?q=current+location";
          Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
        }}
      ]
    );
  };

  const getAffirmation = () => {
    const affirmations = [
      "I am capable of handling whatever this day brings.",
      "My mental health is a priority, and I am doing my best.",
      "I choose to focus on what I can control and let go of the rest.",
      "I am worthy of peace, love, and happiness.",
      "Every small step I take is a victory for my well-being.",
      "I am resilient, strong, and brave.",
      "I deserve to take a break and rest when I need to."
    ];
    const day = new Date().getDay();
    return affirmations[day];
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Afternoon,</Text>
            <Text style={styles.welcome}>{user?.name || 'Friend'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileCircle}>
            <Text style={{ fontSize: 18 }}>👤</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
          <Text style={styles.sosText}>🆘 SOS PANIC BUTTON</Text>
        </TouchableOpacity>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteTitle}>Daily Affirmation ✨</Text>
          <Text style={styles.quoteText}>"{getAffirmation()}"</Text>
        </View>
        
        <View style={styles.recoCard}>
          <Text style={styles.recoTitle}>{recommendation.title}</Text>
          <Text style={styles.recoText}>{recommendation.text}</Text>
          <TouchableOpacity style={styles.recoBtn} onPress={() => navigation.navigate(recommendation.screen)}>
            <Text style={styles.recoBtnText}>{recommendation.action} →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          <MenuCard icon="📊" title="Mood Log" onPress={() => navigation.navigate('MoodTracker')} />
          <MenuCard icon="📈" title="Analytics" onPress={() => navigation.navigate('MoodHistory')} />
          <MenuCard icon="📓" title="Journal" onPress={() => navigation.navigate('Journal')} />
          <MenuCard icon="🌙" title="Relaxation" onPress={() => navigation.navigate('Sleep')} />
          <MenuCard icon="💊" title="Medications" onPress={() => navigation.navigate('Meds')} />
          <MenuCard icon="🧘" title="Wellness" onPress={() => navigation.navigate('Wellness')} />
          <MenuCard icon="👩‍⚕️" title="Therapists" onPress={() => navigation.navigate('Therapy')} />
          <MenuCard icon="🆘" title="Support" onPress={() => navigation.navigate('CrisisSupport')} />
        </View>

        <View style={styles.checklistCard}>
          <Text style={styles.checklistTitle}>✅ Daily Self-Care</Text>
          <CheckItem text="Drink 8 glasses of water" />
          <CheckItem text="5-minute meditation" />
          <CheckItem text="Write one thing you're grateful for" />
          <CheckItem text="Go for a short walk" />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const MenuCard = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.cardIcon}>{icon}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

const CheckItem = ({ text }) => {
  const [done, setDone] = useState(false);
  return (
    <TouchableOpacity style={styles.checkRow} onPress={() => setDone(!done)}>
      <View style={[styles.checkbox, done && styles.checkboxDone]}>
        {done && <Text style={{color: '#fff', fontSize: 10}}>✓</Text>}
      </View>
      <Text style={[styles.checkText, done && styles.checkTextDone]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  greeting: { fontSize: 14, color: '#64748b' },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#0f766e' },
  profileCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  
  sosButton: { backgroundColor: '#fee2e2', padding: 15, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#fecaca', alignItems: 'center' },
  sosText: { color: '#dc2626', fontWeight: 'bold', fontSize: 16 },

  quoteCard: { padding: 20, backgroundColor: '#fff', borderRadius: 20, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#0f766e', shadowColor: '#000', shadowOpacity: 0.05, elevation: 1 },
  quoteTitle: { fontSize: 10, fontWeight: 'bold', color: '#0f766e', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  quoteText: { fontSize: 16, fontStyle: 'italic', color: '#1e293b', lineHeight: 24 },
  
  recoCard: { backgroundColor: '#ccfbf1', padding: 20, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: '#99f6e4' },
  recoTitle: { fontWeight: 'bold', color: '#0f766e', fontSize: 17, marginBottom: 5 },
  recoText: { color: '#115e59', fontSize: 14, lineHeight: 22, marginBottom: 15 },
  recoBtn: { backgroundColor: '#0f766e', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, alignSelf: 'flex-start' },
  recoBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '23%', backgroundColor: '#fff', paddingVertical: 15, borderRadius: 16, marginBottom: 15, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, alignItems: 'center' },
  cardIcon: { fontSize: 24, marginBottom: 8 },
  cardTitle: { fontSize: 10, fontWeight: 'bold', color: '#475569', textAlign: 'center' },

  checklistCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 20, elevation: 1 },
  checklistTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#e2e8f0', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxDone: { backgroundColor: '#0f766e', borderColor: '#0f766e' },
  checkText: { fontSize: 15, color: '#475569' },
  checkTextDone: { textDecorationLine: 'line-through', color: '#94a3b8' },

  logoutButton: { marginTop: 10, padding: 15, backgroundColor: '#f1f5f9', borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#64748b', fontWeight: 'bold', fontSize: 14 }
});
