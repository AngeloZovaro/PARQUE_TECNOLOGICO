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
  const [secretQuestion, setSecretQuestion] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
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

    try {
      // Prepara os dados a serem enviados
      const data = { username, password };
      if (method === "register") {
        data.secret_question = secretQuestion;
        data.secret_answer = secretAnswer;
      }

      const res = await api.post(route, data);
      
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login/");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      <p className="form-description">
        Bem-vindo ao Sistema de Controle de Ativos. Gerencie seu inventário de forma fácil e flexível.
      </p>

      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      {/* --- Novos campos exibidos apenas no registro --- */}
      {method === "register" && (
        <>
          <input
            className="form-input"
            type="text"
            value={secretQuestion}
            onChange={(e) => setSecretQuestion(e.target.value)}
            placeholder="Digite uma pergunta secreta (ex: nome do seu pet?)"
            required
          />
          <input
            className="form-input"
            type="text"
            value={secretAnswer}
            onChange={(e) => setSecretAnswer(e.target.value)}
            placeholder="Digite a resposta secreta"
            required
          />
        </>
      )}

      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        {name}
      </button>

      <div className="form-links">
        {method === "login" ? (
          <p className="form-toggle">
            Ainda não tem uma conta? <Link to="/register">Registre-se</Link>
          </p>
        ) : (
          <p className="form-toggle">
            Já possui uma conta? <Link to="/login">Faça o login</Link>
          </p>
        )}
        {/* --- Link para "Esqueceu a senha?" --- */}
        {method === "login" && (
            <p className="form-toggle">
                <Link to="/forgot-password">Esqueceu a senha?</Link>
            </p>
        )}
      </div>
    </form>
  );
}

export default Form;
