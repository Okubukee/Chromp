import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import Switch from 'react-switch';

/**
 * Componente para cambiar entre modo claro y oscuro
 * @param {Object} props
 * @param {boolean} props.darkMode - Estado actual del modo oscuro
 * @param {Function} props.onToggle - Función al cambiar
 */
const ThemeToggle = ({ darkMode, onToggle }) => {
  return (
    <div className="theme-toggle">
      <motion.div
        animate={{ scale: darkMode ? 1 : 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <FiSun className={!darkMode ? 'active' : ''} />
      </motion.div>
      
      <Switch
        onChange={onToggle}
        checked={darkMode}
        offColor="#ffa502"
        onColor="#2f3542"
        uncheckedIcon={false}
        checkedIcon={false}
        height={20}
        width={40}
      />
      
      <motion.div
        animate={{ scale: darkMode ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <FiMoon className={darkMode ? 'active' : ''} />
      </motion.div>
    </div>
  );
};

export default ThemeToggle;