import type { User, UserAccount } from '@/types';

export type { User, UserAccount };


export const mockUserAccounts: UserAccount[] = [
    {
        id: '1',
        username: 'admin',
        password: 'password',
        role: 'admin',
        displayName: 'ผู้ดูแลระบบ สุรพล'
    },
    {
        id: '2',
        username: 'librarian1_lib',
        password: 'lib123456',
        role: 'librarian',
        displayName: 'บรรณารักษ์ สมใส'
    },
    {
        id: '3',
        username: 'librarian2_lib',
        password: 'lib789012',
        role: 'librarian',
        displayName: 'บรรณารักษ์ วิชาญ'
    }
];

// Helper function to get member data from user account
export const getUserMember = (username: string) => {
    // This will be imported and used to find corresponding member
    // Based on username matching
    const userAccount = mockUserAccounts.find(user => user.username === username);
    return userAccount;
};

// Helper function to get user account from member ID
export const getMemberUser = (memberId: string) => {
    // Mapping between member IDs and user account IDs
    const memberUserMapping: Record<string, string> = {
        '1': '1', // Admin member -> Admin user
        '2': '2', // Librarian1 member -> Librarian1 user
        '3': '3', // Librarian2 member -> Librarian2 user
    };

    const userId = memberUserMapping[memberId];
    return userId ? mockUserAccounts.find(user => user.id === userId) : null;
};