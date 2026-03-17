import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiBookmark, FiEdit, FiTrash2 } from 'react-icons/fi';

import EmptyState from '../components/common/EmptyState';

/**
 * Página de colecciones guardadas
 */
const CollectionsPage = ({ 
  savedPalettes, 
  setSavedPalettes, 
  currentUser, 
  setCurrentUser,
  cardSize = 'medium',
  onCopyColor
}) => {
  const [editingPalette, setEditingPalette] = useState(null);
  const [editName, setEditName] = useState('');

  const handleDelete = (id) => {
    const updated = savedPalettes.filter(p => p.id !== id);
    setSavedPalettes(updated);
    
    setCurrentUser({
      ...currentUser,
      palettesCount: Math.max(0, (currentUser.palettesCount || 0) - 1)
    });
    
    toast.info('🗑️ Colección eliminada');
  };

  const startEdit = (palette) => {
    setEditingPalette(palette.id);
    setEditName(palette.name);
  };

  const saveEdit = () => {
    if (!editName.trim()) {
      toast.warning('El nombre no puede estar vacío');
      return;
    }

    const updated = savedPalettes.map(p => 
      p.id === editingPalette ? { ...p, name: editName } : p
    );
    
    setSavedPalettes(updated);
    setEditingPalette(null);
    setEditName('');
    toast.success('✏️ Nombre actualizado');
  };

  const cancelEdit = () => {
    setEditingPalette(null);
    setEditName('');
  };

  if (savedPalettes.length === 0) {
    return (
      <EmptyState
        message="Aún no tienes colecciones guardadas"
        hint="Extrae colores de imágenes o genera paletas aleatorias"
        icon={<FiBookmark className="empty-icon" />}
      />
    );
  }

  return (
    <motion.div 
      className="collections-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2>📚 Tus colecciones</h2>
      
      <div className={`saved-palettes-grid grid-${cardSize}`}>
        {savedPalettes.map((palette) => (
          <motion.div
            key={palette.id}
            className={`saved-palette-card card-${cardSize}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
          >
            {editingPalette === palette.id ? (
              <div className="palette-edit">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                />
                <div className="palette-edit-actions">
                  <button onClick={saveEdit} className="edit-confirm">
                    ✓
                  </button>
                  <button onClick={cancelEdit} className="edit-cancel">
                    ✗
                  </button>
                </div>
              </div>
            ) : (
              <div className="palette-header">
                <h3 className="palette-name" title={palette.name}>
                  {palette.name}
                </h3>
                <div className="palette-actions">
                  <button 
                    onClick={() => startEdit(palette)} 
                    className="palette-edit-btn"
                    title="Editar nombre"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    onClick={() => handleDelete(palette.id)} 
                    className="palette-delete-btn"
                    title="Eliminar colección"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            )}
            
            <div className="saved-palette-colors">
              {palette.colors.map((hex, i) => (
                <div
                  key={i}
                  className="saved-color"
                  style={{ backgroundColor: hex }}
                  onClick={() => onCopyColor?.(hex, palette.colorNames?.[i])}
                  title={hex}
                />
              ))}
            </div>
            
            <div className="saved-palette-info">
              <span className="saved-date">{palette.date}</span>
              {palette.theme && (
                <span className="saved-theme">{palette.theme}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CollectionsPage;