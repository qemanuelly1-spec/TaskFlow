# TaskFlow

Sistema completo de gerenciamento de tarefas, desenvolvido como projeto de estudo para praticar desenvolvimento **full stack**.

## Tecnologias

**Backend**
- C#
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- PostgreSQL
- Swagger (documentação/testes da API)

**Frontend**
- HTML5
- CSS3
- JavaScript (fetch API)
- Bootstrap 5

## Funcionalidades

- ➕ Criar tarefa
- 📋 Listar tarefas
- ✏️ Editar tarefa
- ✅ Marcar como concluída / reabrir
- 🗑️ Excluir tarefa
- 🔎 Filtrar por: todas / pendentes / concluídas

## Arquitetura

```
Frontend (HTML/CSS/JS)  →  API REST (ASP.NET Core)  →  PostgreSQL
```

## Estrutura do projeto

```
TaskFlow/
│
├── backend/
│   ├── database.sql                 # script SQL alternativo (sem migrations)
│   └── TaskFlow.Api/
│       ├── Controllers/
│       │   └── TarefasController.cs
│       ├── Models/
│       │   └── Tarefa.cs
│       ├── DTOs/
│       │   └── TarefaDto.cs
│       ├── Data/
│       │   └── AppDbContext.cs
│       ├── Properties/
│       │   └── launchSettings.json
│       ├── Program.cs
│       ├── appsettings.json
│       └── TaskFlow.Api.csproj
│
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/tarefas.js
│
├── README.md
└── .gitignore
```

## Como rodar o projeto

Veja o passo a passo completo na conversa ou no arquivo `COMO_RODAR.md` (mesmo conteúdo, para consulta rápida).

## Endpoints da API

| Método | Rota                        | Descrição                          |
|--------|------------------------------|-------------------------------------|
| GET    | /api/tarefas                | Lista todas as tarefas              |
| GET    | /api/tarefas?concluida=true | Filtra por concluídas/pendentes     |
| GET    | /api/tarefas/{id}           | Busca uma tarefa por Id             |
| POST   | /api/tarefas                | Cria uma nova tarefa                |
| PUT    | /api/tarefas/{id}           | Atualiza uma tarefa existente       |
| PATCH  | /api/tarefas/{id}/concluir  | Alterna concluída/pendente          |
| DELETE | /api/tarefas/{id}           | Remove uma tarefa                   |

## Exemplo de body (POST/PUT)

```json
{
  "titulo": "Estudar API",
  "descricao": "Aprender ASP.NET Core",
  "concluida": false
}
```

## Próximos passos (evolução do projeto)

- Autenticação/login (JWT)
- Paginação na listagem
- Testes automatizados (xUnit)
- Deploy (Azure, Render, Railway etc.)
