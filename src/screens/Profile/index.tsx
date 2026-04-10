import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [speedAlerts, setSpeedAlerts] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Welcome');
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Minha conta', value: user?.email ?? '' },
    { icon: 'shield-checkmark-outline', label: 'Segurança', value: 'Senha e autenticação' },
    { icon: 'analytics-outline', label: 'Relatórios', value: 'Ver histórico completo' },
    { icon: 'help-circle-outline', label: 'Suporte', value: 'Central de ajuda' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatarCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() ?? 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>Administrador</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Veículos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.success }]}>2</Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.danger }]}>1</Text>
            <Text style={styles.statLabel}>Alertas</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>CONFIGURAÇÕES</Text>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>Notificações</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="speedometer-outline" size={20} color={colors.warning} />
              <Text style={styles.settingLabel}>Alertas de velocidade</Text>
            </View>
            <Switch
              value={speedAlerts}
              onValueChange={setSpeedAlerts}
              trackColor={{ false: colors.border, true: colors.warning }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>MENU</Text>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <View key={item.label}>
              <TouchableOpacity style={styles.menuRow}>
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                  <View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <Text style={styles.menuValue}>{item.value}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>FleetPulse v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 52 },
  header: { marginBottom: 20 },
  title: { color: colors.text, fontSize: 22, fontWeight: 'bold' },
  avatarCard: { backgroundColor: colors.card, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  userName: { color: colors.text, fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  roleBadge: { backgroundColor: colors.primary + '22', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  roleText: { color: colors.primary, fontSize: 12, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 16, alignItems: 'center' },
  statNumber: { color: colors.text, fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  sectionTitle: { color: colors.textMuted, fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 10 },
  settingsCard: { backgroundColor: colors.card, borderRadius: 14, padding: 4, marginBottom: 24 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { color: colors.text, fontSize: 15 },
  separator: { height: 1, backgroundColor: colors.border, marginHorizontal: 14 },
  menuCard: { backgroundColor: colors.card, borderRadius: 14, padding: 4, marginBottom: 24 },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuLabel: { color: colors.text, fontSize: 15 },
  menuValue: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.danger + '22', padding: 16, borderRadius: 14, marginBottom: 16 },
  logoutText: { color: colors.danger, fontWeight: 'bold', fontSize: 15 },
  version: { color: colors.textMuted, fontSize: 12, textAlign: 'center', marginBottom: 30 },
});