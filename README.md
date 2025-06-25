# 💻 Controle de Patrimônio 📈

Bem-vindo ao nosso projeto de Controle de Patrimônio! Este sistema foi criado para facilitar a vida de quem precisa gerenciar ativos e suas informações de forma simples e organizada.

---

### 📝 Sobre o Projeto

Este é um sistema completo de controle de patrimônio. Com ele, você pode:
* Gerenciar categorias de ativos.
* Registrar e acompanhar cada item individualmente.
* Utilizar campos customizáveis para detalhar as informações mais importantes para você.

A aplicação é dividida em duas partes principais: um **Frontend** super moderno feito com React e um **Backend** robusto construído com Django.

---

### 🚀 Tecnologias Utilizadas

Aqui estão as ferramentas e tecnologias que movem nosso projeto:

#### **Frontend**
* **React**: Para criar uma interface de usuário rápida e interativa.
* **Vite**: Nosso motor para um desenvolvimento ágil e eficiente.
* **React Router DOM**: Cuidando das rotas e da navegação.
* **Axios**: Para uma comunicação suave com nossa API.
* **React Hot Toast**: Para exibir notificações charmosas e úteis.
* **React Icons**: Deixando tudo mais bonito com uma vasta biblioteca de ícones.

#### **Backend**
* **Django**: A base sólida e segura da nossa aplicação.
* **Django REST Framework**: Para construir uma API poderosa e flexível.
* **Simple JWT**: Garantindo a segurança com autenticação via JSON Web Tokens.
* **Psycopg2**: Adaptado para PostgreSQL (mas usamos SQLite por padrão para facilitar sua vida!).

---

### ✅ Pré-requisitos

Antes de começar, garanta que você tenha o seguinte instalado na sua máquina:

* Node.js e npm
* Python e pip

---

### ⚙️ Como Colocar para Rodar

Vamos configurar o ambiente e deixar tudo funcionando! Siga os passos abaixo.

#### **Backend (O Coração da Aplicação)**

1.  **Entre na pasta do backend:**
    ```bash
    cd backend
    ```

2.  **Crie e ative seu ambiente virtual (sua "bolha" de desenvolvimento):**
    ```bash
    python -m venv env
    ```
    *No Windows (PowerShell), pode ser necessário liberar a execução de scripts:*
    ```powershell
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    ```
    *Agora, ative o ambiente:*
    ```bash
    .\env\Scripts\activate
    ```

3.  **Instale as dependências com um simples comando:**
    ```bash
    pip install -r backend/requirements.txt
    ```

4.  **Prepare o banco de dados:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

5.  **Ligue o servidor do backend! 🚀**
    ```bash
    python manage.py runserver
    ```
    O backend estará rodando em `http://127.0.0.1:8000`.

#### **Frontend (A Cara do Projeto)**

1.  **Agora, vamos para a pasta do frontend:**
    ```bash
    cd frontend
    ```

2.  **Instale todas as dependências necessárias:**
    ```bash
    npm install
    ```
    *Precisa de um pacote específico, como os ícones? É fácil:*
    ```bash
    npm install react-icons
    ```

3.  **Inicie o servidor de desenvolvimento do frontend! ✨**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173`.

---

### ⚡️ Comandos que Salvam o Dia

Aqui uma colinha dos comandos mais úteis:

* `python manage.py makemigrations`: Cria os "mapas" para o seu banco de dados quando você altera os modelos.
* `python manage.py migrate`: Aplica esses mapas e atualiza o banco de dados.
* `python manage.py runserver`: Inicia o servidor de desenvolvimento do Django.
* `npm run dev`: Inicia o servidor de desenvolvimento do Vite com atualização automática.
* `npm install`: Instala as dependências do frontend listadas no `package.json`.

---
