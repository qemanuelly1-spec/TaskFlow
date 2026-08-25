-- Script opcional: só é necessário se você NÃO usar as Migrations do EF Core.
-- Se usar "dotnet ef database update", essa tabela é criada automaticamente.

CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    concluida BOOLEAN NOT NULL DEFAULT FALSE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW()
);
