# Sistema de Controle de Gastos Residenciais

Aplicação full stack para controle de gastos residenciais, separada em **Web API** (Back-end em .NET) e **Front-end** (React + TypeScript), com persistência em MySQL.

## Visão geral

O sistema permite cadastrar pessoas, categorias e transações financeiras, além de consultar relatórios consolidados por pessoa e por categoria.

## Arquitetura do projeto

```text
Controle-Gastos/
├── Back-end/      # API REST em ASP.NET Core + Entity Framework Core
└── Front-end/     # SPA em React + TypeScript + Vite
```

## Tecnologias utilizadas

### Back-end

- C#
- .NET 9 (ASP.NET Core Web API)
- Entity Framework Core 9
- Pomelo.EntityFrameworkCore.MySql
- Scalar/OpenAPI (documentação da API em ambiente de desenvolvimento)

### Front-end

- React 19
- TypeScript
- Vite
- Axios
- React Router
- Tailwind CSS

### Persistência

- MySQL 8
- Docker Compose para subir o banco localmente
- Migrations do EF Core versionadas no projeto

---

## Regras de negócio implementadas

### Pessoas

- Cadastro completo: criação, edição, deleção e listagem.
- Campos:
  - `Id` (gerado automaticamente)
  - `Name` (máximo 200)
  - `Age`
- Ao excluir pessoa, suas transações são removidas automaticamente (cascade delete).

### Categorias

- Cadastro com criação e listagem.
- Campos:
  - `Id` (gerado automaticamente)
  - `Description` (máximo 400)
  - `Purpose` (`Despesa`, `Receita`, `Ambas`)

### Transações

- Cadastro com criação e listagem.
- Campos:
  - `Id` (gerado automaticamente)
  - `Description` (máximo 400)
  - `Value` (número positivo)
  - `Type` (`Despesa` ou `Receita`)
  - `CategoryId`
  - `PersonId`

Validações aplicadas:

- pessoa informada deve existir;
- categoria informada deve existir;
- **menores de 18 anos só podem ter transações do tipo despesa**;
- categoria deve ser compatível com o tipo da transação (ex.: tipo `Despesa` não aceita categoria com finalidade `Receita`).

### Relatórios

- Totais por pessoa:
  - total de receitas;
  - total de despesas;
  - saldo (`receitas - despesas`);
  - total geral consolidado.
- Totais por categoria:
  - total de receitas;
  - total de despesas;
  - saldo;
  - total geral consolidado.

---

## Endpoints principais da API

Base URL: `http://localhost:5000/api`

### Pessoas

- `GET /api/Persons`
- `GET /api/Persons/{id}`
- `POST /api/Persons`
- `PUT /api/Persons/{id}`
- `DELETE /api/Persons/{id}`

### Categorias

- `GET /api/Categories`
- `GET /api/Categories/{id}`
- `POST /api/Categories`

### Transações

- `GET /api/Transactions`
- `GET /api/Transactions/{id}`
- `POST /api/Transactions`

### Relatórios

- `GET /api/Reports/totals-by-person`
- `GET /api/Reports/totals-by-category`

---

## Como executar localmente

## 1) Pré-requisitos

- .NET SDK 9
- Node.js 20+
- npm
- Docker Desktop (para o MySQL)

## 2) Subir banco MySQL

No diretório `Back-end/Infra`:

```bash
docker compose up -d
```

Isso cria o banco `desafio_tecnico` com volume persistente (`mysql_data`).

## 3) Configurar e iniciar Back-end

No diretório `Back-end`:

```bash
dotnet restore
dotnet ef database update
dotnet run
```

API disponível em:

- `http://localhost:5000`

Documentação OpenAPI/Scalar (em Development):

- `http://localhost:5000/scalar/v1`

## 4) Configurar e iniciar Front-end

No diretório `Front-end`:

```bash
npm install
npm run dev
```

Aplicação disponível em (padrão do Vite):

- `http://localhost:5173`

> Observação: o front já está configurado para consumir a API em `http://localhost:5000/api`.

---

## Persistência de dados

A persistência é feita em MySQL.

- Dados permanecem após reinicialização da aplicação.
- Ao usar Docker Compose, os dados são mantidos no volume `mysql_data`.

---

## Funcionalidades da interface

- Tela de pessoas com criação, edição, remoção e filtros.
- Tela de categorias com criação e listagem com filtros.
- Tela de transações com validações de negócio no front e no back-end.
- Tela de relatórios com totais por pessoa, por categoria e consolidado geral.

---

## Próximos passos

- Adicionar testes automatizados (API e front-end).
- Melhorar observabilidade com logs estruturados.
- Evoluir UX com paginação, ordenação e estados de carregamento/erro mais detalhados.
