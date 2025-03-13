"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { configureWorkerAuth, getAuthenticatedWorker, type AuthenticatedWorker, type WorkerApplication, formatWorkerApplicationFromCognito } from "@/lib/worker-auth";

type AuthContextType = {
  worker: AuthenticatedWorker | null;
  workerApplication: WorkerApplication | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshWorkerData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  worker: null,
  workerApplication: null,
  isLoading: true,
  isAuthenticated: false,
  refreshWorkerData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [worker, setWorker] = useState<AuthenticatedWorker | null>(null);
  const [workerApplication, setWorkerApplication] = useState<WorkerApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadWorkerData = async () => {
    try {
      // Configure Amplify for worker auth
      configureWorkerAuth();
      
      // Get authenticated worker data
      const workerData = await getAuthenticatedWorker();
      
      if (workerData) {
        setWorker(workerData);
        
        // Try to get application data from localStorage first
        const savedData = localStorage.getItem("workerApplicationData");
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            setWorkerApplication(parsedData);
          } catch (error) {
            console.error("Error parsing saved application data:", error);
            
            // Fallback to formatting from Cognito attributes
            const formattedData = formatWorkerApplicationFromCognito(workerData.attributes);
            setWorkerApplication(formattedData);
          }
        } else {
          // Format application data from Cognito attributes
          const formattedData = formatWorkerApplicationFromCognito(workerData.attributes);
          setWorkerApplication(formattedData);
        }
      } else {
        setWorker(null);
        setWorkerApplication(null);
      }
    } catch (error) {
      console.error("Error loading worker data:", error);
      setWorker(null);
      setWorkerApplication(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load worker data on initial mount
  useEffect(() => {
    loadWorkerData();
  }, []);

  const value = {
    worker,
    workerApplication,
    isLoading,
    isAuthenticated: !!worker,
    refreshWorkerData: loadWorkerData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
