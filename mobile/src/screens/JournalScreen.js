import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import api from '../api/axiosConfig';

export default function JournalScreen({ navigation }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(true);

  const categories = ['General', 'Gratitude', 'Stress', 'Goals'];

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={{marginRight: 15}}>
          <Text style={{fontSize: 20}}>🏠</Text>
        </TouchableOpacity>
      )
    });
    authenticateUser();
  }, []);

  const authenticateUser = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setIsAuthenticated(true);
      fetchEntries();
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock your Private Journal',
      fallbackLabel: 'Use Passcode',
    });

    if (result.success) {
      setIsAuthenticated(true);
      fetchEntries();
    } else {
      Alert.alert('Authentication Failed', 'You must unlock to view your journal.');
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = entries.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries);
    }
  }, [searchQuery, entries]);

  const fetchEntries = async () => {
    try {
      const res = await api.get('/journals');
      setEntries(res.data);
      setFilteredEntries(res.data);
    } catch (e) {
      console.log('Error fetching journals', e);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!content) {
      Alert.alert('Error', 'Journal content cannot be empty.');
      return;
    }

    try {
      const res = await api.post('/journals', {
        title: title || 'Untitled',
        content,
        category,
        isLocked: true
      });
      const newEntries = [res.data, ...entries];
      setEntries(newEntries);
      setTitle('');
      setContent('');
      Alert.alert('Success', `Journal saved! Sentiment detected: ${res.data.sentimentAnalysis}`);
    } catch (e) {
      Alert.alert('Error', 'Failed to save journal.');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this journal entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/journals/${id}`);
          setEntries(entries.filter(e => e._id !== id));
        } catch (e) {
          Alert.alert('Error', 'Failed to delete entry.');
        }
      }}
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.entryCard}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5}}>
        <View>
          <Text style={styles.entryTitle}>{item.title}</Text>
          {item.sentiment && (
            <Text style={[styles.sentimentText, { color: item.sentiment === 'Positive' ? '#10b981' : item.sentiment === 'Negative' ? '#ef4444' : '#64748b' }]}>
              Analysis: {item.sentiment}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Text style={{color: '#ef4444', fontSize: 12}}>🗑️</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.entryCategory}>{item.category}</Text>
      <Text style={styles.entryDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      <Text style={styles.entryContent}>{item.content}</Text>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <View style={styles.centered}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.title}>Journal is Locked</Text>
        <TouchableOpacity style={styles.button} onPress={authenticateUser}>
          <Text style={styles.buttonText}>Unlock Journal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#0f766e" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList 
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Private Journal</Text>
            
            <View style={styles.searchBar}>
              <Text style={{marginRight: 10}}>🔍</Text>
              <TextInput 
                style={{flex: 1}} 
                placeholder="Search entries..." 
                value={searchQuery} 
                onChangeText={setSearchQuery} 
              />
            </View>

            <View style={styles.formCard}>
              <TextInput style={styles.input} placeholder="Title (Optional)" value={title} onChangeText={setTitle} />
              <View style={styles.categoryRow}>
                {categories.map(c => (
                  <TouchableOpacity key={c} style={[styles.catBadge, category === c && styles.catBadgeActive]} onPress={() => setCategory(c)}>
                    <Text style={[styles.catText, category === c && styles.catTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput 
                style={styles.textArea} 
                multiline 
                placeholder="What's on your mind?" 
                value={content} 
                onChangeText={setContent} 
              />
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Entry</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        data={filteredEntries}
        keyExtractor={item => item._id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{padding: 20, paddingBottom: 40}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  lockIcon: { fontSize: 64, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f766e', marginBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 20, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05 },
  formCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, elevation: 3 },
  input: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  textArea: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 15 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  catBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#e2e8f0', marginRight: 8, marginBottom: 8 },
  catBadgeActive: { backgroundColor: '#0f766e' },
  catText: { color: '#475569', fontSize: 12, fontWeight: 'bold' },
  catTextActive: { color: '#fff' },
  button: { backgroundColor: '#0f766e', padding: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  entryCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 },
  entryTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  sentimentText: { fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  entryCategory: { fontSize: 10, color: '#0f766e', backgroundColor: '#ccfbf1', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: 'hidden', fontWeight: 'bold', marginBottom: 5 },
  entryDate: { fontSize: 12, color: '#94a3b8', marginBottom: 10 },
  entryContent: { fontSize: 15, color: '#475569', lineHeight: 22 }
});
