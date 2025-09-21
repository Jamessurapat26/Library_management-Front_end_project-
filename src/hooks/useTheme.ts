'use client';

import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Custom hook to access theme context
 * 
 * @returns ThemeContextType object containing theme state and toggle function
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme() {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error(
            'useTheme must be used within a ThemeProvider. ' +
            'Make sure your component is wrapped with ThemeProvider.'
        );
    }

    return context;
}