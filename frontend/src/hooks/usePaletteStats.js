import { useMemo } from 'react';
import chroma from 'chroma-js';

/**
 * Hook personalizado para calcular estadísticas de paletas
 * @param {Array} palettes - Array de paletas guardadas
 * @returns {Object} - Objeto con todas las estadísticas
 */
export function usePaletteStats(palettes) {
  const favoriteColors = useMemo(() => {
    if (!palettes || palettes.length === 0) return [];

    const allColors = palettes.flatMap(p => p.colors || []);
    
    if (allColors.length === 0) return [];
    
    const colorCount = {};
    allColors.forEach(hex => {
      const normalizedHex = hex.toUpperCase();
      colorCount[normalizedHex] = (colorCount[normalizedHex] || 0) + 1;
    });
    
    const sorted = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);
    
    if (sorted.length > 0 && sorted[0][1] > 1) {
      return sorted.slice(0, 5).map(([hex]) => hex);
    }
    
    const allHexes = allColors.map(c => c.toUpperCase());
    
    const averageColor = (colors) => {
      if (colors.length === 0) return '#667EEA';
      
      const sum = colors.reduce((acc, hex) => {
        const rgb = chroma(hex).rgb();
        return [acc[0] + rgb[0], acc[1] + rgb[1], acc[2] + rgb[2]];
      }, [0, 0, 0]);
      
      const avg = sum.map(val => Math.round(val / colors.length));
      return chroma(avg).hex();
    };
    
    const warmColors = allHexes.filter(hex => {
      const [h] = chroma(hex).hsl();
      return (h >= 0 && h < 60) || (h >= 300 && h <= 360);
    });
    
    const coldColors = allHexes.filter(hex => {
      const [h] = chroma(hex).hsl();
      return h >= 180 && h < 300;
    });
    
    const vibrantColors = allHexes.filter(hex => {
      const [, s] = chroma(hex).hsl();
      return s > 0.7;
    });
    
    const pastelColors = allHexes.filter(hex => {
      const [, s] = chroma(hex).hsl();
      return s < 0.3;
    });
    
    const representative = [];
    
    if (warmColors.length > 0) {
      representative.push(averageColor(warmColors));
    }
    if (coldColors.length > 0) {
      representative.push(averageColor(coldColors));
    }
    if (vibrantColors.length > 0 && vibrantColors.length !== allHexes.length) {
      representative.push(averageColor(vibrantColors));
    }
    if (pastelColors.length > 0 && pastelColors.length !== allHexes.length) {
      representative.push(averageColor(pastelColors));
    }
    
    while (representative.length < 5 && allHexes.length > 0) {
      const randomHex = allHexes[Math.floor(Math.random() * allHexes.length)];
      if (!representative.includes(randomHex)) {
        representative.push(randomHex);
      }
    }
    
    return representative.slice(0, 5);
  }, [palettes]);

  const uniqueColorsCount = useMemo(() => {
    if (!palettes || palettes.length === 0) return 0;
    
    const allColors = palettes.flatMap(p => p.colors || []);
    return new Set(allColors).size;
  }, [palettes]);

  const detailedStats = useMemo(() => {
    if (!palettes || palettes.length === 0) return null;

    const allColors = palettes.flatMap(p => p.colors || []);
    const total = allColors.length;
    
    if (total === 0) return null;

    const stats = {
      warm: 0,
      cold: 0,
      vibrant: 0,
      pastel: 0,
      dark: 0,
      light: 0,
      total: total
    };

    allColors.forEach(hex => {
      try {
        const color = chroma(hex);
        const [h, s, l] = color.hsl();
        
        if ((h >= 0 && h < 60) || (h >= 300 && h <= 360)) {
          stats.warm++;
        } else {
          stats.cold++;
        }
        
        if (s > 0.7) {
          stats.vibrant++;
        } else if (s < 0.3) {
          stats.pastel++;
        }
        
        if (l < 0.3) {
          stats.dark++;
        } else if (l > 0.7) {
          stats.light++;
        }
      } catch (e) {
        console.warn('Color inválido:', hex);
      }
    });

    return stats;
  }, [palettes]);

  const totalPalettes = palettes?.length || 0;

  const mostUsedColor = useMemo(() => {
    if (!palettes || palettes.length === 0) return null;
    
    const allColors = palettes.flatMap(p => p.colors || []);
    if (allColors.length === 0) return null;
    
    const colorCount = {};
    allColors.forEach(hex => {
      const normalizedHex = hex.toUpperCase();
      colorCount[normalizedHex] = (colorCount[normalizedHex] || 0) + 1;
    });
    
    const sorted = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : null;
  }, [palettes]);

  return {
    favoriteColors,
    uniqueColorsCount,
    detailedStats,
    totalPalettes,
    mostUsedColor
  };
}