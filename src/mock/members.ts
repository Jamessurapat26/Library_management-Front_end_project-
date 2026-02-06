import type { Member } from '@/types';

export type { Member };


export const mockMembers: Member[] = [
    {
        id: "1",
        memberNumber: "ADM001",
        name: "ผู้ดูแลระบบ สุรพล",
        email: "admin@library.com",
        phone: "02-123-4567",
        role: "admin",
        status: "active",
        joinDate: "2023-01-01",
        borrowedBooks: 0,
        overdueBooks: 0,
        username: "admin",
        password: "password"
    },
    {
        id: "2",
        memberNumber: "LIB001",
        name: "บรรณารักษ์ สมใส",
        email: "librarian1@library.com",
        phone: "02-234-5678",
        role: "librarian",
        status: "active",
        joinDate: "2023-02-15",
        borrowedBooks: 2,
        overdueBooks: 0,
        username: "librarian1_lib",
        password: "lib123456"
    },
    {
        id: "3",
        memberNumber: "LIB002",
        name: "บรรณารักษ์ วิชาญ",
        email: "librarian2@library.com",
        phone: "02-345-6789",
        role: "librarian",
        status: "active",
        joinDate: "2023-03-10",
        borrowedBooks: 1,
        overdueBooks: 0,
        username: "librarian2_lib",
        password: "lib789012"
    },
    {
        id: "4",
        memberNumber: "MEM001",
        name: "สมชาย ใจดี",
        email: "somchai@email.com",
        phone: "08-111-2222",
        role: "member",
        status: "active",
        joinDate: "2023-04-20",
        borrowedBooks: 3,
        overdueBooks: 1
    },
    {
        id: "5",
        memberNumber: "MEM002",
        name: "สมใส รักเรียน",
        email: "somsai@email.com",
        phone: "08-333-4444",
        role: "member",
        status: "active",
        joinDate: "2023-05-12",
        borrowedBooks: 2,
        overdueBooks: 0
    },
    {
        id: "6",
        memberNumber: "MEM003",
        name: "ปัญญา เก่งกาจ",
        email: "panya@email.com",
        phone: "08-555-6666",
        role: "member",
        status: "inactive",
        joinDate: "2023-06-08",
        borrowedBooks: 0,
        overdueBooks: 0
    }
];
