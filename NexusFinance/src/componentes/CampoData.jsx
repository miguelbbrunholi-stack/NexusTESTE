import React from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import Calendario from './Calendario';
import { CampoFormulario } from "./LayoutFormulario";
import { useTema } from "../contextos/ContextoTema";
import { formatarEntradaData } from "../servicos/entradaData.mjs";

export default function CampoData({
  value: valor,
  onChangeText: aoAlterarTexto,
  placeholder = 'DD/MM/AAAA',
  style: estilo,
  ...propriedades
}) {
  const { cores } = useTema();
  const [mostrarCalendario, setMostrarCalendario] = React.useState(false);

  const lidarAlteracao = texto => {
    if (!aoAlterarTexto) return;
    aoAlterarTexto(formatarEntradaData(texto));
  };

  const aoSelecionarData = data => {
    setMostrarCalendario(false);
    if (!data || !aoAlterarTexto) return;
    aoAlterarTexto(data);
  };

  return <>
      <View style={estilos.container}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Selecionar data ${placeholder}`} hitSlop={8} onPress={() => {
          Keyboard.dismiss();
          setMostrarCalendario(true);
        }} style={[estilos.botaoCalendario, { backgroundColor: cores.primariaSuave }]}>
          <Icon name="calendar-today" size={18} color={cores.primaria} />
        </Pressable>
        <View style={estilos.textoContainer}>
          <Text style={[estilos.rotulo, { color: cores.textoSecundario }]}>{placeholder}</Text>
          <CampoFormulario {...propriedades} style={[estilo, estilos.campo]} placeholder="DD/MM/AAAA" accessibilityLabel={propriedades.accessibilityLabel || placeholder} keyboardType="number-pad" inputMode="numeric" maxLength={10} autoCorrect={false} value={formatarEntradaData(valor)} onChangeText={lidarAlteracao} />
        </View>
      </View>
      {mostrarCalendario ? <Calendario valor={valor} aoSelecionar={aoSelecionarData} aoFechar={() => setMostrarCalendario(false)} /> : null}
    </>;
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden'
  },
  botaoCalendario: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  textoContainer: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center'
  },
  rotulo: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    marginBottom: 2
  },
  campo: {
    flex: 1,
    minHeight: 24,
    paddingVertical: 0,
    paddingLeft: 0,
    paddingRight: 4,
    textAlign: 'left'
  }
});
