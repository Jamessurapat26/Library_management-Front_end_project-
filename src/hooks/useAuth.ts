'use client';

import { useContext, useCallback, useEffect, useState } from 'react';
import { AuthContext, type AuthContextType, type User } from '@/context/AuthContext';
import { validateSession, getStoredSession, clearStoredSession } from '@/utils/auth';

// Enhanced authentication state interface
interface UseAuthReturn extends AuthContextType {
    error: string | null;
    clearError: () => void;
    refreshSession: () => Promise<void>;
    isSessionValid: boolean;
}

// Authentication error types
export const AUTH_ERRORS = {
    INVALID_CREDENTIALS: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
    SESSION_EXPIRED: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
    NETWORK_ERROR: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง',
    UNKNOWN_ERROR: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ',
    CONTEXT_ERROR: 'useAuth must be used within an AuthProvider'
} as const;

/**
 * Enhanced authentication hook with error handling and session management
 * 
 * Features:
 * - Error state management with Thai error messages
 * - Session validation and restoration
 * - Loading states for better UX
 * - Session refresh functionality
 * - Automatic session cleanup on errors
 */
export function useAuth(): UseAuthReturn {
    const context = useContext(AuthContext);
    const [error, setError] = useState<string | null>(null);
    const [isSessionValid, setIsSessionValid] = useState(false);

    // Ensure hook is used within AuthProvider
    if (context === undefined) {
        throw new Error(AUTH_ERRORS.CONTEXT_ERROR);
    }

    const {
        user,
        isAuthenticated,
        login: contextLogin,
        logout: contextLogout,
        isLoading,
        sessionExpired,
        clearSessionExpired
    } = context;

    // Clear error state
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Enhanced login function with error handling
    const login = useCallback(async (
        username: string,
        password: string,
        rememberMe: boolean = false
    ): Promise<boolean> => {
        try {
            clearError();

            // Validate input
            if (!username.trim() || !password.trim()) {
                setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
                return false;
            }

            const success = await contextLogin(username, password, rememberMe);

            if (!success) {
                setError(AUTH_ERRORS.INVALID_CREDENTIALS);
                return false;
            }

            return true;
        } catch (err) {
            console.error('Login error:', err);
            setError(AUTH_ERRORS.NETWORK_ERROR);
            return false;
        }
    }, [contextLogin, clearError]);

    // Enhanced logout function with error handling
    const logout = useCallback((reason?: 'manual' | 'expired' | 'invalid') => {
        try {
            clearError();
            contextLogout(reason);
            setIsSessionValid(false);
        } catch (err) {
            console.error('Logout error:', err);
            // Force logout even if there's an error
            contextLogout(reason);
            setIsSessionValid(false);
        }
    }, [contextLogout, clearError]);

    // Refresh session validation
    const refreshSession = useCallback(async (): Promise<void> => {
        try {
            const storedSession = getStoredSession();

            if (storedSession) {
                const isValid = validateSession(storedSession);
                setIsSessionValid(isValid);

                if (!isValid) {
                    setError(AUTH_ERRORS.SESSION_EXPIRED);
                    clearStoredSession();
                    // Use the context logout directly to avoid dependency issues
                    context.logout('expired');
                }
            } else {
                setIsSessionValid(false);
            }
        } catch (err) {
            console.error('Session refresh error:', err);
            setIsSessionValid(false);
            setError(AUTH_ERRORS.UNKNOWN_ERROR);
        }
    }, [context]); // Add context dependency as required by ESLint

    // Session restoration and validation on mount and user changes
    useEffect(() => {
        if (!isLoading) {
            refreshSession();
        }
    }, [isLoading, refreshSession]);

    // Periodic session validation (every 5 minutes)
    useEffect(() => {
        if (isAuthenticated) {
            const interval = setInterval(() => {
                refreshSession();
            }, 5 * 60 * 1000); // 5 minutes

            return () => clearInterval(interval);
        }
    }, [isAuthenticated, refreshSession]);

    // Auto-clear errors after 10 seconds
    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => {
                setError(null);
            }, 10000);

            return () => clearTimeout(timeout);
        }
    }, [error]);

    return {
        user,
        isAuthenticated,
        login,
        logout,
        isLoading,
        error,
        clearError,
        refreshSession,
        isSessionValid: isSessionValid && isAuthenticated,
        sessionExpired,
        clearSessionExpired
    };
}

// Type guard to check if user has specific role
export function useAuthRole(requiredRole?: 'admin' | 'librarian'): {
    hasRole: boolean;
    user: User | null;
    isLoading: boolean;
} {
    const { user, isLoading } = useAuth();

    const hasRole = user ? (
        requiredRole ? user.role === requiredRole || user.role === 'admin' : true
    ) : false;

    return {
        hasRole,
        user,
        isLoading
    };
}

// Hook for checking authentication status with redirect capability
export function useAuthGuard(): {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    requireAuth: () => boolean;
} {
    const { isAuthenticated, isLoading, user } = useAuth();

    const requireAuth = useCallback((): boolean => {
        if (!isLoading && !isAuthenticated) {
            // This can be used by components to trigger redirects
            return false;
        }
        return isAuthenticated;
    }, [isAuthenticated, isLoading]);

    return {
        isAuthenticated,
        isLoading,
        user,
        requireAuth
    };
}