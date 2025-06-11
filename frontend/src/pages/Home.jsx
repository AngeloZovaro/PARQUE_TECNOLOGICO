import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import toast from 'react-hot-toast';
import "../styles/Home.css"; 
import OverflowMenu from '../components/OverflowMenu';
import ConfirmationModal from "../components/ConfirmationModal";

// --- Definição do Componente Home ---
function Home() {
  // --- Estados do Componente ---

  // Armazena a lista de categorias buscada da API.
  const [categories, setCategories] = useState([]);
  // Armazena o valor do campo de input para criar uma nova categoria.
  const [name, setName] = useState("");
  // Hook para redirecionar o usuário para outras páginas.
  const navigate = useNavigate();
  // Controla a visibilidade do modal de confirmação de exclusão.
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Armazena a categoria que o usuário selecionou para deletar.
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // --- Efeito Colateral para Busca Inicial de Dados ---

  // `useEffect` com um array de dependências vazio `[]` executa esta função
  // apenas uma vez, quando o componente é montado pela primeira vez.
  useEffect(() => {
    // AbortController é usado para cancelar a requisição da API caso o componente
    // seja desmontado antes da resposta chegar, evitando memory leaks.
    const controller = new AbortController();
    api
      .get("/api/categories/", { signal: controller.signal }) // Passa o sinal para a requisição.
      .then((res) => {
        // Se a requisição for bem-sucedida, atualiza o estado com as categorias recebidas.
        setCategories(res.data);
      })
      .catch((err) => {
        // Se ocorrer um erro, verifica se não foi um erro de cancelamento.
        if (err.name !== "CanceledError") {
          toast.error("Não foi possível carregar as categorias.");
        }
      });

    // Função de limpeza: será chamada quando o componente for desmontado.
    return () => {
      controller.abort(); // Cancela a requisição pendente.
    };
  }, []); // O array vazio garante que o efeito só rode na montagem.

  // --- Funções Auxiliares ---

  // Função para recarregar a lista de categorias. Útil após criar ou deletar.
  const getCategories = () => {
    api
      .get("/api/categories/")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => toast.error("Não foi possível recarregar as categorias."));
  };
  
  // Abre o modal de confirmação para deletar uma categoria.
  const handleOpenDeleteModal = (category) => {
    setCategoryToDelete(category); // Guarda a categoria a ser deletada.
    setIsModalOpen(true);          // Abre o modal.
  };

  // Executa a exclusão após o usuário confirmar no modal.
  const handleConfirmDelete = () => {
    if (!categoryToDelete) return; // Segurança: não faz nada se nenhuma categoria foi selecionada.

    // `toast.promise` mostra automaticamente toasts de 'loading', 'success' e 'error'.
    toast.promise(
      api.delete(`/api/categories/${categoryToDelete.id}/`), // A promessa a ser resolvida.
      {
        loading: 'Deletando categoria...',
        success: () => {
          // Ações a serem executadas em caso de sucesso:
          getCategories();         // Recarrega a lista de categorias.
          setIsModalOpen(false);   // Fecha o modal.
          setCategoryToDelete(null); // Limpa o estado.
          return "Categoria deletada com sucesso!"; // Mensagem do toast de sucesso.
        },
        error: "Não foi possível deletar a categoria." // Mensagem do toast de erro.
      }
    );
  };
  
  return (
    <>
      <div>
        <div className="content-header">
          <h1>Dashboard de Categorias</h1>
        </div>
        
        <div className="form-section">
          <h2>Criar Nova Categoria</h2>
          <form onSubmit={createCategory} className="category-form">
            <input
              type="text"
              id="name"
              name="name"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Nome da Categoria"
              className="category-input"
            />
            <button type="submit" className="category-button">Criar</button>
          </form>
        </div>
        <div className="categories-grid">
          {categories.map((category) => {
            const menuOptions = [
              {
                label: 'Gerenciar Campos',
                onClick: () => navigate(`/category/${category.id}/manage`),
              },
              {
                label: 'Deletar Categoria',
                onClick: () => handleOpenDeleteModal(category),
                isDestructive: true,
              },
            ];

            return (
              <div className="category-card" key={category.id}>
                <div className="card-header">
                  <Link to={`/category/${category.id}`} className="card-link-title">
                    <h3>{category.name}</h3>
                  </Link>
                  <OverflowMenu options={menuOptions} />
                </div>
                <div className="card-content">
                    <p>Clique no título para ver os ativos.</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão de Categoria"
        requiredInput={categoryToDelete?.name}
      >
        <p>
          Esta ação é <strong>irreversível</strong> e deletará todos os ativos associados.
          Para confirmar, por favor, digite o nome da categoria: <strong>{categoryToDelete?.name}</strong>
        </p>
      </ConfirmationModal>
    </>
  );
}

export default Home;