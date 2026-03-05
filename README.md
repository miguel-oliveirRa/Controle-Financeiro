<div align="center">

# 💰 Sistema de Controle Financeiro

**Aplicação full-stack para gestão de finanças pessoais com regras de negócio e validações robustas**

![Skills Icons](https://skillicons.dev/icons?i=dotnet,cs,react,ts,mysql,tailwind,docker)

[🚀 Demo](#-como-executar) • [🛠️ Tecnologias](#-tecnologias) • [💡 Decisões Técnicas](#-decisões-técnicas)

</div>

---

## 🎯 Sobre o Projeto

Sistema de controle financeiro desenvolvido para demonstrar **arquitetura full-stack moderna** com foco em:

- ✅ **Validações de negócio** no backend e frontend
- ✅ **Relacionamentos de banco** com cascade delete
- ✅ **Queries otimizadas** usando EF Core Include()
- ✅ **UX moderna** com toast notifications e validações em tempo real
- ✅ **API REST documentada** com OpenAPI/Scalar

### Regras de Negócio Implementadas

🔹 **Gestão de Pessoas**: CRUD completo com cascade delete de transações relacionadas  
🔹 **Categorias Flexíveis**: Despesa, Receita ou Ambas  
🔹 **Validação de Menores**: Pessoas < 18 anos só podem registrar despesas  
🔹 **Compatibilidade**: Categorias devem ser compatíveis com tipo da transação  
🔹 **Relatórios**: Totalizadores consolidados por pessoa e categoria

---

## 🛠️ Tecnologias

### Backend

```
ASP.NET Core 9          → Web API REST
Entity Framework Core   → ORM com migrations
MySQL                → Banco relacional
Pomelo.EFCore.MySql    → Provider MySQL
Scalar                  → Documentação OpenAPI
```

### Frontend

```
React            → UI components
TypeScript             → Type safety
Vite                   → Build tool
Axios                  → HTTP client
React Router           → Navegação
Tailwind CSS           → Estilização
React Hot Toast        → Notificações
```

### DevOps

```
Docker Compose         → Containerização MySQL
EF Core Migrations     → Versionamento de schema
```

---

## 💡 Decisões Técnicas

### Por que .NET 9?

Última versão LTS com performance otimizada e suporte completo ao EF Core 9.

### Por que Entity Framework Core?

- Migrations versionadas facilitam deploy
- Include() otimiza queries N+1
- Change Tracker simplifica updates

### Por que React + TypeScript?

TypeScript previne bugs em tempo de desenvolvimento. React oferece componentização e reatividade.

### Por que Tailwind?

Produtividade: estilização inline sem context switching. Resultado: UI moderna em menos tempo.

### Arquitetura de Dados

```
Person (1) ----< (N) Transaction >---- (1) Category
```

**Relacionamentos e Regras:**

🔹 **Person (CRUD Completo)**

- Deletar pessoa → Cascade delete remove todas transações automaticamente
- Protege integridade: transações órfãs são impossíveis

🔹 **Category (Apenas Criação e Leitura)**

- Sem endpoints de UPDATE ou DELETE
- Categorias são permanentes para manter histórico
- Garante rastreabilidade de transações antigas

🔹 **Transaction (Apenas Criação e Leitura)**

- Sem endpoints de UPDATE ou DELETE
- Registros imutáveis garantem auditoria
- Única forma de deletar: via cascade ao deletar pessoa

**Configuração no EF Core:**

```csharp
// Cascade delete: Person → Transactions
modelBuilder.Entity<Transaction>()
    .HasOne(t => t.Person)
    .WithMany(p => p.Transactions)
    .HasForeignKey(t => t.PersonId)
    .OnDelete(DeleteBehavior.Cascade);

// Restrict delete: Category → Transactions (proteção)
modelBuilder.Entity<Transaction>()
    .HasOne(t => t.Category)
    .WithMany(c => c.Transactions)
    .HasForeignKey(t => t.CategoryId)
    .OnDelete(DeleteBehavior.Restrict);
```

**Por que Restrict em Category?**
Mesmo sem endpoint DELETE, a configuração Restrict protege contra:

- Deleções diretas no banco de dados
- Queries SQL manuais acidentais
- Futura implementação de soft-delete

---

## 🚧 Desafios Enfrentados

### 1. Problema N+1 Queries

**Situação**: Frontend fazia 3 chamadas HTTP (transactions, persons, categories) e depois `find()` manual.

**Solução**: Implementei `.Include()` no backend para trazer dados relacionados em 1 query.

**Resultado**: Redução de 100+ queries para 1 query única.

### 2. Conversão PascalCase ↔ camelCase

**Situação**: Backend .NET retorna PascalCase, frontend espera camelCase.

**Solução**: Configurei `JsonNamingPolicy.CamelCase` no backend ao invés de converter no frontend.

**Resultado**: Remoção de 40 linhas de código complexo de conversão.

---

## 🚀 Como Executar

### Pré-requisitos

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### 1️⃣ Clonar repositório

```bash
git clone https://github.com/miguel-oliveirRa/Controle-Financeiro.git
cd Controle-Financeiro
```

### 2️⃣ Subir banco de dados

```bash
cd Back-end/Infra
docker compose up -d
```

### 3️⃣ Configurar backend

```bash
cd ../
dotnet restore
dotnet ef database update
dotnet run
```

✅ API disponível em `http://localhost:5000`  
📚 Documentação em `http://localhost:5000/scalar/v1`

### 4️⃣ Configurar frontend

```bash
cd ../Front-end
npm install
npm run dev
```

✅ Aplicação disponível em `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
Controle-Financeiro/
├── Back-end/
│   ├── Controllers/         # Endpoints da API
│   ├── Models/             # Entidades do domínio
│   ├── Migrations/         # Versionamento do schema
│   ├── Infra/              # Docker Compose
│   └── Program.cs          # Configuração da aplicação
│
└── Front-end/
    ├── src/
    │   ├── pages/          # Componentes de página
    │   ├── services/       # API client (Axios)
    │   ├── types/          # Interfaces TypeScript
    │   └── utils/          # Helpers e validações
    └── package.json
```

---

## 📚 Endpoints da API

<<<<<<< HEAD
### Pessoas

```http
GET    /api/Persons           # Listar todas
GET    /api/Persons/{id}      # Buscar por ID
POST   /api/Persons           # Criar nova
PUT    /api/Persons/{id}      # Atualizar
DELETE /api/Persons/{id}      # Deletar (cascade)
```

### Categorias

```http
GET    /api/Categories        # Listar todas
POST   /api/Categories        # Criar nova
```

### Transações

```http
GET    /api/Transactions      # Listar todas (com Include)
POST   /api/Transactions      # Criar nova (com validações)
```

### Relatórios

```http
GET    /api/Reports/totals-by-person    # Totais por pessoa
GET    /api/Reports/totals-by-category  # Totais por categoria
```

---

## 🧪 Testando a API

### Scalar UI

Acesse `http://localhost:5000/scalar/v1` para interface interativa.

### Exemplos com cURL

**Criar pessoa:**

```bash
curl -X POST http://localhost:5000/api/Persons \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","age":25}'
```

**Listar transações:**

```bash
curl http://localhost:5000/api/Transactions
```

---

## 🎨 Funcionalidades

- ✅ **CRUD completo** de pessoas com edição inline
- ✅ **Toast notifications** para feedback visual
- ✅ **Filtros dinâmicos** em todas listagens
- ✅ **Validações em tempo real** (frontend + backend)
- ✅ **Relacionamentos otimizados** com Include()
- ✅ **Cascade delete** automático
- ✅ **Relatórios consolidados** com totalizadores
- ✅ **Interface responsiva** mobile-first

---

## 📈 Possíveis Melhorias Futuras

- [ ] Testes unitários (xUnit) e integração
- [ ] Paginação e ordenação nas listagens
- [ ] Gráficos de evolução financeira
- [ ] Autenticação e multi-usuário
- [ ] Export de relatórios (PDF/Excel)
- [ ] Deploy automatizado (CI/CD)

---

## 👨‍💻 Autor

**Miguel Oliveira**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/seu-perfil)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/miguel-oliveirRa)

---

## 📄 Licença

Este projeto foi desenvolvido para fins de portfólio e aprendizado.
=======
- Tela de pessoas com criação, edição, remoção e filtros.
- Tela de categorias com criação e listagem com filtros.
- Tela de transações com validações de negócio no front e no back-end.
- Tela de relatórios com totais por pessoa, por categoria e consolidado geral.
>>>>>>> 16c6d992a266f03fbbc076ccef11c9b41ddd4ab0
