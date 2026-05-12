import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import api from '../api/axiosConfig';

const MOODS = [
  { label: 'Happy', emoji: '😊', color: '#4ade80' },
  { label: 'Calm', emoji: '😌', color: '#60a5fa' },
  { label: 'Sad', emoji: '😢', color: '#94a3b8' },
  { label: 'Anxious', emoji: '😬', color: '#fb923c' },
  { label: 'Angry', emoji: '😡', color: '#f87171' },
  { label: 'Tired', emoji: '😴', color: '#c084fc' },
];

export default function MoodTrackerScreen({ navigation }) {
  const [selectedMood, setSelectedMood] = useState('Happy');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    try {
      const response = await api.post('/moods', {
        mood: selectedMood,
        intensity: Math.round(intensity),
        notes
      });
      if (response.status === 201) {
        Alert.alert('Success', 'Your mood has been logged.');
        navigation.navigate('MoodHistory');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to save mood log.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      
      <View style={styles.moodGrid}>
        {MOODS.map((m) => (
          <TouchableOpacity 
            key={m.label} 
            style={[styles.moodCard, selectedMood === m.label && { borderColor: m.color, borderWidth: 2, backgroundColor: `${m.color}20` }]}
            onPress={() => setSelectedMood(m.label)}
          >
            <Text style={styles.emoji}>{m.emoji}</Text>
            <Text style={styles.moodLabel}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Intensity: {Math.round(intensity)}/10</Text>
      <Slider
        style={{width: '100%', height: 40}}
        minimumValue={1}
        maximumValue={10}
        value={intensity}
        onValueChange={setIntensity}
        minimumTrackTintColor="#0f766e"
        maximumTrackTintColor="#ccfbf1"
      />

      <Text style={styles.label}>Notes (Optional)</Text>
      <TextInput 
        style={styles.textArea} 
        multiline 
        numberOfLines={4} 
        placeholder="Why do you feel this way?"
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Mood</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('MoodHistory')}>
        <Text style={{color: '#0f766e', textAlign: 'center', marginTop: 10, fontSize: 16}}>View Mood History & Trends</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0fdf4' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f766e', marginBottom: 20, textAlign: 'center' },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  moodCard: { width: '30%', padding: 15, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', marginBottom: 15, borderWidth: 2, borderColor: 'transparent' },
  emoji: { fontSize: 32, marginBottom: 5 },
  moodLabel: { fontSize: 14, color: '#333', fontWeight: '500' },
  label: { fontSize: 18, fontWeight: 'bold', color: '#0f766e', marginTop: 20, marginBottom: 10 },
  textArea: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ccfbf1', height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#0f766e', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});
