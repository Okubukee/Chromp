import cv2
import numpy as np
from sklearn.cluster import KMeans
import os

class ColorExtractor:
    def __init__(self, n_colors=5):
        self.n_colors = n_colors
    
    def extract_from_path(self, image_path):

        img = cv2.imread(image_path)
        if img is None:
            raise Exception("No se pudo cargar la imagen")
        
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        height, width = img_rgb.shape[:2]
        scale = min(1.0, 500.0 / max(height, width))
        if scale < 1.0:
            new_size = (int(width * scale), int(height * scale))
            img_rgb = cv2.resize(img_rgb, new_size, interpolation=cv2.INTER_AREA)
        
        pixels = img_rgb.reshape(-1, 3).astype(np.float32)
        
        kmeans = KMeans(n_clusters=self.n_colors, random_state=42, n_init=10)
        kmeans.fit(pixels)
        
        colors = kmeans.cluster_centers_.astype(int)
        
        labels = kmeans.labels_
        percentages = np.bincount(labels) / len(labels) * 100
        
        sorted_indices = np.argsort(percentages)[::-1]
        colors = colors[sorted_indices]
        percentages = percentages[sorted_indices]
        
        result = []
        for color, percentage in zip(colors, percentages):
            rgb = color.tolist()
            hex_color = '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])
            
            result.append({
                'rgb': rgb,
                'hex': hex_color,
                'percentage': round(float(percentage), 2)
            })
        
        return result
