
/**
 * Exporta datos a un archivo JSON
 * @param {Object} data - Datos a exportar
 * @param {string} filename - Nombre del archivo
 */
export const exportToJSON = (data, filename = 'chromp-backup') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Prepara los datos completos para exportar
 * @param {Array} palettes - Paletas guardadas
 * @param {Object} user - Información del usuario
 * @param {Object} stats - Estadísticas
 * @returns {Object} - Datos formateados para exportar
 */
export const prepareExportData = (palettes, user, stats) => {
  return {
    exportDate: new Date().toISOString(),
    user: {
      name: user.name,
      avatar: user.avatar,
      bio: user.bio
    },
    palettes: palettes,
    statistics: stats
  };
};