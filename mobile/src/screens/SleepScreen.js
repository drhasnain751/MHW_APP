import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function SleepScreen({ navigation }) {
  const sounds = [
    { name: 'Rainfall', icon: '🌧️', color: '#60a5fa' },
    { name: 'Ocean Waves', icon: '🌊', color: '#3b82f6' },
    { name: 'Forest Birds', icon: '🌲', color: '#10b981' },
    { name: 'White Noise', icon: '🌫️', color: '#94a3b8' },
    { name: 'Campfire', icon: '🔥', color: '#f59e0b' },
    { name: 'Deep Zen', icon: '🧘', color: '#8b5cf6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{padding: 20}}>
        <Text style={styles.title}>Sleep & Relaxation</Text>
        <Text style={styles.subtitle}>Listen to calming sounds to help you sleep better.</Text>

        <View style={styles.grid}>
          {sounds.map(s => (
            <TouchableOpacity key={s.name} style={[styles.soundCard, { backgroundColor: s.color + '20' }]}>
              <Text style={styles.icon}>{s.icon}</Text>
              <Text style={styles.name}>{s.name}</Text>
              <Text style={styles.playBtn}>▶️ Play</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.timerCard}>
          <Text style={styles.timerTitle}>Sleep Timer</Text>
          <Text style={styles.timerText}>Sounds will automatically stop after 30 mins.</Text>
          <TouchableOpacity style={styles.configBtn}>
            <Text style={styles.configText}>Change Timer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  soundCard: { width: '48%', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  icon: { fontSize: 40, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  playBtn: { fontSize: 14, color: '#2563eb', fontWeight: 'bold' },
  timerCard: { marginTop: 20, backgroundColor: '#fff', padding: 20, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  timerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 5 },
  timerText: { fontSize: 14, color: '#64748b', marginBottom: 15 },
  configBtn: { backgroundColor: '#f1f5f9', padding: 12, borderRadius: 8, alignItems: 'center' },
  configText: { color: '#475569', fontWeight: 'bold' }
});
