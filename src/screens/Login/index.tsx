import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { colors } from '../../theme/colors';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigation.replace('App');
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') setError('Usuário não encontrado!');
      else if (e.code === 'auth/wrong-password') setError('Senha incorreta!');
      else if (e.code === 'auth/email-already-in-use') setError('Email já cadastrado!');
      else if (e.code === 'auth/weak-password') setError('Senha muito fraca!');
      else if (e.code === 'auth/invalid-email') setError('Email inválido!');
      else setError('Erro ao autenticar. Tente novamente!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>FleetPulse</Text>
        <Text style={styles.subtitle}>
          {isRegister ? 'Crie sua conta' : 'Entre na sua conta'}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnPrimaryText}>
              {isRegister ? 'Criar conta' : 'Entrar'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => { setIsRegister(!isRegister); setError(''); }}
        >
          <Text style={styles.btnSecondaryText}>
            {isRegister ? 'Já tenho conta — Entrar' : 'Não tenho conta — Criar'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 28, justifyContent: 'center' },
  header: { marginBottom: 40 },
  logo: { color: colors.primary, fontSize: 36, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: colors.textMuted, fontSize: 16 },
  form: { gap: 16 },
  inputWrapper: { gap: 6 },
  label: { color: colors.textMuted, fontSize: 13, fontWeight: 'bold' },
  input: { backgroundColor: colors.card, color: colors.text, padding: 16, borderRadius: 12, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  error: { color: colors.danger, fontSize: 13, textAlign: 'center' },
  btnPrimary: { backgroundColor: colors.primary, padding: 18, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnSecondary: { padding: 14, alignItems: 'center' },
  btnSecondaryText: { color: colors.textMuted, fontSize: 14 },
});