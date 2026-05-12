import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

export default function TherapyListScreen({ navigation }) {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={{marginRight: 15}}>
          <Text style={{fontSize: 20}}>🏠</Text>
        </TouchableOpacity>
      )
    });
    setTherapists([
      { _id: 2, name: 'Dr. Sarah Jenkins', specialty: 'Anxiety & CBT', available: true },
      { _id: 3, name: 'Dr. Mark Lee', specialty: 'Depression & Trauma', available: false },
    ]);
    setLoading(false);
  }, []);

  const handleBook = (therapist) => {
    Alert.alert('Booking', `Requesting a session with ${therapist.name}...`);
  };

  const handleChat = (therapist) => {
    navigation.navigate('Chat', { therapistId: therapist._id, therapistName: therapist.name });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.spec}>{item.specialty}</Text>
      
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.chatBtn} onPress={() => handleChat(item)}>
          <Text style={styles.btnText}>Chat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.bookBtn, !item.available && {backgroundColor: '#cbd5e1'}]} onPress={() => handleBook(item)} disabled={!item.available}>
          <Text style={styles.btnText}>{item.available ? 'Book Session' : 'Unavailable'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#0f766e" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Professional Counseling</Text>
      <FlatList 
        data={therapists}
        keyExtractor={item => item._id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0fdf4' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f766e', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  spec: { fontSize: 14, color: '#64748b', marginBottom: 15 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  chatBtn: { backgroundColor: '#0ea5e9', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, flex: 1, marginRight: 5, alignItems: 'center' },
  bookBtn: { backgroundColor: '#0f766e', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, flex: 1.5, marginRight: 5, alignItems: 'center' },
  videoBtn: { backgroundColor: '#8b5cf6', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});
