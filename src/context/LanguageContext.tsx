'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { LOCALSTORAGE_KEYS } from '@/constants';

// Translation type definitions
type Language = 'th' | 'en';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
    isLoading: boolean;
    error: string | null;
}

// Translation object for Thai and English
const translations = {
    th: {
        // Settings page
        'settings.title': 'การตั้งค่า',
        'settings.theme': 'ธีมสี',
        'settings.language': 'ภาษา',
        'settings.preferences': 'การตั้งค่าส่วนตัว',
        'settings.theme.description': 'เลือกธีมสีที่เหมาะสมกับการใช้งานของคุณ',
        'settings.language.description': 'เปลี่ยนภาษาของระบบตามความต้องการ',

        // Theme
        'theme.light': 'สว่าง',
        'theme.dark': 'มืด',
        'theme.toggle': 'เปลี่ยนธีม',

        // Language
        'language.thai': 'ไทย',
        'language.english': 'อังกฤษ',
        'language.toggle': 'เปลี่ยนภาษา',

        // Navigation
        'nav.dashboard': 'แดชบอร์ด',
        'nav.books.manage': 'จัดการหนังสือ',
        'nav.books.list': 'รายการหนังสือ',
        'nav.books.add': 'เพิ่มหนังสือใหม่',
        'nav.books.search': 'ค้นหาหนังสือ',
        'nav.books.borrowed': 'หนังสือที่ยืม',
        'nav.members.manage': 'จัดการสมาชิก',
        'nav.transactions': 'การยืม-คืน',
        'nav.reports': 'รายงาน',
        'nav.settings': 'การตั้งค่า',
        'nav.history': 'ประวัติการยืม',
        'nav.profile': 'ข้อมูลส่วนตัว',

        // Page headers
        'page.books.title': 'จัดการหนังสือ',
        'page.books.subtitle': 'ค้นหาและจัดการหนังสือในห้องสมุด',
        'page.members.title': 'จัดการสมาชิก',
        'page.members.subtitle': 'จำนวนสมาชิกทั้งหมด {count} คน (ใช้งาน {active} คน)',
        'page.transactions.title': 'การยืม-คืนหนังสือ',
        'page.transactions.subtitle': 'จัดการการยืมและคืนหนังสือของสมาชิก',
        'page.reports.title': 'รายงาน',
        'page.reports.subtitle': 'รายงานสถิติและข้อมูลของระบบห้องสมุด',

        // Buttons and actions
        'button.add.member': 'เพิ่มสมาชิกใหม่',
        'button.borrow.book': 'ยืมหนังสือ',

        // User roles
        'role.admin': 'ผู้ดูแลระบบ',
        'role.librarian': 'บรรณารักษ์',
        'role.member': 'สมาชิก',

        // Reports
        'reports.overview': 'ภาพรวม',
        'reports.books': 'รายงานหนังสือ',
        'reports.members': 'รายงานสมาชิก',
        'reports.transactions': 'รายงานการยืม-คืน',

        // Common UI
        'common.save': 'บันทึก',
        'common.cancel': 'ยกเลิก',
        'common.edit': 'แก้ไข',
        'common.delete': 'ลบ',
        'common.add': 'เพิ่ม',
        'common.search': 'ค้นหา',
        'common.filter': 'กรอง',
        'common.loading': 'กำลังโหลด...',
        'common.success': 'สำเร็จ',
        'common.error': 'เกิดข้อผิดพลาด',

        // Success messages
        'success.settings.saved': 'บันทึกการตั้งค่าเรียบร้อยแล้ว',
        'success.theme.changed': 'เปลี่ยนธีมเรียบร้อยแล้ว',
        'success.language.changed': 'เปลี่ยนภาษาเรียบร้อยแล้ว',

        // Error messages
        'error.settings.load': 'ไม่สามารถโหลดการตั้งค่าได้',
        'error.settings.save': 'ไม่สามารถบันทึกการตั้งค่าได้',
        'error.theme.change': 'ไม่สามารถเปลี่ยนธีมได้',
        'error.language.change': 'ไม่สามารถเปลี่ยนภาษาได้',
        'error.localStorage.unavailable': 'ระบบจัดเก็บข้อมูลไม่พร้อมใช้งาน',
    },
    en: {
        // Settings page
        'settings.title': 'Settings',
        'settings.theme': 'Theme',
        'settings.language': 'Language',
        'settings.preferences': 'Preferences',
        'settings.theme.description': 'Choose a theme that suits your usage preferences',
        'settings.language.description': 'Change the system language according to your needs',

        // Theme
        'theme.light': 'Light',
        'theme.dark': 'Dark',
        'theme.toggle': 'Toggle Theme',

        // Language
        'language.thai': 'Thai',
        'language.english': 'English',
        'language.toggle': 'Toggle Language',

        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.books.manage': 'Manage Books',
        'nav.books.list': 'Book List',
        'nav.books.add': 'Add New Book',
        'nav.books.search': 'Search Books',
        'nav.books.borrowed': 'Borrowed Books',
        'nav.members.manage': 'Manage Members',
        'nav.transactions': 'Transactions',
        'nav.reports': 'Reports',
        'nav.settings': 'Settings',
        'nav.history': 'Borrowing History',
        'nav.profile': 'Profile',

        // Page headers
        'page.books.title': 'Manage Books',
        'page.books.subtitle': 'Search and manage books in the library',
        'page.members.title': 'Manage Members',
        'page.members.subtitle': 'Total {count} members ({active} active)',
        'page.transactions.title': 'Book Transactions',
        'page.transactions.subtitle': 'Manage book borrowing and returns',
        'page.reports.title': 'Reports',
        'page.reports.subtitle': 'Library system statistics and reports',

        // Buttons and actions
        'button.add.member': 'Add New Member',
        'button.borrow.book': 'Borrow Book',

        // User roles
        'role.admin': 'Administrator',
        'role.librarian': 'Librarian',
        'role.member': 'Member',

        // Reports
        'reports.overview': 'Overview',
        'reports.books': 'Books Report',
        'reports.members': 'Members Report',
        'reports.transactions': 'Transactions Report',

        // Common UI
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.edit': 'Edit',
        'common.delete': 'Delete',
        'common.add': 'Add',
        'common.search': 'Search',
        'common.filter': 'Filter',
        'common.loading': 'Loading...',
        'common.success': 'Success',
        'common.error': 'Error',

        // Success messages
        'success.settings.saved': 'Settings saved successfully',
        'success.theme.changed': 'Theme changed successfully',
        'success.language.changed': 'Language changed successfully',

        // Error messages
        'error.settings.load': 'Failed to load settings',
        'error.settings.save': 'Failed to save settings',
        'error.theme.change': 'Failed to change theme',
        'error.language.change': 'Failed to change language',
        'error.localStorage.unavailable': 'Local storage is not available',
    },
} as const;

// Storage key for language preference
const LANGUAGE_STORAGE_KEY = LOCALSTORAGE_KEYS.LANGUAGE;

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language Provider component
interface LanguageProviderProps {
    children: ReactNode;
}

const DEFAULT_LANGUAGE: Language = 'th';

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load language preference from localStorage on mount
    useEffect(() => {
        const loadLanguage = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Check if localStorage is available
                if (typeof window === 'undefined' || !window.localStorage) {
                    console.warn('localStorage is not available, using default language');
                    setLanguage(DEFAULT_LANGUAGE);
                    return;
                }

                const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;

                if (savedLanguage && (savedLanguage === 'th' || savedLanguage === 'en')) {
                    setLanguage(savedLanguage);
                } else if (savedLanguage) {
                    // Invalid language value found, reset to default
                    console.warn(`Invalid language value "${savedLanguage}" found, resetting to default`);
                    localStorage.setItem(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE);
                    setLanguage(DEFAULT_LANGUAGE);
                } else {
                    // No saved language, use default
                    setLanguage(DEFAULT_LANGUAGE);
                }
            } catch (error) {
                console.error('Failed to load language preference from localStorage:', error);
                setError('Failed to load language preferences');
                // Fallback to default language if localStorage fails
                setLanguage(DEFAULT_LANGUAGE);
            } finally {
                setIsLoading(false);
            }
        };

        loadLanguage();
    }, []);

    // Save language preference to localStorage when it changes
    useEffect(() => {
        if (isLoading) return; // Don't save during initial load

        const saveLanguage = async () => {
            try {
                setError(null);

                // Save to localStorage if available
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
                }
            } catch (error) {
                console.error('Failed to save language preference to localStorage:', error);
                setError('Failed to save language preferences');
            }
        };

        saveLanguage();
    }, [language, isLoading]);

    // Toggle language function
    const toggleLanguage = () => {
        try {
            setError(null);
            setLanguage(prev => prev === 'th' ? 'en' : 'th');
        } catch (error) {
            console.error('Failed to toggle language:', error);
            setError('Failed to change language');
        }
    };

    // Translation function
    const t = (key: string): string => {
        try {
            const translation = translations[language][key as keyof typeof translations[typeof language]];

            // Return translation if found, otherwise return the key as fallback
            if (translation) {
                return translation;
            }

            console.warn(`Translation key "${key}" not found for language "${language}"`);
            return key;
        } catch (error) {
            console.error('Translation error:', error);
            return key; // Return key as fallback
        }
    };

    const value: LanguageContextType = {
        language,
        toggleLanguage,
        t,
        isLoading,
        error,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

// Export context for use in custom hook
export { LanguageContext };