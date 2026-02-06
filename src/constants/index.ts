// ============================================================
// Shared Constants
// Single source of truth for all magic values used across the app
// ============================================================

import type { MemberRole, MemberStatus, TransactionStatus } from '@/types';

// --- Book categories (canonical 16-item list) ---

export const BOOK_CATEGORIES = [
    'คอมพิวเตอร์และเทคโนโลยี',
    'วิทยาศาสตร์',
    'คณิตศาสตร์',
    'ศิลปะและการออกแบบ',
    'ประวัติศาสตร์',
    'วรรณกรรม',
    'จิตวิทยา',
    'ปรัชญา',
    'การศึกษา',
    'ธุรกิจและการเงิน',
    'การแพทย์และสุขภาพ',
    'กฎหมาย',
    'สังคมศาสตร์',
    'ภาษาศาสตร์',
    'ศาสนา',
    'อื่นๆ',
] as const;

export const BOOK_LANGUAGES = [
    'ไทย',
    'อังกฤษ',
    'จีน',
    'ญี่ปุ่น',
    'เกาหลี',
    'ฝรั่งเศส',
    'เยอรมัน',
    'อื่นๆ',
] as const;

// --- localStorage keys ---

export const LOCALSTORAGE_KEYS = {
    THEME: 'library-theme',
    LANGUAGE: 'library-language',
    SESSION: 'userSession',
    SIDEBAR: 'sidebar-collapsed',
} as const;

// --- Session & auth durations (milliseconds) ---

export const SESSION_DURATION = {
    /** 30 days — when "Remember Me" is checked */
    REMEMBER_ME: 30 * 24 * 60 * 60 * 1000,
    /** 1 day — normal session */
    DEFAULT: 24 * 60 * 60 * 1000,
    /** 5 minutes — warning threshold before session expires */
    WARNING_THRESHOLD: 5 * 60 * 1000,
    /** 10 minutes — warning threshold used in SessionStatus component */
    SESSION_STATUS_WARNING: 10 * 60 * 1000,
    /** 10 seconds — auto-clear auth error messages */
    AUTH_ERROR_CLEAR: 10 * 1000,
} as const;

// --- Default borrow period ---

/** Default number of days a book can be borrowed */
export const DEFAULT_BORROW_DAYS = 14;

// --- Polling / timer intervals (milliseconds) ---

export const POLLING_INTERVAL = {
    /** 1 second — dashboard stats refresh */
    STATS: 1_000,
    /** 3 seconds — member stats refresh */
    MEMBER_STATS: 3_000,
    /** 5 seconds — member list refresh */
    MEMBERS: 5_000,
    /** 1 minute — overdue check / session check */
    OVERDUE_CHECK: 60_000,
    /** 1 minute — session remaining time update */
    SESSION_CHECK: 60_000,
    /** 5 minutes — periodic session validation */
    SESSION_VALIDATE: 5 * 60 * 1000,
} as const;

// --- Mock API delays (milliseconds) ---

export const MOCK_API_DELAY = {
    /** 500ms — quick operations (update member) */
    SHORT: 500,
    /** 1000ms — normal operations (borrow book) */
    MEDIUM: 1_000,
    /** 1500ms — slow operations (add book) */
    LONG: 1_500,
} as const;

// --- Display name maps ---

/**
 * Maps role keys to hardcoded Thai display names.
 * For i18n-aware display, use `t('role.admin')` etc. from the language context.
 */
export const ROLE_DISPLAY_NAMES: Record<MemberRole, string> = {
    admin: 'ผู้ดูแลระบบ',
    librarian: 'บรรณารักษ์',
    member: 'สมาชิก',
} as const;

/** Utility function that returns the Thai display name for a role */
export function getRoleDisplayName(role: string): string {
    return ROLE_DISPLAY_NAMES[role as MemberRole] ?? role;
}

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
    active: 'กำลังยืม',
    returned: 'คืนแล้ว',
    overdue: 'เกินกำหนด',
} as const;

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
    active: 'ใช้งาน',
    inactive: 'ไม่ใช้งาน',
} as const;

// --- Mock ID prefixes ---

export const MOCK_ID_PREFIX = {
    TRANSACTION: 'TXN',
    ADMIN: 'ADM',
    LIBRARIAN: 'LIB',
    MEMBER: 'MEM',
} as const;

/** Pad a number to 3 digits with leading zeros, e.g. 1 → "001" */
export function padId(n: number): string {
    return String(n).padStart(3, '0');
}

// --- Pagination ---

export const ITEMS_PER_PAGE = {
    /** When sidebar is collapsed */
    COLLAPSED: 12,
    /** When sidebar is expanded */
    EXPANDED: 9,
} as const;

// --- Toast defaults ---

export const TOAST_DEFAULTS = {
    /** Default auto-dismiss duration in ms */
    DURATION: 3_000,
    /** Fade-out animation delay in ms */
    FADE_OUT_DELAY: 300,
} as const;

// --- Debounce ---

/** Default debounce delay for form validation (ms) */
export const DEBOUNCE_DELAY = 300;
