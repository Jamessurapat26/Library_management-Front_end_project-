/**
 * Tests for useAuth hook
 * 
 * Note: These are basic tests to verify the hook structure.
 * Full integration tests would require a more complex test setup with AuthProvider.
 */

import { AUTH_ERRORS } from '../useAuth';

describe('useAuth hook', () => {
    describe('AUTH_ERRORS constants', () => {
        it('should have Thai error messages', () => {
            expect(AUTH_ERRORS.INVALID_CREDENTIALS).toBe('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            expect(AUTH_ERRORS.SESSION_EXPIRED).toBe('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
            expect(AUTH_ERRORS.NETWORK_ERROR).toBe('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
            expect(AUTH_ERRORS.UNKNOWN_ERROR).toBe('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
            expect(AUTH_ERRORS.CONTEXT_ERROR).toBe('useAuth must be used within an AuthProvider');
        });
    });

    describe('Hook exports', () => {
        it('should export required functions', async () => {
            const { useAuth, useAuthRole, useAuthGuard } = await import('../useAuth');

            expect(typeof useAuth).toBe('function');
            expect(typeof useAuthRole).toBe('function');
            expect(typeof useAuthGuard).toBe('function');
        });
    });
});