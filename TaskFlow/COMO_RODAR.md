# Como rodar o TaskFlow

## Pré-requisitos

- [.NET SDK 8.0](https://dotnet.microsoft.com/download) instalado (`dotnet --version` para conferir)
- [PostgreSQL](https://www.postgresql.org/download/) instalado e rodando
- (Opcional) [DBeaver](https://dbeaver.io/) ou pgAdmin para visualizar o banco
- Git instalado

## Passo 1 — Criar o banco de dados

Abra o `psql` ou seu cliente de banco preferido e crie o banco:

```sql
CREATE DATABASE taskflow;
```

## Passo 2 — Configurar a connection string

Abra `backend/TaskFlow.Api/appsettings.json` e ajuste usuário/senha:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=taskflow;Username=postgres;Password=SUA_SENHA_AQUI"
}
```

## Passo 3 — Restaurar pacotes e criar a tabela (via EF Core Migrations)

No terminal, dentro de `backend/TaskFlow.Api`:

```bash
cd backend/TaskFlow.Api
dotnet restore
dotnet tool install --global dotnet-ef   # apenas na primeira vez, se ainda não tiver
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Isso cria a tabela `tarefas` automaticamente no PostgreSQL.

> Alternativa: se preferir não usar Migrations, rode manualmente o script `backend/database.sql` no seu banco.

## Passo 4 — Rodar a API

Ainda dentro de `backend/TaskFlow.Api`:

```bash
dotnet run
```

A API vai subir em `http://localhost:5000`. O Swagger abre automaticamente na raiz (`http://localhost:5000/`), onde você pode testar todos os endpoints.

## Passo 5 — Rodar o frontend

O frontend é só HTML/CSS/JS puro, não precisa de build. Duas opções:

**Opção A — Abrir direto no navegador**
Dê duplo clique em `frontend/index.html`.

**Opção B — Usar um servidor local (recomendado, evita problemas de CORS/caminhos)**
Se tiver a extensão **Live Server** no VS Code, clique com o botão direito em `index.html` → "Open with Live Server".

Ou, com Python instalado:

```bash
cd frontend
python -m http.server 5500
```

E acesse `http://localhost:5500`.

> ⚠️ Se a API estiver rodando em uma porta diferente de 5000, ajuste a constante `API_URL` no arquivo `frontend/js/tarefas.js`.

## Passo 6 — Testar

1. Com a API e o frontend rodando, abra o frontend no navegador.
2. Crie uma tarefa pelo formulário.
3. Veja ela aparecer na lista.
4. Teste editar, concluir e excluir.
5. Teste os filtros (Todas / Pendentes / Concluídas).

## Passo 7 — Subir para o GitHub

Na raiz do projeto (`TaskFlow/`):

```bash
git init
git add .
git commit -m "Projeto inicial: TaskFlow - API C# + frontend"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/TaskFlow.git
git push -u origin main
```

Pronto — projeto completo, funcional e organizado no seu portfólio. 🎉

## Solução de problemas comuns

| Problema | Causa provável | Solução |
|---|---|---|
| `dotnet: command not found` | .NET SDK não instalado | Instale o SDK 8.0 |
| Erro de conexão com o banco | Senha/usuário errados ou Postgres não está rodando | Confira `appsettings.json` e se o serviço do Postgres está ativo |
| Frontend não carrega as tarefas | API não está rodando, ou porta diferente | Confira `API_URL` em `tarefas.js` e se `dotnet run` está ativo |
| Erro de CORS no navegador | Frontend aberto em domínio diferente sem CORS liberado | O `Program.cs` já libera CORS para qualquer origem; confirme que a API foi reiniciada após qualquer alteração |
