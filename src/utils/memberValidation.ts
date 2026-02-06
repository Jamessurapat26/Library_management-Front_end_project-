import type { Member, MemberFormErrors, MemberFormData, ValidationResult } from '@/types';

export type { MemberFormErrors as ValidationErrors, ValidationResult, MemberFormData };


/**
 * Validates member name field
 * 
 * Checks for required field, length constraints, and allowed characters.
 * Supports Thai and English characters with common punctuation.
 * 
 * @param name - The name to validate
 * @returns Error message if validation fails, undefined if valid
 */
export const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
        return 'กรุณากรอกชื่อ-สกุล';
    }

    if (name.trim().length < 2) {
        return 'ชื่อ-สกุลต้องมีอย่างน้อย 2 ตัวอักษร';
    }

    if (name.trim().length > 100) {
        return 'ชื่อ-สกุลต้องไม่เกิน 100 ตัวอักษร';
    }

    // Allow Thai and English characters, spaces, and common punctuation
    const namePattern = /^[ก-๙a-zA-Z\s\-\.]+$/;
    if (!namePattern.test(name.trim())) {
        return 'ชื่อ-สกุลสามารถใช้ได้เฉพาะตัวอักษรไทยและอังกฤษเท่านั้น';
    }

    return undefined;
};

/**
 * Validates email address field
 * 
 * Checks for required field, length constraints, and proper email format.
 * 
 * @param email - The email address to validate
 * @returns Error message if validation fails, undefined if valid
 */
export const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
        return 'กรุณากรอกอีเมล';
    }

    if (email.length > 255) {
        return 'อีเมลต้องไม่เกิน 255 ตัวอักษร';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return 'รูปแบบอีเมลไม่ถูกต้อง (ตัวอย่าง: user@example.com)';
    }

    return undefined;
};

/**
 * Validates Thai phone number field
 * 
 * Supports both mobile (08x, 09x, 06x) and landline (02-07) formats.
 * Validates length and format according to Thai phone number standards.
 * 
 * @param phone - The phone number to validate
 * @returns Error message if validation fails, undefined if valid
 */
export const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) {
        return 'กรุณากรอกเบอร์โทรศัพท์';
    }

    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length < 9 || cleanPhone.length > 10) {
        return 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ตัวอย่าง: 08x-xxx-xxxx)';
    }

    // Thai phone number patterns:
    // Mobile: 08x-xxx-xxxx, 09x-xxx-xxxx, 06x-xxx-xxxx (10 digits starting with 08, 09, 06)
    // Landline: 0x-xxx-xxxx (9 digits starting with 02-07)
    const mobilePattern = /^0[689]\d{8}$/;
    const landlinePattern = /^0[2-7]\d{7}$/;

    if (!mobilePattern.test(cleanPhone) && !landlinePattern.test(cleanPhone)) {
        return 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ตัวอย่าง: 08x-xxx-xxxx)';
    }

    return undefined;
};

/**
 * Validates username field (for librarian accounts)
 * 
 * Checks for required field, length constraints, and allowed characters.
 * Only allows alphanumeric characters, underscore, and hyphen.
 * 
 * @param username - The username to validate
 * @returns Error message if validation fails, undefined if valid
 */
export const validateUsername = (username: string): string | undefined => {
    if (!username.trim()) {
        return 'กรุณากรอก Username';
    }

    if (username.length < 3) {
        return 'Username ต้องมีอย่างน้อย 3 ตัวอักษร';
    }

    if (username.length > 50) {
        return 'Username ต้องไม่เกิน 50 ตัวอักษร';
    }

    // Allow alphanumeric characters, underscore, and hyphen
    const usernamePattern = /^[a-zA-Z0-9_-]+$/;
    if (!usernamePattern.test(username)) {
        return 'Username สามารถใช้ได้เฉพาะตัวอักษร ตัวเลข _ และ - เท่านั้น';
    }

    return undefined;
};

/**
 * Validates password field (for librarian accounts)
 * 
 * Checks for required field and length constraints.
 * 
 * @param password - The password to validate
 * @returns Error message if validation fails, undefined if valid
 */
export const validatePassword = (password: string): string | undefined => {
    if (!password.trim()) {
        return 'กรุณากรอก Password';
    }

    if (password.length < 6) {
        return 'Password ต้องมีอย่างน้อย 6 ตัวอักษร';
    }

    if (password.length > 100) {
        return 'Password ต้องไม่เกิน 100 ตัวอักษร';
    }

    return undefined;
};

/**
 * Checks for duplicate email addresses
 * 
 * Validates that the email is not already in use by another member.
 * Case-insensitive comparison.
 * 
 * @param email - The email to check for duplicates
 * @param existingMembers - Array of existing members to check against
 * @param excludeId - Optional member ID to exclude from duplicate check (for editing)
 * @returns Error message if duplicate found, undefined if unique
 */
export const checkDuplicateEmail = (
    email: string,
    existingMembers: Member[],
    excludeId?: string
): string | undefined => {
    if (!email.trim()) return undefined;

    const duplicate = existingMembers.find(
        member => member.email.toLowerCase() === email.toLowerCase() && member.id !== excludeId
    );

    if (duplicate) {
        return 'อีเมลนี้มีการใช้งานแล้ว';
    }

    return undefined;
};

/**
 * Checks for duplicate phone numbers
 * 
 * Validates that the phone number is not already in use by another member.
 * Normalizes phone numbers by removing non-digit characters for comparison.
 * 
 * @param phone - The phone number to check for duplicates
 * @param existingMembers - Array of existing members to check against
 * @param excludeId - Optional member ID to exclude from duplicate check (for editing)
 * @returns Error message if duplicate found, undefined if unique
 */
export const checkDuplicatePhone = (
    phone: string,
    existingMembers: Member[],
    excludeId?: string
): string | undefined => {
    if (!phone.trim()) return undefined;

    // Normalize phone numbers for comparison (remove all non-digits)
    const normalizePhone = (phoneNumber: string) => phoneNumber.replace(/\D/g, '');
    const normalizedPhone = normalizePhone(phone);

    const duplicate = existingMembers.find(
        member => normalizePhone(member.phone) === normalizedPhone && member.id !== excludeId
    );

    if (duplicate) {
        return 'เบอร์โทรศัพท์นี้มีการใช้งานแล้ว';
    }

    return undefined;
};

/**
 * Checks for duplicate usernames (for librarian accounts)
 * 
 * Validates that the username is not already in use by another member.
 * Case-insensitive comparison.
 * 
 * @param username - The username to check for duplicates
 * @param existingMembers - Array of existing members to check against
 * @param excludeId - Optional member ID to exclude from duplicate check (for editing)
 * @returns Error message if duplicate found, undefined if unique
 */
export const checkDuplicateUsername = (
    username: string,
    existingMembers: Member[],
    excludeId?: string
): string | undefined => {
    if (!username.trim()) return undefined;

    const duplicate = existingMembers.find(
        member => member.username?.toLowerCase() === username.toLowerCase() && member.id !== excludeId
    );

    if (duplicate) {
        return 'Username นี้มีการใช้งานแล้ว';
    }

    return undefined;
};

/**
 * Comprehensive form validation for member data
 * 
 * Validates all form fields including basic validation and duplicate checking.
 * Supports both regular member forms and librarian-specific forms with
 * additional username/password validation.
 * 
 * @param formData - The form data to validate
 * @param existingMembers - Array of existing members for duplicate validation
 * @param excludeId - Optional member ID to exclude from duplicate checks (for editing)
 * @param isLibrarian - Whether to enable librarian-specific validation
 * @returns Validation result with success status and any errors
 */
export const validateMemberForm = (
    formData: MemberFormData,
    existingMembers: Member[],
    excludeId?: string,
    isLibrarian: boolean = false
): ValidationResult => {
    const errors: MemberFormErrors = {};

    // Validate basic fields
    const nameError = validateName(formData.name);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;

    // Check for duplicates
    if (!emailError) {
        const duplicateEmailError = checkDuplicateEmail(formData.email, existingMembers, excludeId);
        if (duplicateEmailError) errors.email = duplicateEmailError;
    }

    if (!phoneError) {
        const duplicatePhoneError = checkDuplicatePhone(formData.phone, existingMembers, excludeId);
        if (duplicatePhoneError) errors.phone = duplicatePhoneError;
    }

    // Validate librarian-specific fields
    if (isLibrarian) {
        if (formData.username !== undefined) {
            const usernameError = validateUsername(formData.username);
            if (usernameError) {
                errors.username = usernameError;
            } else {
                const duplicateUsernameError = checkDuplicateUsername(formData.username, existingMembers, excludeId);
                if (duplicateUsernameError) errors.username = duplicateUsernameError;
            }
        }

        if (formData.password !== undefined) {
            const passwordError = validatePassword(formData.password);
            if (passwordError) errors.password = passwordError;
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validates a single form field (for real-time validation)
 * 
 * Performs validation on individual fields including basic validation
 * and duplicate checking. Used for real-time validation as user types.
 * 
 * @param fieldName - The name of the field to validate
 * @param value - The field value to validate
 * @param existingMembers - Array of existing members for duplicate validation
 * @param excludeId - Optional member ID to exclude from duplicate checks (for editing)
 * @param isLibrarian - Whether to enable librarian-specific validation
 * @returns Error message if validation fails, undefined if valid
 */
export const validateField = (
    fieldName: keyof MemberFormData,
    value: string,
    existingMembers: Member[],
    excludeId?: string,
    isLibrarian: boolean = false
): string | undefined => {
    switch (fieldName) {
        case 'name':
            return validateName(value);

        case 'email': {
            const emailError = validateEmail(value);
            if (emailError) return emailError;
            return checkDuplicateEmail(value, existingMembers, excludeId);
        }

        case 'phone': {
            const phoneError = validatePhone(value);
            if (phoneError) return phoneError;
            return checkDuplicatePhone(value, existingMembers, excludeId);
        }

        case 'username':
            if (isLibrarian && value !== undefined) {
                const usernameError = validateUsername(value);
                if (usernameError) return usernameError;
                return checkDuplicateUsername(value, existingMembers, excludeId);
            }
            return undefined;

        case 'password':
            if (isLibrarian && value !== undefined) {
                return validatePassword(value);
            }
            return undefined;

        default:
            return undefined;
    }
};