"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "@/types";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  department: string;
  departmentCode: string;
  email: string;
  avatarInitials: string;
  description: string;
}

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  ADMIN: {
    id: "usr-admin-01",
    name: "Dr. Alok Verma",
    role: "ADMIN",
    roleLabel: "Sustainability & Asset Director",
    department: "Administration & Facilities",
    departmentCode: "ADMIN",
    email: "director.verma@campus.edu",
    avatarInitials: "AV",
    description: "Full institutional oversight, impact policies, and audit trails.",
  },
  DEPARTMENT_MANAGER: {
    id: "usr-mgr-02",
    name: "Prof. Priya Sharma",
    role: "DEPARTMENT_MANAGER",
    roleLabel: "Department Head",
    department: "Computer Science & Engineering",
    departmentCode: "CSE",
    email: "head.cse@campus.edu",
    avatarInitials: "PS",
    description: "Manages department assets, surplus declarations, and shortage requests.",
  },
  IT_OFFICER: {
    id: "usr-it-03",
    name: "Rohan Nair",
    role: "IT_OFFICER",
    roleLabel: "Lead Systems & Security Officer",
    department: "Central IT & Infrastructure",
    departmentCode: "ADMIN",
    email: "r.nair@it.campus.edu",
    avatarInitials: "RN",
    description: "Performs cryptographic data-wipe audits and digital sanitization approvals.",
  },
  REQUESTER: {
    id: "usr-req-04",
    name: "Aanya Mehta",
    role: "REQUESTER",
    roleLabel: "Research Fellow / Faculty",
    department: "Design & Innovation Lab",
    departmentCode: "DESIGN",
    email: "aanya.m@design.campus.edu",
    avatarInitials: "AM",
    description: "Searches available surplus items and submits asset acquisition requests.",
  },
};

interface RoleContextType {
  currentRole: UserRole;
  user: UserProfile;
  setRole: (role: UserRole) => void;
  campusName: string;
  setCampusName: (name: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("ADMIN");
  const [campusName, setCampusName] = useState("Main Innovation & Technology Campus");

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const user = DEMO_PROFILES[currentRole];

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        user,
        setRole,
        campusName,
        setCampusName,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
