import { useState, useCallback, useEffect } from 'react';
import { Member } from '@/mock/members';
import {
    ValidationErrors,
    ValidationResult,
    MemberFormData,
    validateMemberForm,
    validateField
} from '@/utils/memberValidation';

/**
 * Options for configuring the member form validation hook
 */
export interface UseMemberFormValidationOptions {
    /** Array of existing members for duplicate validation */
    existingMembers: Member[];
    /** ID to exclude from duplicate checks (for editing existing members) */
    excludeId?: string;
    /** Whether the form is for librarian creation (enables username/password validation) */
    isLibrarian?: boolean;
    /** Whether to enable real-time field validation */
    enableRealTimeValidation?: boolean;
}

/**
 * Return type for the member form validation hook
 */
export interface UseMemberFormValidationReturn {
    /** Current validation errors for form fields */
    errors: ValidationErrors;
    /** Whether the form is currently valid (no errors) */
    isValid: boolean;
    /** Function to validate the entire form */
    validateForm: (formData: MemberFormData) => ValidationResult;
    /** Function to validate a single field in real-time */
    validateSingleField: (fieldName: keyof MemberFormData, value: string) => void;
    /** Function to clear all validation errors */
    clearErrors: () => void;
    /** Function to clear error for a specific field */
    clearFieldError: (fieldName: keyof ValidationErrors) => void;
    /** Function to set error for a specific field */
    setError: (fieldName: keyof ValidationErrors, error: string) => void;
    /** Whether there are any validation errors */
    hasErrors: boolean;
}

/**
 * Custom hook for member form validation
 * 
 * Provides comprehensive validation for member forms including real-time field validation,
 * duplicate checking, and error management. Supports both regular member forms and
 * librarian-specific forms with additional username/password validation.
 * 
 * @param options - Configuration options for the validation hook
 * @returns Object containing validation state and functions
 */
export const useMemberFormValidation = ({
    existingMembers,
    excludeId,
    isLibrarian = false,
    enableRealTimeValidation = true
}: UseMemberFormValidationOptions): UseMemberFormValidationReturn => {
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Validate entire form
    const validateForm = useCallback((formData: MemberFormData): ValidationResult => {
        const result = validateMemberForm(formData, existingMembers, excludeId, isLibrarian);
        setErrors(result.errors);
        return result;
    }, [existingMembers, excludeId, isLibrarian]);

    // Validate single field (for real-time validation)
    const validateSingleField = useCallback((fieldName: keyof MemberFormData, value: string) => {
        if (!enableRealTimeValidation) return;

        const error = validateField(fieldName, value, existingMembers, excludeId, isLibrarian);

        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };

            if (error) {
                newErrors[fieldName] = error;
            } else {
                delete newErrors[fieldName];
            }

            return newErrors;
        });
    }, [existingMembers, excludeId, isLibrarian, enableRealTimeValidation]);

    // Clear all errors
    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    // Clear specific field error
    const clearFieldError = useCallback((fieldName: keyof ValidationErrors) => {
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[fieldName];
            return newErrors;
        });
    }, []);

    // Set specific error
    const setError = useCallback((fieldName: keyof ValidationErrors, error: string) => {
        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldName]: error
        }));
    }, []);

    // Computed properties
    const hasErrors = Object.keys(errors).length > 0;
    const isValid = !hasErrors;

    return {
        errors,
        isValid,
        validateForm,
        validateSingleField,
        clearErrors,
        clearFieldError,
        setError,
        hasErrors
    };
};

/**
 * Hook for debounced validation
 * 
 * Useful for expensive validations that should not run on every keystroke.
 * Delays validation execution until user stops typing for the specified delay.
 * 
 * @param callback - The validation function to call after delay
 * @param delay - Delay in milliseconds before executing validation (default: 300ms)
 * @returns Debounced validation function
 */
export const useDebouncedValidation = (
    callback: (fieldName: keyof MemberFormData, value: string) => void,
    delay: number = 300
) => {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const debouncedValidate = useCallback((fieldName: keyof MemberFormData, value: string) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const newTimeoutId = setTimeout(() => {
            callback(fieldName, value);
        }, delay);

        setTimeoutId(newTimeoutId);
    }, [callback, delay, timeoutId]);

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return debouncedValidate;
};

/**
 * Options for the member edit validation hook
 * Extends the base validation options with edit-specific features
 */
export interface UseMemberEditValidationOptions extends UseMemberFormValidationOptions {
    /** The original member being edited (for change detection) */
    originalMember?: Member;
    /** Callback fired when validation state changes */
    onValidationChange?: (isValid: boolean) => void;
}

/**
 * Hook specifically for member editing with additional features
 * 
 * Extends the base validation hook with edit-specific functionality including
 * change detection, validation state callbacks, and enhanced validation methods
 * that consider the original member data.
 * 
 * @param options - Configuration options including original member data
 * @returns Enhanced validation object with edit-specific methods
 */
export const useMemberEditValidation = ({
    originalMember,
    onValidationChange,
    ...options
}: UseMemberEditValidationOptions) => {
    const validation = useMemberFormValidation({
        ...options,
        excludeId: originalMember?.id
    });

    // Notify parent component when validation state changes
    useEffect(() => {
        if (onValidationChange) {
            onValidationChange(validation.isValid);
        }
    }, [validation.isValid, onValidationChange]);

    // Check if form has changes from original
    const hasChanges = useCallback((formData: MemberFormData): boolean => {
        if (!originalMember) return true;

        return (
            formData.name !== originalMember.name ||
            formData.email !== originalMember.email ||
            formData.phone !== originalMember.phone ||
            (formData.username ? formData.username !== originalMember.username : false) ||
            (formData.password ? formData.password !== originalMember.password : false)
        );
    }, [originalMember]);

    // Validate with change detection
    const validateFormWithChanges = useCallback((formData: MemberFormData) => {
        const result = validation.validateForm(formData);
        const hasFormChanges = hasChanges(formData);

        return {
            ...result,
            hasChanges: hasFormChanges,
            canSave: result.isValid && hasFormChanges
        };
    }, [validation, hasChanges]);

    return {
        ...validation,
        hasChanges,
        validateFormWithChanges,
        originalMember
    };
};