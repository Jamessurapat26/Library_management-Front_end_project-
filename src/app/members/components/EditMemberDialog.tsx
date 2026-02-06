import { useState, useEffect } from 'react';
import type { Member, EditMemberForm } from '@/types';
import { getRoleDisplayName, MEMBER_STATUS_LABELS } from '@/constants';
import { useMemberEditValidation } from '@/hooks/useMemberFormValidation';

export type { EditMemberForm };

/**
 * Props interface for the EditMemberDialog component
 * Defines all required props for the member editing dialog
 */
export interface EditMemberDialogProps {
    /** Whether the dialog is currently open */
    isOpen: boolean;
    /** Callback function to close the dialog */
    onClose: () => void;
    /** 
     * Callback function to update member data
     * Returns a promise with success status and optional message
     */
    onUpdateMember: (updatedMember: EditMemberForm) => Promise<{ success: boolean; message?: string }>;
    /** The member to edit, null if no member is selected */
    member: Member | null;
    /** Array of existing members for duplicate validation */
    existingMembers: Member[];
}

/**
 * EditMemberDialog Component
 * 
 * A modal dialog for editing member profile information. Allows admin and librarian
 * users to update member's name, email, and phone number while keeping other fields
 * read-only for security and data integrity.
 * 
 * Features:
 * - Real-time form validation
 * - Duplicate email/phone detection
 * - Unsaved changes warning
 * - Success/error message handling
 * - Read-only fields for sensitive data (memberNumber, role, status, etc.)
 * 
 * @param props - The component props
 * @returns JSX element representing the edit member dialog
 */
export default function EditMemberDialog({
    isOpen,
    onClose,
    onUpdateMember,
    member,
    existingMembers
}: EditMemberDialogProps) {
    // Initialize form state
    const [formData, setFormData] = useState<EditMemberForm>({
        id: '',
        memberNumber: '',
        name: '',
        email: '',
        phone: '',
        role: 'member',
        status: 'active',
        joinDate: '',
        borrowedBooks: 0,
        overdueBooks: 0
    });

    // State for messages and loading
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string>('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Initialize validation hook
    const {
        errors,
        isValid,
        validateSingleField,
        clearErrors,
        hasChanges,
        validateFormWithChanges
    } = useMemberEditValidation({
        existingMembers,
        originalMember: member || undefined,
        isLibrarian: false, // Edit mode doesn't need librarian validation
        enableRealTimeValidation: true
    });

    // Update form data when member prop changes
    useEffect(() => {
        if (member && isOpen) {
            setFormData({
                id: member.id,
                memberNumber: member.memberNumber,
                name: member.name,
                email: member.email,
                phone: member.phone,
                role: member.role,
                status: member.status,
                joinDate: member.joinDate,
                borrowedBooks: member.borrowedBooks,
                overdueBooks: member.overdueBooks
            });
            clearErrors();
            setSubmitError('');
            setHasUnsavedChanges(false);
        }
    }, [member, isOpen, clearErrors]);

    // Track unsaved changes
    useEffect(() => {
        if (member) {
            const currentHasChanges = hasChanges({
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            });
            setHasUnsavedChanges(currentHasChanges);
        }
    }, [formData.name, formData.email, formData.phone, member, hasChanges]);

    // Handle form field changes
    const handleFieldChange = (fieldName: keyof EditMemberForm, value: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));

        // Clear submit error when user starts typing
        if (submitError) {
            setSubmitError('');
        }

        // Validate field in real-time for editable fields only
        if (fieldName === 'name' || fieldName === 'email' || fieldName === 'phone') {
            validateSingleField(fieldName, value);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const validationResult = validateFormWithChanges({
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            });

            if (!validationResult.isValid) {
                setSubmitError('กรุณาแก้ไขข้อผิดพลาดก่อนบันทึก');
                setIsSubmitting(false);
                return;
            }

            if (!validationResult.hasChanges) {
                setSubmitError('ไม่มีการเปลี่ยนแปลงข้อมูล');
                setIsSubmitting(false);
                return;
            }

            // Call the update function and wait for result
            const result = await onUpdateMember(formData);

            if (result.success) {
                // Success - dialog will be closed by parent component
                setHasUnsavedChanges(false);
            } else {
                // Error - keep dialog open and show error
                setSubmitError(result.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle dialog close with unsaved changes confirmation
    const handleClose = () => {
        if (hasUnsavedChanges && !isSubmitting) {
            const confirmClose = window.confirm(
                'คุณมีการเปลี่ยนแปลงข้อมูลที่ยังไม่ได้บันทึก คุณต้องการปิดหน้าต่างโดยไม่บันทึกหรือไม่?'
            );
            if (!confirmClose) {
                return;
            }
        }

        clearErrors();
        setSubmitError('');
        setHasUnsavedChanges(false);
        onClose();
    };

    // Format date for display
    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    // Get role display text
    const getRoleDisplayText = getRoleDisplayName;

    // Get status display text
    const getStatusDisplayText = (status: string): string => {
        return MEMBER_STATUS_LABELS[status as keyof typeof MEMBER_STATUS_LABELS] ?? status;
    };

    // Check if form has changes and is valid
    const canSave = () => {
        if (!member) return false;

        const hasFormChanges = hasChanges({
            name: formData.name,
            email: formData.email,
            phone: formData.phone
        });

        return isValid && hasFormChanges;
    };

    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">แก้ไขข้อมูลสมาชิก</h3>

                {/* Submit Error Message */}
                {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center mb-4">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {submitError}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Member Number - Read Only */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            รหัสสมาชิก
                        </label>
                        <input
                            type="text"
                            value={formData.memberNumber}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                            placeholder="รหัสสมาชิก"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            รหัสสมาชิกไม่สามารถแก้ไขได้
                        </p>
                    </div>

                    {/* Name - Editable */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ชื่อ-สกุล
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="กรอกชื่อ-สกุล"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email - Editable */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            อีเมล
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="กรอกอีเมล (ตัวอย่าง: user@example.com)"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600 mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Phone - Editable */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            เบอร์โทรศัพท์
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="กรอกเบอร์โทรศัพท์ (ตัวอย่าง: 08x-xxx-xxxx)"
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-600 mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.phone}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            รองรับเบอร์มือถือ (08x, 09x, 06x) และเบอร์บ้าน (02-07)
                        </p>
                    </div>

                    {/* Role - Read Only */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            บทบาท
                        </label>
                        <input
                            type="text"
                            value={getRoleDisplayText(formData.role)}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            บทบาทไม่สามารถแก้ไขได้ในหน้านี้
                        </p>
                    </div>

                    {/* Status - Read Only */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            สถานะ
                        </label>
                        <input
                            type="text"
                            value={getStatusDisplayText(formData.status)}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            สถานะสามารถเปลี่ยนได้ผ่านปุ่มในตารางสมาชิก
                        </p>
                    </div>

                    {/* Join Date - Read Only */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            วันที่เข้าร่วม
                        </label>
                        <input
                            type="text"
                            value={formatDate(formData.joinDate)}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>

                    {/* Borrowed Books - Read Only */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                หนังสือที่ยืม
                            </label>
                            <input
                                type="text"
                                value={`${formData.borrowedBooks} เล่ม`}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                หนังสือเกินกำหนด
                            </label>
                            <input
                                type="text"
                                value={`${formData.overdueBooks} เล่ม`}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSave() || isSubmitting}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                กำลังบันทึก...
                            </>
                        ) : (
                            'บันทึกการเปลี่ยนแปลง'
                        )}
                    </button>
                </div>

                {/* Help text for disabled save button */}
                {!canSave() && !isSubmitting && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        {!isValid
                            ? 'กรุณาแก้ไขข้อผิดพลาดก่อนบันทึก'
                            : 'ไม่มีการเปลี่ยนแปลงข้อมูล'
                        }
                    </p>
                )}

                {/* Unsaved changes indicator */}
                {hasUnsavedChanges && !isSubmitting && (
                    <p className="text-xs text-amber-600 mt-2 text-center flex items-center justify-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก
                    </p>
                )}
            </div>
        </div>
    );
}