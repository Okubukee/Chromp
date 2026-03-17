import chroma from 'chroma-js';

/**
 * Tipos de daltonismo disponibles
 */
export const blindnessTypes = [
  { 
    id: 'normal', 
    name: 'Visión normal', 
    description: 'Cómo ven los colores la mayoría de las personas',
    filter: (hex) => hex
  },
  { 
    id: 'protanopia', 
    name: 'Protanopia', 
    description: 'Ceguera al rojo (1% de hombres)',
    filter: simulateProtanopia 
  },
  { 
    id: 'deuteranopia', 
    name: 'Deuteranopia', 
    description: 'Ceguera al verde (1% de hombres)',
    filter: simulateDeuteranopia 
  },
  { 
    id: 'tritanopia', 
    name: 'Tritanopia', 
    description: 'Ceguera al azul (0.01% de personas)',
    filter: simulateTritanopia 
  },
  { 
    id: 'achromatopsia', 
    name: 'Acromatopsia', 
    description: 'Visión en escala de grises (0.003% de personas)',
    filter: simulateAchromatopsia 
  }
];

/**
 * Simula protanopia (ceguera al rojo)
 */
function simulateProtanopia(hex) {
  try {
    const rgb = chroma(hex).rgb();
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    
    const newR = 0.567 * r + 0.433 * g;
    const newG = 0.558 * r + 0.442 * g;
    const newB = 0.242 * g + 0.758 * b;
    
    return chroma(
      Math.min(255, Math.max(0, Math.round(newR))),
      Math.min(255, Math.max(0, Math.round(newG))),
      Math.min(255, Math.max(0, Math.round(newB)))
    ).hex();
  } catch (e) {
    return hex;
  }
}

/**
 * Simula deuteranopia (ceguera al verde)
 */
function simulateDeuteranopia(hex) {
  try {
    const rgb = chroma(hex).rgb();
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    
    const newR = 0.625 * r + 0.375 * g;
    const newG = 0.7 * r + 0.3 * g;
    const newB = 0.3 * g + 0.7 * b;
    
    return chroma(
      Math.min(255, Math.max(0, Math.round(newR))),
      Math.min(255, Math.max(0, Math.round(newG))),
      Math.min(255, Math.max(0, Math.round(newB)))
    ).hex();
  } catch (e) {
    return hex;
  }
}

/**
 * Simula tritanopia (ceguera al azul)
 */
function simulateTritanopia(hex) {
  try {
    const rgb = chroma(hex).rgb();
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    
    const newR = 0.95 * r + 0.05 * g;
    const newG = 0.433 * g + 0.567 * b;
    const newB = 0.475 * g + 0.525 * b;
    
    return chroma(
      Math.min(255, Math.max(0, Math.round(newR))),
      Math.min(255, Math.max(0, Math.round(newG))),
      Math.min(255, Math.max(0, Math.round(newB)))
    ).hex();
  } catch (e) {
    return hex;
  }
}

/**
 * Simula acromatopsia (escala de grises)
 */
function simulateAchromatopsia(hex) {
  try {
    const rgb = chroma(hex).rgb();
    // Convertir a grises usando luminancia
    const gray = Math.round(0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);
    return chroma(gray, gray, gray).hex();
  } catch (e) {
    return hex;
  }
}

/**
 * Aplica un tipo de daltonismo a un color
 */
export const applyColorBlindness = (hex, type) => {
  const blindnessType = blindnessTypes.find(t => t.id === type);
  if (!blindnessType || type === 'normal') return hex;
  return blindnessType.filter(hex);
};

/**
 * Aplica un tipo de daltonismo a una paleta completa
 */
export const applyPaletteColorBlindness = (colors, type) => {
  if (type === 'normal') return colors;
  
  return colors.map(color => ({
    ...color,
    hex: applyColorBlindness(color.hex, type),
    name: `${color.name} (${blindnessTypes.find(t => t.id === type)?.name})`
  }));
};