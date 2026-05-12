import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';

export default function ProfileScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');

  const handleUpdate = async () => {
    try {
      const res = await api.put('/users/profile', { name, email, password });
      setUser({ ...user, name: res.data.name, email: res.data.email });
      Alert.alert('Success', 'Profile updated successfully.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      
      <Text style={styles.label}>New Password (Optional)</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Leave blank to keep current" />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0fdf4' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f766e', marginBottom: 20 },
  label: { fontSize: 16, color: '#334155', marginBottom: 5, fontWeight: '500' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ccfbf1', fontSize: 16 },
  button: { backgroundColor: '#0f766e', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
