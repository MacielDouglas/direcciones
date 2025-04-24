# 🗺️ **Projeto Direcciones**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Gerenciamento avançado de endereços com integração em tempo real.

---

## 🚀 **Tecnologias Utilizadas**

- **Frontend**:
  - ⚡ **Vite.js**
  - 🎨 **Tailwind CSS**
- **Backend**:
  - 🟢 **Node.js**
  - 🔑 **JWT** (Autenticação)
- **GraphQL**:
  - 🚀 **Apollo Client** (@apollo/client)
  - 🌐 **Apollo Server** (@apollo/server)
- **Banco de Dados & Serviços**:
  - 🔥 **Firebase** (Firestore, Auth)
  - 🗃️ **MongoDB** (Atlas)
- **Tempo Real**:
  - 📡 **WebSocket** (Servidor dedicado)

---

## 📂 **Estrutura do Projeto**

```
direcciones/
├── src/               # Código fonte principal
├── docs/              # Documentação técnica
├── tests/             # Testes automatizados
└── server/            # Configurações do servidor
```

---

## 🛠️ **Configuração do Ambiente**

### Passos Iniciais:

1. Clone o repositório:

   ```sh
   git clone https://github.com/seu-usuario/direcciones.git
   cd direcciones
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Configure as variáveis de ambiente (detalhes abaixo).

4. Inicie o projeto:
   ```sh
   npm run dev
   ```

---

## 🔐 **Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

### Configurações do Banco de Dados

```env
MONGO_DB=mongodb+srv://user:password@cluster.mongodb.net/database
JWT_SECRET=sua_chave_secreta_jwt
```

### Configurações do Firebase

```env
VITE_API_KEY=AIzaSyBd7f7s...
VITE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_PROJECT_ID=seu-projeto-id
VITE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_MESSAGING_SENDER_ID=123456789012
VITE_APP_ID=1:123456789012:web:abc123def456
```

### URLs de API

```env
VITE_API_URL=https://api.seu-projeto.com/v1
VITE_API_URL_SOCKET=wss://socket.seu-projeto.com
```

> **Nota**: O servidor WebSocket dedicado está disponível em [MacielDouglas/api_webSocket](https://github.com/MacielDouglas/api_webSocket)

---

## 🌐 **Funcionalidades Principais**

- **Gerenciamento Completo de Endereços**: Armazene, edite e visualize endereços com facilidade.
- **Autenticação Segura**: Usando JWT e Firebase Auth para garantir segurança e acesso controlado.
- **Atualizações em Tempo Real**: Através de WebSocket, mantenha os dados sempre atualizados.
- **Interface Responsiva**: Desenvolvida com **Tailwind CSS** para uma experiência otimizada em qualquer dispositivo.
- **Consultas Eficientes com GraphQL**: Utilização de Apollo Client e Server para consultas rápidas e flexíveis.

---

## 🤝 **Como Contribuir**

1. Faça um fork do projeto.
2. Crie uma branch para sua feature:
   ```sh
   git checkout -b feature/nova-funcionalidade
   ```
3. Envie suas alterações:
   ```sh
   git push origin feature/nova-funcionalidade
   ```
4. Abra um Pull Request.

---

## 📄 **Licença**

Distribuído sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais informações.

---

✨ **Desenvolvido com as melhores tecnologias modernas de desenvolvimento web.**

✨ Desenvolvido com as melhores tecnologias modernas de desenvolvimento web.

```
````
