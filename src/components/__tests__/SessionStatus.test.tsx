/**
 * Tests for SessionStatus component and session management functionality
 */

import { render, screen } from '@testing-library/react';
import { SessionStatus, useSessionStatus } from '../SessionStatus';
import { useAuth } from '@/hooks/useAuth';
import { describe, it, beforeEach } from 'node:test';

// Mock the auth utilities
jest.mock('@/utils/auth', () => ({
    getStoredSession: jest.fn(),
    getSessionRemainingTime: jest.fn(),
    formatSessionTime: jest.fn(),
    validateCredentials: jest.fn(),
    createSession: jest.fn(),
    validateSession: jest.fn(),
    storeSession: jest.fn(),
    clearStoredSession: jest.fn(),
    isSessionExpired: jest.fn(),
}));

// Mock the useAuth hook
jest.mock('@/hooks/useAuth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('SessionStatus', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not render when user is not authenticated', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            user: null,
            login: jest.fn(),
            logout: jest.fn(),
            isLoading: false,
            error: null,
            clearError: jest.fn(),
            refreshSession: jest.fn(),
            isSessionValid: false,
            sessionExpired: false,
            clearSessionExpired: jest.fn(),
        });

        render(<SessionStatus />);

        expect(screen.queryByText(/เซสชัน/)).not.toBeInTheDocument();
    });

    it('should render warning when session is expiring soon', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            user: { id: '1', username: 'test', role: 'admin', displayName: 'Test User' },
            login: jest.fn(),
            logout: jest.fn(),
            isLoading: false,
            error: null,
            clearError: jest.fn(),
            refreshSession: jest.fn(),
            isSessionValid: true,
            sessionExpired: false,
            clearSessionExpired: jest.fn(),
        });

        // Mock session utilities to return expiring session
        const authUtilsMock = await import('@/utils/auth');
        const { getStoredSession, getSessionRemainingTime, formatSessionTime } = authUtilsMock;
        getStoredSession.mockReturnValue({ user: {}, timestamp: Date.now(), rememberMe: false, expiresAt: Date.now() + 300000 });
        getSessionRemainingTime.mockReturnValue(300000); // 5 minutes
        formatSessionTime.mockReturnValue('เหลือ 5 นาที');

        render(<SessionStatus />);

        expect(screen.getByText(/แจ้งเตือน/)).toBeInTheDocument();
        expect(screen.getByText(/เซสชันของคุณจะหมดอายุใน/)).toBeInTheDocument();
    });

    it('should render compact version in navbar', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            user: { id: '1', username: 'test', role: 'admin', displayName: 'Test User' },
            login: jest.fn(),
            logout: jest.fn(),
            isLoading: false,
            error: null,
            clearError: jest.fn(),
            refreshSession: jest.fn(),
            isSessionValid: true,
            sessionExpired: false,
            clearSessionExpired: jest.fn(),
        });

        // Mock session utilities to return expiring session
        const authUtilsMock = await import('@/utils/auth');
        const { getStoredSession, getSessionRemainingTime, formatSessionTime } = authUtilsMock;
        getStoredSession.mockReturnValue({ user: {}, timestamp: Date.now(), rememberMe: false, expiresAt: Date.now() + 300000 });
        getSessionRemainingTime.mockReturnValue(300000); // 5 minutes
        formatSessionTime.mockReturnValue('เหลือ 5 นาที');

        render(<SessionStatus showInNavbar={true} />);

        expect(screen.getByText(/เซสชัน:/)).toBeInTheDocument();
    });
});

describe('useSessionStatus', () => {
    it('should return correct session information', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            user: { id: '1', username: 'test', role: 'admin', displayName: 'Test User' },
            login: jest.fn(),
            logout: jest.fn(),
            isLoading: false,
            error: null,
            clearError: jest.fn(),
            refreshSession: jest.fn(),
            isSessionValid: true,
            sessionExpired: false,
            clearSessionExpired: jest.fn(),
        });

        const authUtilsMock = await import('@/utils/auth');
        const { getStoredSession, getSessionRemainingTime, formatSessionTime } = authUtilsMock;
        getStoredSession.mockReturnValue({ user: {}, timestamp: Date.now(), rememberMe: false, expiresAt: Date.now() + 300000 });
        getSessionRemainingTime.mockReturnValue(300000); // 5 minutes
        formatSessionTime.mockReturnValue('เหลือ 5 นาที');

        let sessionInfo: ReturnType<typeof useSessionStatus>;

        function TestComponent() {
            sessionInfo = useSessionStatus();
            return null;
        }

        render(<TestComponent />);

        expect(sessionInfo.remainingTime).toBe(300000);
        expect(sessionInfo.isExpiringSoon).toBe(true);
        expect(sessionInfo.formattedTime).toBe('เหลือ 5 นาที');
    });
});