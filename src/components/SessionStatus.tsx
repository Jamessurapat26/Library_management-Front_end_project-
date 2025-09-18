'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getStoredSession, getSessionRemainingTime, formatSessionTime } from '@/utils/auth';

interface SessionStatusProps {
    showInNavbar?: boolean;
    className?: string;
}

/**
 * SessionStatus component that displays session information and warnings
 * 
 * Features:
 * - Shows remaining session time
 * - Displays warning when session is about to expire
 * - Updates in real-time
 * - Can be integrated into navbar or shown as standalone component
 */
export function SessionStatus({ showInNavbar = false, className = '' }: SessionStatusProps) {
    const { isAuthenticated, user } = useAuth();
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [showWarning, setShowWarning] = useState(false);

    // Update remaining time every minute
    useEffect(() => {
        if (!isAuthenticated) {
            setRemainingTime(0);
            setShowWarning(false);
            return;
        }

        const updateRemainingTime = () => {
            const session = getStoredSession();
            if (session) {
                const remaining = getSessionRemainingTime(session);
                setRemainingTime(remaining);

                // Show warning if less than 10 minutes remaining
                const tenMinutes = 10 * 60 * 1000;
                setShowWarning(remaining > 0 && remaining <= tenMinutes);
            }
        };

        // Initial update
        updateRemainingTime();

        // Update every minute
        const interval = setInterval(updateRemainingTime, 60 * 1000);

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // Don't render if not authenticated
    if (!isAuthenticated || !user) {
        return null;
    }

    // Navbar version - compact display
    if (showInNavbar) {
        return (
            <div className={`flex items-center space-x-2 ${className}`}>
                {showWarning && (
                    <div className="flex items-center text-yellow-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="hidden md:inline">
                            เซสชัน: {formatSessionTime(remainingTime)}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    // Standalone warning banner
    if (showWarning) {
        return (
            <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 ${className}`}>
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            <strong>แจ้งเตือน:</strong> เซสชันของคุณจะหมดอายุใน {formatSessionTime(remainingTime)}
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">
                            กรุณาบันทึกงานของคุณ หรือเข้าสู่ระบบใหม่เพื่อต่ออายุเซสชัน
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

/**
 * Hook to get session status information
 */
export function useSessionStatus() {
    const { isAuthenticated } = useAuth();
    const [sessionInfo, setSessionInfo] = useState<{
        remainingTime: number;
        isExpiringSoon: boolean;
        formattedTime: string;
    }>({
        remainingTime: 0,
        isExpiringSoon: false,
        formattedTime: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            setSessionInfo({
                remainingTime: 0,
                isExpiringSoon: false,
                formattedTime: ''
            });
            return;
        }

        const updateSessionInfo = () => {
            const session = getStoredSession();
            if (session) {
                const remaining = getSessionRemainingTime(session);
                const tenMinutes = 10 * 60 * 1000;

                setSessionInfo({
                    remainingTime: remaining,
                    isExpiringSoon: remaining > 0 && remaining <= tenMinutes,
                    formattedTime: formatSessionTime(remaining)
                });
            }
        };

        updateSessionInfo();
        const interval = setInterval(updateSessionInfo, 60 * 1000);

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    return sessionInfo;
}