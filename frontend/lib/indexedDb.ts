// ===================================================
// CARBONLOOP — High-Capacity IndexedDB Engine
// Replaces 5MB localStorage with unlimited disk database
// ===================================================

import { Asset } from "@/types";
import { MOCK_ASSETS } from "./mockAssets";

const DB_NAME = "carbonloop_database";
const DB_VERSION = 1;
const STORE_NAME = "assets";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this environment"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("category", "category", { unique: false });
        store.createIndex("departmentId", "departmentId", { unique: false });
        store.createIndex("status", "status", { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getAllAssetsFromDB(): Promise<Asset[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result as Asset[];
        if (!results || results.length === 0) {
          // Initialize with mock assets if empty
          saveAllAssetsToDB(MOCK_ASSETS).then(() => resolve(MOCK_ASSETS));
        } else {
          resolve(results);
        }
      };

      request.onerror = () => {
        resolve(MOCK_ASSETS);
      };
    });
  } catch (err) {
    console.warn("IndexedDB fallback to memory mock assets:", err);
    return MOCK_ASSETS;
  }
}

export async function saveAllAssetsToDB(assets: Asset[]): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.clear(); // Clear existing to maintain sync
      assets.forEach((asset) => store.put(asset));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn("Failed to persist assets to IndexedDB:", err);
  }
}

export async function putAssetInDB(asset: Asset): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.put(asset);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn("Failed to put asset in IndexedDB:", err);
  }
}

export async function deleteAssetFromDB(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.delete(id);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn("Failed to delete asset from IndexedDB:", err);
  }
}
