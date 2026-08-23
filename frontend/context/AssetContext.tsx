"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Asset, CircularAction, AssetCondition } from "@/types";
import { MOCK_ASSETS as INITIAL_ASSETS } from "@/lib/mockAssets";

interface AssetContextType {
  assets: Asset[];
  addAsset: (newAsset: Omit<Asset, "id" | "createdAt" | "updatedAt">) => Asset;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  markAsRecycled: (id: string) => void;
  getAssetById: (id: string) => Asset | undefined;
  resetToDefault: () => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);

  // Load from localStorage on mount if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("carbonloop_assets");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAssets(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load assets from localStorage, using defaults.");
    }
  }, []);

  // Sync to localStorage
  const saveAssets = (newAssets: Asset[]) => {
    setAssets(newAssets);
    try {
      localStorage.setItem("carbonloop_assets", JSON.stringify(newAssets));
    } catch (e) {
      console.warn("Failed to persist assets to localStorage");
    }
  };

  const addAsset = (newAssetData: Omit<Asset, "id" | "createdAt" | "updatedAt">): Asset => {
    const id = `ast-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const created: Asset = {
      ...newAssetData,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    saveAssets([created, ...assets]);
    return created;
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    const updated = assets.map((item) =>
      item.id === id
        ? {
            ...item,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : item
    );
    saveAssets(updated);
  };

  const deleteAsset = (id: string) => {
    const remaining = assets.filter((item) => item.id !== id);
    saveAssets(remaining);
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
    saveAssets(INITIAL_ASSETS);
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
