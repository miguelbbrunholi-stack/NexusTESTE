# Estrutura do Projeto Nexus Finance

```text
NexusTESTE/
├── NexusFinance/
│   ├── src/
│   │   ├── app/              # Telas e layouts do Expo Router
│   │   │   ├── (tabs)/
│   │   │   ├── auth/
│   │   │   ├── despesa/
│   │   │   ├── menus/
│   │   │   └── receita/
│   │   ├── componentes/      # Componentes reutilizáveis
│   │   ├── contextos/        # Sessão e tema
│   │   ├── ganchos/          # Hooks
│   │   ├── servicos/         # API e operações do aplicativo
│   │   ├── style/
│   │   │   └── style.js      # Estilos compartilhados
│   │   └── tema/             # Paletas
│   ├── assets/               # Recursos estáticos
│   └── README.md
├── backend/
│   ├── src/
│   │   ├── bancoDados/       # Conexão MySQL e migração
│   │   ├── config/           # Configuração por ambiente
│   │   ├── middlewares/      # Autenticação e tratamento de erros
│   │   ├── rotas/            # Endpoints HTTP
│   │   ├── servicos/         # Regras financeiras, e-mail e anexos
│   │   ├── utilitarios/      # Validações
│   │   ├── aplicativo.ts     # Composição do Express
│   │   └── servidor.ts       # Inicialização da API
│   └── README.md
├── bancoDados/
│   ├── estrutura.sql         # Criação inicial do banco
│   └── seed_teste_completo_usuario_1.sql
└── docs/
    ├── DOCUMENTACAO_FUNCIONALIDADES.md
    └── ESTRUTURA_PROJETO.md
```

## Convenções

Mantenha apenas telas e layouts em `NexusFinance/src/app/`: todo arquivo nessa pasta participa da navegação. Componentes e estilos ficam em suas pastas próprias.

O backend compila o código de `src/` para `dist/`.

As configurações Expo, TypeScript, ESLint, Vercel e EAS ficam na raiz de `NexusFinance/`. Os arquivos de ambiente, dependências instaladas, anexos e dados locais permanecem em seus locais de execução.

A migração pode ser executada com `npm run migrar` no backend ou, após compilar, com `node dist/bancoDados/migrar.js`.
