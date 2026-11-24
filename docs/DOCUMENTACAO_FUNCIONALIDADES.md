# Guia do Nexus Finance

O Nexus Finance reúne receitas, despesas, metas de economia e relatórios em uma conta pessoal. O aplicativo usa Expo e React Native para web, Android e iOS. A API Express em TypeScript valida as operações, calcula os indicadores e persiste os dados no MySQL.

## Instalação local

1. Inicie o MySQL. Em uma instalação nova, importe [estrutura.sql](../bancoDados/estrutura.sql). O script recria o banco. Para uma instalação existente, preserve os dados e execute somente a migração.
2. Configure o arquivo `backend/.env` conforme o [guia da API](../backend/README.md). No diretório `backend`, execute `npm install`, `npm run migrate` e `npm run dev`. A migração adiciona a coluna da foto às contas existentes.
3. No diretório `NexusFinance`, execute `npm install` e `npm run web` para abrir no navegador. Use `npm start` para abrir o Expo e acessar pelo celular.
4. No navegador local, a API padrão é `http://localhost:3000`. Em um celular físico, configure `EXPO_PUBLIC_API_URL` no arquivo `NexusFinance/.env` com o IPv4 e a porta do computador. Para web em outra origem, inclua a origem do frontend em `APP_ORIGINS`.

## Frontend

| Tela ou recurso | Comportamento |
| --- | --- |
| Entrada e autenticação | Boas-vindas, cadastro em etapas, login e recuperação de senha por código enviado por e-mail. A sessão é restaurada ao reabrir o app. |
| Início | Exibe o saldo disponível, valores realizados e a previsão mensal. Ações rápidas abre Nova receita, Nova despesa ou Painel financeiro. Próximas conquistas mostra até três metas ativas com maior avanço. |
| Nova receita e Nova despesa | O formulário registra valor, descrição, data, categoria, tipo de conta, status e observação. Permite anexar comprovante e escolher recorrência mensal ou parcelamento quando aplicável. Receitas suportam aporte em meta segundo as regras da API. |
| Fluxo Financeiro | As abas Geral, Receitas e Despesas usam os mesmos dados. Os filtros de status, categoria, conta e data são combinados. O período oferece Todo o período, Este mês, Mês passado ou limites personalizados e inclusivos. É possível informar somente um limite. A lista resultante tem até dez transações por página e mantém os cabeçalhos de mês. Lançamentos pendentes elegíveis podem ser confirmados nessa tela. |
| Metas | Permite criar, editar e excluir uma meta. Em andamento lista objetivos ativos abaixo de 100%. Concluídas mostra os objetivos alcançados. Reta final é um subconjunto de Em andamento com avanço estritamente maior que 75%. Cada aba exibe até cinco metas por página. |
| Painel financeiro | Exibe indicadores, distribuição por categoria, histórico e comparações. Permite configurar o limite geral de gastos e exportar o relatório em PDF. |
| Categoria | Apresenta categorias financeiras por tipo de lançamento. A categoria personalizada é cadastrada no formulário de receita ou despesa. |
| Perfil e Meu cadastro | O perfil reúne a foto, o resumo financeiro e atalhos da conta. Em Adicionar foto ou Alterar foto, selecione JPG ou PNG de até 2 MB. A foto aparece também no Início e em Meu cadastro, onde se editam nome, e-mail, telefone e data de nascimento. |
| Configurações | Permite alterar tema e avisos financeiros, exportar transações em CSV e enviar uma solicitação de exclusão da conta. A solicitação passa por análise. |
| Notificações e ajuda | Notificações lista os avisos do usuário e permite marcá-los como lidos. Central de ajuda e Sobre o aplicativo ficam no menu de perfil. |

Os campos de data aceitam digitação no formato DD/MM/AAAA e seleção por calendário. O calendário usa as cores do tema e é compartilhado entre os formulários e o filtro. Nos diálogos de confirmação, Cancelar recebe o preenchimento primário. A ação de encerrar a sessão aparece em destaque no menu do perfil.

### Organização do código

- `src/app` contém os arquivos de rota do Expo Router. `_layout.jsx` fornece os contextos e `index.jsx` direciona a entrada do aplicativo conforme a sessão.
- `src/componentes` centraliza elementos compartilhados. `AbasLista` e `Paginacao` atendem às duas listas. `CampoData` formata a entrada e abre `Calendario`. `AvatarPerfil` exibe a foto ou o ícone padrão.
- `src/contextos` mantém sessão e tema. O token fica no SecureStore em Android e iOS e no armazenamento local do navegador na web. A sessão guarda o usuário retornado pela API, incluindo a foto.
- `src/ganchos` reúne a consulta do resumo financeiro e os dados necessários aos formulários de lançamento. `src/servicos` contém autenticação, HTTP, máscaras, validações, exportação CSV e relatório PDF.
- `src/style/style.js` concentra estilos por tela. `src/tema/paletas.js` fornece as cores dos temas.

## Backend

`servidor.ts` verifica a conexão com o banco, inicia o processamento de recorrências e abre a porta HTTP. `aplicativo.ts` reúne CORS, limites de entrada, roteamento e respostas de erro. `middlewares/autenticacao.ts` verifica o JWT e fornece o identificador do usuário às rotas protegidas. Os serviços implementam o cálculo financeiro, operações de transação, geração de recorrências, manipulação de anexos e envio de e-mails. O pool em `bancoDados/bancoDados.ts` executa consultas parametrizadas.

| Área | Rotas |
| --- | --- |
| Diagnóstico | `GET /` |
| Autenticação e sessão | `POST /auth/cadastro`, `POST /auth/login`, `GET /auth/sessao`, `POST /auth/logout` |
| Recuperação | `POST /auth/recuperar-senha`, `POST /auth/validar-codigo`, `POST /auth/nova-senha` |
| Finanças | `GET /financeiro/resumo`, `GET/POST /financeiro/transacoes`, `PATCH /financeiro/transacoes/:id/confirmar` |
| Opções e anexos | `GET /financeiro/opcoes?tipo=Receita` ou `Despesa`, `POST /financeiro/categorias`, `GET /financeiro/anexos/:id` |
| Metas | `GET/POST /metas`, `PUT/DELETE /metas/:id` |
| Usuário e foto | `GET/PUT /usuarios/me`, `PUT /usuarios/me/foto` |
| Preferências e notificações | `GET/PUT /configuracoes`, `GET /notificacoes`, `PATCH /notificacoes/:id/lida` |
| Direitos do titular | `GET/POST /privacidade/solicitacoes` |

As rotas protegidas recebem `Authorization: Bearer <token>`. Mensagens de erro chegam no campo `mensagem`. Na recuperação de senha, o código expira em 15 minutos e é armazenado como HMAC. Veja os campos dos lançamentos e as opções de ambiente no [guia da API](../backend/README.md).

### Dados e regras

- **Transações.** Contas, categorias, tipos e status classificam cada lançamento. Recorrências geram pendências até o fim do mês atual, respeitando o calendário e o término da regra. Parcelamentos dividem o total em lançamentos mensais. Comprovantes ficam no diretório de uploads com metadados no banco.
- **Resumo.** O saldo total considera contas e transações confirmadas até hoje. O saldo disponível desconta as reservas das metas. A previsão acrescenta pendências e lançamentos futuros até o fim do mês. A API produz os totais para manter todas as telas coerentes.
- **Metas.** `metas` define o objetivo. `movimentacoes_metas` registra os valores guardados. O backend calcula o estado da meta durante gravações e aportes. A interface calcula o percentual e distribui os itens pelas abas.
- **Perfil.** `PUT /usuarios/me/foto` recebe `multipart/form-data` com um único arquivo no campo `foto`. A API limita o tamanho a 2 MiB, verifica a assinatura JPG ou PNG e atualiza `usuarios.foto_perfil_binaria` para o titular do token. A resposta contém `fotoPerfil` como URI de dados. Login e restauração de sessão retornam o mesmo campo.
- **Paginação.** A interface aplica os filtros e pagina o resultado localmente. Os endpoints de leitura preservam as listas completas usadas pelo resumo, pelas opções de filtro e pelas exportações.
- **Privacidade.** Preferências e notificações são vinculadas à conta. As solicitações de privacidade ficam registradas para análise e tratamento pelo responsável.

## Verificação

- Em `backend`, execute `npm run build` para compilar o TypeScript.
- Em `NexusFinance`, execute `npm run lint` e `npm run build` para verificar estilo e gerar a versão web.
- Com um banco de teste, use mais de dez transações e mais de cinco metas em uma aba. Confira a navegação entre páginas, a volta à primeira página após trocar filtro e os estados sem resultados.
- Confira o dia inicial e final de um intervalo, uma data inválida como 31/02 e o limite de 75% exatos em Reta final. Abra o calendário no filtro e em um formulário com tema claro e escuro.
- Entre com uma conta de teste, envie uma foto e reabra o app. Troque por outro arquivo e confira o avatar nas três telas. Teste também arquivo maior que o limite e extensão ou conteúdo incompatível.
