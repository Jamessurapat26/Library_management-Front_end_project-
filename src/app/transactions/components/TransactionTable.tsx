'use client';

import type { Transaction } from '@/types';
import { TRANSACTION_STATUS_LABELS } from '@/constants';

interface TransactionTableProps {
    transactions: Transaction[];
    onReturnBook: (transactionId: string) => void;
    onExtendDueDate: (transactionId: string) => void;
    currentUserType?: 'admin' | 'librarian';
}

export default function TransactionTable({
    transactions,
    onReturnBook,
    onExtendDueDate
}: TransactionTableProps) {

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
        switch (status) {
            case "active":
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case "returned":
                return `${baseClasses} bg-green-100 text-green-800`;
            case "overdue":
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const getStatusText = (status: string) => {
        return TRANSACTION_STATUS_LABELS[status as keyof typeof TRANSACTION_STATUS_LABELS] ?? status;
    };

    const getTypeIcon = (type: string) => {
        return type === 'borrow' ? '📤' : '📥';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH');
    };

    const isOverdue = (dueDate: string, status: string) => {
        if (status === 'returned') return false;
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    รายการยืม-คืนหนังสือ ({transactions.length})
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                รายการ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                หนังสือ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                สมาชิก
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                วันที่ยืม
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                กำหนดคืน
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                สถานะ
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                จัดการ
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                            <tr
                                key={transaction.id}
                                className={`hover:bg-gray-50 transition-colors ${isOverdue(transaction.dueDate, transaction.status) ? 'bg-red-50' : ''
                                    }`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">{getTypeIcon(transaction.type)}</span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{transaction.id}</p>
                                            <p className="text-xs text-gray-500">
                                                {transaction.type === 'borrow' ? 'ยืม' : 'คืน'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 truncate max-w-48">
                                            {transaction.bookTitle}
                                        </p>
                                        <p className="text-xs text-gray-500">{transaction.bookIsbn}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{transaction.memberName}</p>
                                        <p className="text-xs text-gray-500">{transaction.memberNumber}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(transaction.borrowDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={isOverdue(transaction.dueDate, transaction.status) ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                                        {formatDate(transaction.dueDate)}
                                    </span>
                                    {transaction.returnDate && (
                                        <p className="text-xs text-green-600">
                                            คืน: {formatDate(transaction.returnDate)}
                                        </p>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={getStatusBadge(transaction.status)}>
                                        {getStatusText(transaction.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                        {transaction.status === 'active' && (
                                            <>
                                                <button
                                                    onClick={() => onReturnBook(transaction.id)}
                                                    className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                                                >
                                                    คืนหนังสือ
                                                </button>
                                                <button
                                                    onClick={() => onExtendDueDate(transaction.id)}
                                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                                                >
                                                    ต่ออายุ
                                                </button>
                                            </>
                                        )}
                                        {transaction.status === 'overdue' && (
                                            <button
                                                onClick={() => onReturnBook(transaction.id)}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                                            >
                                                คืนหนังสือ
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {transactions.length === 0 && (
                <div className="text-center py-12">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <p className="text-gray-500">ไม่พบรายการที่ตรงตามเงื่อนไข</p>
                </div>
            )}
        </div>
    );
}
