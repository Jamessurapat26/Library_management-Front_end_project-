'use client';

import { useState, useEffect } from 'react';
import { mockMembers, Member } from '@/mock/members';
import { X, User, Calendar, Clock, BookOpen, Search, CheckCircle } from 'lucide-react';

interface BorrowForm {
    borrowerIdentifier: string; // username or phone
    borrowerName: string; // actual name from member data
    borrowDays: number;
    dueDate: string;
    notes?: string;
}

interface BorrowingDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (borrowForm: BorrowForm) => void;
    bookTitle: string;
    availableCopies: number;
}

export default function BorrowingDialog({
    isOpen,
    onClose,
    onConfirm,
    bookTitle,
    availableCopies,
}: BorrowingDialogProps) {
    const [borrowForm, setBorrowForm] = useState<BorrowForm>({
        borrowerIdentifier: '',
        borrowerName: '',
        borrowDays: 14,
        dueDate: '',
        notes: '',
    });
    const [memberError, setMemberError] = useState('');
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Set default due date when dialog opens
    useEffect(() => {
        if (isOpen) {
            const defaultDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0];
            setBorrowForm({
                borrowerIdentifier: '',
                borrowerName: '',
                borrowDays: 14,
                dueDate: defaultDueDate,
                notes: '',
            });
            setMemberError('');
            setSelectedMember(null);
        }
    }, [isOpen]);

    const searchMemberByIdentifier = (identifier: string): Member | null => {
        const searchTerm = identifier.toLowerCase().trim();
        return mockMembers.find(member =>
            member.role === 'member' &&
            member.status === 'active' && (
                member.phone.replace(/[-\s]/g, '').includes(searchTerm.replace(/[-\s]/g, '')) ||
                member.username?.toLowerCase() === searchTerm ||
                member.memberNumber.toLowerCase() === searchTerm ||
                member.email.toLowerCase() === searchTerm
            )
        ) || null;
    };

    const handleMemberSearch = (identifier: string) => {
        setBorrowForm({
            ...borrowForm,
            borrowerIdentifier: identifier,
        });

        if (!identifier.trim()) {
            setSelectedMember(null);
            setMemberError('');
            setBorrowForm((prev) => ({ ...prev, borrowerName: '' }));
            return;
        }

        const member = searchMemberByIdentifier(identifier);

        if (member) {
            setSelectedMember(member);
            setMemberError('');
            setBorrowForm((prev) => ({ ...prev, borrowerName: member.name }));
        } else {
            setSelectedMember(null);
            setMemberError('ไม่พบสมาชิกในระบบ กรุณาตรวจสอบรหัสสมาชิก username หรือเบอร์โทร');
            setBorrowForm((prev) => ({ ...prev, borrowerName: '' }));
        }
    };

    const handleBorrowDaysChange = (days: number) => {
        const dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];
        setBorrowForm({
            ...borrowForm,
            borrowDays: days,
            dueDate: dueDate,
        });
    };

    const handleDueDateChange = (date: string) => {
        const today = new Date();
        const selectedDate = new Date(date);
        const diffTime = selectedDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setBorrowForm({
            ...borrowForm,
            dueDate: date,
            borrowDays: diffDays > 0 ? diffDays : 1,
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    const handleConfirm = async () => {
        if (!borrowForm.borrowerIdentifier.trim()) {
            alert('กรุณากรอกรหัสสมาชิก username หรือเบอร์โทร');
            return;
        }
        if (!selectedMember) {
            alert('ไม่พบสมาชิกในระบบ กรุณาตรวจสอบข้อมูล');
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            onConfirm(borrowForm);
        } catch (error) {
            console.error('Error confirming borrow:', error);
            alert('เกิดข้อผิดพลาดในการยืมหนังสือ');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setBorrowForm({
            borrowerIdentifier: '',
            borrowerName: '',
            borrowDays: 14,
            dueDate: '',
            notes: '',
        });
        setMemberError('');
        setSelectedMember(null);
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
                            <p className="text-sm text-gray-600">{bookTitle}</p>
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
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-800">เล่มที่พร้อมให้ยืม: {availableCopies} เล่ม</span>
                        </div>
                    </div>

                    {/* Member Search */}
                    <div>
                        <label htmlFor="borrowerIdentifier" className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-1" />
                            ค้นหาสมาชิก *
                        </label>
                        <div className="relative">
                            <input
                                id="borrowerIdentifier"
                                type="text"
                                value={borrowForm.borrowerIdentifier}
                                onChange={(e) => handleMemberSearch(e.target.value)}
                                placeholder="รหัสสมาชิก, username, เบอร์โทร หรืออีเมล"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${memberError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>

                        {memberError && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 flex items-center">
                                    <X className="w-4 h-4 mr-1" />
                                    {memberError}
                                </p>
                            </div>
                        )}

                        {selectedMember && (
                            <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-green-800">{selectedMember.name}</p>
                                        <p className="text-sm text-green-600">รหัส: {selectedMember.memberNumber}</p>
                                        <p className="text-sm text-green-600">โทร: {selectedMember.phone}</p>
                                        <p className="text-sm text-green-600">อีเมล: {selectedMember.email}</p>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                ยืมอยู่: {selectedMember.borrowedBooks} เล่ม
                                            </span>
                                            {selectedMember.overdueBooks > 0 && (
                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                                    เกินกำหนด: {selectedMember.overdueBooks} เล่ม
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
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
                                value={borrowForm.borrowDays}
                                onChange={(e) => handleBorrowDaysChange(Number(e.target.value))}
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
                                value={borrowForm.dueDate}
                                onChange={(e) => handleDueDateChange(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Due Date Display */}
                    {borrowForm.dueDate && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                <span className="font-medium">กำหนดคืน:</span> {formatDate(borrowForm.dueDate)}
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
                            value={borrowForm.notes}
                            onChange={(e) => setBorrowForm({ ...borrowForm, notes: e.target.value })}
                            placeholder="เพิ่มหมายเหตุเกี่ยวกับการยืม..."
                            rows={3}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                    >
                        <X className="w-4 h-4 mr-2" />
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading || !selectedMember}
                        className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${isLoading || !selectedMember
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                กำลังยืนยัน...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                ยืนยันการยืม
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export type { BorrowForm };
