// --- Importações de Módulos e Componentes ---

import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
// Importa as chaves usadas para armazenar os tokens no localStorage.
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

// --- Definição do Componente ---

// O componente 'Form' recebe duas props:
// 'route': A URL da API para onde os dados do formulário serão enviados (ex: "/api/token/" ou "/api/user/register/").
// 'method': A ação que o formulário está realizando ("login" ou "register").
function Form({ route, method }) {
  // --- Estados do Componente ---

  // Estado para armazenar o nome de usuário digitado.
  const [username, setUsername] = useState("");
  // Estado para armazenar a senha digitada.
  const [password, setPassword] = useState("");
  // Estado para controlar a exibição do indicador de carregamento durante a requisição.
  const [loading, setLoading] = useState(false);
  // Hook do React Router para permitir a navegação programática para outras rotas.
  const navigate = useNavigate();

  // --- Lógica do Componente ---

  // Determina o texto a ser exibido (ex: no título ou no botão) com base na prop 'method'.
  // Se 'method' for "login", 'name' será "Login". Caso contrário, será "Register".
  const name = method === "login" ? "Login" : "Register";

  // Função assíncrona para lidar com o envio do formulário.
  const handleSubmit = async (e) => {
    // Ativa o estado de carregamento para fornecer feedback visual ao usuário.
    setLoading(true);
    // Previne o comportamento padrão do formulário, que é recarregar a página.
    e.preventDefault();

    // O bloco 'try...catch...finally' é usado para lidar com a chamada assíncrona da API.
    try {
      // Faz uma requisição POST para a 'route' especificada, enviando 'username' e 'password'.
      // `await` pausa a execução da função até que a promessa da API seja resolvida.
      const res = await api.post(route, { username, password });

      // Se o método for "login", a API deve retornar os tokens de acesso.
      if (method === "login") {
        // Armazena o token de acesso no localStorage do navegador.
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        // Armazena o token de atualização (refresh token) no localStorage.
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        // Redireciona o usuário para a página inicial ("/") após o login bem-sucedido.
        navigate("/");
      } else {
        // Se o método for "register", o usuário foi criado com sucesso.
        // Redireciona o usuário para a página de login para que ele possa entrar.
        navigate("/login/");
      }
    } catch (error) {
      // Se ocorrer um erro na requisição (ex: credenciais inválidas, erro no servidor),
      // ele será capturado aqui.
      alert(error); // Exibe um alerta simples com a mensagem de erro.
    } finally {
      // O bloco 'finally' sempre será executado, independentemente de sucesso ou erro.
      // Desativa o estado de carregamento, escondendo o LoadingIndicator.
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      <p className="form-description">
        Bem-vindo ao Sistema de Controle de Ativos. Gerencie seu inventário de
        forma fácil e flexível.
      </p>

      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        {name}
      </button>

      <p className="form-toggle">
        {method === "login" ? (
          <>
            Ainda não tem uma conta? <Link to="/register">Registre-se</Link>
          </>
        ) : (
          <>
            Já possui uma conta? <Link to="/login">Faça o login</Link>
          </>
        )}
      </p>
    </form>
  );
}

export default Form;
