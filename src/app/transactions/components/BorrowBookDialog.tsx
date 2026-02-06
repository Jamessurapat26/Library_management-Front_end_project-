'use client';

import { useState } from 'react';
import { mockBooks } from '@/mock/books';
import { mockMembers } from '@/mock/members';
import { DEFAULT_BORROW_DAYS } from '@/constants';
import { X, User, Calendar, Clock, BookOpen, Search, CheckCircle } from 'lucide-react';

interface BorrowBookDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (borrowData: BorrowBookData) => void;
}

export interface BorrowBookData {
    bookId: string;
    memberId: string;
    notes?: string;
    borrowDays?: number;
    dueDate?: string;
}

export default function BorrowBookDialog({ isOpen, onClose, onSubmit }: BorrowBookDialogProps) {
    const [borrowData, setBorrowData] = useState<BorrowBookData>({
        bookId: '',
        memberId: '',
        notes: '',
        borrowDays: DEFAULT_BORROW_DAYS,
        dueDate: new Date(Date.now() + DEFAULT_BORROW_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    const [searchBook, setSearchBook] = useState('');
    const [searchMember, setSearchMember] = useState('');

    const availableBooks = mockBooks.filter(book => {
        const availableCopies = book.copies.filter(copy => copy.status === 'available').length;
        return availableCopies > 0;
    });
    const filteredBooks = availableBooks.filter(book =>
        book.title.toLowerCase().includes(searchBook.toLowerCase()) ||
        book.isbn.includes(searchBook) ||
        book.author.toLowerCase().includes(searchBook.toLowerCase())
    );
    const selectedBook = mockBooks.find(book => book.id === borrowData.bookId);

    const activeMembers = mockMembers.filter(member => member.status === 'active');
    const filteredMembers = activeMembers.filter(member =>
        member.name.toLowerCase().includes(searchMember.toLowerCase()) ||
        member.memberNumber.includes(searchMember) ||
        member.email.toLowerCase().includes(searchMember.toLowerCase())
    );
    const selectedMember = mockMembers.find(member => member.id === borrowData.memberId);

    // Handle borrow days change
    const handleBorrowDaysChange = (days: number) => {
        const dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        setBorrowData({ ...borrowData, borrowDays: days, dueDate });
    };

    // Handle due date change
    const handleDueDateChange = (date: string) => {
        const today = new Date();
        const selectedDate = new Date(date);
        const diffTime = selectedDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setBorrowData({ ...borrowData, dueDate: date, borrowDays: diffDays > 0 ? diffDays : 1 });
    };

    // Format date (Thai)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (borrowData.bookId && borrowData.memberId) {
            onSubmit(borrowData);
            setBorrowData({
                bookId: '',
                memberId: '',
                notes: '',
                borrowDays: DEFAULT_BORROW_DAYS,
                dueDate: new Date(Date.now() + DEFAULT_BORROW_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
            setSearchBook('');
            setSearchMember('');
            onClose();
        }
    };

    const handleClose = () => {
        setBorrowData({ bookId: '', memberId: '', notes: '' });
        setSearchBook('');
        setSearchMember('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">ยืมหนังสือ</h2>
                            <p className="text-sm text-gray-600">{selectedBook ? selectedBook.title : 'กรุณาเลือกหนังสือ'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Available Copies Info */}
                    {selectedBook && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-800">เล่มที่พร้อมให้ยืม: {selectedBook.copies.filter(copy => copy.status === 'available').length} เล่ม</span>
                            </div>
                        </div>
                    )}

                    {/* Book Search */}
                    <div>
                        <label htmlFor="searchBook" className="block text-sm font-medium text-gray-700 mb-2">
                            <BookOpen className="w-4 h-4 inline mr-1" />
                            ค้นหาหนังสือ *
                        </label>
                        <div className="relative">
                            <input
                                id="searchBook"
                                type="text"
                                value={searchBook}
                                onChange={(e) => setSearchBook(e.target.value)}
                                placeholder="ชื่อหนังสือ, ISBN, ผู้แต่ง"
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg mt-2">
                            {filteredBooks.map((book) => (
                                <div
                                    key={book.id}
                                    onClick={() => setBorrowData({ ...borrowData, bookId: book.id })}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${borrowData.bookId === book.id ? 'bg-indigo-50 border-indigo-200' : ''}`}
                                >
                                    <p className="font-medium text-gray-900">{book.title}</p>
                                    <p className="text-sm text-gray-600">{book.author} • {book.isbn}</p>
                                    <p className="text-xs text-indigo-600">เหลือ {book.copies.filter(copy => copy.status === 'available').length} เล่ม</p>
                                </div>
                            ))}
                            {filteredBooks.length === 0 && (
                                <div className="p-3 text-gray-500">ไม่พบหนังสือที่ค้นหา</div>
                            )}
                        </div>
                        {selectedBook && (
                            <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                <p className="font-medium text-indigo-800">เลือก: {selectedBook.title}</p>
                            </div>
                        )}
                    </div>

                    {/* Member Search */}
                    <div>
                        <label htmlFor="searchMember" className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-1" />
                            ค้นหาสมาชิก *
                        </label>
                        <div className="relative">
                            <input
                                id="searchMember"
                                type="text"
                                value={searchMember}
                                onChange={(e) => setSearchMember(e.target.value)}
                                placeholder="รหัสสมาชิก, username, เบอร์โทร หรืออีเมล"
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg mt-2">
                            {filteredMembers.map((member) => (
                                <div
                                    key={member.id}
                                    onClick={() => setBorrowData({ ...borrowData, memberId: member.id })}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${borrowData.memberId === member.id ? 'bg-indigo-50 border-indigo-200' : ''}`}
                                >
                                    <p className="font-medium text-gray-900">{member.name}</p>
                                    <p className="text-sm text-gray-600">{member.memberNumber} • {member.email}</p>
                                    <p className="text-xs text-indigo-600">ยืมอยู่ {member.borrowedBooks} เล่ม</p>
                                </div>
                            ))}
                            {filteredMembers.length === 0 && (
                                <div className="p-3 text-gray-500">ไม่พบสมาชิกที่ค้นหา</div>
                            )}
                        </div>
                        {selectedMember && (
                            <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                <p className="font-medium text-indigo-800">เลือก: {selectedMember.name}</p>
                            </div>
                        )}
                    </div>

                    {/* Borrow Period */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Borrow Days */}
                        <div>
                            <label htmlFor="borrowDays" className="block text-sm font-medium text-gray-700 mb-2">
                                <Clock className="w-4 h-4 inline mr-1" />
                                ระยะเวลายืม
                            </label>
                            <select
                                id="borrowDays"
                                value={borrowData.borrowDays}
                                onChange={e => handleBorrowDaysChange(Number(e.target.value))}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value={7}>7 วัน</option>
                                <option value={14}>14 วัน</option>
                                <option value={21}>21 วัน</option>
                                <option value={30}>30 วัน</option>
                            </select>
                        </div>
                        {/* Due Date */}
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                วันกำหนดคืน
                            </label>
                            <input
                                id="dueDate"
                                type="date"
                                value={borrowData.dueDate}
                                onChange={e => handleDueDateChange(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                    {/* Due Date Display */}
                    {borrowData.dueDate && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                <span className="font-medium">กำหนดคืน:</span> {formatDate(borrowData.dueDate)}
                            </p>
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                            หมายเหตุ (ไม่บังคับ)
                        </label>
                        <textarea
                            id="notes"
                            value={borrowData.notes}
                            onChange={(e) => setBorrowData({ ...borrowData, notes: e.target.value })}
                            placeholder="เพิ่มหมายเหตุเกี่ยวกับการยืม..."
                            rows={3}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            <X className="w-4 h-4 mr-2" />
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={!borrowData.bookId || !borrowData.memberId}
                            className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${!borrowData.bookId || !borrowData.memberId
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                                }`}
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            ยืนยันการยืม
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
