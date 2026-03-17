import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiEye } from 'react-icons/fi';
import { blindnessTypes, applyPaletteColorBlindness } from '../../utils/colorBlindness';

const ColorBlindnessModal = ({ isOpen, onClose, colors, onApply }) => {
  const [selectedType, setSelectedType] = useState('normal');
  const [previewColors, setPreviewColors] = useState(colors);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    if (type === 'normal') {
      setPreviewColors(colors);
    } else {
      const simulated = applyPaletteColorBlindness(colors, type);
      setPreviewColors(simulated);
    }
  };

  const handleApply = () => {
    if (selectedType !== 'normal' && onApply) {
      onApply(previewColors, selectedType);
    }
    onClose();
  };

  if (!colors || colors.length === 0) return null;

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
            className="blindness-modal"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="blindness-header">
              <h3>👁️ Simular daltonismo</h3>
              <button className="close-button" onClick={onClose}>
                <FiX />
              </button>
            </div>

            <div className="blindness-types">
              {blindnessTypes.map(type => (
                <motion.button
                  key={type.id}
                  className={`type-button ${selectedType === type.id ? 'active' : ''}`}
                  onClick={() => handleTypeChange(type.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="type-info">
                    <h4>{type.name}</h4>
                    <p>{type.description}</p>
                  </div>
                  <div className="type-preview">
                    {colors.slice(0, 3).map((color, i) => {
                      const simulatedHex = type.id === 'normal' 
                        ? color.hex 
                        : applyPaletteColorBlindness([color], type.id)[0].hex;
                      return (
                        <div
                          key={i}
                          className="preview-dot"
                          style={{ backgroundColor: simulatedHex }}
                        />
                      );
                    })}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="blindness-preview">
              <h4>Vista previa de la paleta</h4>
              <div className="preview-palette">
                {previewColors.map((color, i) => (
                  <div
                    key={i}
                    className="preview-color"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className="color-hex-small">{color.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="blindness-actions">
              {selectedType !== 'normal' && (
                <motion.button
                  className="apply-btn"
                  onClick={handleApply}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiEye /> Aplicar esta simulación
                </motion.button>
              )}
              <motion.button
                className="cancel-btn"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cerrar
              </motion.button>
            </div>

            <div className="blindness-info">
              <p className="info-text">
                <strong>Nota:</strong> Estas son simulaciones aproximadas. La percepción real 
                del daltonismo varía según cada persona.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ColorBlindnessModal;