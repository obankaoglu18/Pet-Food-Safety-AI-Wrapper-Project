
import { Pet, FoodCheck } from '../types';

const DB_NAME = 'PetFoodAdvisorDB';
const DB_VERSION = 1;
const STORE_PETS = 'pets';
const STORE_CHECKS = 'checks';

// LocalStorage Keys for Settings (Keep these synchronous for UI performance)
const ONBOARDED_KEY = 'pfa_onboarded';
const PRO_KEY = 'pfa_is_pro';
const CREDITS_KEY = 'pfa_free_credits';

const INITIAL_CREDITS = 3; // User gets 3 free checks

// --- IndexedDB Helpers ---

const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PETS)) {
        db.createObjectStore(STORE_PETS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_CHECKS)) {
        db.createObjectStore(STORE_CHECKS, { keyPath: 'id' });
      }
    };
  });
};

const getAll = async <T>(storeName: string): Promise<T[]> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

const put = async <T>(storeName: string, item: T): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const storageService = {
  // --- Async Data Methods (IndexedDB) ---

  getPets: async (): Promise<Pet[]> => {
    try {
      return await getAll<Pet>(STORE_PETS);
    } catch (e) {
      console.error("Failed to load pets", e);
      return [];
    }
  },

  savePet: async (pet: Pet): Promise<Pet[]> => {
    await put(STORE_PETS, pet);
    return await storageService.getPets();
  },

  updatePet: async (pet: Pet): Promise<Pet[]> => {
    await put(STORE_PETS, pet);
    return await storageService.getPets();
  },

  deletePet: async (id: string): Promise<Pet[]> => {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PETS, 'readwrite');
      const store = tx.objectStore(STORE_PETS);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    return await storageService.getPets();
  },

  getChecks: async (): Promise<FoodCheck[]> => {
    try {
      const checks = await getAll<FoodCheck>(STORE_CHECKS);
      // Sort by timestamp descending (newest first)
      return checks.sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) {
      console.error("Failed to load checks", e);
      return [];
    }
  },

  saveCheck: async (check: FoodCheck): Promise<FoodCheck[]> => {
    await put(STORE_CHECKS, check);
    return await storageService.getChecks();
  },

  // --- Sync Settings Methods (LocalStorage) ---

  hasOnboarded: (): boolean => {
    return localStorage.getItem(ONBOARDED_KEY) === 'true';
  },

  completeOnboarding: () => {
    localStorage.setItem(ONBOARDED_KEY, 'true');
    // Initialize credits if not present
    if (localStorage.getItem(CREDITS_KEY) === null) {
      localStorage.setItem(CREDITS_KEY, INITIAL_CREDITS.toString());
    }
  },
  
  isPro: (): boolean => {
    return localStorage.getItem(PRO_KEY) === 'true';
  },

  setPro: (status: boolean) => {
    localStorage.setItem(PRO_KEY, status ? 'true' : 'false');
  },

  getFreeCredits: (): number => {
    const stored = localStorage.getItem(CREDITS_KEY);
    return stored ? parseInt(stored, 10) : 0;
  },

  useCredit: (): void => {
    const current = storageService.getFreeCredits();
    if (current > 0) {
      localStorage.setItem(CREDITS_KEY, (current - 1).toString());
    }
  },

  clearAll: async () => {
    localStorage.clear();
    const db = await getDB();
    const tx = db.transaction([STORE_PETS, STORE_CHECKS], 'readwrite');
    tx.objectStore(STORE_PETS).clear();
    tx.objectStore(STORE_CHECKS).clear();
  }
};
