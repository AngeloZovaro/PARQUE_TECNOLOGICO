import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import "../styles/AssetList.css";
import toast from 'react-hot-toast';
import ConfirmationModal from "../components/ConfirmationModal";

function AssetList() {
  const { categoryId } = useParams();
  const [assets, setAssets] = useState([]);
  const [category, setCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    api.get(`/api/categories/${categoryId}/`, { signal: controller.signal })
       .then((res) => setCategory(res.data))
       .catch(err => { if (err.name !== 'CanceledError') console.error("Erro ao buscar categoria", err) });

    api.get(`/api/assets/?category_id=${categoryId}`, { signal: controller.signal })
       .then((res) => setAssets(res.data))
       .catch(err => { if (err.name !== 'CanceledError') console.error("Erro ao buscar ativos", err) });

    return () => {
        controller.abort();
    }
  }, [categoryId]);

  const handleOpenDeleteModal = (asset) => {
    setAssetToDelete(asset);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!assetToDelete) return;
    
    toast.promise(
      api.delete(`/api/assets/${assetToDelete.id}/`),
      {
        loading: 'Deletando ativo...',
        success: () => {
          setAssets(assets.filter(asset => asset.id !== assetToDelete.id));
          setIsModalOpen(false);
          setAssetToDelete(null);
          return "Ativo deletado com sucesso!";
        },
        error: "Não foi possível deletar o ativo."
      }
    );
  };

  const renderStatusBadge = (status) => {
    const lowerCaseStatus = status.toLowerCase();
    let statusClass = "status-default";

    if (lowerCaseStatus === 'active' || lowerCaseStatus === 'ativo') {
      statusClass = "status-active";
    } else if (lowerCaseStatus === 'inactive' || lowerCaseStatus === 'inativo') {
      statusClass = "status-inactive";
    } else if (lowerCaseStatus === 'maintenance' || lowerCaseStatus === 'manutenção') {
      statusClass = "status-maintenance";
    }

    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  if (!category) return <div>Carregando...</div>;

  return (
    <>
      <div>
        <div className="content-header">
          <h1>{category.name}</h1>
          <Link to={`/category/${categoryId}/new-asset`} className="new-asset-link">
            Registrar Novo Ativo
          </Link>
        </div>

        <div className="asset-list-section">
          <h2>Ativos Registrados</h2>
          <table className="assets-table">
            <thead>
              <tr>
                <th>Patrimônio</th>
                {category.field_definitions.map(field => <th key={field.id}>{field.name}</th>)}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.id}>
                  <td>{asset.patrimonio}</td>
                  {category.field_definitions.map(fieldDef => {
                    const value = asset.field_values.find(fv => fv.field_definition === fieldDef.id)?.value || 'N/A';
                    return (
                      <td key={fieldDef.id}>
                        {fieldDef.name.toLowerCase() === 'status' ? renderStatusBadge(value) : value}
                      </td>
                    );
                  })}
                  <td className="action-buttons">
                    <Link to={`/edit-asset/${asset.id}`} className="action-edit">Editar</Link>
                    <button onClick={() => handleOpenDeleteModal(asset)} className="action-delete">Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão de Ativo"
      >
        <p>
          Você tem certeza que deseja deletar permanentemente o ativo com patrimônio: <strong>{assetToDelete?.patrimonio}</strong>?
        </p>
      </ConfirmationModal>
    </>
  );
}

export default AssetList;