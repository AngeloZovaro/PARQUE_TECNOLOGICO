import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Deletar",
  requiredInput = null
}) {
  const [inputValue, setInputValue] = useState("");

  // Hook 1: Efeito para resetar o input quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      setInputValue("");
    }
  }, [isOpen]);

  // Hook 2: Efeito para fechar o modal com a tecla 'Escape'
  // Este Hook SEMPRE será chamado, corrigindo o erro.
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // AGORA, após todos os hooks serem chamados, podemos retornar null.
  if (!isOpen) {
    return null;
  }

  const isConfirmDisabled = requiredInput && inputValue !== requiredInput;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close-button">&times;</button>
        </div>
        <div className="modal-body">
          {children}
          {requiredInput && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="modal-input"
              placeholder={`Digite "${requiredInput}" para confirmar`}
              autoFocus
            />
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-button cancel">
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="modal-button confirm"
            disabled={isConfirmDisabled}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;