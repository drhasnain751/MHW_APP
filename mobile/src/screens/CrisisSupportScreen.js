import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';

const HELPLINES = [
  { name: 'National Suicide Prevention Lifeline', number: '988', region: 'USA' },
  { name: 'Crisis Text Line', number: '741741', region: 'USA' },
  { name: 'Samaritans', number: '116 123', region: 'UK' },
  { name: 'Kids Help Phone', number: '1-800-668-6868', region: 'Canada' },
  { name: 'Lifeline', number: '13 11 14', region: 'Australia' }
];

export default function CrisisSupportScreen({ navigation }) {
  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const findCenters = () => {
    // For FR18: Redirect to map search
    Linking.openURL('https://www.google.com/maps/search/mental+health+center+near+me');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.alertIcon}>⚠️</Text>
        <Text style={styles.title}>You are not alone.</Text>
        <Text style={styles.subtitle}>Help is available right now.</Text>
      </View>

      <TouchableOpacity style={styles.calmButton} onPress={() => navigation.navigate('Breathing')}>
        <Text style={styles.calmText}>Start Calming Exercise</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.mapButton} onPress={findCenters}>
        <Text style={styles.mapText}>📍 Find Support Centers Near Me</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Emergency Hotlines</Text>
      {HELPLINES.map((hl, i) => (
        <View key={i} style={styles.hotlineCard}>
          <View>
            <Text style={styles.hlName}>{hl.name}</Text>
            <Text style={styles.hlRegion}>{hl.region}</Text>
          </View>
          <TouchableOpacity style={styles.callBtn} onPress={() => handleCall(hl.number)}>
            <Text style={styles.callText}>Call {hl.number}</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.disclaimer}>
        If you are in immediate danger or experiencing a medical emergency, please call your local emergency services (e.g., 911, 999, 112) immediately.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fef2f2' },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  alertIcon: { fontSize: 48, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#dc2626' },
  subtitle: { fontSize: 16, color: '#7f1d1d', marginTop: 5 },
  calmButton: { backgroundColor: '#14b8a6', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  calmText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  mapButton: { backgroundColor: '#fff', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 30, borderWidth: 1, borderColor: '#fca5a5' },
  mapText: { color: '#dc2626', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#991b1b', marginBottom: 15 },
  hotlineCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  hlName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  hlRegion: { fontSize: 12, color: '#64748b' },
  callBtn: { backgroundColor: '#ef4444', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  callText: { color: '#fff', fontWeight: 'bold' },
  disclaimer: { fontSize: 12, color: '#991b1b', textAlign: 'center', marginTop: 20, marginBottom: 40, paddingHorizontal: 10 }
});
