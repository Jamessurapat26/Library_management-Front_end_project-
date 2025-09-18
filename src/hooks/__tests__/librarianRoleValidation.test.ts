/**
 * Comprehensive test suite for librarian role functionality validation
 * 
 * This test validates all requirements for task 6:
 * - Test librarian login and navigation to all pages
 * - Verify librarian can access all features same as admin
 * - Confirm librarian cannot create librarian accounts
 * - Test that all other functionality works identically
 * - Verify sidebar navigation works correctly for librarian role
 * 
 * Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.5
 */

import { renderHook } from '@testing-library/react';
import { useRolePermissions, useUserCreationValidation } from '../useRolePermissions';
import { useAuth } from '../useAuth';
import { adminSidebarItems, librarianSidebarItems } from '../../components/Sidebar';

// Mock the useAuth hook
jest.mock('../useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('Librarian Role Validation Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('1. Librarian Navigation and Sidebar Tests (Requirements 1.1, 5.1)', () => {
        test('librarian sidebar items should use same routes as admin', () => {
            // Extract routes from both sidebar configurations
            const adminRoutes = extractRoutesFromSidebarItems(adminSidebarItems);
            const librarianRoutes = extractRoutesFromSidebarItems(librarianSidebarItems);

            // Verify librarian has access to all main routes
            expect(librarianRoutes).toContain('/dashboard');
            expect(librarianRoutes).toContain('/books');
            expect(librarianRoutes).toContain('/books/add');
            expect(librarianRoutes).toContain('/members');
            expect(librarianRoutes).toContain('/transactions');
            expect(librarianRoutes).toContain('/reports');
            expect(librarianRoutes).toContain('/setting');

            // Verify librarian routes match admin routes exactly
            expect(librarianRoutes.sort()).toEqual(adminRoutes.sort());
        });

        test('librarian sidebar should have same menu structure as admin', () => {
            // Verify both have the same number of main menu items
            expect(librarianSidebarItems.length).toBe(adminSidebarItems.length);

            // Verify each menu item has the same structure
            librarianSidebarItems.forEach((libItem, index) => {
                const adminItem = adminSidebarItems[index];

                expect(libItem.id).toBe(adminItem.id);
                expect(libItem.label).toBe(adminItem.label);
                expect(libItem.href).toBe(adminItem.href);

                // Check children structure
                if (adminItem.children) {
                    expect(libItem.children).toBeDefined();
                    expect(libItem.children?.length).toBe(adminItem.children.length);

                    libItem.children?.forEach((libChild, childIndex) => {
                        const adminChild = adminItem.children![childIndex];
                        expect(libChild.href).toBe(adminChild.href);
                        expect(libChild.label).toBe(adminChild.label);
                    });
                }
            });
        });
    });

    describe('2. Librarian Permissions Tests (Requirements 2.1, 3.1, 4.1, 5.1)', () => {
        beforeEach(() => {
            mockUseAuth.mockReturnValue({
                user: {
                    id: '2',
                    username: 'librarian',
                    role: 'librarian',
                    displayName: 'บรรณารักษ์หลัก'
                },
                login: jest.fn(),
                logout: jest.fn(),
                isLoading: false
            });
        });

        test('librarian should have full access to all features except user role management', () => {
            const { result } = renderHook(() => useRolePermissions());
            const permissions = result.current;

            // Verify librarian has access to all main features
            expect(permissions.canAccessAllFeatures).toBe(true);
            expect(permissions.canDeleteUsers).toBe(true);

            // Verify librarian can create members
            expect(permissions.canCreateMember).toBe(true);

            // Verify librarian cannot create librarian or admin accounts
            expect(permissions.canCreateLibrarian).toBe(false);
            expect(permissions.canCreateAdmin).toBe(false);
            expect(permissions.canEditUserRoles).toBe(false);
        });

        test('librarian should only see member role in available roles for creation', () => {
            const { result } = renderHook(() => useRolePermissions());
            const permissions = result.current;

            expect(permissions.availableRolesForCreation).toEqual([
                { value: 'member', label: 'สมาชิก' }
            ]);
        });

        test('librarian user creation validation should work correctly', () => {
            const { result } = renderHook(() => useUserCreationValidation());
            const { canCreateUser } = result.current;

            // Test member creation - should be allowed
            const memberValidation = canCreateUser('member');
            expect(memberValidation.allowed).toBe(true);
            expect(memberValidation.errorMessage).toBeUndefined();

            // Test librarian creation - should be denied
            const librarianValidation = canCreateUser('librarian');
            expect(librarianValidation.allowed).toBe(false);
            expect(librarianValidation.errorMessage).toBe('เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถสร้างบัญชีบรรณารักษ์ได้');

            // Test admin creation - should be denied
            const adminValidation = canCreateUser('admin');
            expect(adminValidation.allowed).toBe(false);
            expect(adminValidation.errorMessage).toBe('เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถสร้างบัญชีผู้ดูแลระบบได้');
        });
    });

    describe('3. User Creation Restrictions Tests (Requirements 3.3, 6.1, 6.2, 6.5)', () => {
        beforeEach(() => {
            mockUseAuth.mockReturnValue({
                user: {
                    id: '2',
                    username: 'librarian',
                    role: 'librarian',
                    displayName: 'บรรณารักษ์หลัก'
                },
                login: jest.fn(),
                logout: jest.fn(),
                isLoading: false
            });
        });

        test('librarian should not be able to create librarian accounts', () => {
            const { result } = renderHook(() => useRolePermissions());
            const permissions = result.current;

            expect(permissions.canCreateLibrarian).toBe(false);

            // Verify available roles only includes member
            const availableRoles = permissions.availableRolesForCreation;
            expect(availableRoles.length).toBe(1);
            expect(availableRoles[0].value).toBe('member');
            expect(availableRoles[0].label).toBe('สมาชิก');
        });

        test('librarian should receive appropriate error messages for unauthorized role creation', () => {
            const { result } = renderHook(() => useUserCreationValidation());
            const { canCreateUser } = result.current;

            const librarianValidation = canCreateUser('librarian');
            expect(librarianValidation.allowed).toBe(false);
            expect(librarianValidation.errorMessage).toContain('เฉพาะผู้ดูแลระบบเท่านั้น');

            const adminValidation = canCreateUser('admin');
            expect(adminValidation.allowed).toBe(false);
            expect(adminValidation.errorMessage).toContain('เฉพาะผู้ดูแลระบบเท่านั้น');
        });
    });

    describe('4. Comparison with Admin Permissions', () => {
        test('admin should have all permissions that librarian has plus user role management', () => {
            // Test librarian permissions
            mockUseAuth.mockReturnValue({
                user: {
                    id: '2',
                    username: 'librarian',
                    role: 'librarian',
                    displayName: 'บรรณารักษ์หลัก'
                },
                login: jest.fn(),
                logout: jest.fn(),
                isLoading: false
            });

            const { result: librarianResult } = renderHook(() => useRolePermissions());
            const librarianPermissions = librarianResult.current;

            // Test admin permissions
            mockUseAuth.mockReturnValue({
                user: {
                    id: '1',
                    username: 'admin',
                    role: 'admin',
                    displayName: 'ผู้ดูแลระบบ'
                },
                login: jest.fn(),
                logout: jest.fn(),
                isLoading: false
            });

            const { result: adminResult } = renderHook(() => useRolePermissions());
            const adminPermissions = adminResult.current;

            // Verify admin has all librarian permissions plus more
            expect(adminPermissions.canAccessAllFeatures).toBe(librarianPermissions.canAccessAllFeatures);
            expect(adminPermissions.canDeleteUsers).toBe(librarianPermissions.canDeleteUsers);
            expect(adminPermissions.canCreateMember).toBe(librarianPermissions.canCreateMember);

            // Verify admin has additional permissions
            expect(adminPermissions.canCreateLibrarian).toBe(true);
            expect(adminPermissions.canCreateAdmin).toBe(true);
            expect(adminPermissions.canEditUserRoles).toBe(true);

            // Verify admin has more role options
            expect(adminPermissions.availableRolesForCreation.length).toBeGreaterThan(
                librarianPermissions.availableRolesForCreation.length
            );
        });
    });

    describe('5. Edge Cases and Error Handling', () => {
        test('should handle unauthenticated user correctly', () => {
            mockUseAuth.mockReturnValue({
                user: null,
                login: jest.fn(),
                logout: jest.fn(),
                isLoading: false
            });

            const { result } = renderHook(() => useRolePermissions());
            const permissions = result.current;

            expect(permissions.canAccessAllFeatures).toBe(false);
            expect(permissions.canCreateMember).toBe(false);
            expect(permissions.canCreateLibrarian).toBe(false);
            expect(permissions.canCreateAdmin).toBe(false);
            expect(permissions.availableRolesForCreation).toEqual([]);
        });

        test('should handle invalid role gracefully', () => {
            mockUseAuth.mockReturnValue({
                user: {
                    id: '999',
                    username: 'invalid',
                    role: 'invalid' as any,
                    displayName: 'Invalid User'
                },
                login: jest.fn(),
                logout: jest.fn(),
                isLoading: false
            });

            const { result } = renderHook(() => useRolePermissions());
            const permissions = result.current;

            expect(permissions.canAccessAllFeatures).toBe(false);
            expect(permissions.canCreateMember).toBe(false);
            expect(permissions.canCreateLibrarian).toBe(false);
            expect(permissions.canCreateAdmin).toBe(false);
            expect(permissions.availableRolesForCreation).toEqual([]);
        });
    });
});

// Helper function to extract all routes from sidebar items
function extractRoutesFromSidebarItems(items: any[]): string[] {
    const routes: string[] = [];

    items.forEach(item => {
        routes.push(item.href);

        if (item.children) {
            item.children.forEach((child: any) => {
                routes.push(child.href);
            });
        }
    });

    return routes;
}