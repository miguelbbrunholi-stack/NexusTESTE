import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useTema } from '../contextos/ContextoTema';
import { dataParaIso, formatarEntradaData } from '../servicos/entradaData.mjs';

const DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function Calendario({ valor, aoSelecionar, aoFechar }) {
  const { cores } = useTema();
  const selecionada = dataParaIso(valor);
  const [mes, setMes] = useState(() => selecionada ? new Date(selecionada + 'T12:00:00') : new Date());
  const ano = mes.getFullYear();
  const indiceMes = mes.getMonth();
  const primeiroDia = new Date(ano, indiceMes, 1).getDay();
  const totalDias = new Date(ano, indiceMes + 1, 0).getDate();

  function navegar(deslocamento) {
    setMes(new Date(ano, indiceMes + deslocamento, 1));
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={aoFechar}>
      <View style={{ flex: 1, padding: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.sobreposicao }}>
        <View accessibilityViewIsModal style={{ width: '100%', maxWidth: 370, borderRadius: 20, padding: 12, backgroundColor: cores.superficieElevada }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pressable accessibilityRole="button" accessibilityLabel="Mês anterior" onPress={() => navegar(-1)} style={{ padding: 10 }}>
              <Icon name="chevron-left" size={24} color={cores.textoLink} />
            </Pressable>
            <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={{ color: cores.textoPrincipal, fontWeight: '700' }}>
              {mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Próximo mês" onPress={() => navegar(1)} style={{ padding: 10 }}>
              <Icon name="chevron-right" size={24} color={cores.textoLink} />
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {DIAS.map((dia, indice) => (
              <Text key={indice} style={{ width: '14.28%', textAlign: 'center', paddingVertical: 8, color: cores.textoSecundario }}>{dia}</Text>
            ))}
            {Array.from({ length: primeiroDia + totalDias }, (_, indice) => {
              const dia = indice - primeiroDia + 1;
              if (dia < 1) return <View key={indice} style={{ width: '14.28%' }} />;
              const iso = [String(ano).padStart(4, '0'), String(indiceMes + 1).padStart(2, '0'), String(dia).padStart(2, '0')].join('-');
              const ativo = iso === selecionada;
              return (
                <Pressable key={indice} accessibilityRole="button" accessibilityLabel={formatarEntradaData(iso)} accessibilityState={{ selected: ativo }}
                  onPress={() => aoSelecionar(formatarEntradaData(iso))}
                  style={{ width: '14.28%', minHeight: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: ativo ? cores.primaria : 'transparent' }}>
                  <Text style={{ color: ativo ? cores.sobrePrimaria : cores.textoPrincipal }}>{dia}</Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable accessibilityRole="button" onPress={aoFechar} style={{ alignSelf: 'flex-end', marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: cores.primaria }}>
            <Text style={{ color: cores.sobrePrimaria, fontWeight: '700' }}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
