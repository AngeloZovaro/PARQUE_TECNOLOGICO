import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import toast from 'react-hot-toast';
import "../styles/Home.css"; 
import OverflowMenu from '../components/OverflowMenu';
import ConfirmationModal from "../components/ConfirmationModal";

function Home() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/api/categories/", { signal: controller.signal })
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        if (err.name !== "CanceledError") {
          toast.error("Não foi possível carregar as categorias.");
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const getCategories = () => {
    api
      .get("/api/categories/")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => toast.error("Não foi possível recarregar as categorias."));
  };
  
  const handleOpenDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;

    toast.promise(
      api.delete(`/api/categories/${categoryToDelete.id}/`),
      {
        loading: 'Deletando categoria...',
        success: () => {
          getCategories();
          setIsModalOpen(false);
          setCategoryToDelete(null);
          return "Categoria deletada com sucesso!";
        },
        error: "Não foi possível deletar a categoria."
      }
    );
  };
  
  const createCategory = (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Criando categoria...");
    api
      .post("/api/categories/", { name })
      .then((res) => {
        toast.dismiss(loadingToast);
        if (res.status === 201) {
          toast.success("Categoria criada!");
          setName("");
          getCategories();
        } else {
          toast.error("Falha ao criar categoria.");
        }
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        toast.error(err.response?.data?.name?.[0] || "Erro desconhecido ao criar.");
      });
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