'use client';

import { useState } from 'react';
import { mockBooks } from '@/mock/books';
import { mockMembers } from '@/mock/members';

interface BorrowBookDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (borrowData: BorrowBookData) => void;
}

export interface BorrowBookData {
    bookId: string;
    memberId: string;
    notes?: string;
}

export default function BorrowBookDialog({ isOpen, onClose, onSubmit }: BorrowBookDialogProps) {
    const [borrowData, setBorrowData] = useState<BorrowBookData>({
        bookId: '',
        memberId: '',
        notes: ''
    });
    const [searchBook, setSearchBook] = useState('');
    const [searchMember, setSearchMember] = useState('');

    const availableBooks = mockBooks.filter(book => {
        const availableCopies = book.copies.filter(copy => copy.status === 'available').length;
        return availableCopies > 0;
    });
    const activeMembers = mockMembers.filter(member => member.status === 'active');

    const getAvailableCopies = (book: { copies: { status: string }[] }) => {
        return book.copies.filter((copy: { status: string }) => copy.status === 'available').length;
    };

    const filteredBooks = availableBooks.filter(book =>
        book.title.toLowerCase().includes(searchBook.toLowerCase()) ||
        book.isbn.includes(searchBook) ||
        book.author.toLowerCase().includes(searchBook.toLowerCase())
    );

    const filteredMembers = activeMembers.filter(member =>
        member.name.toLowerCase().includes(searchMember.toLowerCase()) ||
        member.memberNumber.includes(searchMember) ||
        member.email.toLowerCase().includes(searchMember.toLowerCase())
    );

    const selectedBook = mockBooks.find(book => book.id === borrowData.bookId);
    const selectedMember = mockMembers.find(member => member.id === borrowData.memberId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (borrowData.bookId && borrowData.memberId) {
            onSubmit(borrowData);
            setBorrowData({ bookId: '', memberId: '', notes: '' });
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
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={handleClose}>
            <div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        ยืมหนังสือ
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Book Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            เลือกหนังสือ
                        </label>
                        <input
                            type="text"
                            placeholder="ค้นหาหนังสือ..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3"
                            value={searchBook}
                            onChange={(e) => setSearchBook(e.target.value)}
                        />
                        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                            {filteredBooks.map((book) => (
                                <div
                                    key={book.id}
                                    onClick={() => setBorrowData({ ...borrowData, bookId: book.id })}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${borrowData.bookId === book.id ? 'bg-indigo-50 border-indigo-200' : ''
                                        }`}
                                >
                                    <p className="font-medium text-gray-900">{book.title}</p>
                                    <p className="text-sm text-gray-600">{book.author} • {book.isbn}</p>
                                    <p className="text-xs text-indigo-600">เหลือ {getAvailableCopies(book)} เล่ม</p>
                                </div>
                            ))}
                        </div>
                        {selectedBook && (
                            <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                <p className="font-medium text-indigo-800">เลือก: {selectedBook.title}</p>
                            </div>
                        )}
                    </div>

                    {/* Member Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            เลือกสมาชิก
                        </label>
                        <input
                            type="text"
                            placeholder="ค้นหาสมาชิก..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3"
                            value={searchMember}
                            onChange={(e) => setSearchMember(e.target.value)}
                        />
                        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                            {filteredMembers.map((member) => (
                                <div
                                    key={member.id}
                                    onClick={() => setBorrowData({ ...borrowData, memberId: member.id })}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${borrowData.memberId === member.id ? 'bg-indigo-50 border-indigo-200' : ''
                                        }`}
                                >
                                    <p className="font-medium text-gray-900">{member.name}</p>
                                    <p className="text-sm text-gray-600">{member.memberNumber} • {member.email}</p>
                                    <p className="text-xs text-indigo-600">ยืมอยู่ {member.borrowedBooks} เล่ม</p>
                                </div>
                            ))}
                        </div>
                        {selectedMember && (
                            <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                <p className="font-medium text-indigo-800">เลือก: {selectedMember.name}</p>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            หมายเหตุ (ไม่บังคับ)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            rows={3}
                            placeholder="เพิ่มหมายเหตุ..."
                            value={borrowData.notes}
                            onChange={(e) => setBorrowData({ ...borrowData, notes: e.target.value })}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={!borrowData.bookId || !borrowData.memberId}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ยืมหนังสือ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
