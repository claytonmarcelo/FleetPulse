import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { colors } from '../../theme/colors';
import { useVehicleStore, Vehicle } from '../../store/useVehicleStore';

const mockVehicles: Vehicle[] = [
  { id: '1', name: 'Caminhão 01', driver: 'Carlos Silva', speed: 87, latitude: -23.55, longitude: -46.63, status: 'online', updatedAt: new Date() },
  { id: '2', name: 'Van 02', driver: 'Ana Souza', speed: 0, latitude: -23.56, longitude: -46.64, status: 'offline', updatedAt: new Date() },
  { id: '3', name: 'Moto 03', driver: 'Pedro Lima', speed: 112, latitude: -23.57, longitude: -46.65, status: 'alert', updatedAt: new Date() },
  { id: '4', name: 'Caminhão 04', driver: 'Julia Costa', speed: 64, latitude: -23.58, longitude: -46.66, status: 'online', updatedAt: new Date() },
];

const statusColor = {
  online: colors.success,
  offline: colors.textMuted,
  alert: colors.danger,
};

const statusLabel = {
  online: 'Online',
  offline: 'Offline',
  alert: 'Alerta',
};

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.vehicleName}>{vehicle.name}</Text>
          <Text style={styles.driverName}>{vehicle.driver}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor[vehicle.status] + '22' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor[vehicle.status] }]} />
          <Text style={[styles.statusText, { color: statusColor[vehicle.status] }]}>
            {statusLabel[vehicle.status]}
          </Text>
        </View>
      </View>

      <View style={styles.cardStats}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{vehicle.speed}</Text>
          <Text style={styles.statUnit}>km/h</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{vehicle.latitude.toFixed(3)}</Text>
          <Text style={styles.statUnit}>lat</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{vehicle.longitude.toFixed(3)}</Text>
          <Text style={styles.statUnit}>lng</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  const { vehicles, setVehicles } = useVehicleStore();

  useEffect(() => {
    setVehicles(mockVehicles);

    const interval = setInterval(() => {
      setVehicles(
        mockVehicles.map((v) => ({
          ...v,
          speed: v.status === 'online'
            ? Math.floor(Math.random() * 40) + 60
            : v.status === 'alert'
            ? Math.floor(Math.random() * 30) + 100
            : 0,
          updatedAt: new Date(),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const online = vehicles.filter((v) => v.status === 'online').length;
  const alerts = vehicles.filter((v) => v.status === 'alert').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>FleetPulse</Text>
          <Text style={styles.headerSub}>Painel em tempo real</Text>
        </View>
        <View style={styles.liveTag}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>AO VIVO</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{vehicles.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: colors.success }]}>{online}</Text>
          <Text style={styles.summaryLabel}>Online</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: colors.danger }]}>{alerts}</Text>
          <Text style={styles.summaryLabel}>Alertas</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Veículos</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 52 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { color: colors.text, fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  liveTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.danger + '22', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.danger, marginRight: 6 },
  liveText: { color: colors.danger, fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  summary: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 14, padding: 18, marginBottom: 24, justifyContent: 'space-around', alignItems: 'center' },
  summaryItem: { alignItems: 'center' },
  summaryNumber: { color: colors.text, fontSize: 26, fontWeight: 'bold' },
  summaryLabel: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  summaryDivider: { width: 1, height: 36, backgroundColor: colors.border },
  sectionTitle: { color: colors.textMuted, fontSize: 13, fontWeight: 'bold', letterSpacing: 1, marginBottom: 12 },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 18, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  vehicleName: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  driverName: { color: colors.textMuted, fontSize: 13, marginTop: 3 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  cardStats: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statBox: { alignItems: 'center' },
  statValue: { color: colors.primary, fontSize: 18, fontWeight: 'bold' },
  statUnit: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: colors.border },
});