import chroma from 'chroma-js';
import { findColorName } from './colorNames';


/**
 * Genera una paleta monocromática (variaciones de un mismo tono)
 */
const generateMonochrome = (baseHue, count) => {
  return Array(count).fill(0).map((_, i) => {
    const lightness = 0.3 + (i * 0.6 / (count - 1 || 1));
    return chroma.hsl(baseHue, 0.7, lightness).hex();
  });
};

/**
 * Genera una paleta complementaria (colores opuestos)
 */
const generateComplementary = (baseHue, count) => {
  const complementaryHue = (baseHue + 180) % 360;
  const colors = [];
  
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1 || 1);
    const hue = i % 2 === 0 ? baseHue : complementaryHue;
    const saturation = 0.6 + t * 0.3;
    const lightness = 0.4 + t * 0.3;
    colors.push(chroma.hsl(hue, saturation, lightness).hex());
  }
  
  return colors;
};

/**
 * Genera una paleta análoga (colores adyacentes en la rueda)
 */
const generateAnalogous = (baseHue, count) => {
  const range = 40; // Rango de 40 grados a cada lado
  const colors = [];
  
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1 || 1);
    const hue = (baseHue - range/2 + t * range + 360) % 360;
    colors.push(chroma.hsl(hue, 0.7, 0.5).hex());
  }
  
  return colors;
};

/**
 * Genera una paleta triádica (120 grados de separación)
 */
const generateTriadic = (baseHue, count) => {
  const hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
  const colors = [];
  
  for (let i = 0; i < count; i++) {
    const hue = hues[i % 3];
    const variation = Math.floor(i / 3) * 15;
    colors.push(chroma.hsl((hue + variation) % 360, 0.7, 0.5).hex());
  }
  
  return colors;
};

/**
 * Genera una paleta tetrádica (rectángulo en la rueda)
 */
const generateTetradic = (baseHue, count) => {
  const hues = [
    baseHue,
    (baseHue + 90) % 360,
    (baseHue + 180) % 360,
    (baseHue + 270) % 360
  ];
  
  return Array(count).fill(0).map((_, i) => {
    const hue = hues[i % 4];
    const saturation = 0.6 + (i % 2) * 0.2;
    const lightness = 0.4 + (Math.floor(i / 4) * 0.2);
    return chroma.hsl(hue, saturation, lightness).hex();
  });
};

/**
 * Genera una paleta dividida complementaria (base + dos adyacentes al complementario)
 */
const generateSplitComplementary = (baseHue, count) => {
  const complementary = (baseHue + 180) % 360;
  const hues = [
    baseHue,
    (complementary - 30 + 360) % 360,
    (complementary + 30) % 360
  ];
  
  return Array(count).fill(0).map((_, i) => {
    const hue = hues[i % 3];
    const saturation = 0.7;
    const lightness = 0.5;
    return chroma.hsl(hue, saturation, lightness).hex();
  });
};

/**
 * Genera una paleta de tonos tierra (colores naturales) - CORREGIDO: añadido const
 */
const generateEarthTones = (baseHue, count) => {
  const earthHues = [30, 45, 60, 75, 90]; 
  const baseEarthHue = earthHues[Math.floor(Math.random() * earthHues.length)];
  
  return Array(count).fill(0).map((_, i) => {
    const hue = (baseEarthHue + i * 5) % 360;
    const saturation = 0.4 + Math.random() * 0.3;
    const lightness = 0.3 + Math.random() * 0.4;
    return chroma.hsl(hue, saturation, lightness).hex();
  });
};

/**
 * Genera una paleta pastel (colores suaves)
 */
const generatePastel = (baseHue, count) => {
  return Array(count).fill(0).map((_, i) => {
    const hue = (baseHue + i * 30) % 360;
    return chroma.hsl(hue, 0.2, 0.8).hex();
  });
};

/**
 * Genera una paleta vibrante (colores saturados)
 */
const generateVibrant = (baseHue, count) => {
  return Array(count).fill(0).map((_, i) => {
    const hue = (baseHue + i * 30) % 360;
    return chroma.hsl(hue, 0.9, 0.6).hex();
  });
};

/**
 * Genera una paleta oceánica (azules y verdes)
 */
const generateOcean = (baseHue, count) => {
  const oceanHues = [180, 200, 220, 240, 260]; 
  return Array(count).fill(0).map((_, i) => {
    const hue = oceanHues[i % oceanHues.length];
    const saturation = 0.5 + Math.random() * 0.4;
    const lightness = 0.3 + Math.random() * 0.4;
    return chroma.hsl(hue, saturation, lightness).hex();
  });
};

/**
 * Genera una paleta atardecer (naranjas, rosas, púrpuras)
 */
const generateSunset = (baseHue, count) => {
  const sunsetHues = [0, 20, 40, 300, 320, 340]; 
  return Array(count).fill(0).map((_, i) => {
    const hue = sunsetHues[i % sunsetHues.length];
    const saturation = 0.6 + Math.random() * 0.3;
    const lightness = 0.4 + Math.random() * 0.3;
    return chroma.hsl(hue, saturation, lightness).hex();
  });
};

/**
 * Genera una paleta neón (colores eléctricos)
 */
const generateNeon = (baseHue, count) => {
  const neonHues = [0, 60, 120, 180, 240, 300];
  return Array(count).fill(0).map((_, i) => {
    const hue = neonHues[i % neonHues.length];
    return chroma.hsl(hue, 1, 0.5).hex();
  });
};

/**
 * Genera una paleta otoño (colores cálidos y terrosos)
 */
const generateAutumn = (baseHue, count) => {
  const autumnHues = [30, 45, 60, 75, 90]; 
  return Array(count).fill(0).map((_, i) => {
    const hue = autumnHues[i % autumnHues.length];
    const saturation = 0.5 + Math.random() * 0.4;
    const lightness = 0.3 + Math.random() * 0.3;
    return chroma.hsl(hue, saturation, lightness).hex();
  });
};

const schemes = [
  { name: 'Monocromático', generator: generateMonochrome, description: 'Variaciones de un mismo color' },
  { name: 'Complementario', generator: generateComplementary, description: 'Colores opuestos en la rueda' },
  { name: 'Análogo', generator: generateAnalogous, description: 'Colores vecinos en la rueda' },
  { name: 'Triádico', generator: generateTriadic, description: 'Tres colores equidistantes' },
  { name: 'Tetrádico', generator: generateTetradic, description: 'Rectángulo de cuatro colores' },
  { name: 'Complementario Dividido', generator: generateSplitComplementary, description: 'Base + dos adyacentes al complementario' },
  { name: 'Tonos Tierra', generator: generateEarthTones, description: 'Colores naturales y orgánicos' },
  { name: 'Pastel', generator: generatePastel, description: 'Colores suaves y delicados' },
  { name: 'Vibrante', generator: generateVibrant, description: 'Colores intensos y saturados' },
  { name: 'Oceánico', generator: generateOcean, description: 'Azules y verdes marinos' },
  { name: 'Atardecer', generator: generateSunset, description: 'Naranjas, rosas y púrpuras' },
  { name: 'Neón', generator: generateNeon, description: 'Colores eléctricos y brillantes' },
  { name: 'Otoño', generator: generateAutumn, description: 'Tonos cálidos y terrosos' }
];

/**
 * Genera variaciones de una paleta
 * @param {Array} baseColors - Colores base
 * @returns {Object} - Objeto con diferentes variaciones
 */
export const generatePaletteVariations = (baseColors) => {
  const variations = {
    original: baseColors,
    lighter: [],
    darker: [],
    moreSaturated: [],
    lessSaturated: [],
    warmer: [],
    cooler: []
  };

  baseColors.forEach(color => {
    const hex = color.hex;
    const chromaColor = chroma(hex);
    const [h, s, l] = chromaColor.hsl();

    // Más claro (+20% luminosidad)
    variations.lighter.push({
      ...color,
      id: `color-${Date.now()}-${Math.random()}`,
      hex: chromaColor.set('hsl.l', Math.min(l + 0.2, 1)).hex(),
      name: `${color.name} (claro)`
    });

    // Más oscuro (-20% luminosidad)
    variations.darker.push({
      ...color,
      id: `color-${Date.now()}-${Math.random()}`,
      hex: chromaColor.set('hsl.l', Math.max(l - 0.2, 0)).hex(),
      name: `${color.name} (oscuro)`
    });

    // Más saturado (+30% saturación)
    variations.moreSaturated.push({
      ...color,
      id: `color-${Date.now()}-${Math.random()}`,
      hex: chromaColor.set('hsl.s', Math.min(s + 0.3, 1)).hex(),
      name: `${color.name} (vibrante)`
    });

    // Menos saturado (-30% saturación)
    variations.lessSaturated.push({
      ...color,
      id: `color-${Date.now()}-${Math.random()}`,
      hex: chromaColor.set('hsl.s', Math.max(s - 0.3, 0)).hex(),
      name: `${color.name} (suave)`
    });

    // Más cálido (+20 grados)
    variations.warmer.push({
      ...color,
      id: `color-${Date.now()}-${Math.random()}`,
      hex: chromaColor.set('hsl.h', (h + 20) % 360).hex(),
      name: `${color.name} (cálido)`
    });

    // Más frío (-20 grados)
    variations.cooler.push({
      ...color,
      id: `color-${Date.now()}-${Math.random()}`,
      hex: chromaColor.set('hsl.h', (h - 20 + 360) % 360).hex(),
      name: `${color.name} (frío)`
    });
  });

  return variations;
};

/**
 * Filtros disponibles para generación con restricciones
 */
export const colorFilters = [
  { 
    id: 'no-red', 
    name: 'Sin rojos', 
    description: 'Evita colores rojizos',
    filter: (hex) => {
      const [h] = chroma(hex).hsl();
      return !((h >= 0 && h < 30) || (h >= 330 && h <= 360));
    }
  },
  { 
    id: 'no-blue', 
    name: 'Sin azules', 
    description: 'Evita colores azulados',
    filter: (hex) => {
      const [h] = chroma(hex).hsl();
      return !(h >= 180 && h < 270);
    }
  },
  { 
    id: 'no-green', 
    name: 'Sin verdes', 
    description: 'Evita colores verdosos',
    filter: (hex) => {
      const [h] = chroma(hex).hsl();
      return !(h >= 90 && h < 180);
    }
  },
  { 
    id: 'warm-only', 
    name: 'Solo cálidos', 
    description: 'Solo colores cálidos',
    filter: (hex) => {
      const [h] = chroma(hex).hsl();
      return (h >= 0 && h < 60) || (h >= 300 && h <= 360);
    }
  },
  { 
    id: 'cold-only', 
    name: 'Solo fríos', 
    description: 'Solo colores fríos',
    filter: (hex) => {
      const [h] = chroma(hex).hsl();
      return h >= 180 && h < 300;
    }
  },
  { 
    id: 'pastel-only', 
    name: 'Solo pastel', 
    description: 'Colores suaves y claros',
    filter: (hex) => {
      const [, s, l] = chroma(hex).hsl();
      return s < 0.4 && l > 0.6;
    }
  },
  { 
    id: 'vibrant-only', 
    name: 'Solo vibrantes', 
    description: 'Colores intensos',
    filter: (hex) => {
      const [, s, l] = chroma(hex).hsl();
      return s > 0.7 && l > 0.3 && l < 0.8;
    }
  },
  { 
    id: 'dark-only', 
    name: 'Solo oscuros', 
    description: 'Colores con poca luz',
    filter: (hex) => {
      const [, , l] = chroma(hex).hsl();
      return l < 0.3;
    }
  },
  { 
    id: 'light-only', 
    name: 'Solo claros', 
    description: 'Colores con mucha luz',
    filter: (hex) => {
      const [, , l] = chroma(hex).hsl();
      return l > 0.7;
    }
  }
];

/**
 * Genera una paleta aleatoria con filtros aplicados
 * @param {number} colorCount - Número de colores
 * @param {Array} activeFilters - IDs de filtros a aplicar
 * @returns {Object} - Paleta generada
 */
export const generateFilteredRandomPalette = (colorCount = 5, activeFilters = []) => {
  if (activeFilters.length === 0) {
    return generateRandomPalette(colorCount);
  }

  const filters = colorFilters.filter(f => activeFilters.includes(f.id));
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const { colors, theme, description } = generateRandomPalette(colorCount);
    
    const passesFilters = colors.every(color => {
      return filters.every(filter => filter.filter(color.hex));
    });

    if (passesFilters) {
      return { colors, theme, description };
    }

    attempts++;
  }

  console.warn('No se encontró paleta con los filtros aplicados después de', maxAttempts, 'intentos');
  return generateRandomPalette(colorCount);
};

/**
 * Genera una paleta aleatoria avanzada
 * @param {number} colorCount - Número de colores a generar (3-8)
 * @returns {Object} { colors: Array, theme: String, description: String }
 */
export const generateRandomPalette = (colorCount = 5) => {
  const count = Math.min(8, Math.max(3, colorCount));
  
  const schemeIndex = Math.floor(Math.random() * schemes.length);
  const scheme = schemes[schemeIndex];
  
  const baseHue = Math.floor(Math.random() * 360);
  
  const hexColors = scheme.generator(baseHue, count);
  
  const colors = hexColors.map((hex, index) => {
    const color = chroma(hex);
    const [h, s, l] = color.hsl();
    
    const colorName = findColorName(hex);
    
    return {
      id: `color-${Date.now()}-${index}-${Math.random()}`,
      hex: hex,
      name: colorName,
      percentage: Math.floor(100 / count),
      rgb: color.rgb(),
      hsl: [h, s, l],
      luminance: Math.round(color.luminance() * 100) / 100,
      temperature: color.temperature() > 5000 ? 'Cálido' : 'Frío',
      scheme: scheme.name
    };
  });

  return { 
    colors, 
    theme: scheme.name,
    description: scheme.description
  };
};


/**
 * Extrae colores de una imagen (simulado)
 */
export const extractColors = (colorCount = 5) => {
  const baseColors = [
    { hex: '#FF6B6B', name: 'Coral' },
    { hex: '#4ECDC4', name: 'Turquesa' },
    { hex: '#FFE66D', name: 'Amarillo' },
    { hex: '#6BCB77', name: 'Verde' },
    { hex: '#9B59B6', name: 'Púrpura' },
    { hex: '#3498DB', name: 'Azul' },
    { hex: '#E67E22', name: 'Naranja' },
    { hex: '#2C3E50', name: 'Azul noche' }
  ];

  return baseColors.slice(0, colorCount).map((color, index) => ({
    id: `color-${Date.now()}-${index}-${Math.random()}`,
    hex: color.hex,
    name: color.name,
    percentage: Math.floor(Math.random() * 30 + 10),
    rgb: chroma(color.hex).rgb(),
    hsl: chroma(color.hex).hsl(),
    favorite: false
  }));
};

/**
 * Mezcla dos colores
 * @param {string} color1 - Hex del primer color
 * @param {string} color2 - Hex del segundo color
 * @param {number} ratio - Proporción de mezcla (0-1)
 * @returns {string} - Hex del color mezclado
 */
export const mixColors = (color1, color2, ratio = 0.5) => {
  return chroma.mix(color1, color2, ratio).hex();
};

/**
 * Obtiene información detallada de un color
 * @param {string} hex - Color en formato hex
 * @returns {Object} - Información del color
 */
export const getColorInfo = (hex) => {
  try {
    const color = chroma(hex);
    const [h, s, l] = color.hsl();
    
    return {
      hex,
      rgb: color.rgb(),
      hsl: [h, s, l],
      luminance: Math.round(color.luminance() * 100) / 100,
      temperature: color.temperature() > 5000 ? 'Cálido' : 'Frío',
      isLight: l > 0.6,
      isDark: l < 0.3,
      isVibrant: s > 0.7,
      isPastel: s < 0.3
    };
  } catch (e) {
    return null;
  }
};