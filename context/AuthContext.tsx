"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "@/services/auth";
import type { StrapiCustomer } from "@/lib/auth-types";
import LoginModal from "@/components/auth/LoginModal";

interface AuthContextType {
  customer: StrapiCustomer | null;
  isLoading: boolean;
  login: (onSuccess?: () => void) => void;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<StrapiCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      const user = await authService.me();
      setCustomer(user);
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setCustomer(null);
    }
  }, []);

  // Hydrate session on mount
  useEffect(() => {
    fetchSession().finally(() => setIsLoading(false));
  }, [fetchSession]);

  const refreshCustomer = useCallback(async () => {
    if (!customer) return;
    setIsLoading(true);
    await fetchSession();
    setIsLoading(false);
  }, [customer, fetchSession]);

  const login = useCallback((onSuccess?: () => void) => {
    if (onSuccess) {
      setOnSuccessCallback(() => onSuccess);
    } else {
      setOnSuccessCallback(null);
    }
    setIsModalOpen(true);
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setCustomer(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setOnSuccessCallback(null);
  };

  const handleModalSuccess = async (customerData: StrapiCustomer) => {
    setCustomer(customerData);
    setIsModalOpen(false);
    
    if (onSuccessCallback) {
      onSuccessCallback();
      setOnSuccessCallback(null);
    }
  };

  const value = {
    customer,
    isLoading,
    login,
    logout,
    refreshCustomer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        onSuccess={handleModalSuccess} 
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
