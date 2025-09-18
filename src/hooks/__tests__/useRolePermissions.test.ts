/**
 * Tests for useRolePermissions hook
 * 
 * These tests verify the role-based permission logic and validation functions.
 * Requirements covered: 6.1, 6.2, 6.4
 */

import { renderHook } from '@testing-library/react';
import { useRolePermissions, usePermissionCheck, useUserCreationValidation } from '../useRolePermissions';
import { useAuth } from '../useAuth';

// Mock the useAuth hook
jest.mock('../useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('useRolePermissions hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Admin permissions', () => {
        beforeEach(() => {
            mockUseAuth.mockReturnValue({
                user: {
                    id: '1',
                    username: 'admin',
                    role: 'admin',
                    displayName: 'Admin User'
                },
                isAuthenticated: true,
                login: jest.fn(),
                logout: jest.fn(),
                isLoading: false,
                error: null,
                clearError: jest.fn(),
                refreshSession: jest.fn(),
                isSessionValid: true,
                sessionExpired: false,
                clearSessionExpired: jest.fn()
            });
        });

        it('should grant all permissions to admin', () => {
            const { result } = renderHook(() => useRolePermissions());

            expect(result.current.canCreateMember).toBe(true);
            expect(result.current.canCreateLibrarian).toBe(true);
            expect(result.current.canCreateAdmin).toBe(true);
            expect(result.current.canEditUserRoles).toBe(true);
            expect(result.current.canDeleteUsers).toBe(true);
            expect(result.current.canAccessAllFeatures).toBe(true);
        });

        it('should provide all role options for admin', () => {
            const { result } = renderHook(() => useRolePermissions());

            expect(result.current.availableRolesForCreation).toHaveLength(3);
            expect(result.current.availableRolesForCreation).toEqual([
                { value: 'member', label: 'สมาชิก' },
                { value: 'librarian', label: 'บรรณารักษ์' },
                { value: 'admin', label: 'ผู้ดูแลระบบ' }
            ]);
        });
    });

    describe('Librarian permissions', () => {
        beforeEach(() => {
            mockUseAuth.mockReturnValue({
                user: {
                    id: '2',
                    username: 'librarian',
                    role: 'librarian',
                    displayName: 'Librarian User'
                },
                isAuthenticated: true,
                login: jest.fn(),
                logout: jest.fn(),
                isLoading: false,
                error: null,
                clearError: jest.fn(),
                refreshSession: jest.fn(),
                isSessionValid: true,
                sessionExpired: false,
                clearSessionExpired: jest.fn()
            });
        });

        it('should grant limited permissions to librarian', () => {
            const { result } = renderHook(() => useRolePermissions());

            expect(result.current.canCreateMember).toBe(true);
            expect(result.current.canCreateLibrarian).toBe(false); // Key restriction
            expect(result.current.canCreateAdmin).toBe(false);
            expect(result.current.canEditUserRoles).toBe(false); // Key restriction
            expect(result.current.canDeleteUsers).toBe(true);
            expect(result.current.canAccessAllFeatures).toBe(true);
        });

        it('should provide only member role option for librarian', () => {
            const { result } = renderHook(() => useRolePermissions());

            expect(result.current.availableRolesForCreation).toHaveLength(1);
            expect(result.current.availableRolesForCreation).toEqual([
                { value: 'member', label: 'สมาชิก' }
            ]);
        });
    });

    describe('Unauthenticated user permissions', () => {
        beforeEach(() => {
            mockUseAuth.mockReturnValue({
                user: null,
                isAuthenticated: false,
                login: jest.fn(),
                logout: jest.fn(),
                isLoading: false,
                error: null,
                clearError: jest.fn(),
                refreshSession: jest.fn(),
                isSessionValid: false,
                sessionExpired: false,
                clearSessionExpired: jest.fn()
            });
        });

        it('should deny all permissions to unauthenticated user', () => {
            const { result } = renderHook(() => useRolePermissions());

            expect(result.current.canCreateMember).toBe(false);
            expect(result.current.canCreateLibrarian).toBe(false);
            expect(result.current.canCreateAdmin).toBe(false);
            expect(result.current.canEditUserRoles).toBe(false);
            expect(result.current.canDeleteUsers).toBe(false);
            expect(result.current.canAccessAllFeatures).toBe(false);
            expect(result.current.availableRolesForCreation).toHaveLength(0);
        });
    });
});

describe('usePermissionCheck hook', () => {
    beforeEach(() => {
        mockUseAuth.mockReturnValue({
            user: {
                id: '2',
                username: 'librarian',
                role: 'librarian',
                displayName: 'Librarian User'
            },
            isAuthenticated: true,
            login: jest.fn(),
            logout: jest.fn(),
            isLoading: false,
            error: null,
            clearError: jest.fn(),
            refreshSession: jest.fn(),
            isSessionValid: true,
            sessionExpired: false,
            clearSessionExpired: jest.fn()
        });
    });

    it('should check specific permissions correctly', () => {
        const { result: canCreateMember } = renderHook(() => usePermissionCheck('canCreateMember'));
        const { result: canCreateLibrarian } = renderHook(() => usePermissionCheck('canCreateLibrarian'));

        expect(canCreateMember.current).toBe(true);
        expect(canCreateLibrarian.current).toBe(false);
    });
});

describe('useUserCreationValidation hook', () => {
    describe('Librarian user validation', () => {
        beforeEach(() => {
            mockUseAuth.mockReturnValue({
                user: {
                    id: '2',
                    username: 'librarian',
                    role: 'librarian',
                    displayName: 'Librarian User'
                },
                isAuthenticated: true,
                login: jest.fn(),
                logout: jest.fn(),
                isLoading: false,
                error: null,
                clearError: jest.fn(),
                refreshSession: jest.fn(),
                isSessionValid: true,
                sessionExpired: false,
                clearSessionExpired: jest.fn()
            });
        });

        it('should allow member creation for librarian', () => {
            const { result } = renderHook(() => useUserCreationValidation());
            const validation = result.current.canCreateUser('member');

            expect(validation.allowed).toBe(true);
            expect(validation.errorMessage).toBeUndefined();
        });

        it('should deny librarian creation for librarian', () => {
            const { result } = renderHook(() => useUserCreationValidation());
            const validation = result.current.canCreateUser('librarian');

            expect(validation.allowed).toBe(false);
            expect(validation.errorMessage).toBe('เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถสร้างบัญชีบรรณารักษ์ได้');
        });

        it('should deny admin creation for librarian', () => {
            const { result } = renderHook(() => useUserCreationValidation());
            const validation = result.current.canCreateUser('admin');

            expect(validation.allowed).toBe(false);
            expect(validation.errorMessage).toBe('เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถสร้างบัญชีผู้ดูแลระบบได้');
        });

        it('should return available roles for librarian', () => {
            const { result } = renderHook(() => useUserCreationValidation());
            const availableRoles = result.current.getAvailableRoles();

            expect(availableRoles).toEqual([
                { value: 'member', label: 'สมาชิก' }
            ]);
        });
    });

    describe('Unauthenticated user validation', () => {
        beforeEach(() => {
            mockUseAuth.mockReturnValue({
                user: null,
                isAuthenticated: false,
                login: jest.fn(),
                logout: jest.fn(),
                isLoading: false,
                error: null,
                clearError: jest.fn(),
                refreshSession: jest.fn(),
                isSessionValid: false,
                sessionExpired: false,
                clearSessionExpired: jest.fn()
            });
        });

        it('should deny all user creation for unauthenticated user', () => {
            const { result } = renderHook(() => useUserCreationValidation());

            const memberValidation = result.current.canCreateUser('member');
            const librarianValidation = result.current.canCreateUser('librarian');
            const adminValidation = result.current.canCreateUser('admin');

            expect(memberValidation.allowed).toBe(false);
            expect(memberValidation.errorMessage).toBe('กรุณาเข้าสู่ระบบก่อนดำเนินการ');

            expect(librarianValidation.allowed).toBe(false);
            expect(librarianValidation.errorMessage).toBe('กรุณาเข้าสู่ระบบก่อนดำเนินการ');

            expect(adminValidation.allowed).toBe(false);
            expect(adminValidation.errorMessage).toBe('กรุณาเข้าสู่ระบบก่อนดำเนินการ');
        });
    });
});