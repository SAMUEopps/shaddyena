// 'use client';

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';



// interface User {
//   id: string;
//   name: string;
//   email: string;
//   phoneNumber: string;
//   role: 'customer' | 'vendor' | 'admin' | 'rider';
//   isVerified: boolean;

//   // Membership
//   isMember: boolean;
//   memberSince?: string;
//   totalSavings?: number;
//   totalInvestments?: number;
//   availableBalance?: number;

//   createdAt?: string;
//   referralCode?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   updateUser: (userData: Partial<User>) => void;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   // Load auth state from localStorage on mount
//   useEffect(() => {
//     const loadAuthState = () => {
//       try {
//         const storedToken = localStorage.getItem('token');
//         const storedUser = localStorage.getItem('user');
        
//         if (storedToken && storedUser) {
//           setToken(storedToken);
//           setUser(JSON.parse(storedUser));
//         }
//       } catch (error) {
//         console.error('Failed to load auth state:', error);
//         // Clear invalid data
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadAuthState();

//     // Listen for storage changes (for multi-tab support)
//     const handleStorageChange = (e: StorageEvent) => {
//       if (e.key === 'token' && e.newValue === null) {
//         setToken(null);
//         setUser(null);
//       }
//       if (e.key === 'user' && e.newValue) {
//         try {
//           setUser(JSON.parse(e.newValue));
//         } catch {
//           setUser(null);
//         }
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/shd-api/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Login failed');
//       }

//       // Store auth data
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
      
//       setToken(data.token);
//       setUser(data.user);

//       // Redirect based on role
//       const roleRedirects: Record<string, string> = {
//         admin: '/shd-pages/admin/dashboard',
//         vendor: '/shd-pages/vendor/dashboard',
//         rider: '/shd-pages/rider/dashboard',
//       };

//       const redirectPath = roleRedirects[data.user.role] || '/';
//       router.push(redirectPath);

//     } catch (error: any) {
//       throw new Error(error.message || 'Login failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setToken(null);
//     setUser(null);
//     router.push('/');
//   };

//   const updateUser = (userData: Partial<User>) => {
//     if (user) {
//       const updatedUser = { ...user, ...userData };
//       setUser(updatedUser);
//       localStorage.setItem('user', JSON.stringify(updatedUser));
      
//       // Update user in other tabs
//       window.dispatchEvent(new StorageEvent('storage', {
//         key: 'user',
//         newValue: JSON.stringify(updatedUser),
//       }));
//     }
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       token,
//       isLoading,
//       login,
//       logout,
//       updateUser,
//       isAuthenticated: !!user && !!token,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }


// shd-context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'customer' | 'vendor' | 'admin' | 'rider';
  isVerified: boolean;
  isMember: boolean;
  memberSince?: string;
  totalSavings?: number;
  totalInvestments?: number;
  availableBalance?: number;
  referralCode?: string;
  referredBy?: string | null;
  referralEarnings?: number;
  referralCommissionEarnings?: number;
  referralSubscriptionEarnings?: number;
  organizationId?: string | null; // Add this
  organizationName?: string | null; // Add this
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  organizationId: string | null; // Add this
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateOrganization: (orgData: { organizationId: string; organizationName: string }) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedOrgId = localStorage.getItem('organizationId');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setOrganizationId(parsedUser.organizationId || storedOrgId || null);
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('organizationId');
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && e.newValue === null) {
        setToken(null);
        setUser(null);
        setOrganizationId(null);
      }
      if (e.key === 'user' && e.newValue) {
        try {
          const parsedUser = JSON.parse(e.newValue);
          setUser(parsedUser);
          setOrganizationId(parsedUser.organizationId || null);
        } catch {
          setUser(null);
          setOrganizationId(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/shd-api/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.user.organizationId) {
        localStorage.setItem('organizationId', data.user.organizationId);
      }
      
      setToken(data.token);
      setUser(data.user);
      setOrganizationId(data.user.organizationId || null);

      // Redirect based on role
      const roleRedirects: Record<string, string> = {
        admin: '/shd-pages/admin/dashboard',
        vendor: '/shd-pages/vendor/dashboard',
        rider: '/shd-pages/rider/dashboard',
      };

      const redirectPath = roleRedirects[data.user.role] || '/';
      router.push(redirectPath);

    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('organizationId');
    setToken(null);
    setUser(null);
    setOrganizationId(null);
    router.push('/');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      if (userData.organizationId) {
        setOrganizationId(userData.organizationId);
        localStorage.setItem('organizationId', userData.organizationId);
      }
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update user in other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'user',
        newValue: JSON.stringify(updatedUser),
      }));
    }
  };

  const updateOrganization = (orgData: { organizationId: string; organizationName: string }) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        organizationId: orgData.organizationId,
        organizationName: orgData.organizationName
      };
      setUser(updatedUser);
      setOrganizationId(orgData.organizationId);
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('organizationId', orgData.organizationId);
      
      // Update user in other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'user',
        newValue: JSON.stringify(updatedUser),
      }));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      organizationId,
      isLoading,
      login,
      logout,
      updateUser,
      updateOrganization,
      isAuthenticated: !!user && !!token,
    }}>
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