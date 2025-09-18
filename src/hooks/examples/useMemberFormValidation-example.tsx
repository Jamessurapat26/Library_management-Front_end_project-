/**
 * Example usage of useMemberFormValidation hook
 * This demonstrates how to use the validation hook in React components
 */

import React, { useState } from 'react';
import { useMemberFormValidation, useMemberEditValidation } from '@/hooks/useMemberFormValidation';
import { mockMembers, Member } from '@/mock/members';

// Example 1: Basic form validation for adding new member
export const AddMemberFormExample: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const {
        errors,
        isValid,
        validateForm,
        validateSingleField,
        clearErrors,
        hasErrors
    } = useMemberFormValidation({
        existingMembers: mockMembers,
        enableRealTimeValidation: true
    });

    const handleFieldChange = (fieldName: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        validateSingleField(fieldName, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = validateForm(formData);

        if (result.isValid) {
            console.log('Form is valid, submitting...', formData);
            // Reset form after successful submission
            setFormData({ name: '', email: '', phone: '' });
            clearErrors();
        } else {
            console.log('Form has errors:', result.errors);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">ชื่อ-สกุล</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="กรอกชื่อ-สกุล"
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">อีเมล</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="กรอกอีเมล"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">เบอร์โทรศัพท์</label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="กรอกเบอร์โทรศัพท์"
                />
                {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={!isValid || hasErrors}
                    className={`px-4 py-2 rounded ${isValid && !hasErrors
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    เพิ่มสมาชิก
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setFormData({ name: '', email: '', phone: '' });
                        clearErrors();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                    ล้างข้อมูล
                </button>
            </div>

            {/* Debug information */}
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
                <p><strong>Form State:</strong></p>
                <p>Is Valid: {isValid ? 'Yes' : 'No'}</p>
                <p>Has Errors: {hasErrors ? 'Yes' : 'No'}</p>
                <p>Errors: {JSON.stringify(errors, null, 2)}</p>
            </div>
        </form>
    );
};

// Example 2: Edit form with change detection
interface EditMemberFormExampleProps {
    originalMember: Member;
    onSave: (updatedMember: Member) => void;
    onCancel: () => void;
}

export const EditMemberFormExample: React.FC<EditMemberFormExampleProps> = ({
    originalMember,
    onSave,
    onCancel
}) => {
    const [formData, setFormData] = useState({
        name: originalMember.name,
        email: originalMember.email,
        phone: originalMember.phone
    });

    const {
        errors,
        isValid,
        hasChanges,
        validateFormWithChanges,
        validateSingleField,

    } = useMemberEditValidation({
        originalMember,
        existingMembers: mockMembers,
        enableRealTimeValidation: true,
        onValidationChange: (valid) => {
            console.log('Validation state changed:', valid);
        }
    });

    const handleFieldChange = (fieldName: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        validateSingleField(fieldName, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = validateFormWithChanges(formData);

        if (result.canSave) {
            const updatedMember: Member = {
                ...originalMember,
                ...formData
            };
            onSave(updatedMember);
        }
    };

    const formHasChanges = hasChanges(formData);
    const canSave = isValid && formHasChanges;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Read-only fields */}
            <div>
                <label className="block text-sm font-medium text-gray-500">รหัสสมาชิก</label>
                <input
                    type="text"
                    value={originalMember.memberNumber}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-gray-500"
                />
            </div>

            {/* Editable fields */}
            <div>
                <label className="block text-sm font-medium">ชื่อ-สกุล</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">อีเมล</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium">เบอร์โทรศัพท์</label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
            </div>

            {/* Read-only status fields */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-500">บทบาท</label>
                    <input
                        type="text"
                        value={originalMember.role === 'admin' ? 'ผู้ดูแลระบบ' :
                            originalMember.role === 'librarian' ? 'บรรณารักษ์' : 'สมาชิก'}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-gray-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500">สถานะ</label>
                    <input
                        type="text"
                        value={originalMember.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 text-gray-500"
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={!canSave}
                    className={`px-4 py-2 rounded ${canSave
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    บันทึกการเปลี่ยนแปลง
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                    ยกเลิก
                </button>
            </div>

            {/* Status indicators */}
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm space-y-1">
                <p><strong>Form Status:</strong></p>
                <p>Is Valid: {isValid ? '✅' : '❌'}</p>
                <p>Has Changes: {formHasChanges ? '✅' : '❌'}</p>
                <p>Can Save: {canSave ? '✅' : '❌'}</p>
                {Object.keys(errors).length > 0 && (
                    <p>Errors: {Object.keys(errors).join(', ')}</p>
                )}
            </div>
        </form>
    );
};

// Example 3: Librarian form with credentials
export const LibrarianFormExample: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        username: '',
        password: ''
    });

    const {
        errors,
        isValid,
        validateSingleField
    } = useMemberFormValidation({
        existingMembers: mockMembers,
        isLibrarian: true,
        enableRealTimeValidation: true
    });

    const handleFieldChange = (fieldName: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        validateSingleField(fieldName, value);
    };

    const generateCredentials = () => {
        const username = formData.email.split('@')[0] + '_lib';
        const password = Math.random().toString(36).slice(-8);
        setFormData(prev => ({ ...prev, username, password }));
    };

    return (
        <form className="space-y-4">
            {/* Basic fields */}
            <div>
                <label className="block text-sm font-medium">ชื่อ-สกุล</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">อีเมล</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">เบอร์โทรศัพท์</label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Librarian credentials */}
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <h4 className="font-medium text-yellow-800 mb-2">ข้อมูลการเข้าสู่ระบบ</h4>

                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium text-yellow-700">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleFieldChange('username', e.target.value)}
                            className={`w-full px-3 py-2 border rounded ${errors.username ? 'border-red-500' : 'border-yellow-300'
                                }`}
                        />
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-yellow-700">Password</label>
                        <input
                            type="text"
                            value={formData.password}
                            onChange={(e) => handleFieldChange('password', e.target.value)}
                            className={`w-full px-3 py-2 border rounded ${errors.password ? 'border-red-500' : 'border-yellow-300'
                                }`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <button
                        type="button"
                        onClick={generateCredentials}
                        className="text-sm text-yellow-700 hover:text-yellow-800 underline"
                    >
                        สร้างข้อมูลอัตโนมัติ
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={!isValid}
                className={`w-full px-4 py-2 rounded ${isValid
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
            >
                เพิ่มบรรณารักษ์
            </button>
        </form>
    );
};