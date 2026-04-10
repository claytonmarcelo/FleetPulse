import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { useVehicleStore, Vehicle } from '../../store/useVehicleStore';

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

type HistoryPoint = { time: string; speed: number };

export default function VehicleScreen() {
  const { vehicles } = useVehicleStore();
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  useEffect(() => {
    if (!selected) return;

    const addPoint = () => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      const current = vehicles.find((v) => v.id === selected.id);
      const speed = current?.speed ?? selected.speed;
      setHistory((prev) => [...prev.slice(-19), { time, speed }]);
    };

    addPoint();
    const interval = setInterval(addPoint, 2000);
    return () => clearInterval(interval);
  }, [selected?.id]);

  const current = selected ? vehicles.find((v) => v.id === selected.id) ?? selected : null;
  const maxSpeed = history.length > 0 ? Math.max(...history.map((h) => h.speed), 1) : 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Veículos</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Selecione um veículo</Text>

        <View style={styles.vehicleList}>
          {vehicles.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[styles.vehicleChip, selected?.id === v.id && styles.vehicleChipSelected]}
              onPress={() => { setSelected(v); setHistory([]); }}
            >
              <View style={[styles.chipDot, { backgroundColor: statusColor[v.status] }]} />
              <Text style={[styles.chipText, selected?.id === v.id && styles.chipTextSelected]}>
                {v.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {current && (
          <>
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.vehicleTitle}>{current.name}</Text>
                  <Text style={styles.driverName}>{current.driver}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor[current.status] + '22' }]}>
                  <View style={[styles.statusDot, { backgroundColor: statusColor[current.status] }]} />
                  <Text style={[styles.statusText, { color: statusColor[current.status] }]}>
                    {statusLabel[current.status]}
                  </Text>
                </View>
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricValue}>{current.speed}</Text>
                  <Text style={styles.metricUnit}>km/h</Text>
                  <Text style={styles.metricLabel}>Velocidade</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricBox}>
                  <Text style={styles.metricValue}>{current.latitude.toFixed(4)}</Text>
                  <Text style={styles.metricUnit}>lat</Text>
                  <Text style={styles.metricLabel}>Latitude</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricBox}>
                  <Text style={styles.metricValue}>{current.longitude.toFixed(4)}</Text>
                  <Text style={styles.metricUnit}>lng</Text>
                  <Text style={styles.metricLabel}>Longitude</Text>
                </View>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Histórico de velocidade ({history.length} pontos)</Text>
              {history.length === 0 ? (
                <Text style={styles.chartEmpty}>Coletando dados...</Text>
              ) : (
                <View style={styles.chartArea}>
                  {history.map((point, i) => {
                    const barHeight = Math.max((point.speed / maxSpeed) * 100, 4);
                    return (
                      <View key={i} style={styles.barWrapper}>
                        <Text style={styles.barValue}>{point.speed}</Text>
                        <View style={styles.barTrack}>
                          <View
                            style={[
                              styles.bar,
                              {
                                height: `${barHeight}%` as any,
                                backgroundColor: point.speed > 100 ? colors.danger : colors.primary,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Informações</Text>
              {[
                { label: 'ID do veículo', value: current.id },
                { label: 'Motorista', value: current.driver },
                { label: 'Última atualização', value: new Date(current.updatedAt).toLocaleTimeString() },
                { label: 'Status', value: statusLabel[current.status] },
              ].map((item) => (
                <View key={item.label} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {!current && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🚗</Text>
            <Text style={styles.emptyText}>Selecione um veículo para ver os detalhes</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 52 },
  header: { marginBottom: 20 },
  title: { color: colors.text, fontSize: 22, fontWeight: 'bold' },
  sectionTitle: { color: colors.textMuted, fontSize: 13, fontWeight: 'bold', letterSpacing: 1, marginBottom: 12 },
  vehicleList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  vehicleChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, gap: 6, borderWidth: 1, borderColor: colors.border },
  vehicleChipSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '22' },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipText: { color: colors.textMuted, fontSize: 13, fontWeight: 'bold' },
  chipTextSelected: { color: colors.primary },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 18, marginBottom: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  vehicleTitle: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  driverName: { color: colors.textMuted, fontSize: 13, marginTop: 3 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  metricBox: { alignItems: 'center' },
  metricValue: { color: colors.primary, fontSize: 20, fontWeight: 'bold' },
  metricUnit: { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  metricLabel: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  metricDivider: { width: 1, height: 40, backgroundColor: colors.border },
  chartCard: { backgroundColor: colors.card, borderRadius: 14, padding: 18, marginBottom: 14 },
  chartTitle: { color: colors.text, fontSize: 15, fontWeight: 'bold', marginBottom: 16 },
  chartEmpty: { color: colors.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: 20 },
  chartArea: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 4 },
  barWrapper: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barValue: { color: colors.textMuted, fontSize: 8, marginBottom: 2 },
  barTrack: { width: '100%', height: '85%', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 3, minHeight: 4 },
  infoCard: { backgroundColor: colors.card, borderRadius: 14, padding: 18, marginBottom: 30 },
  infoTitle: { color: colors.text, fontSize: 15, fontWeight: 'bold', marginBottom: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { color: colors.textMuted, fontSize: 13 },
  infoValue: { color: colors.text, fontSize: 13, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { color: colors.textMuted, fontSize: 15, textAlign: 'center' },
});