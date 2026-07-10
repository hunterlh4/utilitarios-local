// Helper genérico para manejar localStorage

const STORAGE_KEYS = {
  HIDE_TITLES: 'hideTitles',
  // Aquí se pueden agregar más keys en el futuro
} as const;

export const storageHelper = {
  // Hide Titles
  getHideTitles: (): boolean => {
    const value = localStorage.getItem(STORAGE_KEYS.HIDE_TITLES);
    return value === 'true';
  },

  setHideTitles: (value: boolean): void => {
    localStorage.setItem(STORAGE_KEYS.HIDE_TITLES, String(value));
  },

  toggleHideTitles: (): boolean => {
    const current = storageHelper.getHideTitles();
    const newValue = !current;
    storageHelper.setHideTitles(newValue);
    return newValue;
  },

  // Métodos genéricos
  get: (key: string): string | null => {
    return localStorage.getItem(key);
  },

  set: (key: string, value: string): void => {
    localStorage.setItem(key, value);
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },
};
