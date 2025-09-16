import { Book } from "@/app/books/components";

export const mockBooks: Book[] = [
    {
        id: "1",
        title: "แฮร์รี่ พอตเตอร์ กับศิลาอาถรรพ์",
        author: "เจ.เค. โรว์ลิง",
        isbn: "978-616-06-0123-4",
        category: "วรรณกรรม",
        publishYear: 2020,
        publisher: "นานมีบุ๊คส์",
        description: "เรื่องราวของเด็กชายผู้มีพลังเวทย์มนต์ และการผจญภัยครั้งแรกในโรงเรียนเวทมนตร์ฮอกวอตส์",
        totalCopies: 5,
        copies: [
            { copyId: "1-001", status: "available" },
            { copyId: "1-002", status: "available" },
            { copyId: "1-003", status: "available" },
            { copyId: "1-004", status: "borrowed", borrowedBy: "นายสมชาย ใจดี", dueDate: "2024-01-20" },
            { copyId: "1-005", status: "borrowed", borrowedBy: "นางสมใส รักเรียน", dueDate: "2024-01-18" }
        ]
    },
    {
        id: "2",
        title: "คณิตศาสตร์ ม.6 เล่ม 1",
        author: "ดร.สมชาย เลขานุการ",
        isbn: "978-616-06-0456-7",
        category: "คณิตศาสตร์",
        publishYear: 2023,
        publisher: "สำนักพิมพ์แห่งจุฬาลงกรณ์มหาวิทยาลัย",
        description: "หนังสือเรียนคณิตศาสตร์สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 6",
        totalCopies: 10,
        copies: [
            { copyId: "2-001", status: "borrowed", borrowedBy: "นายปัญญา เก่งกาจ", dueDate: "2024-01-15" },
            { copyId: "2-002", status: "borrowed", borrowedBy: "นางสาวอัจฉรา เรียนดี", dueDate: "2024-01-16" },
            { copyId: "2-003", status: "borrowed", borrowedBy: "นายวิชาญ คิดเก่ง", dueDate: "2024-01-17" },
            { copyId: "2-004", status: "available" },
            { copyId: "2-005", status: "available" },
            { copyId: "2-006", status: "available" },
            { copyId: "2-007", status: "available" },
            { copyId: "2-008", status: "available" },
            { copyId: "2-009", status: "available" },
            { copyId: "2-010", status: "available" }
        ]
    },
    {
        id: "3",
        title: "ประวัติศาสตร์ไทย",
        author: "ศ.ดร.วิชาญ ประวัติกุล",
        isbn: "978-616-06-0789-0",
        category: "ประวัติศาสตร์",
        publishYear: 2022,
        publisher: "โรงพิมพ์มหาวิทยาลัยธรรมศาสตร์",
        description: "ประวัติศาสตร์ไทยตั้งแต่สมัยโบราณจนถึงปัจจุบัน",
        totalCopies: 8,
        copies: [
            { copyId: "3-001", status: "available" },
            { copyId: "3-002", status: "available" },
            { copyId: "3-003", status: "available" },
            { copyId: "3-004", status: "available" },
            { copyId: "3-005", status: "available" },
            { copyId: "3-006", status: "borrowed", borrowedBy: "นายธนา รักประวัติ", dueDate: "2024-01-25" },
            { copyId: "3-007", status: "borrowed", borrowedBy: "นางสาวพิมพ์ใจ อ่านหนัง", dueDate: "2024-01-22" },
            { copyId: "3-008", status: "borrowed", borrowedBy: "นายสุรพล เลิฟบุ๊ค", dueDate: "2024-01-19" }
        ]
    },
    {
        id: "4",
        title: "Programming in Python",
        author: "John Smith",
        isbn: "978-616-06-0321-5",
        category: "คอมพิวเตอร์",
        publishYear: 2023,
        publisher: "Tech Publications",
        description: "Complete guide to Python programming for beginners to advanced users",
        totalCopies: 6,
        copies: [
            { copyId: "4-001", status: "available" },
            { copyId: "4-002", status: "available" },
            { copyId: "4-003", status: "borrowed", borrowedBy: "นายโค้ด โปรแกรม", dueDate: "2024-01-30" },
            { copyId: "4-004", status: "borrowed", borrowedBy: "นางสาวเทค นิค", dueDate: "2024-01-28" },
            { copyId: "4-005", status: "borrowed", borrowedBy: "นายพายธอน เขียนโค้ด", dueDate: "2024-01-26" },
            { copyId: "4-006", status: "borrowed", borrowedBy: "นางสาวเวบ เดฟ", dueDate: "2024-01-24" }
        ]
    },
    {
        id: "5",
        title: "วิทยาศาสตร์ ม.3",
        author: "ดร.สุภา วิทยากุล",
        isbn: "978-616-06-0654-8",
        category: "วิทยาศาสตร์",
        publishYear: 2023,
        publisher: "สำนักพิมพ์วิทยาศาสตร์",
        description: "หนังสือเรียนวิทยาศาสตร์สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 3",
        totalCopies: 12,
        copies: [
            { copyId: "5-001", status: "available" },
            { copyId: "5-002", status: "available" },
            { copyId: "5-003", status: "available" },
            { copyId: "5-004", status: "available" },
            { copyId: "5-005", status: "available" },
            { copyId: "5-006", status: "available" },
            { copyId: "5-007", status: "available" },
            { copyId: "5-008", status: "available" },
            { copyId: "5-009", status: "borrowed", borrowedBy: "นายไซ เอนซ์", dueDate: "2024-01-21" },
            { copyId: "5-010", status: "borrowed", borrowedBy: "นางสาวเคมี ฟิสิก", dueDate: "2024-01-23" },
            { copyId: "5-011", status: "borrowed", borrowedBy: "นายชีวะ วิทยา", dueDate: "2024-01-27" },
            { copyId: "5-012", status: "borrowed", borrowedBy: "นางสาวโลก ศึกษา", dueDate: "2024-01-29" }
        ]
    },
    {
        id: "6",
        title: "ศิลปะการวาดภาพ",
        author: "นางสาวอารีย์ สีสวย",
        isbn: "978-616-06-0987-3",
        category: "ศิลปะ",
        publishYear: 2021,
        publisher: "สำนักพิมพ์ศิลปกรรม",
        description: "เทคนิคและวิธีการวาดภาพสำหรับผู้เริ่มต้น",
        totalCopies: 4,
        copies: [
            { copyId: "6-001", status: "available" },
            { copyId: "6-002", status: "available" },
            { copyId: "6-003", status: "available" },
            { copyId: "6-004", status: "available" }
        ]
    }
];
