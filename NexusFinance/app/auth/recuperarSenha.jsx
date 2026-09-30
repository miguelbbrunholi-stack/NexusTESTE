import { useSession } from '../../src/data/Session';
import { api } from '../../src/api/client';
import { apiStyles, keyboardStyles, recuperarSenhaStyles as styles } from '../../src/styles';
import KeyboardForm from '../../src/components/KeyboardForm';
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AnimatedCard, AnimatedScreen } from '../../src/components/AnimatedScreen';
export default function RecuperarSenha() {
  const session = useSession();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const enviarCodigo = async () => {
    if (busy) return;

    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo) {
      setMessage('Digite seu e-mail.');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const result = await api('/auth/recuperar-senha', {
        method: 'POST',
        body: {
          email: emailLimpo
        }
      });

      setEmail(emailLimpo);

      if (result.codigo_desenvolvimento) {
        setCodigo(result.codigo_desenvolvimento);
        setMessage(`${result.mensagem} Código: ${result.codigo_desenvolvimento}`);
      } else {
        setMessage(result.mensagem);
      }
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  };
  const verificarCodigo = async () => {
    if (busy) return;

    const emailLimpo = email.trim().toLowerCase();
    const codigoLimpo = codigo.replace(/\D/g, '');

    if (!emailLimpo) {
      setMessage('Digite seu e-mail.');
      return;
    }

    if (codigoLimpo.length !== 6) {
      setMessage('Digite o código de 6 dígitos.');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      await api('/auth/verificar-codigo', {
        method: 'POST',
        body: {
          email: emailLimpo,
          codigo: codigoLimpo
        }
      });
      session.setRecovery({
        email: emailLimpo,
        codigo: codigoLimpo
      });
      router.push('/auth/novaSenha');
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  };
  return <AnimatedScreen style={keyboardStyles.screen} delay={60}>
      <KeyboardForm contentContainerStyle={styles.container}>
    <SafeAreaView style={[styles.container, keyboardStyles.content]}>
      <AnimatedCard style={styles.content} delay={80}>
        <Text style={styles.title}>Recuperar senha</Text>

        <Text style={styles.descricao}>
          Digite seu e-mail para receber um código de recuperação.
        </Text>
        <View style={styles.inputContainer1}>
        <TextInput style={styles.input} placeholder="Digite seu e-mail" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

        <TouchableOpacity style={styles.button} disabled={busy} onPress={enviarCodigo}>
          <Text style={styles.buttonText}>Enviar código</Text>
        </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Digite o código de 6 dígitos"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={6}
          value={codigo}
          onChangeText={text => setCodigo(text.replace(/\D/g, '').slice(0, 6))}
        />

        <TouchableOpacity style={styles.button} disabled={busy} onPress={verificarCodigo}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>
            Voltar para o login
          </Text>
        </TouchableOpacity>
      </AnimatedCard>
    </SafeAreaView>
    {!!message && <Text style={apiStyles.error}>{message}</Text>}
      {busy && <Text style={apiStyles.message}>Aguarde...</Text>}
    </KeyboardForm>
    </AnimatedScreen>;
}
