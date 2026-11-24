import React, { useRef, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import AvatarPerfil from '../../componentes/AvatarPerfil';
import BarraNavegacao from "../../componentes/BarraNavegacao";
import { CartaoAnimado, TelaAnimada } from "../../componentes/TelaAnimada";
import { View, Text, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useEstilosApp } from "../../style/style";
import { formatarReais, apiAutenticada } from "../../servicos/financeiro";
import { useSessao } from "../../contextos/ContextoSessao";
import { useResumoFinanceiro } from "../../ganchos/useResumoFinanceiro";
export default function Perfil() {
  const {
    cores,
    estilosPerfil: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const [modalSair, setModalSair] = useState(false);
  const selecionandoFoto = useRef(false);
  const [salvandoFoto, setSalvandoFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState('');
  const {
    usuario,
    setUsuario,
    encerrarSessao
  } = useSessao();
  const {
    dados
  } = useResumoFinanceiro();
  const totais = dados.atual;
  async function alterarFoto() {
    if (selecionandoFoto.current || !usuario) return;
    selecionandoFoto.current = true;
    setSalvandoFoto(true);
    setErroFoto('');
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: ['image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
        base64: false
      });
      if (resultado.canceled) return;
      const arquivo = resultado.assets[0];
      if (Platform.OS === 'web') URL.revokeObjectURL(arquivo.uri);
      if (arquivo.size > 2 * 1024 * 1024) throw new Error('Escolha uma foto de até 2 MB.');
      const formulario = new FormData();
      if (Platform.OS === 'web') {
        formulario.append('foto', arquivo.file, arquivo.name);
      } else {
        formulario.append('foto', { uri: arquivo.uri, name: arquivo.name, type: arquivo.mimeType || 'application/octet-stream' });
      }
      const { fotoPerfil } = await apiAutenticada('/usuarios/me/foto', { method: 'PUT', body: formulario });
      setUsuario(atual => atual?.id === usuario.id ? { ...atual, fotoPerfil } : atual);
    } catch (falha) {
      setErroFoto(falha.message || 'Não foi possível alterar a foto.');
    } finally {
      selecionandoFoto.current = false;
      setSalvandoFoto(false);
    }
  }

  async function sair() {
    try {
      await apiAutenticada('/auth/logout', {
        method: 'POST'
      });
    } catch {
      // A sessão local deve ser encerrada mesmo se o servidor estiver indisponível.
    }
    await encerrarSessao();
    setModalSair(false);
    router.replace('/auth/login');
  }
  return <TelaAnimada style={estilos.recipiente} atraso={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilosCompartilhados.espacamentoInferior120}>
        {/* Perfil */}
        <CartaoAnimado style={estilos.perfilRecipiente} atraso={40}>
          <View style={estilos.perfilCirculo}>
            <AvatarPerfil foto={usuario?.fotoPerfil} tamanho={60} cor={cores.textoPrincipal} />
          </View>

          <View style={estilos.perfilInformacoes}>
            <Text style={estilos.nome}>{usuario?.nome || 'Usuário'}</Text>

            <Text style={estilos.email}>{usuario?.email || ''}</Text>
            <TouchableOpacity accessibilityRole="button" disabled={!usuario || salvandoFoto} onPress={alterarFoto} style={{ minHeight: 44, justifyContent: 'center' }}>
              <Text style={{ color: cores.textoLink, fontWeight: '700' }}>
                {salvandoFoto ? 'Salvando foto…' : usuario?.fotoPerfil ? 'Alterar foto' : 'Adicionar foto'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={estilos.settingsBotao} onPress={() => router.push('/configuracoes')}>
            <Icon name="settings" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>
        </CartaoAnimado>

        {erroFoto ? <Text accessibilityLiveRegion="polite" style={estilosCompartilhados.erroTexto}>{erroFoto}</Text> : null}

        {/* Resumo */}

        <CartaoAnimado style={estilos.resumoCartao} atraso={120}>
          <Text style={estilos.resumoTitulo}>Resumo da conta</Text>
          <View style={estilos.resumoLinha}>
            <>
              <View style={estilos.itemResumo}>
                <Icon name="account-balance-wallet" size={35} color={cores.primaria} />
                <Text style={estilos.rotuloResumo}>Disponível</Text>
                <Text style={estilos.valorResumo}>{formatarReais(dados.saldoDisponivel)}</Text>
              </View>

              <View style={estilos.itemResumo}>
                <Icon name="trending-up" size={35} color={cores.sucesso} />
                <Text style={estilos.rotuloResumo}>Receitas</Text>
                <Text style={[estilos.valorResumo, estilosCompartilhados.positivoTexto]}>
                  {formatarReais(totais.totalReceitas)}
                </Text>
              </View>

              <View style={estilos.itemResumo}>
                <Icon name="trending-down" size={35} color={cores.perigo} />
                <Text style={estilos.rotuloResumo}>Despesas</Text>
                <Text style={[estilos.valorResumo, estilosCompartilhados.negativoTexto]}>
                  {formatarReais(totais.totalDespesas)}
                </Text>
              </View>

              <View style={estilos.itemResumo}>
                <Icon name="savings" size={35} color={cores.primaria} />
                <Text style={estilos.rotuloResumo}>Resultado mensal</Text>
                <Text style={estilos.valorResumo}>
                  {formatarReais(totais.totalReceitas - totais.totalDespesas)}
                </Text>
              </View>
            </>
          </View>
        </CartaoAnimado>

        {/* Menu */}

        <CartaoAnimado style={estilos.menuCartao} atraso={180}>
          <TouchableOpacity style={estilos.itemMenu} onPress={() => router.push('/menus/meuCadastro')}>
            <View style={estilos.itemEsquerda}>
              <Icon name="person-outline" size={24} color={cores.textoPrincipal} />
              <Text style={estilos.itemTexto}>Meu cadastro</Text>
            </View>
            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>

          <TouchableOpacity style={estilos.itemMenu} onPress={() => router.push('/painel')}>
            <View style={estilos.itemEsquerda}>
              <Icon name="bar-chart" size={24} color={cores.textoPrincipal} />
              <Text style={estilos.itemTexto}>Painel financeiro</Text>
            </View>
            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>

          <TouchableOpacity style={estilos.itemMenu} onPress={() => router.push('/menus/centralAjuda')}>
            <View style={estilos.itemEsquerda}>
              <Icon name="support-agent" size={24} color={cores.textoPrincipal} />
              <Text style={estilos.itemTexto}>Central de ajuda</Text>
            </View>
            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>

          <TouchableOpacity style={estilos.itemMenu} onPress={() => router.push('/menus/sobreApp')}>
            <View style={estilos.itemEsquerda}>
              <Icon name="info-outline" size={24} color={cores.textoPrincipal} />
              <Text style={estilos.itemTexto}>Sobre o aplicativo</Text>
            </View>
            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>

          <TouchableOpacity style={estilos.itemMenu} onPress={() => setModalSair(true)}>
            <View style={estilos.itemEsquerda}>
              <Icon name="logout" size={24} color={cores.perigo} />

              <Text style={[estilos.itemTexto, { color: cores.perigo }]}>Encerrar sessão</Text>
            </View>

            <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
          </TouchableOpacity>
        </CartaoAnimado>
      </ScrollView>

      {/* Modal de confirmação */}

      <Modal visible={modalSair} transparent animationType="fade" onRequestClose={() => setModalSair(false)}>
        <ScrollView contentContainerStyle={[estilos.modalFundo, {
        flex: undefined,
        flexGrow: 1,
        paddingVertical: 32
      }]}>
          <View style={estilos.modal}>
            <View style={estilos.modalIcone}>
              <Icon name="logout" size={40} color={cores.sobrePrimaria} />
            </View>

            <Text accessibilityRole="header" style={estilos.modalTitulo}>Sair da conta?</Text>

            <Text style={estilos.modalTexto}>Você poderá entrar novamente quando quiser.</Text>

            <View style={estilos.modalBotoes}>
              <TouchableOpacity style={[estilos.sair, { backgroundColor: cores.primaria }]} onPress={() => setModalSair(false)}>
                <Text style={estilos.sairTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={estilos.cancelar} onPress={sair}>
                <Text style={[estilos.cancelarTexto, { color: cores.perigo }]}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>

      <BarraNavegacao />
    </TelaAnimada>;
}
