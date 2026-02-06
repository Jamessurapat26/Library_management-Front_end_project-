import { mockMembers, type Member } from './members';
import { mockUserAccounts, type UserAccount } from './users';

/**
 * Utility functions to manage the relationship between users and members
 * Admin and Librarian roles exist in both users (for authentication) and members (for library operations)
 */

// Mapping between member IDs and user account IDs
export const MEMBER_USER_MAPPING: Record<string, string> = {
    '1': '1', // Admin member -> Admin user
    '2': '2', // Librarian1 member -> Librarian1 user  
    '3': '3', // Librarian2 member -> Librarian2 user
};

/**
 * Get user account from member ID
 */
export const getUserFromMember = (memberId: string): UserAccount | null => {
    const userId = MEMBER_USER_MAPPING[memberId];
    return userId ? mockUserAccounts.find(user => user.id === userId) || null : null;
};

/**
 * Get member from user account ID
 */
export const getMemberFromUser = (userId: string): Member | null => {
    const memberEntry = Object.entries(MEMBER_USER_MAPPING).find(([, uId]) => uId === userId);
    if (memberEntry) {
        const memberId = memberEntry[0];
        return mockMembers.find(member => member.id === memberId) || null;
    }
    return null;
};

/**
 * Get member from username
 */
export const getMemberFromUsername = (username: string): Member | null => {
    const userAccount = mockUserAccounts.find(user => user.username === username);
    if (!userAccount) return null;

    return getMemberFromUser(userAccount.id);
};

/**
 * Get user account from username (existing in member)
 */
export const getUserFromUsername = (username: string): UserAccount | null => {
    return mockUserAccounts.find(user => user.username === username) || null;
};

/**
 * Validate if user has permission for a specific action
 */
export const hasPermission = (username: string, requiredRole: 'admin' | 'librarian'): boolean => {
    const user = getUserFromUsername(username);
    if (!user) return false;

    if (requiredRole === 'librarian') {
        return user.role === 'admin' || user.role === 'librarian';
    }

    return user.role === requiredRole;
};

/**
 * Get current librarian info for transactions
 */
export const getCurrentLibrarian = (username: string): { id: string; name: string } | null => {
    const member = getMemberFromUsername(username);
    if (!member || (member.role !== 'admin' && member.role !== 'librarian')) {
        return null;
    }

    return {
        id: member.memberNumber,
        name: member.name
    };
};

/**
 * Create a new member and corresponding user account for admin/librarian roles
 */
export const createMemberWithUser = (memberData: {
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'librarian' | 'member';
    username?: string;
    password?: string;
}): { success: boolean; member?: Member; user?: UserAccount; error?: string } => {
    try {
        // Generate unique IDs
        const newMemberId = String(Math.max(...mockMembers.map(m => parseInt(m.id))) + 1);
        const newUserId = String(Math.max(...mockUserAccounts.map(u => parseInt(u.id))) + 1);

        // Generate member number
        let memberNumber: string;
        let memberNumberPrefix: string;

        switch (memberData.role) {
            case 'admin':
                memberNumberPrefix = 'ADM';
                const adminCount = mockMembers.filter(m => m.role === 'admin').length + 1;
                memberNumber = `${memberNumberPrefix}${String(adminCount).padStart(3, '0')}`;
                break;
            case 'librarian':
                memberNumberPrefix = 'LIB';
                const librarianCount = mockMembers.filter(m => m.role === 'librarian').length + 1;
                memberNumber = `${memberNumberPrefix}${String(librarianCount).padStart(3, '0')}`;
                break;
            default:
                memberNumberPrefix = 'MEM';
                const memberCount = mockMembers.filter(m => m.role === 'member').length + 1;
                memberNumber = `${memberNumberPrefix}${String(memberCount).padStart(3, '0')}`;
                break;
        }

        // Create new member
        const newMember: Member = {
            id: newMemberId,
            memberNumber,
            name: memberData.name,
            email: memberData.email,
            phone: memberData.phone,
            role: memberData.role,
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0],
            borrowedBooks: 0,
            overdueBooks: 0,
            username: memberData.username,
            password: memberData.password
        };

        // Add member to mock data
        mockMembers.push(newMember);

        // Create user account for admin/librarian roles
        let newUser: UserAccount | undefined;
        if ((memberData.role === 'admin' || memberData.role === 'librarian') && memberData.username && memberData.password) {
            newUser = {
                id: newUserId,
                username: memberData.username,
                password: memberData.password,
                role: memberData.role,
                displayName: memberData.name
            };

            // Add user to mock data
            mockUserAccounts.push(newUser);

            // Update mapping
            MEMBER_USER_MAPPING[newMemberId] = newUserId;
        }

        return {
            success: true,
            member: newMember,
            user: newUser
        };

    } catch (error) {
        console.error('Error creating member and user:', error);
        return {
            success: false,
            error: 'เกิดข้อผิดพลาดในการสร้างสมาชิกและบัญชีผู้ใช้'
        };
    }
};

/**
 * Update existing member and sync with user account
 */
export const updateMemberWithUser = (memberId: string, updateData: {
    name?: string;
    email?: string;
    phone?: string;
}): { success: boolean; member?: Member; user?: UserAccount; error?: string } => {
    try {
        // Find and update member
        const memberIndex = mockMembers.findIndex(m => m.id === memberId);
        if (memberIndex === -1) {
            return { success: false, error: 'ไม่พบสมาชิกที่ต้องการอัพเดท' };
        }

        const updatedMember = { ...mockMembers[memberIndex], ...updateData };
        mockMembers[memberIndex] = updatedMember;

        // Update corresponding user account if exists
        let updatedUser: UserAccount | undefined;
        const userId = MEMBER_USER_MAPPING[memberId];
        if (userId) {
            const userIndex = mockUserAccounts.findIndex(u => u.id === userId);
            if (userIndex !== -1 && updateData.name) {
                updatedUser = { ...mockUserAccounts[userIndex], displayName: updateData.name };
                mockUserAccounts[userIndex] = updatedUser;
            }
        }

        return {
            success: true,
            member: updatedMember,
            user: updatedUser
        };

    } catch (error) {
        console.error('Error updating member and user:', error);
        return {
            success: false,
            error: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล'
        };
    }
};
