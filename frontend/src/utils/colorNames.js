
/**
 * Base de datos de colores con nombres reales
 * Basado en nombres de colores web y de pinturas populares
 */
export const colorNames = [
  // Rojos
  { hex: '#FF6B6B', name: 'Coral' },
  { hex: '#FF4444', name: 'Rojo brillante' },
  { hex: '#DC143C', name: 'Crimson' },
  { hex: '#B22222', name: 'Ladrillo' },
  { hex: '#CD5C5C', name: 'Rojo indio' },
  { hex: '#F08080', name: 'Coral claro' },
  { hex: '#FA8072', name: 'Salmón' },
  { hex: '#E9967A', name: 'Salmón oscuro' },
  { hex: '#FFA07A', name: 'Salmón claro' },
  
  // Naranjas
  { hex: '#FFA500', name: 'Naranja' },
  { hex: '#FF8C00', name: 'Naranja oscuro' },
  { hex: '#FF7F50', name: 'Coral' },
  { hex: '#FF6347', name: 'Tomate' },
  { hex: '#FF4500', name: 'Naranja rojizo' },
  { hex: '#FFD700', name: 'Dorado' },
  
  // Amarillos
  { hex: '#FFE66D', name: 'Amarillo' },
  { hex: '#FFFF00', name: 'Amarillo puro' },
  { hex: '#FFFFE0', name: 'Amarillo claro' },
  { hex: '#FFFACD', name: 'Limón' },
  { hex: '#FAFAD2', name: 'Dorado claro' },
  { hex: '#FFEFD5', name: 'Melocotón' },
  
  // Verdes
  { hex: '#6BCB77', name: 'Verde' },
  { hex: '#4CAF50', name: 'Verde medio' },
  { hex: '#8BC34A', name: 'Verde lima' },
  { hex: '#CDDC39', name: 'Lima' },
  { hex: '#009688', name: 'Verde azulado' },
  { hex: '#008080', name: 'Verde petróleo' },
  { hex: '#006400', name: 'Verde oscuro' },
  { hex: '#228B22', name: 'Verde bosque' },
  { hex: '#32CD32', name: 'Verde lima' },
  { hex: '#98FB98', name: 'Verde menta' },
  { hex: '#ADFF2F', name: 'Verde amarillento' },
  
  // Azules
  { hex: '#4ECDC4', name: 'Turquesa' },
  { hex: '#3498DB', name: 'Azul' },
  { hex: '#00BFFF', name: 'Azul cielo' },
  { hex: '#1E90FF', name: 'Azul dodger' },
  { hex: '#4169E1', name: 'Azul real' },
  { hex: '#0000FF', name: 'Azul puro' },
  { hex: '#00008B', name: 'Azul oscuro' },
  { hex: '#191970', name: 'Azul noche' },
  { hex: '#6A5ACD', name: 'Azul pizarra' },
  { hex: '#7B68EE', name: 'Azul medio' },
  { hex: '#ADD8E6', name: 'Azul claro' },
  { hex: '#B0E0E6', name: 'Azul polvo' },
  
  // Púrpuras
  { hex: '#9B59B6', name: 'Púrpura' },
  { hex: '#800080', name: 'Púrpura' },
  { hex: '#8A2BE2', name: 'Azul violeta' },
  { hex: '#9370DB', name: 'Púrpura medio' },
  { hex: '#BA55D3', name: 'Orquídea media' },
  { hex: '#DA70D6', name: 'Orquídea' },
  { hex: '#EE82EE', name: 'Violeta' },
  { hex: '#DDA0DD', name: 'Ciruela' },
  
  // Rosas
  { hex: '#FF69B4', name: 'Rosa caliente' },
  { hex: '#FF1493', name: 'Rosa profundo' },
  { hex: '#FFB6C1', name: 'Rosa claro' },
  { hex: '#FFC0CB', name: 'Rosa' },
  { hex: '#FFDAB9', name: 'Melocotón' },
  
  // Marrones
  { hex: '#8B4513', name: 'Marrón' },
  { hex: '#A0522D', name: 'Siena' },
  { hex: '#CD853F', name: 'Perú' },
  { hex: '#D2691E', name: 'Chocolate' },
  { hex: '#8B5A2B', name: 'Marrón' },
  { hex: '#B8860B', name: 'Oro oscuro' },
  
  // Grises
  { hex: '#808080', name: 'Gris' },
  { hex: '#A9A9A9', name: 'Gris oscuro' },
  { hex: '#C0C0C0', name: 'Plata' },
  { hex: '#D3D3D3', name: 'Gris claro' },
  { hex: '#DCDCDC', name: 'Gris ganis' },
  { hex: '#F5F5F5', name: 'Blanco humo' },
  
  // Blancos y negros
  { hex: '#FFFFFF', name: 'Blanco' },
  { hex: '#F8F8FF', name: 'Blanco fantasma' },
  { hex: '#F0F8FF', name: 'Azul alicia' },
  { hex: '#000000', name: 'Negro' },
  { hex: '#2C3E50', name: 'Azul noche' }
];

/**
 * Encuentra el nombre más cercano para un color HEX
 * @param {string} hex - Color en formato HEX
 * @returns {string} - Nombre del color
 */
export const findColorName = (hex) => {
  if (!hex) return 'Color';
  
  try {
    const normalizedHex = hex.toUpperCase();
    
    const exactMatch = colorNames.find(c => c.hex.toUpperCase() === normalizedHex);
    if (exactMatch) return exactMatch.name;
    
    return getGenericColorName(hex);
  } catch (e) {
    return 'Color';
  }
};

/**
 * Genera un nombre genérico basado en características del color
 * @param {string} hex - Color en formato HEX
 * @returns {string} - Nombre descriptivo
 */
const getGenericColorName = (hex) => {
  try {
    const chroma = window.chroma || require('chroma-js');
    const color = chroma(hex);
    const [h, s, l] = color.hsl();
    
    let baseName = '';
    if (s < 0.1) {
      baseName = l > 0.5 ? 'Blanco' : l < 0.2 ? 'Negro' : 'Gris';
    } else {
      if (h >= 0 && h < 30) baseName = 'Rojo';
      else if (h >= 30 && h < 60) baseName = 'Naranja';
      else if (h >= 60 && h < 90) baseName = 'Amarillo';
      else if (h >= 90 && h < 150) baseName = 'Verde';
      else if (h >= 150 && h < 210) baseName = 'Cian';
      else if (h >= 210 && h < 270) baseName = 'Azul';
      else if (h >= 270 && h < 330) baseName = 'Púrpura';
      else baseName = 'Rojo';
    }
    
    if (s > 0.7) baseName = `${baseName} vibrante`;
    else if (s < 0.3 && baseName !== 'Gris' && baseName !== 'Blanco' && baseName !== 'Negro') {
      baseName = `${baseName} pastel`;
    }
    
    if (l < 0.3) baseName = `${baseName} oscuro`;
    else if (l > 0.7) baseName = `${baseName} claro`;
    
    return baseName;
  } catch (e) {
    return 'Color';
  }
};