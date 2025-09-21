'use client';

import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

/**
 * Custom hook to access language context
 * 
 * @returns LanguageContextType object containing language state, toggle function, and translation function
 * @throws Error if used outside of LanguageProvider
 */
export function useLanguage() {
    const context = useContext(LanguageContext);

    if (context === undefined) {
        throw new Error(
            'useLanguage must be used within a LanguageProvider. ' +
            'Make sure your component is wrapped with LanguageProvider.'
        );
    }

    return context;
}