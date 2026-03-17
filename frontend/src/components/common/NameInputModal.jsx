import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';

const NameInputModal = ({
  isOpen,
  value,
  onChange,
  onConfirm,
  onCancel,
  placeholder = "Nombre de la colección",
  title = "Guardar colección"
}) => {
  const inputRef = useRef(null);

  const handleConfirm = () => {
    if (typeof onConfirm === 'function') {
      onConfirm();
    } else {
      console.error('Error: onConfirm no es una función', onConfirm);
    }
  };

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    } else {
      console.error('Error: onCancel no es una función', onCancel);
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCancel}
        >
          <motion.div
            className="name-input-container"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{title}</h3>
            
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="modal-input"
            />
            
            <div className="name-input-actions">
              <motion.button
                onClick={handleConfirm}
                className="confirm-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!value.trim()}
              >
                <FiCheck /> Confirmar
              </motion.button>
              
              <motion.button
                onClick={handleCancel}
                className="cancel-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX /> Cancelar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NameInputModal;