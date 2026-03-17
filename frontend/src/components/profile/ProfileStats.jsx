import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBarChart2, FiDownload, FiStar } from 'react-icons/fi';

/**
 * Componente de estadísticas para el perfil
 * @param {Object} props
 * @param {number} props.palettesCount - Número de paletas guardadas
 * @param {number} props.uniqueColorsCount - Número de colores únicos
 * @param {Array} props.favoriteColors - Array de colores favoritos (hex)
 * @param {Object} props.detailedStats - Estadísticas detalladas (opcional)
 * @param {Function} props.onCopyColor - Función al copiar un color
 * @param {Function} props.onExport - Función al exportar datos
 * @param {boolean} props.showExport - Mostrar botón de exportar
 */
const ProfileStats = ({ 
  palettesCount = 0,
  uniqueColorsCount = 0,
  favoriteColors = [],
  detailedStats = null,
  onCopyColor,
  onExport,
  showExport = true
}) => {
  const [showDetailedStats, setShowDetailedStats] = useState(false);

  const BasicStats = () => (
    <div className="profile-stats-simple">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <strong>{palettesCount}</strong>
        <span>Paletas guardadas</span>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <strong>{uniqueColorsCount}</strong>
        <span>Colores únicos</span>
      </motion.div>
    </div>
  );

  const FavoriteColors = () => {
  if (favoriteColors.length === 0) return null;

  return (
    <motion.div 
      className="favorite-colors-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h4>
        <FiStar style={{ marginRight: '5px' }} /> 
        Tus colores favoritos
        <span className="favorite-subtitle">(los más repetidos)</span>
      </h4>
      <div className="favorite-colors">
        {favoriteColors.map((hex, i) => (
          <motion.div
            key={i}
            className="favorite-color-dot"
            style={{ backgroundColor: hex }}
            onClick={() => onCopyColor?.(hex, 'Color favorito')}
            title={`${hex} - #${i + 1} más usado`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
          />
        ))}
      </div>
      <p className="favorite-info">
        Basado en {detailedStats?.total || 0} colores individuales
      </p>
    </motion.div>
  );
};

  const StatsToggle = () => {
    if (!detailedStats) return null;

    return (
      <motion.button 
        className="stats-toggle-btn"
        onClick={() => setShowDetailedStats(!showDetailedStats)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <FiBarChart2 /> 
        {showDetailedStats ? 'Ocultar' : 'Ver'} estadísticas detalladas
      </motion.button>
    );
  };

const DetailedStats = () => {
  if (!detailedStats || !showDetailedStats) return null;

  const total = detailedStats.total || 1; 

  const warmPercent = Math.round((detailedStats.warm / total) * 100);
  const coldPercent = Math.round((detailedStats.cold / total) * 100);
  
  const vibrantPercent = Math.round((detailedStats.vibrant / total) * 100);
  const pastelPercent = Math.round((detailedStats.pastel / total) * 100);
  const mediumSaturationPercent = 100 - vibrantPercent - pastelPercent;
  
  const darkPercent = Math.round((detailedStats.dark / total) * 100);
  const lightPercent = Math.round((detailedStats.light / total) * 100);
  const mediumLightPercent = 100 - darkPercent - lightPercent;

  return (
    <motion.div 
      className="detailed-stats"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <h4>📊 Distribución de colores</h4>
      
      {/* Temperatura */}
      <div className="stat-item">
        <span>Temperatura</span>
        <div className="stat-bars">
          <StatBar 
            label="Cálidos" 
            value={detailedStats.warm} 
            total={total}
            barClass="warm-bar"
          />
          <StatBar 
            label="Fríos" 
            value={detailedStats.cold} 
            total={total}
            barClass="cold-bar"
          />
        </div>
        <div className="stat-summary">
          <span className="stat-note">Total: {warmPercent}% cálidos · {coldPercent}% fríos</span>
        </div>
      </div>

      {/* Saturación */}
      <div className="stat-item">
        <span>Saturación</span>
        <div className="stat-bars">
          <StatBar 
            label="Vibrantes" 
            value={detailedStats.vibrant} 
            total={total}
            barClass="vibrant-bar"
          />
          <StatBar 
            label="Pastel" 
            value={detailedStats.pastel} 
            total={total}
            barClass="pastel-bar"
          />
        </div>
        <div className="stat-summary">
          <span className="stat-note">
            {vibrantPercent}% vibrantes · {pastelPercent}% pastel · {mediumSaturationPercent}% saturación media
          </span>
        </div>
      </div>

      {/* Luminosidad */}
      <div className="stat-item">
        <span>Luminosidad</span>
        <div className="stat-bars">
          <StatBar 
            label="Oscuros" 
            value={detailedStats.dark} 
            total={total}
            barClass="dark-bar"
          />
          <StatBar 
            label="Claros" 
            value={detailedStats.light} 
            total={total}
            barClass="light-bar"
          />
        </div>
        <div className="stat-summary">
          <span className="stat-note">
            {darkPercent}% oscuros · {lightPercent}% claros · {mediumLightPercent}% luminosidad media
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const StatBar = ({ label, value, total, barClass }) => {
  const percentage = Math.round((value / total) * 100);
  
  return (
    <div className="stat-bar">
      <span>{label}</span>
      <div className="bar-container">
        <motion.div 
          className={`bar ${barClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
      <span>{percentage}%</span>
    </div>
  );
};

  const ExportButton = () => {
    if (!showExport || !onExport) return null;

    return (
      <motion.button
        onClick={onExport}
        className="export-btn"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <FiDownload /> Exportar mis datos
      </motion.button>
    );
  };

  return (
    <div className="profile-stats-container">
      <BasicStats />
      <FavoriteColors />
      <StatsToggle />
      <AnimatePresence>
        <DetailedStats />
      </AnimatePresence>
      <ExportButton />
    </div>
  );
};

export default ProfileStats;