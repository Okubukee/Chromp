import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiGrid, FiHeart } from 'react-icons/fi';
import chroma from 'chroma-js';
import { v4 as uuidv4 } from 'uuid';

import ColorCard from '../components/colors/ColorCard';
import EmptyState from '../components/common/EmptyState';
import NameInputModal from '../components/common/NameInputModal';

const MixerPage = ({ 
  savedPalettes = [], 
  setSavedPalettes, 
  currentUser, 
  setCurrentUser,
  cardSize = 'medium', 
  onCopyColor 
}) => {
  useEffect(() => {
    console.log('MixerPage props:', {
      savedPalettes: savedPalettes?.length,
      setSavedPalettes: typeof setSavedPalettes,
      currentUser: currentUser?.name,
      setCurrentUser: typeof setCurrentUser,
      cardSize,
      onCopyColor: typeof onCopyColor
    });
  }, [
    savedPalettes, 
    setSavedPalettes, 
    currentUser, 
    setCurrentUser, 
    cardSize, 
    onCopyColor
  ]); 

  const [palette1, setPalette1] = useState(null);
  const [palette2, setPalette2] = useState(null);
  const [mixedPalette, setMixedPalette] = useState([]);
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [collectionName, setCollectionName] = useState('');

  if (typeof setSavedPalettes !== 'function') {
    console.error('❌ setSavedPalettes no es función en MixerPage', setSavedPalettes);
    return <div>Error: setSavedPalettes no está disponible</div>;
  }

  if (typeof setCurrentUser !== 'function') {
    console.error('❌ setCurrentUser no es función en MixerPage', setCurrentUser);
    return <div>Error: setCurrentUser no está disponible</div>;
  }

  const mixPalettes = () => {
    if (!palette1 || !palette2) {
      toast.warning('Selecciona dos paletas para mezclar');
      return;
    }

    const mixed = [];
    const maxLength = Math.max(palette1.colors.length, palette2.colors.length);

    for (let i = 0; i < maxLength; i++) {
      const color1 = palette1.colors[i % palette1.colors.length];
      const color2 = palette2.colors[i % palette2.colors.length];
      
      if (color1 && color2) {
        const mixedHex = chroma.mix(color1, color2, 0.5).hex();
        
        const name1 = palette1.colorNames?.[i % palette1.colors.length] || 'Color';
        const name2 = palette2.colorNames?.[i % palette2.colors.length] || 'Color';
        
        mixed.push({
          id: uuidv4(),
          hex: mixedHex,
          name: `Mezcla: ${name1} + ${name2}`,
          percentage: Math.floor(100 / maxLength)
        });
      }
    }

    setMixedPalette(mixed);
    toast.success(`🎨 Mezcla de "${palette1.name}" y "${palette2.name}"`);
  };

  const handleSaveMixedPalette = () => {
    if (mixedPalette.length === 0) {
      toast.warning('No hay paleta mezclada para guardar');
      return;
    }
    setShowSaveModal(true);
  };

  const confirmSaveMixedPalette = () => {
    if (!collectionName.trim()) {
      toast.warning('Escribe un nombre para la colección');
      return;
    }

    const newPalette = {
      id: uuidv4(),
      name: collectionName,
      colors: mixedPalette.map(c => c.hex),
      colorNames: mixedPalette.map(c => c.name),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      theme: 'Mezcla',
      source: {
        palette1: palette1?.name,
        palette2: palette2?.name
      }
    };

    if (typeof setSavedPalettes === 'function') {
      setSavedPalettes([newPalette, ...savedPalettes].slice(0, 50));
    } else {
      console.error('setSavedPalettes no es función', setSavedPalettes);
      toast.error('Error al guardar: función no disponible');
      return;
    }
    
    if (typeof setCurrentUser === 'function') {
      setCurrentUser({
        ...currentUser,
        palettesCount: (currentUser.palettesCount || 0) + 1
      });
    }

    setShowSaveModal(false);
    setCollectionName('');
    
    toast.success(`💾 Mezcla guardada como "${collectionName}"`);
  };

  const cancelSave = () => {
    setShowSaveModal(false);
    setCollectionName('');
  };

  if (savedPalettes.length === 0) {
    return (
      <EmptyState
        message="No hay paletas para mezclar"
        hint="Guarda algunas paletas primero"
        icon={<FiGrid className="empty-icon" />}
      />
    );
  }

  return (
    <motion.div 
      className="mixer-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <NameInputModal
        isOpen={showSaveModal}
        value={collectionName}
        onChange={(val) => setCollectionName(val)}
        onConfirm={() => confirmSaveMixedPalette()}
        onCancel={() => cancelSave()}
        title="Guardar mezcla"
        placeholder="Nombre de la colección"
      />

      <h2>🎨 Mezclador de paletas</h2>
      
      <div className="mixer-container">
        <div className="mixer-palettes">
          {/* Paleta 1 */}
          <div className="mixer-palette">
            <h3>Paleta 1 {palette1 && `: ${palette1.name}`}</h3>
            <div className="mixer-colors">
              {savedPalettes.map((palette) => (
                <motion.div
                  key={palette.id}
                  className={`mixer-palette-option ${palette1?.id === palette.id ? 'selected' : ''}`}
                  onClick={() => setPalette1(palette)}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="mixer-palette-name">{palette.name}</span>
                  <div className="mixer-palette-mini">
                    {palette.colors.map((hex, j) => (
                      <div
                        key={j}
                        className="mini-color"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Paleta 2 */}
          <div className="mixer-palette">
            <h3>Paleta 2 {palette2 && `: ${palette2.name}`}</h3>
            <div className="mixer-colors">
              {savedPalettes.map((palette) => (
                <motion.div
                  key={palette.id}
                  className={`mixer-palette-option ${palette2?.id === palette.id ? 'selected' : ''}`}
                  onClick={() => setPalette2(palette)}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="mixer-palette-name">{palette.name}</span>
                  <div className="mixer-palette-mini">
                    {palette.colors.map((hex, j) => (
                      <div
                        key={j}
                        className="mini-color"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {palette1 && palette2 && (
          <motion.button
            className="mix-button"
            onClick={mixPalettes}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiGrid /> Mezclar "{palette1.name}" y "{palette2.name}"
          </motion.button>
        )}

        {mixedPalette.length > 0 && (
          <motion.div
            className="mixed-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mixed-header">
              <h3>Resultado de la mezcla</h3>
              <motion.button
                className="save-mix-btn"
                onClick={handleSaveMixedPalette}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiHeart /> Guardar mezcla
              </motion.button>
            </div>
            
            <div className={`mixed-colors grid-${cardSize}`}>
              {mixedPalette.map((color, i) => (
                <ColorCard
                  key={color.id}
                  color={color}
                  index={i}
                  cardSize={cardSize}
                  onCopy={onCopyColor}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MixerPage;