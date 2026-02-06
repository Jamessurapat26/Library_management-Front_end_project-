'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { LOCALSTORAGE_KEYS } from '@/constants';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isLoading: boolean;
    error: string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = LOCALSTORAGE_KEYS.THEME;
const DEFAULT_THEME: Theme = 'light';

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load theme from localStorage on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Check if localStorage is available
                if (typeof window === 'undefined' || !window.localStorage) {
                    console.warn('localStorage is not available, using default theme');
                    setTheme(DEFAULT_THEME);
                    // Apply default theme to DOM immediately
                    if (DEFAULT_THEME === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                    return;
                }

                const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme;

                if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                    setTheme(savedTheme);
                    // Apply saved theme to DOM immediately
                    if (savedTheme === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                } else if (savedTheme) {
                    // Invalid theme value found, reset to default
                    console.warn(`Invalid theme value "${savedTheme}" found, resetting to default`);
                    localStorage.setItem(STORAGE_KEY, DEFAULT_THEME);
                    setTheme(DEFAULT_THEME);
                    // Apply default theme to DOM
                    if (DEFAULT_THEME === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                } else {
                    // No saved theme, use default
                    setTheme(DEFAULT_THEME);
                    // Apply default theme to DOM
                    if (DEFAULT_THEME === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }
            } catch (error) {
                console.error('Failed to load theme from localStorage:', error);
                setError('Failed to load theme preferences');
                // Fallback to default theme if localStorage fails
                setTheme(DEFAULT_THEME);
                // Apply default theme to DOM
                if (DEFAULT_THEME === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadTheme();
    }, []);

    // Update CSS class and save to localStorage when theme changes
    useEffect(() => {
        if (isLoading) return; // Don't save during initial load

        const saveTheme = async () => {
            try {
                setError(null);

                // Update dark class on document element for Tailwind CSS
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }

                // Also set data-theme attribute for custom CSS variables
                document.documentElement.setAttribute('data-theme', theme);

                // Save to localStorage if available
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem(STORAGE_KEY, theme);
                }
            } catch (error) {
                console.error('Failed to save theme to localStorage:', error);
                setError('Failed to save theme preferences');

                // Still update the UI even if saving fails
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                document.documentElement.setAttribute('data-theme', theme);
            }
        };

        saveTheme();
    }, [theme, isLoading]);

    const toggleTheme = () => {
        try {
            setError(null);
            setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
        } catch (error) {
            console.error('Failed to toggle theme:', error);
            setError('Failed to change theme');
        }
    };

    const value: ThemeContextType = {
        theme,
        toggleTheme,
        isLoading,
        error,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// Export context for use in custom hook
export { ThemeContext };