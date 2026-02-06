import type { Transaction } from '@/types';

export type { Transaction };


export const mockTransactions: Transaction[] = [
    {
        id: "TXN001",
        type: "borrow",
        bookId: "BK001",
        bookTitle: "การเขียนโปรแกรม JavaScript",
        bookIsbn: "978-0123456789",
        memberId: "MEM001",
        memberName: "สมชาย ใจดี",
        memberNumber: "MEM001",
        borrowDate: "2024-09-10",
        dueDate: "2024-09-24",
        status: "active",
        librarianId: "LIB001",
        librarianName: "บรรณารักษ์ สมใส",
        notes: "หนังสือในสภาพดี"
    },
    {
        id: "TXN002",
        type: "borrow",
        bookId: "BK002",
        bookTitle: "ประวัติศาสตร์ไทย",
        bookIsbn: "978-0987654321",
        memberId: "MEM002",
        memberName: "สมหญิง รักการอ่าน",
        memberNumber: "MEM002",
        borrowDate: "2024-09-05",
        dueDate: "2024-09-19",
        status: "overdue",
        librarianId: "LIB001",
        librarianName: "บรรณารักษ์ สมใส"
    },
    {
        id: "TXN003",
        type: "return",
        bookId: "BK003",
        bookTitle: "คณิตศาสตร์พื้นฐาน",
        bookIsbn: "978-0111222333",
        memberId: "MEM003",
        memberName: "สมศักดิ์ เก่งคิด",
        memberNumber: "MEM003",
        borrowDate: "2024-08-20",
        dueDate: "2024-09-03",
        returnDate: "2024-09-02",
        status: "returned",
        librarianId: "LIB002",
        librarianName: "บรรณารักษ์ วิชาญ"
    },
    {
        id: "TXN004",
        type: "borrow",
        bookId: "BK004",
        bookTitle: "วรรณกรรมไทย",
        bookIsbn: "978-0444555666",
        memberId: "MEM004",
        memberName: "สมปอง ชอบอ่าน",
        memberNumber: "MEM004",
        borrowDate: "2024-09-15",
        dueDate: "2024-09-29",
        status: "active",
        librarianId: "LIB001",
        librarianName: "บรรณารักษ์ สมใส"
    },
    {
        id: "TXN005",
        type: "borrow",
        bookId: "BK005",
        bookTitle: "วิทยาศาสตร์สิ่งแวดล้อม",
        bookIsbn: "978-0777888999",
        memberId: "MEM001",
        memberName: "สมชาย ใจดี",
        memberNumber: "MEM001",
        borrowDate: "2024-09-01",
        dueDate: "2024-09-15",
        status: "overdue",
        librarianId: "LIB002",
        librarianName: "บรรณารักษ์ วิชาญ",
        notes: "ต้องการต่ออายุ"
    }
];
