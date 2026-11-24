import { Pressable, Text, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useTema } from '../contextos/ContextoTema';

export default function Paginacao({ pagina, total, aoMudar }) {
  const { cores } = useTema();
  if (total <= 1) return null;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginVertical: 12 }}>
      {[-1, 0, 1].map(direcao => {
        if (!direcao) {
          return <Text key={direcao} accessibilityLiveRegion="polite" style={{ color: cores.textoPrincipal }}>Página {pagina} de {total}</Text>;
        }
        const destino = pagina + direcao;
        const desabilitado = destino < 1 || destino > total;
        return (
          <Pressable
            key={direcao}
            accessibilityRole="button"
            accessibilityLabel={direcao < 0 ? 'Página anterior' : 'Próxima página'}
            disabled={desabilitado}
            onPress={() => aoMudar(destino)}
            style={{ width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.primariaSuave, opacity: desabilitado ? 0.45 : 1 }}
          >
            <Icon name={direcao < 0 ? 'chevron-left' : 'chevron-right'} color={cores.textoLink} size={24} />
          </Pressable>
        );
      })}
    </View>
  );
}
