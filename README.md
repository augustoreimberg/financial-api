# 💰 Financial Wallet API

A robust and secure financial wallet API built with **NestJS**, **TypeScript**, and following **Clean Architecture** principles.

---

## 🚀 Features

- ✅ User registration and authentication  
- 💼 Wallet management  
- 💸 Money transfers between users  
- 📜 Transaction history  
- 🔁 Transaction reversal  
- 🔒 Security and validation  

---

## 🏗️ Architecture

This project follows the **Clean Architecture** pattern, divided into three main layers:

- **Domain Layer**  
  Entities, repository interfaces, and core types  
- **Core Layer**  
  Use cases and business logic  
- **Infrastructure Layer**  
  Controllers, repositories, and external service integrations  

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)  
- [PostgreSQL](https://www.postgresql.org/)  
- [Docker & Docker Compose](https://www.docker.com/) (optional)

---

## 🛠️ Installation

### 🔁 Using Docker

```bash
# 1. Clone the repository
git clone https://github.com/seu-usuario/financial-wallet-api.git
cd financial-wallet-api

# 2. Copy the environment file
cp .env.example .env

# 3. Update environment variables (if needed)

# 4. Start the containers
docker-compose up -d

⚙️ Manual Installation
bash
Copiar
Editar
# 1. Clone the repository
git clone https://github.com/seu-usuario/financial-wallet-api.git
cd financial-wallet-api

# 2. Install dependencies
npm install

# 3. Copy the environment file
cp .env.example .env

# 4. Update environment variables

# 5. Start the application
npm run start:dev

📚 API Documentation
Once the server is running, access the Swagger UI:

👉 http://localhost:3000/api/docs

🔌 API Endpoints
🔐 Authentication
POST /auth/login – User login

👤 Users
POST /users – Create a new user

GET /users/me – Get current user profile

💳 Wallets
GET /wallets/me – Get current user's wallet

💱 Transactions
POST /transactions – Create a new transaction

POST /transactions/reverse – Reverse a transaction

GET /transactions – List all transactions for the user

🧪 Testing
Run unit tests:

bash
Copiar
Editar
npm test
Check test coverage:

bash
Copiar
Editar
npm run test:cov

This project is licensed under the MIT License.
