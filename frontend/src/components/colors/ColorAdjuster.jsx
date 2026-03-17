import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiRefreshCw } from 'react-icons/fi';
import chroma from 'chroma-js';

/**
 * Modal para ajustar tono, saturación y luminosidad de un color
 */
const ColorAdjuster = ({ isOpen, onClose, color, onApply }) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0.5);
  const [lightness, setLightness] = useState(0.5);
  const [adjustedColor, setAdjustedColor] = useState(color?.hex || '#000000');

  useEffect(() => {
    if (color?.hex) {
      try {
        const [h, s, l] = chroma(color.hex).hsl();
        setHue(Math.round(h) || 0);
        setSaturation(s);
        setLightness(l);
        setAdjustedColor(color.hex);
      } catch (e) {
        console.error('Error al parsear color:', e);
      }
    }
  }, [color, isOpen]);

  useEffect(() => {
    try {
      const newColor = chroma.hsl(hue, saturation, lightness).hex();
      setAdjustedColor(newColor);
    } catch (e) {}
  }, [hue, saturation, lightness]);

  const handleApply = () => {
    if (onApply) {
      onApply({
        ...color,
        hex: adjustedColor,
        name: `Ajustado: ${adjustedColor}`
      });
    }
    onClose();
  };

  const handleReset = () => {
    if (color?.hex) {
      try {
        const [h, s, l] = chroma(color.hex).hsl();
        setHue(Math.round(h) || 0);
        setSaturation(s);
        setLightness(l);
      } catch (e) {}
    }
  };

  if (!color) return null;

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
            className="color-adjuster"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adjuster-header">
              <h3>🎨 Ajustar color</h3>
              <button className="close-button" onClick={onClose}>
                <FiX />
              </button>
            </div>

            <div className="adjuster-content">
              <div className="color-previews">
                <div className="preview-item">
                  <span className="preview-label">Original</span>
                  <div className="preview-color" style={{ backgroundColor: color.hex }} />
                </div>
                <div className="preview-arrow">→</div>
                <div className="preview-item">
                  <span className="preview-label">Ajustado</span>
                  <div className="preview-color" style={{ backgroundColor: adjustedColor }} />
                </div>
              </div>

              <div className="adjuster-sliders">
                <div className="slider-group">
                  <div className="slider-header">
                    <span className="slider-label">Tono</span>
                    <span className="slider-value">{hue}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={hue}
                    onChange={(e) => setHue(parseInt(e.target.value))}
                    className="slider hue-slider"
                  />
                </div>

                <div className="slider-group">
                  <div className="slider-header">
                    <span className="slider-label">Saturación</span>
                    <span className="slider-value">{Math.round(saturation * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={saturation}
                    onChange={(e) => setSaturation(parseFloat(e.target.value))}
                    className="slider saturation-slider"
                  />
                </div>

                <div className="slider-group">
                  <div className="slider-header">
                    <span className="slider-label">Luminosidad</span>
                    <span className="slider-value">{Math.round(lightness * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={lightness}
                    onChange={(e) => setLightness(parseFloat(e.target.value))}
                    className="slider lightness-slider"
                  />
                </div>
              </div>

              <div className="adjuster-info">
                <div className="info-row">
                  <span className="info-label">HEX:</span>
                  <code className="info-value">{adjustedColor}</code>
                </div>
              </div>
            </div>

            <div className="adjuster-actions">
              <motion.button
                className="reset-btn"
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiRefreshCw /> Resetear
              </motion.button>
              <motion.button
                className="apply-btn"
                onClick={handleApply}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Aplicar cambios
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ColorAdjuster;