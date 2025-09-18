/**
 * Example usage of the useAuth hook
 * 
 * This file demonstrates how to use the enhanced useAuth hook
 * with error handling and session management.
 */

'use client';

import { useAuth, useAuthRole, useAuthGuard } from '@/hooks';

// Example: Basic authentication usage
export function BasicAuthExample() {
    const {
        user,
        isAuthenticated,
        login,
        logout,
        isLoading,
        error,
        clearError
    } = useAuth();

    const handleLogin = async () => {
        const success = await login('admin', 'admin123', true);
        if (success) {
            console.log('Login successful!');
        }
    };

    if (isLoading) {
        return <div>กำลังโหลด...</div>;
    }

    return (
        <div className="p-4">
            <h2>Basic Auth Example</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                    <button onClick={clearError} className="ml-2 underline">
                        ปิด
                    </button>
                </div>
            )}

            {isAuthenticated ? (
                <div>
                    <p>สวัสดี, {user?.displayName}!</p>
                    <p>บทบาท: {user?.role}</p>
                    <button onClick={() => logout('manual')} className="bg-red-500 text-white px-4 py-2 rounded">
                        ออกจากระบบ
                    </button>
                </div>
            ) : (
                <div>
                    <p>กรุณาเข้าสู่ระบบ</p>
                    <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
                        เข้าสู่ระบบ (Demo)
                    </button>
                </div>
            )}
        </div>
    );
}

// Example: Role-based access control
export function RoleBasedExample() {
    const { hasRole, user, isLoading } = useAuthRole('admin');

    if (isLoading) {
        return <div>กำลังตรวจสอบสิทธิ์...</div>;
    }

    return (
        <div className="p-4">
            <h2>Role-Based Access Example</h2>

            {hasRole ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <p>คุณมีสิทธิ์ผู้ดูแลระบบ</p>
                    <p>ผู้ใช้: {user?.displayName}</p>
                </div>
            ) : (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    <p>คุณไม่มีสิทธิ์เข้าถึงส่วนนี้</p>
                </div>
            )}
        </div>
    );
}

// Example: Authentication guard
export function AuthGuardExample() {
    const { isAuthenticated, isLoading, user, requireAuth } = useAuthGuard();

    // This would typically be used in a useEffect to redirect
    const checkAuth = () => {
        if (!requireAuth()) {
            console.log('User needs to authenticate - redirect to login');
            // In a real component, you would use router.push('/auth/login')
        }
    };

    return (
        <div className="p-4">
            <h2>Auth Guard Example</h2>

            <div className="space-y-2">
                <p>สถานะการเข้าสู่ระบบ: {isAuthenticated ? 'เข้าสู่ระบบแล้ว' : 'ยังไม่ได้เข้าสู่ระบบ'}</p>
                <p>กำลังโหลด: {isLoading ? 'ใช่' : 'ไม่'}</p>
                {user && <p>ผู้ใช้: {user.displayName}</p>}

                <button
                    onClick={checkAuth}
                    className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                    ตรวจสอบการเข้าสู่ระบบ
                </button>
            </div>
        </div>
    );
}