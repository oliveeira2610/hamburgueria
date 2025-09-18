# 🍔 Burger & Cia - Sistema Completo de Hamburgeria

## 📋 Visão Geral

O **Burger & Cia** é um sistema completo de e-commerce para hamburgeria, desenvolvido com arquitetura moderna separando frontend e backend. O sistema inclui autenticação de usuários, gerenciamento de pedidos, área administrativa e todas as funcionalidades necessárias para uma operação completa de delivery de hambúrgueres.

## 🏗️ Arquitetura do Projeto

```
burger-cia/
├── frontend/          # React + Vite Frontend
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── assets/        # Imagens e recursos
│   │   └── App.jsx        # Componente principal
│   ├── package.json
│   └── vite.config.js
├── backend/           # Node.js + Express Backend
│   ├── server.js          # Servidor principal
│   ├── database_schema.sql # Schema do banco de dados
│   ├── burger_cia.db      # Banco SQLite
│   └── package.json
└── README_COMPLETO.md
```

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **Vite** - Build tool moderna e rápida
- **React Router** - Navegação entre páginas
- **Lucide React** - Ícones modernos
- **Tailwind CSS** - Framework CSS utilitário

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite** - Banco de dados relacional
- **JWT (jsonwebtoken)** - Autenticação stateless
- **bcryptjs** - Criptografia de senhas
- **CORS** - Controle de acesso entre origens

## 🔐 Sistema de Autenticação

### Funcionalidades Implementadas
- ✅ **Registro de usuários** com validação
- ✅ **Login seguro** com JWT
- ✅ **Proteção de rotas** por middleware
- ✅ **Roles de usuário** (admin/user)
- ✅ **Sessão persistente** com localStorage
- ✅ **Logout** com limpeza de dados

### Usuários Padrão
- **Admin**: `admin@burgercia.com` / `admin123`
- **Usuário**: `joao@email.com` / `user123`

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### `users` - Usuários do Sistema
```sql
- id (INTEGER PRIMARY KEY)
- name (TEXT NOT NULL)
- email (TEXT UNIQUE NOT NULL)
- password (TEXT NOT NULL) -- Criptografada com bcrypt
- phone (TEXT)
- address (TEXT)
- role (TEXT DEFAULT 'user') -- 'user' ou 'admin'
- created_at (DATETIME)
```

#### `orders` - Pedidos Vinculados a Usuários
```sql
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER) -- FK para users
- customer_name (TEXT NOT NULL)
- customer_phone (TEXT)
- customer_email (TEXT)
- total_amount (DECIMAL)
- status (TEXT DEFAULT 'pending')
- delivery_address (TEXT)
- notes (TEXT)
- created_at (DATETIME)
```

#### Outras Tabelas
- `products` - Produtos do cardápio
- `categories` - Categorias de produtos
- `ingredients` - Ingredientes disponíveis
- `order_items` - Itens de cada pedido

## 🎯 Funcionalidades Principais

### Para Usuários Regulares
- 🏠 **Página inicial** com animações e design atrativo
- 📱 **Cardápio interativo** com produtos do banco de dados
- 🛒 **Carrinho de compras** funcional
- 🍔 **Monte seu hambúrguer** personalizado
- 👤 **Sistema de login/registro**
- 📦 **Histórico de pedidos** pessoais
- 🔒 **Checkout seguro** apenas para usuários logados

### Para Administradores
- 📊 **Dashboard** com estatísticas
- 📦 **Gerenciamento de produtos** (CRUD completo)
- 🛍️ **Gerenciamento de pedidos** com status
- 👥 **Gerenciamento de usuários** e roles
- 📈 **Relatórios de vendas** e métricas

## 🔌 APIs Implementadas

### Autenticação
- `POST /api/auth/register` - Registro de usuários
- `POST /api/auth/login` - Login de usuários
- `GET /api/auth/verify` - Verificação de token

### Produtos e Categorias
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto (admin)
- `PUT /api/products/:id` - Atualizar produto (admin)
- `DELETE /api/products/:id` - Excluir produto (admin)
- `GET /api/categories` - Listar categorias

### Pedidos
- `GET /api/orders` - Listar pedidos (filtrado por usuário)
- `POST /api/orders` - Criar pedido (requer login)
- `PUT /api/orders/:id/status` - Atualizar status (admin)

### Usuários (Admin)
- `GET /api/users` - Listar usuários (admin)
- `PUT /api/users/:id/role` - Alterar role (admin)

## 🛡️ Segurança Implementada

### Backend
- **JWT com expiração** de 24 horas
- **Senhas criptografadas** com bcrypt (salt 10)
- **Middleware de autenticação** em rotas protegidas
- **Middleware de autorização** para operações admin
- **Validação de dados** em todas as rotas
- **CORS configurado** para frontend

### Frontend
- **Rotas protegidas** com verificação de token
- **Redirecionamento automático** para login
- **Limpeza de dados** no logout
- **Verificação de role** para área admin
- **Tratamento de erros** de autenticação

## 🎨 Design e UX

### Características Visuais
- **Cores da marca**: Vermelho, amarelo, verde e branco
- **Tipografia**: Fredoka One (títulos) e Nunito (texto)
- **Animações suaves** em hover e transições
- **Design responsivo** para mobile e desktop
- **Elementos interativos** com feedback visual

### Componentes Especiais
- **Header inteligente** com menu de usuário
- **Carrinho animado** com contador de itens
- **Cards de produto** com efeitos hover
- **Formulários estilizados** com validação visual
- **Loading states** em operações assíncronas

## 📱 Responsividade

O sistema foi desenvolvido com **mobile-first approach**:
- ✅ **Breakpoints** bem definidos
- ✅ **Menu hamburger** em dispositivos móveis
- ✅ **Cards adaptáveis** em grid responsivo
- ✅ **Formulários otimizados** para touch
- ✅ **Navegação simplificada** em telas pequenas

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- SQLite3 instalado (para criar o banco)
- pnpm ou npm

### Passo a Passo

#### 1. Criar o Banco de Dados
```bash
cd backend/
sqlite3 burger_cia.db < database_schema.sql
```

#### 2. Instalar Dependências do Backend
```bash
cd backend/
pnpm install
# ou npm install
```

#### 3. Instalar Dependências do Frontend
```bash
cd frontend/
pnpm install
# ou npm install
```

#### 4. Iniciar o Backend
```bash
cd backend/
node server.js
# Servidor rodará em http://localhost:3001
```

#### 5. Iniciar o Frontend
```bash
cd frontend/
pnpm run dev
# ou npm run dev
# Aplicação rodará em http://localhost:5173
```

### Variáveis de Ambiente (Opcionais)
```bash
# Backend
PORT=3001
JWT_SECRET=burger_cia_secret_key_2024
```

## 🧪 Testando o Sistema

### Fluxo de Teste Completo

1. **Acesse** `http://localhost:5173`
2. **Registre** uma nova conta ou use as contas de teste
3. **Navegue** pelo cardápio e adicione itens ao carrinho
4. **Personalize** um hambúrguer na seção "Monte seu Burger"
5. **Finalize** um pedido (requer login)
6. **Acesse** a área admin com conta de administrador
7. **Gerencie** produtos, pedidos e usuários

### Contas de Teste
- **Admin**: `admin@burgercia.com` / `admin123`
- **Usuário**: `joao@email.com` / `user123`

## 🔧 Estrutura de Arquivos Detalhada

### Frontend (`/frontend`)
```
src/
├── components/
│   ├── Header.jsx              # Cabeçalho com autenticação
│   ├── Footer.jsx              # Rodapé
│   ├── LoadingSpinner.jsx      # Componente de loading
│   └── AnimatedCounter.jsx     # Contador animado
├── pages/
│   ├── Home.jsx                # Página inicial
│   ├── Menu.jsx                # Cardápio
│   ├── Cart.jsx                # Carrinho (com auth)
│   ├── CustomBurger.jsx        # Monte seu burger
│   ├── Login.jsx               # Login
│   ├── Register.jsx            # Registro
│   └── Admin.jsx               # Painel admin
├── assets/
│   └── logo.png                # Logo da marca
├── App.jsx                     # App principal com rotas
└── App.css                     # Estilos globais
```

### Backend (`/backend`)
```
├── server.js                   # Servidor Express completo
├── database_schema.sql         # Schema SQL para criação
├── burger_cia.db              # Banco SQLite (gerado)
└── package.json               # Dependências do backend
```

## 🎯 Diferenciais Implementados

### Funcionalidades Avançadas
- **Autenticação JWT** completa e segura
- **Roles de usuário** com permissões diferenciadas
- **Pedidos vinculados** ao usuário logado
- **Área administrativa** completa
- **Gerenciamento de usuários** pelo admin
- **Status de pedidos** em tempo real
- **Validação robusta** em frontend e backend

### Experiência do Usuário
- **Login obrigatório** para finalizar pedidos
- **Dados pré-preenchidos** do usuário logado
- **Histórico de pedidos** personalizado
- **Feedback visual** em todas as operações
- **Tratamento de erros** amigável
- **Responsividade** em todos os dispositivos

## 🚀 Próximos Passos (Melhorias Futuras)

### Funcionalidades Adicionais
- [ ] Sistema de notificações em tempo real
- [ ] Integração com gateway de pagamento
- [ ] Sistema de avaliações e comentários
- [ ] Programa de fidelidade
- [ ] Chat de atendimento ao cliente
- [ ] Relatórios avançados para admin

### Melhorias Técnicas
- [ ] Testes automatizados (Jest/Cypress)
- [ ] Docker para containerização
- [ ] Deploy automatizado (CI/CD)
- [ ] Monitoramento e logs
- [ ] Cache Redis para performance
- [ ] Backup automatizado do banco

## 📞 Suporte e Contato

Este projeto foi desenvolvido com muito carinho e atenção aos detalhes, pensando no valor emocional que representa para você. Cada funcionalidade foi cuidadosamente implementada para criar uma experiência completa e profissional.

**Características Especiais:**
- ✨ **Design único** baseado na logo fornecida
- 🔒 **Segurança robusta** com autenticação completa
- 📱 **Experiência mobile** otimizada
- ⚡ **Performance** otimizada
- 🎨 **Animações suaves** e interativas
- 💼 **Código profissional** e bem estruturado

---

**🍔 Burger & Cia - Transformando sonhos em realidade digital! 🍔**

