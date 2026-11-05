/**
 * SmartAssess AI: Authentication & Role Management Context
 * Supports Student, Teacher, and Admin roles with active session switching for demonstration.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Institution } from '../types/index.ts';
import { dbService } from '../services/db.ts';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  institution: Institution | null;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchDemoUser: (userId: string) => void;
  registerUser: (
    name: string,
    email: string,
    role: UserRole,
    department: string,
    institutionName?: string,
    phone?: string,
    bio?: string
  ) => Promise<User>;
  updateUserProfile: (updates: Partial<User>) => Promise<User>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  refreshCurrentUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Default to sample student for instant demonstration
    const savedUserId = localStorage.getItem('smartassess_active_user') || 'usr-stud-01';
    const user = dbService.getUserById(savedUserId);
    if (user) {
      setCurrentUser(user);
    } else {
      const fallback = dbService.getUsers()[0];
      if (fallback) setCurrentUser(fallback);
    }
    setIsLoading(false);
  }, []);

  const refreshCurrentUser = () => {
    if (currentUser) {
      const fresh = dbService.getUserById(currentUser.id);
      if (fresh) setCurrentUser(fresh);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    const user = dbService.getUserByEmail(email);
    if (user && user.status === 'ACTIVE') {
      setCurrentUser(user);
      localStorage.setItem('smartassess_active_user', user.id);
      dbService.logAudit(user.id, 'USER_LOGIN', 'users', user.id, { email });
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      dbService.logAudit(currentUser.id, 'USER_LOGOUT', 'users', currentUser.id);
    }
    setCurrentUser(null);
    localStorage.removeItem('smartassess_active_user');
  };

  const switchDemoUser = (userId: string) => {
    const user = dbService.getUserById(userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('smartassess_active_user', user.id);
      dbService.logAudit(user.id, 'DEMO_ROLE_SWITCH', 'users', user.id, { role: user.role });
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    role: UserRole,
    department: string,
    institutionName?: string,
    phone?: string,
    bio?: string
  ): Promise<User> => {
    const existing = dbService.getUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    // Match or create institution
    let instId = 'inst-01';
    if (institutionName && institutionName.trim()) {
      const existingInst = dbService.getInstitutions().find(
        i => i.name.toLowerCase() === institutionName.trim().toLowerCase()
      );
      if (existingInst) {
        instId = existingInst.id;
      } else {
        const newInst = dbService.createInstitution({
          name: institutionName.trim(),
          code: institutionName.replace(/[^A-Za-z0-9]/g, '').substring(0, 8).toUpperCase(),
          contactEmail: `admin@${institutionName.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu`,
          isActive: true,
        });
        instId = newInst.id;
      }
    }

    const newUser = dbService.createUser({
      name,
      email,
      role,
      department,
      institutionId: instId,
      institutionName: institutionName || 'National Institute of Technology & Engineering',
      phone: phone || '',
      bio: bio || '',
      status: role === 'TEACHER' ? 'PENDING_APPROVAL' : 'ACTIVE',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
    });

    if (newUser.status === 'ACTIVE') {
      setCurrentUser(newUser);
      localStorage.setItem('smartassess_active_user', newUser.id);
    }

    return newUser;
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<User> => {
    if (!currentUser) throw new Error('No user is currently signed in');
    const updated = dbService.updateUser(currentUser.id, updates, currentUser.id);
    setCurrentUser(updated);
    return updated;
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    const user = dbService.getUserByEmail(email);
    if (!user) return false;
    dbService.logAudit(user.id, 'PASSWORD_RESET_REQUESTED', 'users', user.id, { email });
    return true;
  };

  const resolvedInstitution = currentUser?.institutionId
    ? dbService.getInstitutions().find(i => i.id === currentUser.institutionId) || null
    : null;

  const institution: Institution | null = resolvedInstitution || (currentUser?.institutionName ? {
    id: currentUser.institutionId || 'inst-custom',
    name: currentUser.institutionName,
    code: 'INST',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } : null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        institution,
        isLoading,
        login,
        logout,
        switchDemoUser,
        registerUser,
        updateUserProfile,
        requestPasswordReset,
        refreshCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
