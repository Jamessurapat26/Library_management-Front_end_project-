"use client";

import { useState, useEffect } from 'react';
import { LOCALSTORAGE_KEYS } from '@/constants';

interface UseSidebarCollapseReturn {
    isCollapsed: boolean;
    toggleCollapse: () => void;
    setCollapsed: (collapsed: boolean) => void;
}

export function useSidebarCollapse(defaultCollapsed: boolean = false): UseSidebarCollapseReturn {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);

    // Load saved state from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem(LOCALSTORAGE_KEYS.SIDEBAR);
            if (savedState !== null) {
                setIsCollapsed(JSON.parse(savedState));
            }
        }
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCALSTORAGE_KEYS.SIDEBAR, JSON.stringify(isCollapsed));
            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('sidebar-toggle'));
        }
    }, [isCollapsed]);

    const toggleCollapse = () => {
        setIsCollapsed(prev => !prev);
    };

    const setCollapsed = (collapsed: boolean) => {
        setIsCollapsed(collapsed);
    };

    return {
        isCollapsed,
        toggleCollapse,
        setCollapsed,
    };
}

// Alternative hook for session storage (doesn't persist across browser sessions)
export function useSidebarCollapseSession(defaultCollapsed: boolean = false): UseSidebarCollapseReturn {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);

    // Load saved state from sessionStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedState = sessionStorage.getItem(LOCALSTORAGE_KEYS.SIDEBAR);
            if (savedState !== null) {
                setIsCollapsed(JSON.parse(savedState));
            }
        }
    }, []);

    // Save state to sessionStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(LOCALSTORAGE_KEYS.SIDEBAR, JSON.stringify(isCollapsed));
        }
    }, [isCollapsed]);

    const toggleCollapse = () => {
        setIsCollapsed(prev => !prev);
    };

    const setCollapsed = (collapsed: boolean) => {
        setIsCollapsed(collapsed);
    };

    return {
        isCollapsed,
        toggleCollapse,
        setCollapsed,
    };
}
