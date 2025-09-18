export interface User {
    id: string;
    username: string;
    role: 'admin' | 'librarian';
    displayName: string;
}

export interface UserAccount {
    id: string;
    username: string;
    password: string;
    role: 'admin' | 'librarian';
    displayName: string;
}

export const mockUserAccounts: UserAccount[] = [
    {
        id: '1',
        username: 'admin',
        password: 'password',
        role: 'admin',
        displayName: 'ผู้ดูแลระบบ'
    },
    {
        id: '2',
        username: 'librarian',
        password: 'password123',
        role: 'librarian',
        displayName: 'บรรณารักษ์หลัก'
    },
    {
        id: '3',
        username: 'somchai',
        password: 'somchai123',
        role: 'librarian',
        displayName: 'สมชาย ใจดี'
    },
    {
        id: '4',
        username: 'malee',
        password: 'malee123',
        role: 'librarian',
        displayName: 'มาลี สวยงาม'
    }
];