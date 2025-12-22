export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  role: UserRole | null;
}

export interface AuthActions {
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  googleLogin: (token: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (requiredRole: UserRole) => boolean;
}

export type AuthStore = AuthState & AuthActions;
