import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from 'react-native';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

export default function ChatScreen({ route, navigation }) {
  const { therapistId, therapistName } = route.params;
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const flatListRef = useRef();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide default header to use custom one
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${therapistId}`);
      setMessages(res.data);
    } catch (e) {
      console.log('Failed to fetch messages', e);
    }
  };

  const sendMessage = async () => {
    if(!text.trim()) return;
    const tempText = text;
    setText('');
    try {
      await api.post('/messages', { receiverId: therapistId, content: tempText });
      fetchMessages();
    } catch (e) {
      console.log('Failed to send', e);
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.senderId === user?._id || item.senderId === user?.id;
    return (
      <View style={[styles.msgWrapper, isMe ? styles.myMsgWrapper : styles.theirMsgWrapper]}>
        <View style={[styles.msgContainer, isMe ? styles.myMsg : styles.theirMsg]}>
          <Text style={[styles.msgText, isMe ? styles.myText : styles.theirText]}>{item.content}</Text>
        </View>
        <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      
      {/* Custom Pretty Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.headerIconBtn}>
          <Text style={{fontSize: 22}}>🏠</Text>
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{therapistName.split(' ').map(n=>n[0]).join('')}</Text>
          </View>
          <View>
            <Text style={styles.headerTitleText}>{therapistName}</Text>
            <Text style={styles.headerSubText}>Online • Always here to help</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList 
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item._id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{padding: 15, paddingBottom: 20}}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
        
        <View style={styles.inputArea}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Dashboard')}>
              <Text style={{fontSize: 22}}>🏠</Text>
            </TouchableOpacity>
            <TextInput 
              style={styles.input} 
              value={text} 
              onChangeText={setText} 
              placeholder="Type your message..." 
              placeholderTextColor="#94a3b8"
              multiline
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <Text style={styles.sendText}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fdfdfd' },
  container: { flex: 1 },
  
  // Header Styles
  customHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 12, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderColor: '#f1f5f9',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  headerInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 5 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0f766e', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  headerTitleText: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  headerSubText: { fontSize: 11, color: '#10b981', fontWeight: '500' },
  headerActions: { flexDirection: 'row' },
  headerIconBtn: { padding: 8, marginLeft: 5 },

  // Message Styles
  msgWrapper: { marginBottom: 12, maxWidth: '80%' },
  myMsgWrapper: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  theirMsgWrapper: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  msgContainer: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 18, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 2, elevation: 1 },
  myMsg: { backgroundColor: '#0f766e', borderBottomRightRadius: 2 },
  theirMsg: { backgroundColor: '#fff', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#f1f5f9' },
  msgText: { fontSize: 15, lineHeight: 20 },
  myText: { color: '#fff' },
  theirText: { color: '#334155' },
  timeText: { fontSize: 10, color: '#94a3b8', marginTop: 4, marginHorizontal: 4 },

  // Input Styles
  inputArea: { backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#f1f5f9', paddingHorizontal: 15, paddingVertical: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  homeBtn: { marginRight: 12, padding: 5 },
  input: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, fontSize: 16, maxHeight: 100, color: '#1e293b' },
  sendBtn: { backgroundColor: '#0f766e', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  sendText: { color: '#fff', fontSize: 18 }
});
