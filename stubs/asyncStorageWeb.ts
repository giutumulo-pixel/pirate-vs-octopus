// Minimal web stub for '@react-native-async-storage/async-storage'
// Provides an AsyncStorage-like default export using window.localStorage

type NullableString = string | null;

const storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : undefined;

const AsyncStorage = {
  getItem: async (key: string): Promise<NullableString> => {
    try {
      return storage ? storage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (storage) storage.setItem(key, value);
    } catch {
      // no-op
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (storage) storage.removeItem(key);
    } catch {
      // no-op
    }
  },
  clear: async (): Promise<void> => {
    try {
      if (storage) storage.clear();
    } catch {
      // no-op
    }
  },
};

export default AsyncStorage;


