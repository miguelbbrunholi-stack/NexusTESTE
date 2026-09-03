# Deploy NexusFinance on Vercel

Este repositório está preparado para publicar **frontend Expo Web + API FastAPI no mesmo projeto Vercel**.

## Estrutura usada pela Vercel

- `NexusFinance/` → aplicativo Expo Router para Web.
- `NexusFinance/dist/` → saída estática gerada pelo build.
- `api/index.py` → entrada da API FastAPI.
- `backend/` → código da API.
- `/api/v1/*` → endpoints do backend no mesmo domínio do frontend.

## 1. Importar no Vercel

Ao criar o projeto a partir do GitHub:

- **Root Directory:** `ProjetoNexus` (raiz do repositório)
- **Framework Preset:** `Other`
- Não coloque `NexusFinance` como Root Directory neste projeto combinado.
- O arquivo `vercel.json` da raiz já define install, build, output e função Python.

O GitHub precisa conter estes arquivos na raiz:

```text
api/index.py
requirements.txt
.python-version
vercel.json
```

## 2. Banco de dados

O backend rejeita SQLite em produção. Crie/tenha um **MySQL ou MariaDB acessível pela internet** e configure no Vercel:

```text
DATABASE_URL=mysql+pymysql://USUARIO:SENHA@HOST:3306/nexus_finance?charset=utf8mb4
ENVIRONMENT=production
STORAGE_DIR=/tmp/nexus-storage
TIME_ZONE=America/Sao_Paulo
SESSION_DAYS=7
```

Se a senha tiver caracteres especiais, faça URL-encode dela.

Para o primeiro deploy, configure essas variáveis em **Production** e faça um novo deploy.

### Migrações

As tabelas precisam existir no banco antes de usar o aplicativo. O projeto possui migrações Alembic e o comando de inicialização é:

```bash
python -m nexus.cli init-db
```

Execute esse comando a partir de um ambiente confiável, apontando `DATABASE_URL` para o banco de produção. Não execute `SQL.txt` novamente em um banco que já tenha dados: o SQL original contém comandos destrutivos.

## 3. Frontend e API

Não é necessário configurar `EXPO_PUBLIC_API_URL` quando frontend e backend estiverem no mesmo projeto Vercel. No Web, o aplicativo usa automaticamente:

```text
https://SEU-DOMINIO.vercel.app/api/v1
```

Se o backend for hospedado separadamente, aí sim defina `EXPO_PUBLIC_API_URL` com a URL pública base da API, incluindo `/api/v1`.

## 4. E-mail de recuperação de senha

Para recuperação por e-mail, configure também:

```text
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
SMTP_STARTTLS=true
```

Nunca coloque senhas ou outras credenciais no GitHub ou neste ZIP.

## 5. Arquivos enviados

O Vercel só oferece armazenamento gravável temporário em `/tmp`. O projeto já usa `/tmp/nexus-storage` quando detecta o ambiente Vercel. Arquivos enviados pelo usuário não devem ser considerados permanentes; para persistência, use armazenamento de objetos externo.

## 6. Teste depois do deploy

Depois de publicar, abra:

```text
https://SEU-DOMINIO.vercel.app/docs
https://SEU-DOMINIO.vercel.app/health
```

- `/docs` abrir → a função FastAPI está sendo encontrada.
- `/health` retornar `{"status":"ok", ...}` → API e banco estão acessíveis.
- `/docs` funcionar e `/health` falhar → confira `DATABASE_URL` e as migrações do banco.
