// Export all custom hooks from this directory
export { useSidebarCollapse, useSidebarCollapseSession } from './useSidebarCollapse';
export { useAuth, useAuthRole, useAuthGuard, AUTH_ERRORS } from './useAuth';
export {
    useRolePermissions,
    usePermissionCheck,
    useUserCreationValidation,
    type RolePermissions
} from './useRolePermissions';
export {
    useMemberFormValidation,
    useDebouncedValidation,
    useMemberEditValidation,
    type UseMemberFormValidationOptions,
    type UseMemberFormValidationReturn,
    type UseMemberEditValidationOptions
} from './useMemberFormValidation';

// You can add more hooks here in the future
// export { useApi } from './useApi';
// export { useLocalStorage } from './useLocalStorage';
