import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

/**
 * Panel de configuración de la aplicación
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla si el panel está visible
 * @param {Function} props.onClose - Función para cerrar el panel
 * @param {number} props.colorCount - Número de colores por paleta
 * @param {Function} props.onColorCountChange - Función para cambiar número de colores
 * @param {string} props.cardSize - Tamaño de las tarjetas ('small', 'medium', 'large')
 * @param {Function} props.onCardSizeChange - Función para cambiar tamaño de tarjetas
 */
const SettingsPanel = ({
  isOpen,
  onClose,
  colorCount,
  onColorCountChange,
  cardSize,
  onCardSizeChange
}) => {
  const sizeOptions = [
    { value: 'small', label: 'Pequeño' },
    { value: 'medium', label: 'Mediano' },
    { value: 'large', label: 'Grande' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="settings-panel"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="settings-header">
            <h3>⚙️ Configuración</h3>
            <button className="close-button" onClick={onClose}>
              <FiX />
            </button>
          </div>
          
          {/* Número de colores */}
          <div className="setting-item">
            <label>
              Número de colores: <span className="setting-value">{colorCount}</span>
            </label>
            <input
              type="range"
              min="3"
              max="8"
              value={colorCount}
              onChange={(e) => onColorCountChange(parseInt(e.target.value))}
              className="setting-slider"
            />
            <div className="setting-hint">
              De 3 a 8 colores por paleta
            </div>
          </div>

          {/* Tamaño de tarjetas */}
          <div className="setting-item">
            <label>Tamaño de tarjetas</label>
            <div className="size-options">
              {sizeOptions.map((option) => (
                <motion.button
                  key={option.value}
                  className={`size-btn ${cardSize === option.value ? 'active' : ''}`}
                  onClick={() => onCardSizeChange(option.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
            <div className="setting-hint">
              Afecta al tamaño de las tarjetas en toda la app
            </div>
          </div>

          {/* Información adicional */}
          <div className="setting-info">
            <p>✨ Los cambios se guardan automáticamente</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;