'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'librarian';
    fallbackPath?: string;
    loadingComponent?: React.ReactNode;
}

/**
 * ProtectedRoute component that wraps pages requiring authentication
 * 
 * Features:
 * - Authentication check with automatic redirect
 * - Role-based access control
 * - Loading state handling
 * - Session expiration handling
 * - Customizable fallback paths and loading components
 */
export function ProtectedRoute({
    children,
    requiredRole,
    fallbackPath = '/auth/login',
    loadingComponent
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user, error, sessionExpired } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Don't redirect while still loading
        if (isLoading) return;

        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            // Add session expired parameter if session was expired
            const redirectUrl = sessionExpired
                ? `${fallbackPath}?expired=true`
                : fallbackPath;
            router.push(redirectUrl);
            return;
        }

        // Check role-based access if required
        if (requiredRole && user) {
            const hasAccess = user.role === requiredRole || user.role === 'admin';

            if (!hasAccess) {
                // Redirect to dashboard with access denied (could be enhanced with query params)
                router.push('/dashboard?error=access_denied');
                return;
            }
        }
    }, [isAuthenticated, isLoading, user, requiredRole, router, fallbackPath, sessionExpired]);

    // Show loading state while checking authentication
    if (isLoading) {
        return loadingComponent || <LoadingSpinner />;
    }

    // Don't render children if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }

    // Check role access for authenticated users
    if (requiredRole && user) {
        const hasAccess = user.role === requiredRole || user.role === 'admin';

        if (!hasAccess) {
            return <AccessDenied userRole={user.role} requiredRole={requiredRole} />;
        }
    }

    // Handle session errors
    if (error) {
        return <SessionError error={error} />;
    }

    // Render protected content
    return <>{children}</>;
}

/**
 * Default loading spinner component
 */
function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">กำลังตรวจสอบสิทธิ์การเข้าใช้...</p>
            </div>
        </div>
    );
}

/**
 * Access denied component for role-based restrictions
 */
function AccessDenied({ userRole, requiredRole }: { userRole: string; requiredRole: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto p-6">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">ไม่มีสิทธิ์เข้าใช้</h1>
                <p className="text-gray-600 mb-4">
                    คุณไม่มีสิทธิ์เข้าใช้งานส่วนนี้ สิทธิ์ปัจจุบันของคุณ: {getRoleDisplayName(userRole)}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    ต้องการสิทธิ์: {getRoleDisplayName(requiredRole)}
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    กลับไปหน้าก่อนหน้า
                </button>
            </div>
        </div>
    );
}

/**
 * Session error component
 */
function SessionError({ error }: { error: string }) {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto p-6">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={() => router.push('/auth/login')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    เข้าสู่ระบบใหม่
                </button>
            </div>
        </div>
    );
}

/**
 * Helper function to get Thai display names for roles
 */
function getRoleDisplayName(role: string): string {
    switch (role) {
        case 'admin':
            return 'ผู้ดูแลระบบ';
        case 'librarian':
            return 'บรรณารักษ์';
        default:
            return role;
    }
}

// Export additional components for custom usage
export { LoadingSpinner, AccessDenied, SessionError };