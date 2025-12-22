import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthStore, UserRole } from '@/types/auth';
import { api } from '@/services/api';

// NOTE: This is a mock implementation for demonstration purposes.
// In production, replace with actual API calls and JWT token validation.
// Never rely solely on localStorage for security - always validate on the server.

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      role: null,

      login: async (email: string, password: string, role: UserRole): Promise<boolean> => {
        try {
          const data = await api.auth.login(email, password);

          if (data.user.role !== role && role !== 'admin') {
            // Optional: Enforce role check if backend allows multiple roles but current UI forces selection.
            // For now, let's trust the backend response or just update the local state with backend role.
            // The backend returns the user's actual role.
          }

          set({
            isAuthenticated: true,
            user: { ...data.user, name: data.user.email.split('@')[0] },
            role: data.user.role as UserRole,
          });

          return true;
        } catch (error) {
          console.error("Login failed:", error);
          return false;
        }
      },

      googleLogin: async (token: string): Promise<boolean> => {
        try {
          const data = await api.auth.googleLogin(token);
          set({
            isAuthenticated: true,
            user: { ...data.user, name: data.user.email.split('@')[0] },
            role: data.user.role as UserRole,
          });
          return true;
        } catch (error) {
          console.error("Google login failed:", error);
          return false;
        }
      },

      logout: () => {
        api.auth.logout();
        set({
          isAuthenticated: false,
          user: null,
          role: null,
        });
      },

      hasRole: (requiredRole: UserRole): boolean => {
        const state = get();
        if (!state.isAuthenticated || !state.role) return false;

        // Admin has access to everything
        if (state.role === 'admin') return true;

        return state.role === requiredRole;
      },
    }),
    {
      name: 'campus-nav-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        role: state.role,
      }),
    }
  )
);
