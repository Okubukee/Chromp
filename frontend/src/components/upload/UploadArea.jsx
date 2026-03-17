import React from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiLink, FiCheck } from 'react-icons/fi';

/**
 * Área de subida de imágenes con drag & drop y opción URL
 * @param {Object} props
 * @param {Function} props.onImageSelect - Función al seleccionar imagen
 * @param {boolean} props.disabled - Deshabilitar el área
 */
const UploadArea = ({ onImageSelect, disabled = false }) => {
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0 && !disabled && !isLoading) {
      onImageSelect(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 10485760, 
    disabled: disabled || isLoading
  });

  const handleUrlSubmit = () => {
    if (!urlInput.trim() || disabled || isLoading) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
    
      const mockFile = new File([], 'url-image.jpg', { type: 'image/jpeg' });
      Object.defineProperty(mockFile, 'url', { value: urlInput });
      
      onImageSelect(mockFile);
      setUrlInput('');
      setShowUrlInput(false);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="upload-wrapper"
    >
      <div
        {...getRootProps()}
        className={`upload-area ${isDragActive ? 'drag-active' : ''} ${disabled || isLoading ? 'disabled' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="upload-content">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <FiCamera className="upload-icon" />
          </motion.div>
          
          <p>
            {isDragActive 
              ? 'Suelta la imagen aquí' 
              : isLoading 
                ? 'Cargando imagen...' 
                : 'Arrastra una imagen o haz clic'}
          </p>
          
          {!disabled && !isLoading && (
            <button
              className="url-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(!showUrlInput);
              }}
              type="button"
            >
              <FiLink /> O pegar URL
            </button>
          )}

          <AnimatePresence>
            {showUrlInput && (
              <motion.div
                className="url-input-container"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
                <button 
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim() || isLoading}
                >
                  <FiCheck />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isLoading && (
        <motion.div
          className="loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="spinner-small" />
          <span>Cargando imagen...</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadArea;