import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiCamera, 
  FiBookmark, 
  FiGrid, 
  FiUser, 
  FiSettings 
} from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

/**
 * Header principal de la aplicación con tabs y controles
 * @param {Object} props
 * @param {string} props.activeTab - Pestaña activa ('extractor', 'collections', 'mixer')
 * @param {Function} props.setActiveTab - Función para cambiar de pestaña
 * @param {boolean} props.darkMode - Estado del modo oscuro
 * @param {Function} props.setDarkMode - Función para cambiar modo oscuro
 * @param {Function} props.onProfileClick - Función al hacer clic en perfil
 * @param {Function} props.onSettingsClick - Función al hacer clic en configuración
 * @param {number} props.savedPalettesCount - Número de paletas guardadas
 */
const Header = ({ 
  activeTab, 
  setActiveTab, 
  darkMode, 
  setDarkMode,
  onProfileClick,
  onSettingsClick,
  savedPalettesCount = 0
}) => {
  const tabs = [
    { id: 'extractor', label: 'Extractor', icon: FiCamera },
    { id: 'collections', label: 'Colecciones', icon: FiBookmark, count: savedPalettesCount },
    { id: 'mixer', label: 'Mezclador', icon: FiGrid }
  ];

  return (
    <motion.header 
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="header-content">
        <div className="header-left">
          <motion.h1 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            🎨 Chromp
          </motion.h1>
          <p>Descubre los colores que te rodean</p>
        </div>
        
        <div className="header-right">
          {/* Modo oscuro */}
          <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />

          {/* Perfil */}
          <motion.button
            className="icon-button"
            onClick={onProfileClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Perfil"
          >
            <FiUser />
          </motion.button>

          {/* Tabs */}
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon />
              {tab.label}
              {tab.count > 0 && (
                <span className="tab-count">{tab.count}</span>
              )}
            </motion.button>
          ))}

          {/* Configuración */}
          <motion.button
            className="icon-button"
            onClick={onSettingsClick}
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            title="Configuración"
          >
            <FiSettings />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;