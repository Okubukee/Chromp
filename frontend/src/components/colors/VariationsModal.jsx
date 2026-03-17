import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

/**
 * Modal para mostrar variaciones de una paleta
 */
const VariationsModal = ({ isOpen, onClose, variations, onSelectVariation }) => {
  const [selectedVariation, setSelectedVariation] = React.useState('original');

  if (!variations) return null;

  const variationLabels = {
    original: 'Original',
    lighter: 'Más claro',
    darker: 'Más oscuro',
    moreSaturated: 'Más saturado',
    lessSaturated: 'Menos saturado',
    warmer: 'Más cálido',
    cooler: 'Más frío'
  };

  const handleSelect = (key) => {
    setSelectedVariation(key);
    if (onSelectVariation) {
      onSelectVariation(key, variations[key]);
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
          onClick={onClose}
        >
          <motion.div
            className="variations-modal"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="variations-header">
              <h3>🔄 Variaciones de la paleta</h3>
              <button className="close-button" onClick={onClose}>
                <FiX />
              </button>
            </div>

            <div className="variations-grid">
              {Object.entries(variations).map(([key, colors]) => (
                <motion.div
                  key={key}
                  className={`variation-card ${selectedVariation === key ? 'selected' : ''}`}
                  onClick={() => handleSelect(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="variation-title">{variationLabels[key]}</h4>
                  <div className="variation-colors">
                    {colors.map((color, i) => (
                      <div
                        key={i}
                        className="variation-color"
                        style={{ backgroundColor: color.hex }}
                        title={color.hex}
                      />
                    ))}
                  </div>
                  <div className="variation-preview">
                    {colors.map((color, i) => (
                      <div
                        key={i}
                        className="preview-dot"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="variations-actions">
              <motion.button
                className="apply-btn"
                onClick={() => {
                  onSelectVariation(selectedVariation, variations[selectedVariation]);
                  onClose();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Aplicar variación seleccionada
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VariationsModal;