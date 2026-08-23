"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ShortageRequest, AssetCategory, UrgencyLevel, AssetCondition } from "@/types";
import { MOCK_DEPARTMENTS } from "@/lib/mockData";

export const INITIAL_SHORTAGES: ShortageRequest[] = [
  {
    id: "req-01",
    departmentId: "dept-design",
    department: MOCK_DEPARTMENTS[4], // Bansuri Guru Design Studio
    category: "MONITOR",
    quantityRequested: 8,
    quantityFulfilled: 0,
    urgency: "HIGH",
    minimumCondition: "GOOD",
    requestedBy: "Prof. Kabir Sen",
    reason: "Bansuri Guru Design Studio requires color-accurate secondary displays for digital graphics labs.",
    status: "OPEN",
    createdAt: "2024-08-14T09:00:00Z",
    updatedAt: "2024-08-14T09:00:00Z",
  },
  {
    id: "req-02",
    departmentId: "dept-design",
    department: MOCK_DEPARTMENTS[4],
    category: "LAPTOP",
    quantityRequested: 4,
    quantityFulfilled: 0,
    urgency: "CRITICAL",
    minimumCondition: "GOOD",
    requestedBy: "Aanya Mehta",
    reason: "Research workstations pending replacement for incoming student design fellowship batch.",
    status: "OPEN",
    createdAt: "2024-08-15T11:30:00Z",
    updatedAt: "2024-08-15T11:30:00Z",
  },
  {
    id: "req-03",
    departmentId: "dept-civil",
    department: MOCK_DEPARTMENTS[3], // A-Block Civil
    category: "PROJECTOR",
    quantityRequested: 2,
    quantityFulfilled: 0,
    urgency: "MEDIUM",
    minimumCondition: "FAIR",
    requestedBy: "Prof. Nandini Rao",
    reason: "A-Block Civil Engineering seminar hall projector failed before upcoming structural workshop.",
    status: "OPEN",
    createdAt: "2024-08-16T14:15:00Z",
    updatedAt: "2024-08-16T14:15:00Z",
  },
  {
    id: "req-04",
    departmentId: "dept-research",
    department: MOCK_DEPARTMENTS[7], // S-Block Research
    category: "CHAIR",
    quantityRequested: 10,
    quantityFulfilled: 0,
    urgency: "HIGH",
    minimumCondition: "GOOD",
    requestedBy: "Dr. Vikram Sethi",
    reason: "Ergonomic seating required for post-doctoral scholars in S-Block Nanotech cleanroom offices.",
    status: "OPEN",
    createdAt: "2024-08-17T10:00:00Z",
    updatedAt: "2024-08-17T10:00:00Z",
  },
  {
    id: "req-05",
    departmentId: "dept-research",
    department: MOCK_DEPARTMENTS[7],
    category: "NETWORKING",
    quantityRequested: 2,
    quantityFulfilled: 0,
    urgency: "HIGH",
    minimumCondition: "GOOD",
    requestedBy: "Dr. Vikram Sethi",
    reason: "48-port PoE+ Gigabit switches needed to wire high-throughput IoT environmental sensors.",
    status: "OPEN",
    createdAt: "2024-08-18T16:45:00Z",
    updatedAt: "2024-08-18T16:45:00Z",
  },
];

interface ShortageContextType {
  shortages: ShortageRequest[];
  addShortage: (newShortage: Omit<ShortageRequest, "id" | "createdAt" | "updatedAt" | "quantityFulfilled" | "status">) => ShortageRequest;
  fulfillShortage: (id: string, qty: number) => void;
  deleteShortage: (id: string) => void;
}

const ShortageContext = createContext<ShortageContextType | undefined>(undefined);

export function ShortageProvider({ children }: { children: ReactNode }) {
  const [shortages, setShortages] = useState<ShortageRequest[]>(INITIAL_SHORTAGES);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("carbonloop_shortages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setShortages(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load shortages from storage");
    }
  }, []);

  const saveShortages = (items: ShortageRequest[]) => {
    setShortages(items);
    try {
      localStorage.setItem("carbonloop_shortages", JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save shortages to storage");
    }
  };

  const addShortage = (
    newShortage: Omit<ShortageRequest, "id" | "createdAt" | "updatedAt" | "quantityFulfilled" | "status">
  ): ShortageRequest => {
    const id = `req-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const created: ShortageRequest = {
      ...newShortage,
      id,
      quantityFulfilled: 0,
      status: "OPEN",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    saveShortages([created, ...shortages]);
    return created;
  };

  const fulfillShortage = (id: string, qty: number) => {
    const updated = shortages.map((s) => {
      if (s.id === id) {
        const newFulfilled = s.quantityFulfilled + qty;
        return {
          ...s,
          quantityFulfilled: newFulfilled,
          status: newFulfilled >= s.quantityRequested ? ("FULFILLED" as const) : ("OPEN" as const),
          updatedAt: new Date().toISOString(),
        };
      }
      return s;
    });
    saveShortages(updated);
  };

  const deleteShortage = (id: string) => {
    saveShortages(shortages.filter((s) => s.id !== id));
  };

  return (
    <ShortageContext.Provider
      value={{
        shortages,
        addShortage,
        fulfillShortage,
        deleteShortage,
      }}
    >
      {children}
    </ShortageContext.Provider>
  );
}

export function useShortages() {
  const context = useContext(ShortageContext);
  if (!context) {
    throw new Error("useShortages must be used within a ShortageProvider");
  }
  return context;
}
