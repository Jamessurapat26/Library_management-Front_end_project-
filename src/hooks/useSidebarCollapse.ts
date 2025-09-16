"use client";

import { useState, useEffect } from 'react';

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
            const savedState = localStorage.getItem('sidebar-collapsed');
            if (savedState !== null) {
                setIsCollapsed(JSON.parse(savedState));
            }
        }
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
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
            const savedState = sessionStorage.getItem('sidebar-collapsed');
            if (savedState !== null) {
                setIsCollapsed(JSON.parse(savedState));
            }
        }
    }, []);

    // Save state to sessionStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
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
