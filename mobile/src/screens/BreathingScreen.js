import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, SafeAreaView } from 'react-native';

export default function BreathingScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;
  const [phase, setPhase] = useState('Breathe In');
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    runAnimation();
  }, []);

  const runAnimation = () => {
    // Phase 1: Breathe In (4s)
    setPhase('Breathe In');
    setTimer(4);
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 2.2, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 4000, useNativeDriver: true })
    ]).start(() => {
      // Phase 2: Hold (7s)
      setPhase('Hold');
      setTimer(7);
      setTimeout(() => {
        // Phase 3: Breathe Out (8s)
        setPhase('Breathe Out');
        setTimer(8);
        Animated.parallel([
          Animated.timing(scaleAnim, { toValue: 1, duration: 8000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0.5, duration: 8000, useNativeDriver: true })
        ]).start(runAnimation);
      }, 7000);
    });
  };

  useEffect(() => {
    if (timer > 0) {
      const t = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(t);
    }
  }, [timer]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={{fontSize: 24}}>✕</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.phase}>{phase}</Text>
        <Text style={styles.timer}>{timer}s</Text>
        
        <View style={styles.circleContainer}>
          <Animated.View style={[styles.circleOuter, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]} />
          <Animated.View style={[styles.circleInner, { transform: [{ scale: Animated.multiply(scaleAnim, 0.6) }] }]} />
        </View>

        <Text style={styles.guide}>Focus on the expanding circle. Let your body relax.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdfa' },
  backBtn: { padding: 20, marginTop: 10 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  phase: { fontSize: 36, fontWeight: 'bold', color: '#0f766e', marginBottom: 10 },
  timer: { fontSize: 24, color: '#14b8a6', marginBottom: 60 },
  circleContainer: { width: 300, height: 300, justifyContent: 'center', alignItems: 'center' },
  circleOuter: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#99f6e4' },
  circleInner: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: '#0f766e', opacity: 0.3 },
  guide: { marginTop: 100, fontSize: 16, color: '#64748b', textAlign: 'center', paddingHorizontal: 40 }
});
