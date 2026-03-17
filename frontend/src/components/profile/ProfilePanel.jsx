import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiEdit2, FiSave } from 'react-icons/fi';
import ProfileStats from './ProfileStats';

/**
 * Panel completo de perfil de usuario
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla si el panel está visible
 * @param {Function} props.onClose - Función para cerrar el panel
 * @param {Object} props.user - Datos del usuario
 * @param {Function} props.onUpdateUser - Función para actualizar usuario
 * @param {Array} props.savedPalettes - Paletas guardadas
 * @param {Object} props.stats - Estadísticas calculadas
 * @param {Function} props.onCopyColor - Función para copiar color
 * @param {Function} props.onExport - Función para exportar datos
 */
const ProfilePanel = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  savedPalettes = [],
  stats,
  onCopyColor,
  onExport
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleStartEdit = () => {
    setEditedUser({ ...user });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="profile-panel"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div className="profile-header">
            <h2>👤 Perfil</h2>
            <button className="close-button" onClick={onClose}>
              <FiX />
            </button>
          </div>

          {isEditing ? (
            <div className="profile-edit">
              <div className="profile-avatar-large">
                <span className="avatar-emoji">{editedUser.avatar || '🎨'}</span>
              </div>
              
              <div className="edit-field">
                <label>Nombre</label>
                <input
                  type="text"
                  value={editedUser.name || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  placeholder="Tu nombre"
                />
              </div>

              <div className="edit-field">
                <label>Avatar (emoji)</label>
                <input
                  type="text"
                  value={editedUser.avatar || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, avatar: e.target.value })}
                  placeholder="🎨"
                  maxLength="2"
                />
              </div>

              <div className="edit-field">
                <label>Biografía</label>
                <textarea
                  value={editedUser.bio || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                  placeholder="Cuéntanos sobre ti..."
                  rows="3"
                />
              </div>

              <div className="profile-edit-actions">
                <motion.button
                  className="save-edit-btn"
                  onClick={handleSaveEdit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiSave /> Guardar cambios
                </motion.button>
                
                <motion.button
                  className="cancel-edit-btn"
                  onClick={handleCancelEdit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <div className="profile-avatar-large">
                <span className="avatar-emoji">{user.avatar || '🎨'}</span>
              </div>
              
              <h3>{user.name || 'Usuario Chromp'}</h3>
              <p className="profile-bio">{user.bio || 'Amante de los colores'}</p>

              {/* Estadísticas */}
              <ProfileStats
                palettesCount={savedPalettes.length}
                uniqueColorsCount={stats?.uniqueColorsCount || 0}
                favoriteColors={stats?.favoriteColors || []}
                detailedStats={stats?.detailedStats}
                onCopyColor={onCopyColor}
                onExport={onExport}
                showExport={savedPalettes.length > 0}
              />

              {/* Botón de editar */}
              <motion.button
                className="edit-profile-btn"
                onClick={handleStartEdit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiEdit2 /> Editar perfil
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePanel;