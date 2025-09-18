/**
 * Example usage of ProtectedRoute component
 * 
 * This file demonstrates different ways to use the ProtectedRoute wrapper
 * for protecting pages and components that require authentication.
 */

import { ProtectedRoute } from '../ProtectedRoute';

// Example 1: Basic protected page (any authenticated user)
export function BasicProtectedPage() {
    return (
        <ProtectedRoute>
            <div className="p-6">
                <h1 className="text-2xl font-bold">หน้าที่ต้องเข้าสู่ระบบ</h1>
                <p>เนื้อหานี้จะแสดงเฉพาะผู้ใช้ที่เข้าสู่ระบบแล้วเท่านั้น</p>
            </div>
        </ProtectedRoute>
    );
}

// Example 2: Admin-only protected page
export function AdminOnlyPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <div className="p-6">
                <h1 className="text-2xl font-bold">หน้าสำหรับผู้ดูแลระบบ</h1>
                <p>เนื้อหานี้จะแสดงเฉพาะผู้ดูแลระบบเท่านั้น</p>
            </div>
        </ProtectedRoute>
    );
}

// Example 3: Librarian-only protected page
export function LibrarianOnlyPage() {
    return (
        <ProtectedRoute requiredRole="librarian">
            <div className="p-6">
                <h1 className="text-2xl font-bold">หน้าสำหรับบรรณารักษ์</h1>
                <p>เนื้อหานี้จะแสดงเฉพาะบรรณารักษ์และผู้ดูแลระบบ</p>
            </div>
        </ProtectedRoute>
    );
}

// Example 4: Custom loading component
function CustomLoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-pulse bg-blue-200 rounded-lg p-8">
                    <div className="w-16 h-16 bg-blue-400 rounded-full mx-auto mb-4"></div>
                    <p className="text-blue-800">กำลังโหลด...</p>
                </div>
            </div>
        </div>
    );
}

export function ProtectedPageWithCustomLoading() {
    return (
        <ProtectedRoute loadingComponent={<CustomLoadingSpinner />}>
            <div className="p-6">
                <h1 className="text-2xl font-bold">หน้าที่มี Loading แบบกำหนดเอง</h1>
                <p>หน้านี้ใช้ loading component ที่กำหนดเอง</p>
            </div>
        </ProtectedRoute>
    );
}

// Example 5: Custom fallback path
export function ProtectedPageWithCustomFallback() {
    return (
        <ProtectedRoute fallbackPath="/custom-login">
            <div className="p-6">
                <h1 className="text-2xl font-bold">หน้าที่มี Fallback แบบกำหนดเอง</h1>
                <p>หน้านี้จะ redirect ไปยัง /custom-login แทน /auth/login</p>
            </div>
        </ProtectedRoute>
    );
}

// Example 6: Usage in Next.js App Router page
export function DashboardPageExample() {
    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">แดชบอร์ด</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">สถิติหนังสือ</h2>
                            <p className="text-gray-600">จำนวนหนังสือทั้งหมด: 1,234 เล่ม</p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">สมาชิก</h2>
                            <p className="text-gray-600">สมาชิกทั้งหมด: 567 คน</p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">การยืม-คืน</h2>
                            <p className="text-gray-600">รายการยืมวันนี้: 23 รายการ</p>
                        </div>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}

// Example 7: Nested protection with different roles
export function NestedProtectionExample() {
    return (
        <ProtectedRoute>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">หน้าหลัก (ต้องเข้าสู่ระบบ)</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                        <h2 className="text-lg font-semibold mb-2">ส่วนทั่วไป</h2>
                        <p>เนื้อหาที่ผู้ใช้ทุกคนเข้าถึงได้</p>
                    </div>

                    <ProtectedRoute requiredRole="admin">
                        <div className="border rounded-lg p-4 bg-red-50">
                            <h2 className="text-lg font-semibold mb-2">ส่วนผู้ดูแลระบบ</h2>
                            <p>เนื้อหาสำหรับผู้ดูแลระบบเท่านั้น</p>
                        </div>
                    </ProtectedRoute>
                </div>
            </div>
        </ProtectedRoute>
    );
}