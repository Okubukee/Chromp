import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar localStorage de forma sencilla
 * @param {string} key - Clave en localStorage
 * @param {any} initialValue - Valor inicial si no existe
 * @returns {[any, Function]} - [valor, función para actualizar]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      
      if (item === null) {
        return initialValue;
      }
      
      try {
        return JSON.parse(item);
      } catch (parseError) {
        return item;
      }
    } catch (error) {
      console.error(`Error leyendo localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof valueToStore === 'string') {
        window.localStorage.setItem(key, valueToStore);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error guardando localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          try {
            setStoredValue(JSON.parse(e.newValue));
          } catch {
            setStoredValue(e.newValue);
          }
        } catch (error) {
          console.error(`Error procesando cambio en localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}