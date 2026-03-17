import React from 'react';
import { motion } from 'framer-motion';
import { FiBookmark } from 'react-icons/fi';

/**
 * Componente para mostrar estados vacíos
 * @param {Object} props
 * @param {string} props.message - Mensaje principal
 * @param {string} props.hint - Sugerencia o mensaje secundario
 * @param {React.ReactNode} props.icon - Icono personalizado (opcional)
 */
const EmptyState = ({ 
  message = "Aún no tienes elementos", 
  hint = "Comienza creando algo nuevo",
  icon = <FiBookmark className="empty-icon" />
}) => {
  return (
    <motion.div 
      className="empty-state"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {icon}
      </motion.div>
      <p>{message}</p>
      <p className="empty-hint">{hint}</p>
    </motion.div>
  );
};

export default EmptyState;