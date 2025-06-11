import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/AssetList.css";
import toast from 'react-hot-toast';
import ConfirmationModal from "../components/ConfirmationModal";

function FieldManager() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    api.get(`/api/categories/${categoryId}/`, { signal: controller.signal })
       .then((res) => setCategory(res.data))
       .catch(err => { if (err.name !== 'CanceledError') console.error("Erro ao buscar categoria", err) });
    
    return () => controller.abort();
  }, [categoryId]);

  const getCategoryDetails = () => {
    api
      .get(`/api/categories/${categoryId}/`)
      .then((res) => setCategory(res.data))
      .catch((err) => toast.error("Não foi possível recarregar os campos."));
  };

  const handleOpenDeleteModal = (field) => {
    setFieldToDelete(field);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!fieldToDelete) return;

    toast.promise(
      api.delete(`/api/fields/${fieldToDelete.id}/`),
      {
        loading: 'Deletando campo...',
        success: () => {
          getCategoryDetails();
          setIsModalOpen(false);
          setFieldToDelete(null);
          return "Campo deletado com sucesso!";
        },
        error: "Não foi possível deletar o campo."
      }
    );
  };

  const createFieldDefinition = (e) => {
    e.preventDefault();
    toast.promise(
        api.post(`/api/categories/${categoryId}/fields/`, { name: fieldName, field_type: fieldType }),
        {
            loading: 'Adicionando campo...',
            success: (res) => {
                if (res.status === 201) {
                    setFieldName("");
                    getCategoryDetails();
                    return "Campo criado com sucesso!";
                }
                throw new Error("Falha ao criar campo.");
            },
            error: 'Não foi possível criar o campo.',
        }
    );
  };

  if (!category) return <div>Carregando...</div>;

  return (
    <>
      <div>
          <div className="content-header">
              <h1>Gerenciar Campos de: {category.name}</h1>
              <button onClick={() => navigate(`/category/${categoryId}`)} className="new-asset-link">
                  Voltar aos Ativos
              </button>
          </div>
          <div className="field-management-section">
              <h2>Campos Customizáveis</h2>
              {category.field_definitions.length > 0 && (
              <ul className="field-list">
                  {category.field_definitions.map((field) => (
                  <li key={field.id} className="field-list-item">
                      <div>
                      <span className="field-name">{field.name}</span>
                      <span className="field-type">({field.field_type})</span>
                      </div>
                      <button
                      onClick={() => handleOpenDeleteModal(field)}
                      className="delete-field-button">
                      Deletar
                      </button>
                  </li>
                  ))}
              </ul>
              )}
              <form onSubmit={createFieldDefinition} className="category-form">
              <input
                  type="text"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  placeholder="Nome do novo campo"
                  className="category-input"
              />
              <select value={fieldType} onChange={(e) => setFieldType(e.target.value)} className="category-input">
                  <option value="text">Texto</option>
                  <option value="number">Número</option>
                  <option value="date">Data</option>
              </select>
              <button type="submit" className="category-button">Adicionar Campo</button>
              </form>
          </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão de Campo"
        requiredInput={fieldToDelete?.name}
      >
        <p>
          Você tem certeza que deseja deletar o campo: <strong>{fieldToDelete?.name}</strong>?
          Esta ação não pode ser desfeita.
        </p>
      </ConfirmationModal>
    </>
  );
}

export default FieldManager;