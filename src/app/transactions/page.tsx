'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout';
import {
    TransactionFilters,
    TransactionStats,
    TransactionTable,
    BorrowBookDialog,
    type TransactionFiltersType,
    type BorrowBookData
} from './components';
import { mockTransactions, type Transaction } from '@/mock/transactions';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [showBorrowDialog, setShowBorrowDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<TransactionFiltersType>({
        status: 'all',
        type: 'all',
        dateRange: 'all'
    });

    // Load mock data
    useEffect(() => {
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
    }, []);

    // Apply filters and search
    useEffect(() => {
        let filtered = transactions;

        // Apply search
        if (searchTerm) {
            filtered = filtered.filter(transaction =>
                transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.bookIsbn.includes(searchTerm)
            );
        }

        // Apply status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(transaction => transaction.status === filters.status);
        }

        // Apply type filter
        if (filters.type !== 'all') {
            filtered = filtered.filter(transaction => transaction.type === filters.type);
        }

        // Apply date range filter
        if (filters.dateRange !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            filtered = filtered.filter(transaction => {
                const transactionDate = new Date(transaction.borrowDate);

                switch (filters.dateRange) {
                    case 'today':
                        return transactionDate >= today;
                    case 'week':
                        const weekAgo = new Date(today);
                        weekAgo.setDate(today.getDate() - 7);
                        return transactionDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(today.getMonth() - 1);
                        return transactionDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        setFilteredTransactions(filtered);
    }, [transactions, searchTerm, filters]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const handleFilterChange = (newFilters: TransactionFiltersType) => {
        setFilters(newFilters);
    };

    const handleBorrowBook = (borrowData: BorrowBookData) => {
        // Generate new transaction
        const newTransaction: Transaction = {
            id: `TXN${Date.now()}`,
            type: 'borrow',
            bookId: borrowData.bookId,
            bookTitle: '', // Would be fetched from book data
            bookIsbn: '', // Would be fetched from book data
            memberId: borrowData.memberId,
            memberName: '', // Would be fetched from member data
            memberNumber: '', // Would be fetched from member data
            borrowDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
            status: 'active',
            librianId: 'LIB001', // Would come from current user
            librarianName: 'บรรณารักษ์ปัจจุบัน', // Would come from current user
            notes: borrowData.notes
        };

        setTransactions([newTransaction, ...transactions]);
    };

    const handleReturnBook = (transactionId: string) => {
        setTransactions(transactions.map(transaction =>
            transaction.id === transactionId
                ? {
                    ...transaction,
                    status: 'returned' as const,
                    returnDate: new Date().toISOString().split('T')[0]
                }
                : transaction
        ));
    };

    const handleExtendDueDate = (transactionId: string) => {
        setTransactions(transactions.map(transaction =>
            transaction.id === transactionId
                ? {
                    ...transaction,
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Extend 14 days
                }
                : transaction
        ));
    };

    // Calculate stats
    const stats = {
        activeTransactions: transactions.filter(t => t.status === 'active').length,
        overdueTransactions: transactions.filter(t => t.status === 'overdue').length,
        todayTransactions: transactions.filter(t => {
            const today = new Date().toISOString().split('T')[0];
            return t.borrowDate === today;
        }).length,
        totalTransactions: transactions.length
    };

    return (
        <DashboardLayout userType="admin">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            📚 การยืม-คืนหนังสือ
                        </h1>
                        <p className="text-gray-600 mt-1">จัดการการยืมและคืนหนังสือของสมาชิก</p>
                    </div>
                    <button
                        onClick={() => setShowBorrowDialog(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        ยืมหนังสือ
                    </button>
                </div>

                {/* Stats */}
                <TransactionStats {...stats} />

                {/* Filters */}
                <TransactionFilters
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                />

                {/* Transactions Table */}
                <TransactionTable
                    transactions={filteredTransactions}
                    onReturnBook={handleReturnBook}
                    onExtendDueDate={handleExtendDueDate}
                />

                {/* Borrow Book Dialog */}
                <BorrowBookDialog
                    isOpen={showBorrowDialog}
                    onClose={() => setShowBorrowDialog(false)}
                    onSubmit={handleBorrowBook}
                />
            </div>
        </DashboardLayout>
    );
}
