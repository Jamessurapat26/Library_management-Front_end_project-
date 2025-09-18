import { mockUserAccounts, User } from '@/mock/users';

export interface UserSession {
    user: User;
    timestamp: number;
    rememberMe: boolean;
    expiresAt: number;
}

/**
 * Validates user credentials against mock user accounts
 * @param username - The username to validate
 * @param password - The password to validate
 * @returns User object if credentials are valid, null otherwise
 */
export function validateCredentials(username: string, password: string): User | null {
    const userAccount = mockUserAccounts.find(
        account => account.username === username && account.password === password
    );

    if (!userAccount) {
        return null;
    }

    // Return user without password
    return {
        id: userAccount.id,
        username: userAccount.username,
        role: userAccount.role,
        displayName: userAccount.displayName
    };
}

/**
 * Creates a user session with expiration time
 * @param user - The authenticated user
 * @param rememberMe - Whether to extend session duration
 * @returns UserSession object
 */
export function createSession(user: User, rememberMe: boolean = false): UserSession {
    const now = Date.now();
    const sessionDuration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day

    return {
        user,
        timestamp: now,
        rememberMe,
        expiresAt: now + sessionDuration
    };
}

/**
 * Validates if a session is still valid
 * @param session - The session to validate
 * @returns true if session is valid, false otherwise
 */
export function validateSession(session: UserSession | null): boolean {
    if (!session) {
        return false;
    }

    const now = Date.now();
    return now < session.expiresAt;
}

/**
 * Stores session in localStorage
 * @param session - The session to store
 */
export function storeSession(session: UserSession): void {
    try {
        localStorage.setItem('userSession', JSON.stringify(session));
    } catch (error) {
        console.error('Failed to store session:', error);
    }
}

/**
 * Retrieves session from localStorage
 * @returns UserSession if found and valid, null otherwise
 */
export function getStoredSession(): UserSession | null {
    try {
        const sessionData = localStorage.getItem('userSession');
        if (!sessionData) {
            return null;
        }

        const session: UserSession = JSON.parse(sessionData);

        // Validate session structure
        if (!session.user || !session.timestamp || !session.expiresAt) {
            clearStoredSession();
            return null;
        }

        return session;
    } catch (error) {
        console.error('Failed to retrieve session:', error);
        clearStoredSession();
        return null;
    }
}

/**
 * Clears session from localStorage
 */
export function clearStoredSession(): void {
    try {
        localStorage.removeItem('userSession');
    } catch (error) {
        console.error('Failed to clear session:', error);
    }
}

/**
 * Checks if session is expired and needs renewal
 * @param session - The session to check
 * @returns true if session is expired, false otherwise
 */
export function isSessionExpired(session: UserSession | null): boolean {
    if (!session) {
        return true;
    }

    const now = Date.now();
    return now >= session.expiresAt;
}

/**
 * Gets remaining session time in milliseconds
 * @param session - The session to check
 * @returns remaining time in milliseconds, 0 if expired
 */
export function getSessionRemainingTime(session: UserSession | null): number {
    if (!session) {
        return 0;
    }

    const now = Date.now();
    const remaining = session.expiresAt - now;
    return Math.max(0, remaining);
}

/**
 * Formats remaining session time for display
 * @param remainingMs - Remaining time in milliseconds
 * @returns formatted time string in Thai
 */
export function formatSessionTime(remainingMs: number): string {
    if (remainingMs <= 0) {
        return 'หมดอายุแล้ว';
    }

    const minutes = Math.floor(remainingMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `เหลือ ${days} วัน`;
    } else if (hours > 0) {
        return `เหลือ ${hours} ชั่วโมง`;
    } else if (minutes > 0) {
        return `เหลือ ${minutes} นาที`;
    } else {
        return 'เหลือน้อยกว่า 1 นาที';
    }
}