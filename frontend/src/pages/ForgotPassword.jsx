import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import '../styles/Form.css'; // Reutilizaremos o estilo do formulário

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Enter username, 2: Answer question
  const [username, setUsername] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    toast.promise(
      api.post('/api/user/get-secret-question/', { username }),
      {
        loading: 'Buscando sua pergunta...',
        success: (res) => {
          setSecretQuestion(res.data.secret_question);
          setStep(2);
          return 'Pergunta encontrada!';
        },
        error: (err) => err.response?.data?.error || 'Usuário não encontrado.',
      }
    );
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    const data = {
        username,
        secret_answer: secretAnswer,
        new_password: newPassword,
    };
    toast.promise(
      api.post('/api/user/reset-password/', data),
      {
        loading: 'Verificando e alterando a senha...',
        success: (res) => {
          navigate('/login');
          return res.data.message;
        },
        error: (err) => err.response?.data?.error || 'Não foi possível alterar a senha.',
      }
    );
  };

  return (
    <div className="form-container">
      {step === 1 ? (
        <form onSubmit={handleUsernameSubmit}>
          <h1>Recuperar Senha</h1>
          <p className="form-description">Digite seu nome de usuário para continuar.</p>
          <input
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <button type="submit" className="form-button">Próximo</button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit}>
          <h1>Redefinir Senha</h1>
          <p className="form-description">Responda sua pergunta secreta e defina uma nova senha.</p>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#a0aec0', display: 'block', marginBottom: '5px' }}>Sua Pergunta:</label>
            <p style={{ color: 'white', fontWeight: 'bold', margin: 0 }}>{secretQuestion}</p>
          </div>

          <input
            type="text"
            className="form-input"
            value={secretAnswer}
            onChange={(e) => setSecretAnswer(e.target.value)}
            placeholder="Sua resposta secreta"
            required
          />
          <input
            type="password"
            className="form-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Digite a nova senha"
            required
          />
          <button type="submit" className="form-button">Alterar Senha</button>
        </form>
      )}
       <p className="form-toggle" style={{ marginTop: '20px' }}>
            <Link to="/login">Voltar para o Login</Link>
        </p>
    </div>
  );
}

export default ForgotPassword;