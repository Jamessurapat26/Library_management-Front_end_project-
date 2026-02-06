'use client';

import { useAuth } from './useAuth';
import { ROLE_DISPLAY_NAMES } from '@/constants';

/**
 * Interface defining role-based permissions for different user actions
 */
export interface RolePermissions {
    // User creation permissions
    canCreateMember: boolean;
    canCreateLibrarian: boolean;
    canCreateAdmin: boolean;

    // User management permissions
    canEditUserRoles: boolean;
    canDeleteUsers: boolean;

    // General access permissions
    canAccessAllFeatures: boolean;

    // Available roles for user creation
    availableRolesForCreation: Array<{
        value: 'member' | 'librarian' | 'admin';
        label: string;
    }>;
}

/**
 * Hook for managing role-based permissions
 * 
 * This hook implements the permission matrix where:
 * - Admin: Full permissions including creating librarian accounts
 * - Librarian: All permissions except creating librarian/admin accounts
 * - Member: No administrative permissions
 * 
 * Requirements covered: 6.1, 6.2, 6.4
 */
export function useRolePermissions(): RolePermissions {
    const { user } = useAuth();

    // Default permissions for unauthenticated users
    if (!user) {
        return {
            canCreateMember: false,
            canCreateLibrarian: false,
            canCreateAdmin: false,
            canEditUserRoles: false,
            canDeleteUsers: false,
            canAccessAllFeatures: false,
            availableRolesForCreation: []
        };
    }

    // Permission matrix based on user role
    switch (user.role) {
        case 'admin':
            return {
                canCreateMember: true,
                canCreateLibrarian: true,
                canCreateAdmin: true,
                canEditUserRoles: true,
                canDeleteUsers: true,
                canAccessAllFeatures: true,
                availableRolesForCreation: [
                    { value: 'member', label: ROLE_DISPLAY_NAMES.member },
                    { value: 'librarian', label: ROLE_DISPLAY_NAMES.librarian },
                    { value: 'admin', label: ROLE_DISPLAY_NAMES.admin }
                ]
            };

        case 'librarian':
            return {
                canCreateMember: true,
                canCreateLibrarian: false, // Key restriction: librarian cannot create librarian accounts
                canCreateAdmin: false,
                canEditUserRoles: false, // Cannot edit user roles
                canDeleteUsers: true, // Can delete users (same as admin for other operations)
                canAccessAllFeatures: true, // Full access to all features except user role management
                availableRolesForCreation: [
                    { value: 'member', label: ROLE_DISPLAY_NAMES.member }
                ]
            };

        default:
            // Member or any other role has no administrative permissions
            return {
                canCreateMember: false,
                canCreateLibrarian: false,
                canCreateAdmin: false,
                canEditUserRoles: false,
                canDeleteUsers: false,
                canAccessAllFeatures: false,
                availableRolesForCreation: []
            };
    }
}

/**
 * Hook for checking specific permission
 * Useful for conditional rendering and validation
 */
export function usePermissionCheck(permission: keyof RolePermissions): boolean {
    const permissions = useRolePermissions();

    // Handle array type for availableRolesForCreation
    if (permission === 'availableRolesForCreation') {
        return permissions.availableRolesForCreation.length > 0;
    }

    return permissions[permission] as boolean;
}

/**
 * Hook for validating user creation permissions
 * Returns validation result and error message
 */
export function useUserCreationValidation(): {
    canCreateUser: (targetRole: 'member' | 'librarian' | 'admin') => {
        allowed: boolean;
        errorMessage?: string;
    };
    getAvailableRoles: () => Array<{ value: 'member' | 'librarian' | 'admin'; label: string }>;
} {
    const permissions = useRolePermissions();
    const { user } = useAuth();

    const canCreateUser = (targetRole: 'member' | 'librarian' | 'admin') => {
        if (!user) {
            return {
                allowed: false,
                errorMessage: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ'
            };
        }

        switch (targetRole) {
            case 'member':
                return {
                    allowed: permissions.canCreateMember,
                    errorMessage: permissions.canCreateMember ? undefined : 'คุณไม่มีสิทธิ์ในการสร้างบัญชีสมาชิก'
                };

            case 'librarian':
                return {
                    allowed: permissions.canCreateLibrarian,
                    errorMessage: permissions.canCreateLibrarian ? undefined : 'เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถสร้างบัญชีบรรณารักษ์ได้'
                };

            case 'admin':
                return {
                    allowed: permissions.canCreateAdmin,
                    errorMessage: permissions.canCreateAdmin ? undefined : 'เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถสร้างบัญชีผู้ดูแลระบบได้'
                };

            default:
                return {
                    allowed: false,
                    errorMessage: 'ประเภทผู้ใช้ไม่ถูกต้อง'
                };
        }
    };

    const getAvailableRoles = () => {
        return permissions.availableRolesForCreation;
    };

    return {
        canCreateUser,
        getAvailableRoles
    };
}