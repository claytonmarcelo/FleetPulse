import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.badge}>TEMPO REAL</Text>
        <Text style={styles.title}>Fleet{'\n'}Pulse</Text>
        <Text style={styles.subtitle}>
          Monitore sua frota com localização, velocidade e alertas ao vivo.
        </Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>98%</Text>
          <Text style={styles.statLabel}>Uptime</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0.3s</Text>
          <Text style={styles.statLabel}>Latência</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>GPS</Text>
          <Text style={styles.statLabel}>Precisão</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.btnPrimaryText}>Acessar painel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.btnSecondaryText}>Criar conta grátis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 28,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
  },
  badge: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 16,
  },
  title: {
    color: colors.text,
    fontSize: 64,
    fontWeight: 'bold',
    lineHeight: 68,
    marginBottom: 20,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 26,
    maxWidth: width * 0.75,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statNumber: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  buttons: { gap: 12 },
  btnPrimary: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 17,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: colors.textMuted,
    fontWeight: 'bold',
    fontSize: 16,
  },
});