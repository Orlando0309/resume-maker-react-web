import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
    // Get from localStorage and parse, or return raw value if parsing fails
    const readValue = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item === null) return initialValue;
        // Attempt to parse as JSON
        return JSON.parse(item);
      } catch (error) {
        // If parsing fails, return the raw string
        return window.localStorage.getItem(key) || initialValue;
      }
    };
  
    const [storedValue, setStoredValue] = useState(readValue);
  
    // Set value both in state and localStorage
    const setValue = (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        var toStore = typeof valueToStore == "string"? valueToStore: JSON.stringify(valueToStore)
        // Always stringify to ensure consistency (even for strings)
        window.localStorage.setItem(key, toStore);
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    };
  
    // Remove key from localStorage and clear state
    const removeValue = () => {
      try {
        window.localStorage.removeItem(key);
        setStoredValue(null);
      } catch (error) {
        console.warn(`Error removing localStorage key "${key}":`, error);
      }
    };
  
    return [storedValue, setValue, removeValue];
  }