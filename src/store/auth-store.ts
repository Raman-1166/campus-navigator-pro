import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthStore, UserRole } from '@/types/auth';

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
        // Mock login - in production, this would call an API
        // and receive a JWT token with role claims
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock validation - replace with actual authentication
        if (email && password.length >= 4) {
          const user = {
            id: crypto.randomUUID(),
            email,
            name: email.split('@')[0],
            role,
          };

          set({
            isAuthenticated: true,
            user,
            role,
          });

          return true;
        }

        return false;
      },

      logout: () => {
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
