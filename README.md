# 🍽️ Appetite - App de Receitas

Um aplicativo mobile completo para compartilhar, descobrir e gerenciar receitas culinárias com uma interface moderna e intuitiva.

## ✨ Características Principais

### 👤 Autenticação & Perfil
- ✅ Cadastro e login de usuários
- ✅ Perfil personalizado
- ✅ Logout seguro

### 📚 Receitas
- ✅ Visualizar receitas detalhadas
- ✅ 5 categorias principais: Sobremesas, Lanches, Diet, Vegetariano e Bebidas
- ✅ Filtrar por dificuldade (Fácil, Médio, Difícil)
- ✅ Sistema de favoritos (curtir receitas)
- ✅ Avaliação com estrelas
- ✅ Tempo de preparo
- ✅ Lista de ingredientes interativa
- ✅ Modo de preparo passo a passo

### ➕ Criar Receitas
- ✅ Upload de imagem
- ✅ Ingredientes dinâmicos
- ✅ Seleção de categoria
- ✅ Nível de dificuldade
- ✅ Avaliação (1-5 estrelas)

### 🔍 Busca & Filtros
- ✅ Pesquisa por nome
- ✅ Filtrar por nível de dificuldade
- ✅ Filtrar receitas curtidas
- ✅ Navegação rápida por categorias

### 📱 Interface
- ✅ Design moderno e responsivo
- ✅ Tema claro harmonioso
- ✅ Navegação intuitiva com abas
- ✅ Dicas de culinária na home

## 🛠️ Tecnologias

### Frontend
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **Expo Router** - Navegação
- **Ionicons** - Ícones

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **Axios** - Cliente HTTP

### Storage
- **AsyncStorage** - Armazenamento local
- **Multer** - Upload de arquivos

## 📁 Estrutura do Projeto

```
appetite/
├── app/
│   ├── (auth)/
│   │   ├── login.js
│   │   ├── register.js
│   │   └── _layout.js
│   ├── (tabs)/
│   │   ├── home.js
│   │   ├── ListingScreen.js
│   │   ├── CreateRecipeScreen.js
│   │   ├── DetailsScreen.js
│   │   ├── profile.js
│   │   └── _layout.js
│   ├── components/
│   │   ├── header.js
│   │   ├── navComidas.js
│   │   └── RecipeCard.js
│   ├── contexts/
│   │   └── AuthContext.js
│   └── _layout.js
├── server/
│   ├── routes/
│   │   └── receitas.js
│   ├── database/
│   │   └── seed.sql
│   └── migrations/
│       └── init.js
├── assets/
└── .env
```

## 🚀 Como Começar

### Pré-requisitos
- Node.js v16+
- npm ou yarn
- PostgreSQL instalado
- Expo CLI

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seu-usuario/appetite.git
cd appetite
```

### 2️⃣ Instalar dependências
```bash
npm install
# ou
yarn install
```

### 3️⃣ Configurar banco de dados
```bash
# Criar banco de dados
createdb appetitedb

# Executar migrations
psql appetitedb < database/seed.sql
```

### 4️⃣ Configurar variáveis de ambiente
Crie um arquivo `.env`:
```env
EXPO_PUBLIC_API_URL=http://192.168.15.10:3000
```

### 5️⃣ Iniciar servidor backend
```bash
cd server
npm start
# Servidor rodando em http://localhost:3000
```

### 6️⃣ Iniciar aplicativo mobile
```bash
npm start
# Escanear QR code com o Expo Go
```

## 📋 Categorias de Receitas

| Categoria | ID | Exemplos |
|-----------|----|----|
| 🍰 Sobremesas | 1 | Bolo, Pudim, Brigadeiro |
| 🌮 Lanches | 2 | Macarrão, Lasanha, Nhoque |
| 💪 Diet | 3 | Bife à Parmegiana, Frango Assado |
| 🥗 Vegetariano | 4 | Salada, Quiche, Falafel |
| 🥤 Bebidas | 5 | Suco, Vitamina, Café Gelado |

## 🔐 Autenticação

### Login
```javascript
// Email: teste@appetite.com
// Senha: 123456
```

### Criar Nova Conta
Clique em "Cadastre-se" e preencha os dados!

## 🎨 Paleta de Cores

```
Verde Principal: #2E7D32
Rosa Destaque: #E91E63
Cinza Neutro: #666666
Fundo Claro: #FFFCFC
```

## 📱 Funcionalidades por Tela

### 🏠 Home
- Banner com "Receitas da Semana"
- Navegação rápida por categorias
- Receitas populares (IDs pares)
- Dicas de culinária

### 🔍 Buscar
- Listar todas as receitas
- Pesquisa por nome
- Filtros por dificuldade
- Filtro de receitas curtidas
- Paginação (50 receitas por página)

### ➕ Criar Receita
- Upload de imagem
- Ingredientes dinâmicos
- Modo de preparo
- Tempo de preparo
- Avaliação com estrelas

### 📖 Detalhes da Receita
- Imagem grande
- Ingredientes checáveis
- Modo de preparo numerado
- Sistema de favoritos
- Deletar receita (se for o criador)

### 👤 Perfil
- Dados do usuário
- Ações rápidas
- Informações de conta
- Logout

## 🐛 Troubleshooting

### Erro de Conexão com API
```bash
# Verificar IP local
ipconfig getifaddr en0  # macOS
ipconfig             # Windows

# Atualizar .env com IP correto
EXPO_PUBLIC_API_URL=http://seu-ip:3000
```

### Banco de dados não conecta
```bash
# Verificar se PostgreSQL está rodando
psql -U postgres -l

# Criar banco se não existir
createdb appetitedb
```

### Categorias não aparecem corretamente
```bash
# Resetar banco de dados
dropdb appetitedb
createdb appetitedb
psql appetitedb < database/seed.sql
```

## 📚 API Endpoints

### Receitas
- `GET /api/receitas` - Listar todas
- `GET /api/receitas/:id` - Detalhes
- `POST /api/receitas` - Criar nova
- `PUT /api/receitas/:id/favorita` - Favoritar/desfavoritar
- `DELETE /api/receitas/:id` - Deletar

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

**Seu Nome** - Desenvolvedor Full Stack

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- Email: seu.email@example.com

## 🙏 Agradecimentos

- Expo por facilitar o desenvolvimento mobile
- React Native community
- Inspiração em apps culinários modernos

---

**⭐ Se gostou do projeto, deixe uma estrela!**

Feito com ❤️ por TDS1