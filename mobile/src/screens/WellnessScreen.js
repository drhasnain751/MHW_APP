import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../api/axiosConfig';

export default function WellnessScreen({ navigation }) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Anxiety', 'Sleep', 'Focus', 'Stress'];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await api.get('/content');
      if (res.data && res.data.length > 0) {
        setContent(res.data);
      } else {
        throw new Error('No content');
      }
    } catch (e) {
      console.log('Failed to fetch wellness content, using mock data', e);
      setContent([
        { _id: '1', title: '5-Minute Calm', type: 'meditation', description: 'A quick mindfulness session to reset your day.', tags: ['anxiety', 'stress'] },
        { _id: '2', title: 'Box Breathing', type: 'exercise', description: 'Technique used by Navy SEALs to stay calm under pressure.', tags: ['anxiety', 'focus'] },
        { _id: '3', title: 'Rainy Night Sleep', type: 'audio', description: 'Gentle rain sounds to help you fall asleep faster.', tags: ['sleep'] },
        { _id: '4', title: 'Morning Gratitude', type: 'meditation', description: 'Start your day with a positive mindset and focus.', tags: ['focus', 'all'] },
        { _id: '5', title: 'Deep Sleep Story', type: 'audio', description: 'A journey through a mystical forest to help you drift off.', tags: ['sleep'] },
      ]);
    }
    setLoading(false);
  };

  const filteredContent = activeCategory === 'All' 
    ? content 
    : content.filter(c => c.tags && c.tags.includes(activeCategory.toLowerCase()));

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardType}>{item.type.toUpperCase()}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.playButton} onPress={() => {
          if(item.type === 'exercise') {
            navigation.navigate('Breathing');
          } else {
            alert('Audio player coming soon!');
          }
        }}>
          <Text style={styles.playText}>{item.type === 'exercise' ? 'Start Exercise' : 'Play Audio'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkBtn}>
          <Text style={styles.bookmarkText}>🔖 Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#0f766e" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.categoryRow}>
        {categories.map(c => (
          <TouchableOpacity key={c} style={[styles.catBadge, activeCategory === c && styles.catBadgeActive]} onPress={() => setActiveCategory(c)}>
            <Text style={[styles.catText, activeCategory === c && styles.catTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredContent.length === 0 && <Text style={{textAlign: 'center', marginTop: 20, color: '#64748b'}}>No content in this category yet.</Text>}

      <FlatList 
        data={filteredContent}
        keyExtractor={item => item._id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0fdf4' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  catBadge: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e2e8f0', marginRight: 10, marginBottom: 10 },
  catBadgeActive: { backgroundColor: '#0f766e' },
  catText: { color: '#475569', fontWeight: 'bold' },
  catTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 5 },
  cardType: { fontSize: 12, color: '#0f766e', fontWeight: 'bold', marginBottom: 10 },
  cardDesc: { fontSize: 14, color: '#64748b', marginBottom: 15 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  playButton: { backgroundColor: '#0f766e', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  playText: { color: '#fff', fontWeight: 'bold' },
  bookmarkBtn: { padding: 10 },
  bookmarkText: { color: '#0f766e' }
});
