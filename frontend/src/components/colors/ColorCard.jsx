import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiChevronDown, FiChevronUp, FiLock, FiUnlock, FiSliders } from 'react-icons/fi';
import chroma from 'chroma-js';

const ColorCard = ({ 
  color, 
  index = 0, 
  cardSize = 'medium', 
  onCopy,
  onToggleLock,
  onAdjust,
  isLocked = false
}) => {
  const [copied, setCopied] = useState(false);
  const [showFormats, setShowFormats] = useState(false);

  const handleCopy = (format, value) => {
    if (onCopy) {
      onCopy(value, `${color.name} (${format})`);
    }
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLockToggle = (e) => {
    e.stopPropagation();
    if (onToggleLock) {
      onToggleLock(color.id);
    }
  };

  const handleAdjust = (e) => {
    e.stopPropagation();
    if (onAdjust) {
      onAdjust(color);
    }
  };

  // Calcular formatos adicionales
  const getFormats = () => {
    try {
      const rgb = chroma(color.hex).rgb();
      const hsl = chroma(color.hex).hsl();
      const cmyk = chroma(color.hex).cmyk();
      
      return {
        rgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
        hsl: `hsl(${Math.round(hsl[0])}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`,
        cmyk: `cmyk(${Math.round(cmyk[0] * 100)}%, ${Math.round(cmyk[1] * 100)}%, ${Math.round(cmyk[2] * 100)}%, ${Math.round(cmyk[3] * 100)}%)`
      };
    } catch (e) {
      return null;
    }
  };

  const formats = getFormats();

  return (
    <motion.div
      className={`color-card card-${cardSize} ${isLocked ? 'locked' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div 
        className="color-preview"
        style={{ backgroundColor: color.hex }}
      >
        <span className="color-percent-badge">{color.percentage}%</span>
        
        <button
          className="adjust-button"
          onClick={handleAdjust}
          title="Ajustar color"
        >
          <FiSliders />
        </button>

        <button
          className={`lock-button ${isLocked ? 'locked' : ''}`}
          onClick={handleLockToggle}
          title={isLocked ? 'Desbloquear color' : 'Bloquear color'}
        >
          {isLocked ? <FiLock /> : <FiUnlock />}
        </button>
      </div>
      
      <div className="color-details">
        <span className="color-name">{color.name}</span>
        <div className="color-formats">
          <div className="color-format-row">
            <span className="format-label">HEX</span>
            <span className="format-value">{color.hex}</span>
            <button
              className={`format-copy ${copied ? 'copied' : ''}`}
              onClick={() => handleCopy('HEX', color.hex)}
              title="Copiar HEX"
            >
              <FiCopy />
            </button>
          </div>

          <button 
            className="toggle-formats"
            onClick={() => setShowFormats(!showFormats)}
          >
            {showFormats ? <FiChevronUp /> : <FiChevronDown />}
            {showFormats ? 'Ocultar formatos' : 'Ver más formatos'}
          </button>

          {showFormats && formats && (
            <motion.div 
              className="additional-formats"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="color-format-row">
                <span className="format-label">RGB</span>
                <span className="format-value">{formats.rgb}</span>
                <button
                  className="format-copy"
                  onClick={() => handleCopy('RGB', formats.rgb)}
                  title="Copiar RGB"
                >
                  <FiCopy />
                </button>
              </div>

              <div className="color-format-row">
                <span className="format-label">HSL</span>
                <span className="format-value">{formats.hsl}</span>
                <button
                  className="format-copy"
                  onClick={() => handleCopy('HSL', formats.hsl)}
                  title="Copiar HSL"
                >
                  <FiCopy />
                </button>
              </div>

              <div className="color-format-row">
                <span className="format-label">CMYK</span>
                <span className="format-value">{formats.cmyk}</span>
                <button
                  className="format-copy"
                  onClick={() => handleCopy('CMYK', formats.cmyk)}
                  title="Copiar CMYK"
                >
                  <FiCopy />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {(color.temperature || color.luminance) && (
        <div className="color-metadata">
          {color.temperature && (
            <span className="color-temp">{color.temperature}</span>
          )}
          {color.luminance && (
            <span className="color-lum">L: {color.luminance}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ColorCard;