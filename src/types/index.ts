// ============================================================
// Shared Type Definitions
// Single source of truth for all types used across the app
// ============================================================

// --- Role types ---

export type UserRole = 'admin' | 'librarian';
export type MemberRole = 'admin' | 'librarian' | 'member';
export type MemberStatus = 'active' | 'inactive';
export type BookCopyStatus = 'available' | 'borrowed';
export type TransactionType = 'borrow' | 'return';
export type TransactionStatus = 'active' | 'returned' | 'overdue';

// --- User & Auth ---

export interface User {
    id: string;
    username: string;
    role: UserRole;
    displayName: string;
}

export interface UserAccount {
    id: string;
    username: string;
    password: string;
    role: UserRole;
    displayName: string;
}

export interface UserSession {
    user: User;
    timestamp: number;
    rememberMe: boolean;
    expiresAt: number;
}

// --- Member ---

export interface Member {
    id: string;
    memberNumber: string;
    name: string;
    email: string;
    phone: string;
    role: MemberRole;
    status: MemberStatus;
    joinDate: string;
    borrowedBooks: number;
    overdueBooks: number;
    username?: string;
    password?: string;
}

/** Form data for creating a new member */
export interface NewMemberForm {
    /** Member's full name */
    name: string;
    /** Member's email address */
    email: string;
    /** Member's phone number */
    phone: string;
    /** Member's role in the system */
    role: 'librarian' | 'member';
    /** Username (required for librarian accounts) */
    username?: string;
    /** Password (required for librarian accounts) */
    password?: string;
}

/** Form data for editing an existing member */
export interface EditMemberForm {
    /** Unique identifier for the member */
    id: string;
    /** Member number - read-only field that cannot be modified */
    memberNumber: string;
    /** Member's full name - editable field */
    name: string;
    /** Member's email address - editable field */
    email: string;
    /** Member's phone number - editable field */
    phone: string;
    /** Member's role in the system - read-only for existing members */
    role: MemberRole;
    /** Member's account status - read-only, managed through separate toggle */
    status: MemberStatus;
    /** Date when member joined - read-only field */
    joinDate: string;
    /** Number of books currently borrowed - read-only field */
    borrowedBooks: number;
    /** Number of overdue books - read-only field */
    overdueBooks: number;
}

/**
 * Validation error messages for member forms.
 * Merges the previously separate `ValidationErrors` and `AddMemberFormErrors`.
 */
export interface MemberFormErrors {
    /** Error message for role field */
    role?: string;
    /** General error message not specific to any field */
    general?: string;
    /** Error message for name field */
    name?: string;
    /** Error message for email field */
    email?: string;
    /** Error message for phone field */
    phone?: string;
    /** Error message for username field */
    username?: string;
    /** Error message for password field */
    password?: string;
}

/** Form data for member form validation */
export interface MemberFormData {
    /** Member's full name */
    name: string;
    /** Member's email address */
    email: string;
    /** Member's phone number */
    phone: string;
    /** Username (optional, for librarian accounts) */
    username?: string;
    /** Password (optional, for librarian accounts) */
    password?: string;
    /** Member role (optional) */
    role?: string;
}

/** Result of form validation */
export interface ValidationResult {
    /** Whether the form data is valid */
    isValid: boolean;
    /** Object containing any validation errors */
    errors: MemberFormErrors;
}

// --- Book ---

export interface BookCopy {
    copyId: string;
    status: BookCopyStatus;
    borrowedBy?: string;
    dueDate?: string;
}

export interface Book {
    id: string;
    title: string;
    isbn: string;
    author: string;
    publisher: string;
    publishYear: number;
    category: string;
    totalCopies: number;
    copies: BookCopy[];
    coverImage?: string;
    description?: string;
}

export interface BookEditForm {
    title: string;
    isbn: string;
    author: string;
    publisher: string;
    publishYear: number;
    category: string;
    description?: string;
    totalCopies: number;
}

export interface BookEditFormErrors {
    title?: string;
    isbn?: string;
    author?: string;
    publisher?: string;
    publishYear?: string;
    category?: string;
    totalCopies?: string;
    general?: string;
}

export interface BookFilters {
    category: string;
    availability: string;
    year: string;
    author: string;
}

// --- Borrowing ---

export interface BorrowForm {
    borrowerIdentifier: string; // username or phone
    borrowerName: string; // actual name from member data
    borrowDays: number;
    dueDate: string;
    notes?: string;
}

// --- Transaction ---

export interface Transaction {
    id: string;
    type: TransactionType;
    bookId: string;
    bookTitle: string;
    bookIsbn: string;
    memberId: string;
    memberName: string;
    memberNumber: string;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: TransactionStatus;
    librarianId: string;
    librarianName: string;
    notes?: string;
}

/** Subset of Transaction used in reports */
export type TransactionReportItem = Pick<Transaction, 'id' | 'bookTitle' | 'memberName' | 'borrowDate' | 'status'>;

// --- Dashboard / Reports ---

export interface PopularBook {
    id: string;
    title: string;
    author: string;
    borrowCount: number;
}

/** Subset of PopularBook used in dashboard widget */
export type PopularBookSummary = Pick<PopularBook, 'title' | 'borrowCount'>;

export interface ActivityItem {
    bookTitle: string;
    user: string;
    type: TransactionType;
}
