import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import chroma from 'chroma-js';

import UploadArea from '../components/upload/UploadArea';
import ColorCard from '../components/colors/ColorCard';
import NameInputModal from '../components/common/NameInputModal';
import ColorAdjuster from '../components/colors/ColorAdjuster';
import VariationsModal from '../components/colors/VariationsModal';
import ColorBlindnessModal from '../components/colors/ColorBlindnessModal';

import { generateRandomPalette, generatePaletteVariations, generateFilteredRandomPalette, colorFilters } from '../utils/colorUtils';
import { findColorName } from '../utils/colorNames';
import { blindnessTypes } from '../utils/colorBlindness';  
import { FiX } from 'react-icons/fi';


const possibleUrls = [
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://backend:5000'
];

const sortOptions = [
  { value: 'default', label: 'Original' },
  { value: 'hue', label: 'Por tono' },
  { value: 'saturation', label: 'Por saturación' },
  { value: 'lightness', label: 'Por luminosidad' },
  { value: 'random', label: 'Aleatorio' }
];

const ExtractorPage = ({ 
  savedPalettes, 
  setSavedPalettes, 
  currentUser, 
  setCurrentUser,
  cardSize = 'medium',
  colorCount = 5
}) => {
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [lockedColors, setLockedColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [randomTheme, setRandomTheme] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [backendUrl, setBackendUrl] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [adjustingColor, setAdjustingColor] = useState(null);
  const [showAdjuster, setShowAdjuster] = useState(false);
  const [variations, setVariations] = useState(null);
  const [showVariations, setShowVariations] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [showBlindnessModal, setShowBlindnessModal] = useState(false);

  useEffect(() => {
    const checkBackends = async () => {
      for (const url of possibleUrls) {
        try {
          console.log(`🔍 Probando backend en: ${url}/health`);
          const response = await fetch(`${url}/health`, { 
            mode: 'cors',
            timeout: 2000 
          });
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Backend encontrado en ${url}:`, data);
            setBackendUrl(url);
            return;
          }
        } catch (err) {
          console.log(`❌ No disponible: ${url}`);
        }
      }
      console.warn('⚠️ No se pudo conectar a ningún backend');
    };
    
    checkBackends();
  }, []);

  const handleApplyColorBlindness = (simulatedColors, type) => {
    setColors(simulatedColors);
    const typeName = blindnessTypes.find(t => t.id === type)?.name;
    toast.info(`👁️ Simulación de ${typeName} aplicada`);
  };

  const sortColors = (colorsToSort, criterion) => {
    if (criterion === 'default' || !colorsToSort.length) return colorsToSort;
    
    const colorsCopy = [...colorsToSort];
    
    switch (criterion) {
      case 'hue':
        return colorsCopy.sort((a, b) => {
          const [h1] = chroma(a.hex).hsl();
          const [h2] = chroma(b.hex).hsl();
          return h1 - h2;
        });
      case 'saturation':
        return colorsCopy.sort((a, b) => {
          const [, s1] = chroma(a.hex).hsl();
          const [, s2] = chroma(b.hex).hsl();
          return s2 - s1;
        });
      case 'lightness':
        return colorsCopy.sort((a, b) => {
          const [, , l1] = chroma(a.hex).hsl();
          const [, , l2] = chroma(b.hex).hsl();
          return l2 - l1;
        });
      case 'random':
        return colorsCopy.sort(() => Math.random() - 0.5);
      default:
        return colorsCopy;
    }
  };

  const handleToggleLock = (colorId) => {
    setLockedColors(prev => {
      if (prev.includes(colorId)) {
        return prev.filter(id => id !== colorId);
      } else {
        return [...prev, colorId];
      }
    });
  };

  const generateNewPalette = (baseColors) => {
    if (lockedColors.length === 0) return baseColors;
    
    const lockedColorObjects = colors.filter(c => lockedColors.includes(c.id));
    const result = [...lockedColorObjects];
    
    const neededCount = colorCount - result.length;
    if (neededCount > 0) {
      const newUnlocked = baseColors.slice(0, neededCount);
      result.push(...newUnlocked);
    }
    
    return result;
  };

  const handleAdjustColor = (color) => {
    setAdjustingColor(color);
    setShowAdjuster(true);
  };

  const handleApplyAdjustment = (adjustedColor) => {
    setColors(prevColors => 
      prevColors.map(c => 
        c.id === adjustingColor.id ? adjustedColor : c
      )
    );
    toast.success(`🎨 Color ajustado a ${adjustedColor.hex}`);
  };

  const handleGenerateVariations = () => {
    if (colors.length === 0) {
      toast.warning('Primero genera una paleta');
      return;
    }
    
    const newVariations = generatePaletteVariations(colors);
    setVariations(newVariations);
    setShowVariations(true);
  };

  const handleApplyVariation = (key, variationColors) => {
    setColors(variationColors);
    toast.success(`✅ Aplicada variación: ${key}`);
  };

  const handleGenerateFilteredPalette = () => {
    if (activeFilters.length === 0) {
      toast.warning('Selecciona al menos un filtro');
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const { colors: filteredColors, theme } = generateFilteredRandomPalette(colorCount, activeFilters);
      setColors(filteredColors);
      setRandomTheme(theme);
      setImage(null);
      setLoading(false);
      setShowFilters(false);
      toast.success(`🎨 Paleta generada con ${activeFilters.length} filtro(s)`);
    }, 1000);
  };

  const toggleFilter = (filterId) => {
    setActiveFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  const handleImageSelect = async (file) => {
    setLoading(true);
    
    if (!backendUrl) {
      toast.warning('Backend no disponible. Usando simulación.');
      simulateImageProcessing(file);
      return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('n_colors', colorCount.toString());

    try {
      const response = await fetch(`${backendUrl}/extract`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        const extractedColors = data.colors.map((c, index) => ({
          id: `color-${Date.now()}-${index}-${Math.random()}`,
          hex: c.hex,
          name: findColorName(c.hex),
          percentage: c.percentage,
          rgb: c.rgb
        }));

        const sortedColors = sortColors(extractedColors, sortBy);
        setColors(sortedColors);
        
        const reader = new FileReader();
        reader.onload = (e) => setImage(e.target.result);
        reader.readAsDataURL(file);
        
        toast.success('✨ Colores extraídos correctamente');
      } else {
        toast.error('Error al extraer colores');
        simulateImageProcessing(file);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al conectar con el backend. Usando simulación.');
      simulateImageProcessing(file);
    } finally {
      setLoading(false);
    }
  };

  const simulateImageProcessing = (file) => {
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        
        const mockColors = [
          { hex: '#FF6B6B', name: 'Coral', percentage: 35 },
          { hex: '#4ECDC4', name: 'Turquesa', percentage: 25 },
          { hex: '#FFE66D', name: 'Amarillo', percentage: 20 },
          { hex: '#6BCB77', name: 'Verde', percentage: 12 },
          { hex: '#9B59B6', name: 'Púrpura', percentage: 8 }
        ].slice(0, colorCount).map((c, i) => ({
          id: `color-${Date.now()}-${i}-${Math.random()}`,
          ...c,
          name: findColorName(c.hex)
        }));
        
        const sortedColors = sortColors(mockColors, sortBy);
        setColors(sortedColors);
      };
      reader.readAsDataURL(file);
    }, 1000);
  };

  const handleRandomPalette = () => {
    setLoading(true);
    
    setTimeout(() => {
      const { colors: randomColors, theme } = generateRandomPalette(colorCount);
      
      const sortedColors = sortColors(randomColors, sortBy);
      const finalColors = generateNewPalette(sortedColors);
      
      setColors(finalColors);
      setRandomTheme(theme);
      setImage(null);
      setLoading(false);
      toast.success(`🎨 Paleta ${theme} generada`);
    }, 1000);
  };

  const handleSortChange = (option) => {
    setSortBy(option);
    setShowSortOptions(false);
    
    if (colors.length > 0) {
      const sorted = sortColors(colors, option);
      setColors(sorted);
      toast.info(`🔄 Colores ordenados por ${sortOptions.find(o => o.value === option)?.label}`);
    }
  };

  const handleSavePalette = () => {
    if (colors.length === 0) {
      toast.warning('No hay colores para guardar');
      return;
    }
    setShowNameInput(true);
  };

  const confirmSavePalette = () => {
    if (!collectionName.trim()) {
      toast.warning('Escribe un nombre para la colección');
      return;
    }

    const newPalette = {
      id: uuidv4(),
      name: collectionName,
      colors: colors.map(c => c.hex),
      colorNames: colors.map(c => c.name),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      image: image,
      theme: randomTheme
    };

    setSavedPalettes([newPalette, ...savedPalettes].slice(0, 50));
    
    setCurrentUser({
      ...currentUser,
      palettesCount: (currentUser.palettesCount || 0) + 1
    });

    setShowNameInput(false);
    setCollectionName('');
    setImage(null);
    setColors([]);
    setLockedColors([]);
    
    toast.success(`💾 Colección "${collectionName}" guardada`);
  };

  const cancelSave = () => {
    setShowNameInput(false);
    setCollectionName('');
  };

  const handleReset = () => {
    setImage(null);
    setColors([]);
    setLockedColors([]);
    setRandomTheme('');
  };

  return (
    <div className="extractor-page">
      <NameInputModal
        isOpen={showNameInput}
        value={collectionName}
        onChange={setCollectionName}
        onConfirm={confirmSavePalette}
        onCancel={cancelSave}
        title="Guardar colección"
        placeholder="Nombre de la colección"
      />

      <ColorAdjuster
        isOpen={showAdjuster}
        onClose={() => setShowAdjuster(false)}
        color={adjustingColor}
        onApply={handleApplyAdjustment}
      />

      <VariationsModal
        isOpen={showVariations}
        onClose={() => setShowVariations(false)}
        variations={variations}
        onSelectVariation={handleApplyVariation}
      />

      <ColorBlindnessModal
        isOpen={showBlindnessModal}
        onClose={() => setShowBlindnessModal(false)}
        colors={colors}
        onApply={handleApplyColorBlindness}
      />

      {/* Modal de filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              className="filters-modal"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="filters-header">
                <h3>🔍 Filtros de color</h3>
                <button className="close-button" onClick={() => setShowFilters(false)}>
                  <FiX />
                </button>
              </div>

              <div className="filters-grid">
                {colorFilters.map(filter => (
                  <motion.div
                    key={filter.id}
                    className={`filter-card ${activeFilters.includes(filter.id) ? 'active' : ''}`}
                    onClick={() => toggleFilter(filter.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h4>{filter.name}</h4>
                    <p>{filter.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="filters-actions">
                <button 
                  className="clear-btn"
                  onClick={() => setActiveFilters([])}
                >
                  Limpiar filtros
                </button>
                <button 
                  className="apply-btn"
                  onClick={handleGenerateFilteredPalette}
                  disabled={activeFilters.length === 0}
                >
                  Generar con {activeFilters.length} filtro(s)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!image && colors.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <UploadArea onImageSelect={handleImageSelect} disabled={loading} />
          
          <motion.button
            className="random-button"
            onClick={handleRandomPalette}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            <span className={loading ? 'spinning' : ''}>🎲</span>
            {loading ? 'Generando...' : 'Generar paleta aleatoria'}
            {randomTheme && !loading && (
              <span className="random-theme-badge">{randomTheme}</span>
            )}
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="results"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <div className="action-bar">
            <motion.button
              className="reset-button"
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              ← Nueva imagen
            </motion.button>
            
            <div className="action-buttons">
              <motion.button
                className="action-btn"
                onClick={handleGenerateVariations}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={colors.length === 0}
              >
                🔄 Variaciones
              </motion.button>

              <motion.button
                className="action-btn"
                onClick={() => setShowFilters(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔍 Filtros
              </motion.button>

              <motion.button
                className="action-btn"
                onClick={() => setShowBlindnessModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={colors.length === 0}
              >
                👁️ Daltonismo
              </motion.button>

              {/* Botón de ordenamiento */}
              <div className="sort-dropdown">
                <motion.button
                  className="action-btn sort-btn"
                  onClick={() => setShowSortOptions(!showSortOptions)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔽 Ordenar
                </motion.button>
                
                {showSortOptions && (
                  <motion.div 
                    className="sort-options"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        className={`sort-option ${sortBy === option.value ? 'active' : ''}`}
                        onClick={() => handleSortChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <motion.button
                className="action-btn"
                onClick={handleSavePalette}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || colors.length === 0}
              >
                💾 Guardar
              </motion.button>
            </div>
          </div>

          {image && (
            <div className="preview-section">
              <motion.div 
                className="image-container" 
                whileHover={{ scale: 1.02 }}
              >
                <img src={image} alt="Preview" className="preview-image" />
              </motion.div>
            </div>
          )}

          {!image && randomTheme && (
            <div className="random-palette-header">
              <h3>🎲 Paleta aleatoria: {randomTheme}</h3>
              <div className="random-palette-actions">
                <button 
                  className="save-palette-btn"
                  onClick={handleSavePalette}
                  disabled={loading}
                >
                  💾 Guardar paleta
                </button>
                <button 
                  className="new-random-btn"
                  onClick={handleRandomPalette}
                  disabled={loading}
                >
                  🎲 Otra
                </button>
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="colors-section">
              <h2>🎨 Paleta de colores</h2>
              <div className={`colors-grid grid-${cardSize}`}>
                {colors.map((color, index) => (
                  <ColorCard
                    key={color.id}
                    color={color}
                    index={index}
                    cardSize={cardSize}
                    onCopy={(hex, name) => {
                      navigator.clipboard.writeText(hex);
                      toast.success(`✅ ${name || hex} copiado`);
                    }}
                    onToggleLock={handleToggleLock}
                    onAdjust={handleAdjustColor}
                    isLocked={lockedColors.includes(color.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ExtractorPage;