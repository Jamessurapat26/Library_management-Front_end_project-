'use client';

import React from 'react';
import { useRolePermissions, usePermissionCheck, useUserCreationValidation } from '../useRolePermissions';

/**
 * Example component demonstrating useRolePermissions hook usage
 * 
 * This example shows how to:
 * 1. Check role-based permissions
 * 2. Conditionally render UI based on permissions
 * 3. Validate user creation permissions
 * 4. Get available roles for user creation
 */
export function RolePermissionsExample() {
    const permissions = useRolePermissions();
    const canCreateLibrarian = usePermissionCheck('canCreateLibrarian');
    const { canCreateUser, getAvailableRoles } = useUserCreationValidation();

    const availableRoles = getAvailableRoles();

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Role Permissions Example</h2>

            {/* Basic permissions display */}
            <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Current User Permissions</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Can Create Member: {permissions.canCreateMember ? '✅' : '❌'}</div>
                    <div>Can Create Librarian: {permissions.canCreateLibrarian ? '✅' : '❌'}</div>
                    <div>Can Create Admin: {permissions.canCreateAdmin ? '✅' : '❌'}</div>
                    <div>Can Edit User Roles: {permissions.canEditUserRoles ? '✅' : '❌'}</div>
                    <div>Can Delete Users: {permissions.canDeleteUsers ? '✅' : '❌'}</div>
                    <div>Can Access All Features: {permissions.canAccessAllFeatures ? '✅' : '❌'}</div>
                </div>
            </div>

            {/* Conditional rendering example */}
            <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Conditional UI Rendering</h3>

                {permissions.canCreateMember && (
                    <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                        เพิ่มสมาชิกใหม่
                    </button>
                )}

                {canCreateLibrarian && (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                        เพิ่มบรรณารักษ์ใหม่
                    </button>
                )}

                {permissions.canCreateAdmin && (
                    <button className="bg-red-500 text-white px-4 py-2 rounded mr-2">
                        เพิ่มผู้ดูแลระบบใหม่
                    </button>
                )}

                {!permissions.canCreateMember && !canCreateLibrarian && !permissions.canCreateAdmin && (
                    <p className="text-gray-500">คุณไม่มีสิทธิ์ในการสร้างผู้ใช้ใหม่</p>
                )}
            </div>

            {/* Available roles for creation */}
            <div className="bg-yellow-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Available Roles for Creation</h3>
                {availableRoles.length > 0 ? (
                    <div className="space-y-2">
                        {availableRoles.map((role) => (
                            <div key={role.value} className="flex items-center space-x-2">
                                <span className="bg-white px-3 py-1 rounded border">
                                    {role.label} ({role.value})
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">ไม่มีสิทธิ์ในการสร้างผู้ใช้</p>
                )}
            </div>

            {/* User creation validation example */}
            <div className="bg-red-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">User Creation Validation</h3>
                <div className="space-y-2">
                    {(['member', 'librarian', 'admin'] as const).map((role) => {
                        const validation = canCreateUser(role);
                        return (
                            <div key={role} className="flex items-center justify-between">
                                <span>Create {role}:</span>
                                <span className={validation.allowed ? 'text-green-600' : 'text-red-600'}>
                                    {validation.allowed ? '✅ Allowed' : `❌ ${validation.errorMessage}`}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Role-specific features example */}
            <div className="bg-purple-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Role-Specific Features</h3>

                {permissions.canAccessAllFeatures && (
                    <div className="mb-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            Full Library Management Access
                        </span>
                    </div>
                )}

                {permissions.canEditUserRoles ? (
                    <div className="mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            User Role Management
                        </span>
                    </div>
                ) : (
                    <div className="mb-2">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                            Limited to Member Creation Only
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Example of using permissions in a form component
 */
export function UserCreationFormExample() {
    const { getAvailableRoles, canCreateUser } = useUserCreationValidation();
    const [selectedRole, setSelectedRole] = React.useState<'member' | 'librarian' | 'admin'>('member');
    const [validationMessage, setValidationMessage] = React.useState<string>('');

    const availableRoles = getAvailableRoles();

    const handleRoleChange = (role: 'member' | 'librarian' | 'admin') => {
        setSelectedRole(role);
        const validation = canCreateUser(role);
        setValidationMessage(validation.errorMessage || '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validation = canCreateUser(selectedRole);

        if (!validation.allowed) {
            alert(validation.errorMessage);
            return;
        }

        // Proceed with user creation
        alert(`สร้างผู้ใช้ประเภท ${selectedRole} สำเร็จ!`);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">สร้างผู้ใช้ใหม่</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">ประเภทผู้ใช้</label>
                    <select
                        value={selectedRole}
                        onChange={(e) => handleRoleChange(e.target.value as 'member' | 'librarian' | 'admin')}
                        className="w-full p-2 border rounded-md"
                    >
                        {availableRoles.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>

                    {validationMessage && (
                        <p className="text-red-500 text-sm mt-1">{validationMessage}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!!validationMessage}
                    className={`w-full py-2 px-4 rounded-md ${validationMessage
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                >
                    สร้างผู้ใช้
                </button>
            </form>
        </div>
    );
}