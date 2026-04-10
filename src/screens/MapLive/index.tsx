import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { useVehicleStore, Vehicle } from '../../store/useVehicleStore';

const statusColor = {
  online: colors.success,
  offline: colors.textMuted,
  alert: colors.danger,
};

function MapPlaceholder({ vehicles }: { vehicles: Vehicle[] }) {
  const positions = [
    { x: 60, y: 40 },
    { x: 200, y: 100 },
    { x: 280, y: 30 },
    { x: 140, y: 120 },
  ];

  return (
    <View style={styles.mapBox}>
      <View style={styles.mapGrid}>
        {vehicles.map((v, i) => (
          <View
            key={v.id}
            style={[
              styles.mapDot,
              {
                backgroundColor: statusColor[v.status],
                left: positions[i]?.x ?? 50,
                top: positions[i]?.y ?? 50,
              },
            ]}
          >
            <Text style={styles.mapDotLabel}>{v.name.split(' ')[1]}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.mapLabel}>Mapa ao vivo — GPS em tempo real</Text>
    </View>
  );
}

export default function MapLiveScreen() {
  const { vehicles, setVehicles } = useVehicleStore();
  const [selected, setSelected] = useState<Vehicle | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(
        vehicles.map((v) => ({
          ...v,
          latitude: v.latitude + (Math.random() - 0.5) * 0.001,
          longitude: v.longitude + (Math.random() - 0.5) * 0.001,
          speed: v.status === 'online'
            ? Math.floor(Math.random() * 40) + 60
            : v.status === 'alert'
            ? Math.floor(Math.random() * 30) + 100
            : 0,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [vehicles]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa ao vivo</Text>
        <View style={styles.liveTag}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>AO VIVO</Text>
        </View>
      </View>

      <MapPlaceholder vehicles={vehicles} />

      <Text style={styles.sectionTitle}>Selecione um veículo</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {vehicles.map((v) => (
          <TouchableOpacity
            key={v.id}
            style={[styles.vehicleRow, selected?.id === v.id && styles.vehicleRowSelected]}
            onPress={() => setSelected(v)}
          >
            <View style={[styles.dot, { backgroundColor: statusColor[v.status] }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.vehicleName}>{v.name}</Text>
              <Text style={styles.driverName}>{v.driver}</Text>
            </View>
            <View style={styles.speedBox}>
              <Text style={styles.speedValue}>{v.speed}</Text>
              <Text style={styles.speedUnit}>km/h</Text>
            </View>
          </TouchableOpacity>
        ))}

        {selected && (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>{selected.name}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Motorista</Text>
              <Text style={styles.detailValue}>{selected.driver}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Velocidade</Text>
              <Text style={styles.detailValue}>{selected.speed} km/h</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Latitude</Text>
              <Text style={styles.detailValue}>{selected.latitude.toFixed(5)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Longitude</Text>
              <Text style={styles.detailValue}>{selected.longitude.toFixed(5)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[styles.detailValue, { color: statusColor[selected.status] }]}>
                {selected.status.toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 52 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: colors.text, fontSize: 22, fontWeight: 'bold' },
  liveTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.danger + '22', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.danger, marginRight: 6 },
  liveText: { color: colors.danger, fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  mapBox: { height: 200, backgroundColor: colors.card, borderRadius: 14, marginBottom: 20, overflow: 'hidden', justifyContent: 'flex-end' },
  mapGrid: { flex: 1, position: 'relative' },
  mapDot: { position: 'absolute', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  mapDotLabel: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  mapLabel: { color: colors.textMuted, fontSize: 11, textAlign: 'center', padding: 8 },
  sectionTitle: { color: colors.textMuted, fontSize: 13, fontWeight: 'bold', letterSpacing: 1, marginBottom: 12 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 10, gap: 12 },
  vehicleRowSelected: { borderWidth: 1.5, borderColor: colors.primary },
  dot: { width: 10, height: 10, borderRadius: 5 },
  vehicleName: { color: colors.text, fontSize: 15, fontWeight: 'bold' },
  driverName: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  speedBox: { alignItems: 'flex-end' },
  speedValue: { color: colors.primary, fontSize: 18, fontWeight: 'bold' },
  speedUnit: { color: colors.textMuted, fontSize: 11 },
  detailCard: { backgroundColor: colors.card, borderRadius: 14, padding: 18, marginTop: 8, marginBottom: 20, borderWidth: 1, borderColor: colors.primary + '44' },
  detailTitle: { color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  detailLabel: { color: colors.textMuted, fontSize: 14 },
  detailValue: { color: colors.text, fontSize: 14, fontWeight: 'bold' },
});