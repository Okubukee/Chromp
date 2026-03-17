import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from extractor import ColorExtractor

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuración
UPLOAD_FOLDER = '/tmp/chromp_uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Chromp API funcionando'})

@app.route('/extract', methods=['POST'])
def extract_colors():
    
    if 'image' not in request.files:
        return jsonify({'error': 'No se envió ninguna imagen'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'Nombre de archivo vacío'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Tipo de archivo no permitido'}), 400
    
    
    n_colors = request.form.get('n_colors', 5)
    try:
        n_colors = int(n_colors)
        if n_colors < 2 or n_colors > 12:
            n_colors = 5
    except:
        n_colors = 5
    
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    logger.info(f"Procesando imagen: {filename}, colores: {n_colors}")
    
    try:
        
        extractor = ColorExtractor(n_colors=n_colors)
        colors = extractor.extract_from_path(filepath)
        
        logger.info(f"Imagen procesada exitosamente: {filename}")
        
        return jsonify({
            'success': True,
            'colors': colors,
            'n_colors': n_colors
        })
        
    except Exception as e:
        logger.error(f"Error procesando {filename}: {str(e)}")
        return jsonify({'error': str(e)}), 500
        
    finally:
        
        try:
            if os.path.exists(filepath):
                os.remove(filepath)
        except Exception as e:
            logger.error(f"Error eliminando archivo temporal: {e}")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
