import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, SafeAreaView } from 'react-native';

export default function MedsScreen() {
  const [meds, setMeds] = useState([
    { id: '1', name: 'Multivitamin', time: '08:00 AM', taken: true },
    { id: '2', name: 'Omega 3', time: '09:00 PM', taken: false },
  ]);
  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState('');

  const addMed = () => {
    if (!newName || !newTime) return Alert.alert('Error', 'Please enter name and time');
    setMeds([...meds, { id: Date.now().toString(), name: newName, time: newTime, taken: false }]);
    setNewName('');
    setNewTime('');
  };

  const toggleTaken = (id) => {
    setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: 20}}>
        <Text style={styles.title}>Medication Tracker</Text>
        <Text style={styles.subtitle}>Keep track of your daily supplements and medicines.</Text>

        <View style={styles.inputCard}>
          <TextInput style={styles.input} placeholder="Medication Name" value={newName} onChangeText={setNewName} />
          <TextInput style={styles.input} placeholder="Time (e.g. 10:00 AM)" value={newTime} onChangeText={setNewTime} />
          <TouchableOpacity style={styles.addBtn} onPress={addMed}>
            <Text style={styles.addBtnText}>+ Add Reminder</Text>
          </TouchableOpacity>
        </View>

        <FlatList 
          data={meds}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.medCard}>
              <View style={{flex: 1}}>
                <Text style={styles.medName}>{item.name}</Text>
                <Text style={styles.medTime}>⏰ {item.time}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.checkBtn, item.taken && styles.checkBtnActive]} 
                onPress={() => toggleTaken(item.id)}
              >
                <Text style={{color: item.taken ? '#fff' : '#0f766e'}}>{item.taken ? '✓ Taken' : 'Mark Taken'}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 20 },
  inputCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  input: { backgroundColor: '#f1f5f9', padding: 12, borderRadius: 8, marginBottom: 10 },
  addBtn: { backgroundColor: '#0f766e', padding: 15, borderRadius: 8, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  medCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#0f766e' },
  medName: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  medTime: { fontSize: 14, color: '#64748b' },
  checkBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#0f766e' },
  checkBtnActive: { backgroundColor: '#0f766e' }
});
