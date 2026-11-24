import { Image, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

export default function AvatarPerfil({ foto, tamanho, cor }) {
  if (!foto) return <Icon name="person-outline" size={tamanho} color={cor} />;
  return (
    <Image
      source={{ uri: foto }}
      accessibilityLabel="Foto de perfil"
      resizeMode="cover"
      style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', borderRadius: 999 }]}
    />
  );
}
