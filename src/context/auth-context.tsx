"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// NOTE: This is a mock authentication system.
// In a real application, you would use a secure backend service for user management.
// Do NOT use this implementation in production.

interface User {
  username: string;
  profilePicture?: string;
}

interface StoredUser extends User {
  password_hash: string; // In a real app, this would be a proper hash.
  profilePicture: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfilePicture: (pictureDataUrl: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'domnam-users';
const SESSION_STORAGE_KEY = 'domnam-session-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfilePicture = async (pictureDataUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!user) {
            return reject(new Error("No user is logged in."));
        }

        const updatedUser = { ...user, profilePicture: pictureDataUrl };
        setUser(updatedUser);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));
        
        const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
        let users: StoredUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        
        users = users.map(u => 
            u.username.toLowerCase() === user.username.toLowerCase() 
            ? { ...u, profilePicture: pictureDataUrl } 
            : u
        );
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

        resolve();
    });
  };

  const signup = async (username: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
        const users: StoredUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            return reject(new Error("Username already exists."));
        }

        // In a real app, you'd hash the password securely.
        const newUser: StoredUser = { username, password_hash: password, profilePicture: "" };
        users.push(newUser);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

        // Automatically log in after signup
        const sessionUser: User = { username, profilePicture: "" };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
        resolve();
    });
  };

  const login = async (username: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
        const users: StoredUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

        const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (!foundUser || foundUser.password_hash !== password) {
            return reject(new Error("Invalid username or password."));
        }

        const sessionUser: User = { username: foundUser.username, profilePicture: foundUser.profilePicture };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
        resolve();
    });
  };

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, updateProfilePicture }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
