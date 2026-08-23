"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Asset, CircularAction, AssetCondition } from "@/types";
import { MOCK_ASSETS as INITIAL_ASSETS } from "@/lib/mockAssets";
import {
  getAllAssetsFromDB,
  saveAllAssetsToDB,
  putAssetInDB,
  deleteAssetFromDB,
} from "@/lib/indexedDb";

interface AssetContextType {
  assets: Asset[];
  addAsset: (newAsset: Omit<Asset, "id" | "createdAt" | "updatedAt">) => Asset;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  markAsRecycled: (id: string) => void;
  getAssetById: (id: string) => Asset | undefined;
  resetToDefault: () => void;
  isLoading: boolean;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from high-capacity IndexedDB on mount
  useEffect(() => {
    getAllAssetsFromDB()
      .then((loadedAssets) => {
        if (loadedAssets && loadedAssets.length > 0) {
          setAssets(loadedAssets);
        }
      })
      .catch((err) => {
        console.warn("Failed to load from IndexedDB:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const addAsset = (newAssetData: Omit<Asset, "id" | "createdAt" | "updatedAt">): Asset => {
    const id = `ast-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const created: Asset = {
      ...newAssetData,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const newAssets = [created, ...assets];
    setAssets(newAssets);
    putAssetInDB(created);
    return created;
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    const updated = assets.map((item) => {
      if (item.id === id) {
        const modified = {
          ...item,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        putAssetInDB(modified);
        return modified;
      }
      return item;
    });
    setAssets(updated);
  };

  const deleteAsset = (id: string) => {
    const remaining = assets.filter((item) => item.id !== id);
    setAssets(remaining);
    deleteAssetFromDB(id);
  };

  const markAsRecycled = (id: string) => {
    updateAsset(id, {
      status: "TRANSFERRED",
      recommendedAction: "RECYCLE",
      aiReasoning: "Sent to Certified Institutional E-Waste Recycler. Hazardous materials safely neutralized.",
    });
  };

  const getAssetById = (id: string) => {
    return assets.find((a) => a.id === id);
  };

  const resetToDefault = () => {
    setAssets(INITIAL_ASSETS);
    saveAllAssetsToDB(INITIAL_ASSETS);
  };

  return (
    <AssetContext.Provider
      value={{
        assets,
        addAsset,
        updateAsset,
        deleteAsset,
        markAsRecycled,
        getAssetById,
        resetToDefault,
        isLoading,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
}

export function useAssets() {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error("useAssets must be used within an AssetProvider");
  }
  return context;
}
