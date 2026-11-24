import { Text, TouchableOpacity } from 'react-native';
import { useEstilosApp } from '../style/style';
import { CartaoAnimado } from './TelaAnimada';

export default function AbasLista({ opcoes, selecionada, aoSelecionar, style }) {
  const { estilosFluxoFinanceiro: estilos } = useEstilosApp();
  return (
    <CartaoAnimado style={[estilos.filtroRecipiente, style]} atraso={40}>
      {opcoes.map(opcao => (
        <TouchableOpacity
          key={opcao}
          accessibilityRole="tab"
          accessibilityState={{ selected: selecionada === opcao }}
          style={[estilos.botaoFiltro, { flex: 1, paddingHorizontal: 5, justifyContent: 'center' }, selecionada === opcao && estilos.botaoAtivo]}
          onPress={() => aoSelecionar(opcao)}
        >
          <Text style={[estilos.textoABA, { textAlign: 'center' }, selecionada === opcao && estilos.textoAtivo]}>{opcao}</Text>
        </TouchableOpacity>
      ))}
    </CartaoAnimado>
  );
}
