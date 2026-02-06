import { useRolePermissions, useUserCreationValidation } from '@/hooks/useRolePermissions';
import { useState } from 'react';
import type { NewMemberForm, MemberFormErrors } from '@/types';

export type { NewMemberForm };
export type { MemberFormErrors as AddMemberFormErrors };

type AddMemberFormErrors = MemberFormErrors;

/**
 * Props interface for the AddMemberDialog component
 * Defines all required props for the add member dialog
 */
export interface AddMemberDialogProps {
    /** Whether the dialog is currently open */
    isOpen: boolean;
    /** Callback function to close the dialog */
    onClose: () => void;
    /** Callback function to add a new member */
    onAddMember: () => void;
    /** Current form data for the new member */
    newMemberForm: NewMemberForm;
    /** Function to update the form data */
    setNewMemberForm: (form: NewMemberForm) => void;
    /** Current user's role for permission checking */
    userRole: 'admin' | 'librarian' | 'member';
}

export default function AddMemberDialog({
    isOpen,
    onClose,
    onAddMember,
    newMemberForm,
    setNewMemberForm,
}: AddMemberDialogProps) {
    const permissions = useRolePermissions();
    const { canCreateUser, getAvailableRoles } = useUserCreationValidation();
    const [formErrors, setFormErrors] = useState<AddMemberFormErrors>({});

    // Current user role is passed as prop for additional context
    // Role permissions are handled by useRolePermissions hook

    // Clear errors when dialog closes
    const handleClose = () => {
        setFormErrors({});
        onClose();
    };

    if (!isOpen) return null;

    // Generate username and password for librarian
    const generateCredentials = () => {
        const username = newMemberForm.email.split('@')[0] + '_lib';
        const password = Math.random().toString(36).slice(-8);
        return { username, password };
    };

    // Auto-generate credentials when role changes to librarian
    const handleRoleChange = (role: "librarian" | "member") => {
        // Clear previous errors
        setFormErrors({});

        // Validate if user can create this role
        const validation = canCreateUser(role);
        if (!validation.allowed) {
            // Set error message for display
            setFormErrors({
                role: validation.errorMessage
            });
            // Reset to member role if unauthorized role was selected
            setNewMemberForm({
                ...newMemberForm,
                role: "member",
                username: undefined,
                password: undefined
            });
            return;
        }

        if (role === "librarian") {
            const { username, password } = generateCredentials();
            setNewMemberForm({
                ...newMemberForm,
                role,
                username,
                password
            });
        } else {
            setNewMemberForm({
                ...newMemberForm,
                role,
                username: undefined,
                password: undefined
            });
        }
    };

    // Get available roles for the current user
    const availableRoles = getAvailableRoles();

    // Email validation function
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Phone validation function (Thai phone number format)
    const validatePhone = (phone: string): boolean => {
        // Remove all non-digit characters for validation
        const cleanPhone = phone.replace(/\D/g, '');

        // Thai phone number patterns:
        // Mobile: 08x-xxx-xxxx, 09x-xxx-xxxx, 06x-xxx-xxxx (10 digits starting with 08, 09, 06)
        // Landline: 0x-xxx-xxxx (9 digits starting with 02-07)
        const mobileRegex = /^0[689]\d{8}$/;
        const landlineRegex = /^0[2-7]\d{7}$/;

        return mobileRegex.test(cleanPhone) || landlineRegex.test(cleanPhone);
    };

    // Real-time field validation
    const validateField = (fieldName: string, value: string) => {
        const errors = { ...formErrors };

        switch (fieldName) {
            case 'name':
                if (!value.trim()) {
                    errors.name = 'กรุณากรอกชื่อ-สกุล';
                } else {
                    delete errors.name;
                }
                break;

            case 'email':
                if (!value.trim()) {
                    errors.email = 'กรุณากรอกอีเมล';
                } else if (!validateEmail(value)) {
                    errors.email = 'รูปแบบอีเมลไม่ถูกต้อง (ตัวอย่าง: user@example.com)';
                } else {
                    delete errors.email;
                }
                break;

            case 'phone':
                if (!value.trim()) {
                    errors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
                } else if (!validatePhone(value)) {
                    errors.phone = 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ตัวอย่าง: 08x-xxx-xxxx)';
                } else {
                    delete errors.phone;
                }
                break;

            case 'username':
                if (newMemberForm.role === "librarian") {
                    if (!value.trim()) {
                        errors.username = 'กรุณากรอก Username';
                    } else if (value.length < 3) {
                        errors.username = 'Username ต้องมีอย่างน้อย 3 ตัวอักษร';
                    } else {
                        delete errors.username;
                    }
                } else {
                    delete errors.username;
                }
                break;

            case 'password':
                if (newMemberForm.role === "librarian") {
                    if (!value.trim()) {
                        errors.password = 'กรุณากรอก Password';
                    } else if (value.length < 6) {
                        errors.password = 'Password ต้องมีอย่างน้อย 6 ตัวอักษร';
                    } else {
                        delete errors.password;
                    }
                } else {
                    delete errors.password;
                }
                break;
        }

        setFormErrors(errors);
    };

    // Validate form before submission
    const validateForm = (): boolean => {
        const errors: AddMemberFormErrors = {};

        // Validate role permissions
        const roleValidation = canCreateUser(newMemberForm.role);
        if (!roleValidation.allowed) {
            errors.role = roleValidation.errorMessage;
        }

        // Validate required fields
        if (!newMemberForm.name.trim()) {
            errors.name = 'กรุณากรอกชื่อ-สกุล';
        }

        if (!newMemberForm.email.trim()) {
            errors.email = 'กรุณากรอกอีเมล';
        } else if (!validateEmail(newMemberForm.email)) {
            errors.email = 'รูปแบบอีเมลไม่ถูกต้อง (ตัวอย่าง: user@example.com)';
        }

        if (!newMemberForm.phone.trim()) {
            errors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
        } else if (!validatePhone(newMemberForm.phone)) {
            errors.phone = 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ตัวอย่าง: 08x-xxx-xxxx)';
        }

        // Validate librarian credentials
        if (newMemberForm.role === "librarian") {
            if (!newMemberForm.username?.trim()) {
                errors.username = 'กรุณากรอก Username สำหรับบรรณารักษ์';
            } else if (newMemberForm.username.length < 3) {
                errors.username = 'Username ต้องมีอย่างน้อย 3 ตัวอักษร';
            }

            if (!newMemberForm.password?.trim()) {
                errors.password = 'กรุณากรอก Password สำหรับบรรณารักษ์';
            } else if (newMemberForm.password.length < 6) {
                errors.password = 'Password ต้องมีอย่างน้อย 6 ตัวอักษร';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission with validation
    const handleSubmit = () => {
        if (validateForm()) {
            // Clear errors and proceed with submission
            setFormErrors({});
            onAddMember();
        }
    };

    return (
        <div className="fixed inset-0  flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">เพิ่มสมาชิกใหม่</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ชื่อ-สกุล
                        </label>
                        <input
                            type="text"
                            value={newMemberForm.name}
                            onChange={(e) => {
                                const value = e.target.value;
                                setNewMemberForm({ ...newMemberForm, name: value });
                                validateField('name', value);
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="กรอกชื่อ-สกุล"
                        />
                        {formErrors.name && (
                            <p className="text-sm text-red-600 mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {formErrors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            อีเมล
                        </label>
                        <input
                            type="email"
                            value={newMemberForm.email}
                            onChange={(e) => {
                                const value = e.target.value;
                                setNewMemberForm({ ...newMemberForm, email: value });
                                validateField('email', value);
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="กรอกอีเมล (ตัวอย่าง: user@example.com)"
                        />
                        {formErrors.email && (
                            <p className="text-sm text-red-600 mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {formErrors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            เบอร์โทรศัพท์
                        </label>
                        <input
                            type="tel"
                            value={newMemberForm.phone}
                            onChange={(e) => {
                                const value = e.target.value;
                                setNewMemberForm({ ...newMemberForm, phone: value });
                                validateField('phone', value);
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="กรอกเบอร์โทรศัพท์ (ตัวอย่าง: 08x-xxx-xxxx)"
                        />
                        {formErrors.phone && (
                            <p className="text-sm text-red-600 mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {formErrors.phone}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            รองรับเบอร์มือถือ (08x, 09x, 06x) และเบอร์บ้าน (02-07)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            บทบาท
                        </label>
                        <select
                            value={newMemberForm.role}
                            onChange={(e) => handleRoleChange(e.target.value as "librarian" | "member")}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${formErrors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                        >
                            {availableRoles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>

                        {/* Role-specific help text */}
                        {!permissions.canCreateLibrarian && (
                            <p className="text-sm text-gray-500 mt-1">
                                บรรณารักษ์สามารถเพิ่มเฉพาะสมาชิกธรรมดาเท่านั้น
                            </p>
                        )}

                        {/* Role validation error */}
                        {formErrors.role && (
                            <p className="text-sm text-red-600 mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {formErrors.role}
                            </p>
                        )}
                    </div>

                    {/* Show credentials for librarian */}
                    {newMemberForm.role === "librarian" && newMemberForm.username && newMemberForm.password && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-yellow-800 mb-2">ข้อมูลการเข้าสู่ระบบ (สำหรับบรรณารักษ์)</h4>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-xs font-medium text-yellow-700">Username:</label>
                                    <input
                                        type="text"
                                        value={newMemberForm.username}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setNewMemberForm({ ...newMemberForm, username: value });
                                            validateField('username', value);
                                        }}
                                        className={`w-full px-2 py-1 text-sm border rounded bg-yellow-50 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 ${formErrors.username ? 'border-red-300' : 'border-yellow-300'
                                            }`}
                                        placeholder="อย่างน้อย 3 ตัวอักษร"
                                    />
                                    {formErrors.username && (
                                        <p className="text-xs text-red-600 mt-1">{formErrors.username}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-yellow-700">Password:</label>
                                    <input
                                        type="text"
                                        value={newMemberForm.password}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setNewMemberForm({ ...newMemberForm, password: value });
                                            validateField('password', value);
                                        }}
                                        className={`w-full px-2 py-1 text-sm border rounded bg-yellow-50 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 ${formErrors.password ? 'border-red-300' : 'border-yellow-300'
                                            }`}
                                        placeholder="อย่างน้อย 6 ตัวอักษร"
                                    />
                                    {formErrors.password && (
                                        <p className="text-xs text-red-600 mt-1">{formErrors.password}</p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const { username, password } = generateCredentials();
                                        setNewMemberForm({ ...newMemberForm, username, password });
                                    }}
                                    className="text-xs text-yellow-700 hover:text-yellow-800 underline"
                                >
                                    สร้างข้อมูลใหม่
                                </button>
                            </div>
                            <p className="text-xs text-yellow-600 mt-2">
                                โปรดบันทึกข้อมูลนี้เพื่อให้กับบรรณารักษ์ใหม่
                            </p>
                        </div>
                    )}
                </div>



                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={
                            Object.keys(formErrors).length > 0 ||
                            !newMemberForm.name.trim() ||
                            !newMemberForm.email.trim() ||
                            !newMemberForm.phone.trim() ||
                            (newMemberForm.role === "librarian" && (!newMemberForm.username?.trim() || !newMemberForm.password?.trim()))
                        }
                    >
                        เพิ่มสมาชิก
                    </button>
                </div>
            </div>
        </div>
    );
}
