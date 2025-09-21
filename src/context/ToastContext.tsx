'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Toast, ToastProps } from '../components/Toast';

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
    showSuccess: (message: string, duration?: number) => void;
    showError: (message: string, duration?: number) => void;
    showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}

interface ToastItem {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    duration?: number;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info', duration?: number) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newToast: ToastItem = {
            id,
            type,
            message,
            duration,
        };

        setToasts(prev => [...prev, newToast]);
    }, []);

    const showSuccess = useCallback((message: string, duration?: number) => {
        showToast(message, 'success', duration);
    }, [showToast]);

    const showError = useCallback((message: string, duration?: number) => {
        showToast(message, 'error', duration);
    }, [showToast]);

    const showInfo = useCallback((message: string, duration?: number) => {
        showToast(message, 'info', duration);
    }, [showToast]);

    const value: ToastContextType = {
        showToast,
        showSuccess,
        showError,
        showInfo,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        type={toast.type}
                        message={toast.message}
                        duration={toast.duration}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Export context for testing purposes
export { ToastContext };