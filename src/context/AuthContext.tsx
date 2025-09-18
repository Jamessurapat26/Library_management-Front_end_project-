'use client';

import { createContext, ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import {
    validateCredentials,
    createSession,
    validateSession,
    storeSession,
    getStoredSession,
    clearStoredSession,
    isSessionExpired,
    getSessionRemainingTime
} from '@/utils/auth';

// User interface
export interface User {
    id: string;
    username: string;
    role: 'admin' | 'librarian';
    displayName: string;
}

// User session interface
export interface UserSession {
    user: User;
    timestamp: number;
    rememberMe: boolean;
    expiresAt: number;
}

// Authentication context type
export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string, rememberMe: boolean) => Promise<boolean>;
    logout: (reason?: 'manual' | 'expired' | 'invalid') => void;
    isLoading: boolean;
    sessionExpired: boolean;
    clearSessionExpired: () => void;
}

// Create the authentication context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider props interface
interface AuthProviderProps {
    children: ReactNode;
}

// AuthProvider component with full authentication logic
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false);
    const sessionCheckInterval = useRef<NodeJS.Timeout | null>(null);
    const sessionWarningTimeout = useRef<NodeJS.Timeout | null>(null);

    // Clear session expired flag
    const clearSessionExpired = useCallback(() => {
        setSessionExpired(false);
    }, []);

    // Logout function with session cleanup and reason tracking
    const logout = useCallback((reason: 'manual' | 'expired' | 'invalid' = 'manual'): void => {
        try {
            // Clear intervals and timeouts
            if (sessionCheckInterval.current) {
                clearInterval(sessionCheckInterval.current);
                sessionCheckInterval.current = null;
            }
            if (sessionWarningTimeout.current) {
                clearTimeout(sessionWarningTimeout.current);
                sessionWarningTimeout.current = null;
            }

            // Clear stored session
            clearStoredSession();

            // Clear authentication state
            setUser(null);

            // Set session expired flag if logout was due to expiration
            if (reason === 'expired') {
                setSessionExpired(true);
            }
        } catch (error) {
            console.error('Logout failed:', error);
            // Force clear state even if localStorage fails
            setUser(null);
            if (reason === 'expired') {
                setSessionExpired(true);
            }
        }
    }, []);

    // Check session expiration
    const checkSessionExpiration = useCallback(() => {
        const storedSession = getStoredSession();

        if (!storedSession) {
            return;
        }

        if (isSessionExpired(storedSession)) {
            logout('expired');
            return;
        }

        // Check if session will expire in the next 5 minutes and warn user
        const remainingTime = getSessionRemainingTime(storedSession);
        const fiveMinutes = 5 * 60 * 1000;

        if (remainingTime <= fiveMinutes && remainingTime > 0) {
            // Set a timeout to logout when session actually expires
            if (sessionWarningTimeout.current) {
                clearTimeout(sessionWarningTimeout.current);
            }

            sessionWarningTimeout.current = setTimeout(() => {
                logout('expired');
            }, remainingTime);
        }
    }, [logout]); // Remove user dependency to prevent infinite loops

    // Initialize authentication state from stored session
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedSession = getStoredSession();

                if (storedSession && validateSession(storedSession)) {
                    setUser(storedSession.user);
                } else {
                    // Clear invalid or expired session
                    clearStoredSession();
                    setUser(null);
                    if (storedSession && isSessionExpired(storedSession)) {
                        setSessionExpired(true);
                    }
                }
            } catch (error) {
                console.error('Failed to initialize authentication:', error);
                clearStoredSession();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []); // Remove checkSessionExpiration dependency to prevent infinite loop

    // Set up periodic session checking when user is authenticated
    useEffect(() => {
        if (user && !isLoading) {
            // Check session every minute
            sessionCheckInterval.current = setInterval(() => {
                checkSessionExpiration();
            }, 60 * 1000);

            // Initial check
            checkSessionExpiration();

            return () => {
                if (sessionCheckInterval.current) {
                    clearInterval(sessionCheckInterval.current);
                    sessionCheckInterval.current = null;
                }
                if (sessionWarningTimeout.current) {
                    clearTimeout(sessionWarningTimeout.current);
                    sessionWarningTimeout.current = null;
                }
            };
        }
    }, [user, isLoading, checkSessionExpiration]);

    // Login function with credential validation
    const login = async (username: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
        try {
            setIsLoading(true);

            // Validate credentials
            const validatedUser = validateCredentials(username, password);

            if (!validatedUser) {
                return false;
            }

            // Create and store session
            const session = createSession(validatedUser, rememberMe);
            storeSession(session);

            // Update authentication state
            setUser(validatedUser);

            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };



    const contextValue: AuthContextType = {
        user,
        isAuthenticated: user !== null,
        login,
        logout,
        isLoading,
        sessionExpired,
        clearSessionExpired,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Note: The useAuth hook is now available in src/hooks/useAuth.ts
// This provides enhanced functionality including error handling and session management