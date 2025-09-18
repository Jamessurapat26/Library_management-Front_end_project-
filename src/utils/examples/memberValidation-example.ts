/**
 * Example usage of member validation utilities
 * This file demonstrates how to use the shared validation functions
 * and hooks for member form validation.
 */

import { mockMembers } from '@/mock/members';
import {
    validateName,
    validateEmail,
    validatePhone,
    validateMemberForm,
    checkDuplicateEmail,
    MemberFormData
} from '@/utils/memberValidation';

// Example 1: Basic field validation
export const basicValidationExample = () => {
    const name = 'สมชาย ใจดี';
    const email = 'somchai@email.com';
    const phone = '08-111-2222';

    // Validate individual fields
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);

    console.log('Name validation:', nameError || 'Valid');
    console.log('Email validation:', emailError || 'Valid');
    console.log('Phone validation:', phoneError || 'Valid');
};

// Example 2: Duplicate checking
export const duplicateCheckExample = () => {
    const existingEmail = 'somchai@email.com'; // This exists in mockMembers
    const newEmail = 'newuser@email.com';

    const duplicateEmailError = checkDuplicateEmail(existingEmail, mockMembers);
    const uniqueEmailError = checkDuplicateEmail(newEmail, mockMembers);

    console.log('Existing email check:', duplicateEmailError || 'No duplicate');
    console.log('New email check:', uniqueEmailError || 'No duplicate');

    // Check with exclusion (useful for editing)
    const editEmailError = checkDuplicateEmail(existingEmail, mockMembers, '1'); // Exclude member with ID '1'
    console.log('Edit email check (excluded):', editEmailError || 'No duplicate');
};

// Example 3: Complete form validation
export const formValidationExample = () => {
    // Valid form data
    const validForm: MemberFormData = {
        name: 'นายใหม่ ทดสอบ',
        email: 'newmember@email.com',
        phone: '08-999-8888'
    };

    // Invalid form data
    const invalidForm: MemberFormData = {
        name: '', // Empty name
        email: 'invalid-email', // Invalid format
        phone: '123' // Invalid format
    };

    const validResult = validateMemberForm(validForm, mockMembers);
    const invalidResult = validateMemberForm(invalidForm, mockMembers);

    console.log('Valid form result:', validResult);
    console.log('Invalid form result:', invalidResult);
};

// Example 4: Librarian form validation
export const librarianValidationExample = () => {
    const librarianForm: MemberFormData = {
        name: 'บรรณารักษ์ ใหม่',
        email: 'newlibrarian@library.com',
        phone: '02-999-8888',
        username: 'newlib_user',
        password: 'securepass123'
    };

    const result = validateMemberForm(librarianForm, mockMembers, undefined, true);
    console.log('Librarian form validation:', result);
};

// Example 5: Form validation with exclusion (for editing)
export const editValidationExample = () => {
    // Simulating editing member with ID '1'
    const editForm: MemberFormData = {
        name: 'สมชาย ใจดี (แก้ไข)',
        email: 'somchai@email.com', // Same email as existing member
        phone: '08-111-2222' // Same phone as existing member
    };

    // Without exclusion - should show duplicate errors
    const withoutExclusion = validateMemberForm(editForm, mockMembers);
    console.log('Edit without exclusion:', withoutExclusion);

    // With exclusion - should pass validation
    const withExclusion = validateMemberForm(editForm, mockMembers, '1');
    console.log('Edit with exclusion:', withExclusion);
};

// Example usage in a React component (pseudo-code)
export const reactComponentExample = `
import { useMemberFormValidation } from '@/hooks/useMemberFormValidation';
import { mockMembers } from '@/mock/members';

function AddMemberForm() {
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
    clearErrors
  } = useMemberFormValidation({
    existingMembers: mockMembers,
    enableRealTimeValidation: true
  });

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    validateSingleField(fieldName, value);
  };

  const handleSubmit = () => {
    const result = validateForm(formData);
    if (result.isValid) {
      // Submit form
      console.log('Form is valid, submitting...');
    }
  };

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => handleFieldChange('name', e.target.value)}
      />
      {errors.name && <span>{errors.name}</span>}
      
      <input
        value={formData.email}
        onChange={(e) => handleFieldChange('email', e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}
      
      <button onClick={handleSubmit} disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}
`;

// Example usage for editing with change detection
export const editHookExample = `
import { useMemberEditValidation } from '@/hooks/useMemberFormValidation';

function EditMemberForm({ originalMember, existingMembers }) {
  const [formData, setFormData] = useState({
    name: originalMember.name,
    email: originalMember.email,
    phone: originalMember.phone
  });

  const {
    errors,
    isValid,
    hasChanges,
    validateFormWithChanges
  } = useMemberEditValidation({
    originalMember,
    existingMembers,
    enableRealTimeValidation: true
  });

  const handleSubmit = () => {
    const result = validateFormWithChanges(formData);
    if (result.canSave) {
      // Form is valid and has changes
      console.log('Saving changes...');
    }
  };

  const canSave = isValid && hasChanges(formData);

  return (
    <form>
      {/* Form fields */}
      <button onClick={handleSubmit} disabled={!canSave}>
        Save Changes
      </button>
    </form>
  );
}
`;