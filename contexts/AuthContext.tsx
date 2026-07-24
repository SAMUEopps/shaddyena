// /*'use client';

// import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';

// interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: 'customer' | 'vendor' | 'admin'| 'delivery' ;
//   phone: string;
//   avatar?: string;
//   businessName?: string;
//   businessType?: string;
//   mpesaNumber?: string;
//   isVerified: boolean;
//   isActive: boolean;
//   // Referral fields
//   referralCode: string;
//   referredBy?: string;
//   referralCount: number;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (userData: any) => Promise<void>;
//   logout: () => Promise<void>;
//   isLoading: boolean;
//   refreshUser: () => Promise<void>; // New method to refresh user data
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const response = await fetch('/api/auth/me');
//       if (response.ok) {
//         const userData = await response.json();
//         setUser(userData);
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const refreshUser = async () => {
//     try {
//       const response = await fetch('/api/auth/me');
//       if (response.ok) {
//         const userData = await response.json();
//         setUser(userData);
//       }
//     } catch (error) {
//       console.error('Failed to refresh user data:', error);
//     }
//   };

//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message);
//       }

//       const data = await response.json();
//       setUser(data.user);
//       router.push('/');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (userData: any) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message);
//       }

//       const data = await response.json();
      
//       // Show success message with referral info if applicable
//       if (data.referralCode) {
//         console.log('Your referral code:', data.referralCode);
//       }
      
//       // Redirect to login with success message
//       router.push(`/login?message=Account created successfully${data.referralCode ? '&refCode=' + data.referralCode : ''}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     setIsLoading(true);
//     try {
//       await fetch('/api/auth/logout', { method: 'POST' });
//       setUser(null);
//       router.push('/login');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     isLoading,
//     refreshUser, // Export the refresh method
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };*/

// 'use client';

// import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';

// export interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: 'customer' | 'vendor' | 'admin'| 'delivery' ;
//   phone: string;
//   avatar?: string;
//   businessName?: string;
//   businessType?: string;
//   mpesaNumber?: string;
//   isVerified: boolean;
//   isActive: boolean;
//   // Referral fields
//   referralCode: string;
//   referredBy?: string;
//   referralCount: number;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (userData: any) => Promise<void>;
//   logout: () => Promise<void>;
//   isLoading: boolean;
//   refreshUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const response = await fetch('/api/auth/me');
//       if (response.ok) {
//         const userData = await response.json();
//         setUser(userData);
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const refreshUser = async () => {
//     try {
//       const response = await fetch('/api/auth/me');
//       if (response.ok) {
//         const userData = await response.json();
//         setUser(userData);
//       }
//     } catch (error) {
//       console.error('Failed to refresh user data:', error);
//     }
//   };

//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message);
//       }

//       const data = await response.json();
//       setUser(data.user);
//       router.push('/');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (userData: any) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message);
//       }

//       const data = await response.json();
      
//       // Show success toast with referral info if applicable
//       const successMessage = data.referralCode 
//         ? ` Account created successfully! Your referral code is ${data.referralCode}. Please login to continue.`
//         : ` Account created successfully! Please login to continue.`;
      
//       toast.success(successMessage, {
//         duration: 5000,
//         position: 'top-center',
//         style: {
//           background: '#10B981',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '8px',
//           fontSize: '14px',
//         },
//         iconTheme: {
//           primary: '#fff',
//           secondary: '#10B981',
//         },
//       });

//       // Wait a moment before redirecting so user can see the toast
//       setTimeout(() => {
//         router.push('/login');
//       }, 2000);
      
//     } catch (error: any) {
//       // Show error toast
//       toast.error(error.message || 'Registration failed. Please try again.', {
//         duration: 4000,
//         position: 'top-center',
//         style: {
//           background: '#EF4444',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '8px',
//           fontSize: '14px',
//         },
//       });
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     setIsLoading(true);
//     try {
//       await fetch('/api/auth/logout', { method: 'POST' });
//       setUser(null);
//       router.push('/login');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     isLoading,
//     refreshUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

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
  createdAt?: string;
  referralCode?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
      }
      if (e.key === 'user' && e.newValue) {
        try {
          setUser(JSON.parse(e.newValue));
        } catch {
          setUser(null);
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
      
      setToken(data.token);
      setUser(data.user);

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
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
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
      isLoading,
      login,
      logout,
      updateUser,
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