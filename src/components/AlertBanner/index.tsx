import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useVehicleStore } from '../../store/useVehicleStore';

export default function AlertBanner() {
  const { vehicles } = useVehicleStore();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const opacity = new Animated.Value(0);

  useEffect(() => {
    const alertVehicle = vehicles.find(
      (v) => v.status === 'alert' && v.speed > 100
    );

    if (alertVehicle) {
      setMessage(`⚠️ ${alertVehicle.name} — ${alertVehicle.speed} km/h acima do limite!`);
      setVisible(true);

      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(3000),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => setVisible(false));
    }
  }, [vehicles]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.banner, { opacity }]}>
      <Ionicons name="warning" size={18} color="#fff" />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: colors.danger,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 999,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    flex: 1,
  },
});