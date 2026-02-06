'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
    TransactionFilters,
    TransactionStats,
    TransactionTable,
    BorrowBookDialog,
    type TransactionFiltersType,
    type BorrowBookData
} from './components';
import { mockTransactions } from '@/mock/transactions';
import type { Transaction } from '@/types';
import { mockBooks } from '@/mock/books';
import { mockMembers } from '@/mock/members';
import { useLanguage } from '@/hooks/useLanguage';
import { DEFAULT_BORROW_DAYS, MOCK_ID_PREFIX, padId, POLLING_INTERVAL } from '@/constants';

export default function TransactionsPage() {
    const { t } = useLanguage();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [showBorrowDialog, setShowBorrowDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<TransactionFiltersType>({
        status: 'all',
        type: 'all',
        dateRange: 'all'
    });
    const [dataVersion] = useState(0); // For triggering re-fetch

    // Load mock data and sync with original mockTransactions
    useEffect(() => {
        const loadTransactions = () => {
            // Create a deep copy to avoid direct mutation
            const transactionsCopy = JSON.parse(JSON.stringify(mockTransactions));
            setTransactions(transactionsCopy);
            setFilteredTransactions(transactionsCopy);
        };

        loadTransactions();
    }, [dataVersion]); // Re-run when dataVersion changes

    // Function to update both local state and mock data
    const updateMockData = (updatedTransactions: Transaction[]) => {
        // Update local state
        setTransactions(updatedTransactions);

        // Update original mock data
        mockTransactions.length = 0; // Clear array
        mockTransactions.push(...updatedTransactions); // Add new data

    };

    // Check for overdue transactions every minute
    useEffect(() => {
        const checkOverdueTransactions = () => {
            const now = new Date();
            const updatedTransactions = transactions.map(transaction => {
                if (transaction.status === 'active') {
                    const dueDate = new Date(transaction.dueDate);
                    if (dueDate < now) {
                        return { ...transaction, status: 'overdue' as const };
                    }
                }
                return transaction;
            });

            // Only update if there are changes
            const hasChanges = updatedTransactions.some((t, index) =>
                t.status !== transactions[index]?.status
            );

            if (hasChanges) {
                updateMockData(updatedTransactions);
            }
        };

        // Initial check
        checkOverdueTransactions();

        // Set up interval to check every minute
        const interval = setInterval(checkOverdueTransactions, POLLING_INTERVAL.OVERDUE_CHECK);

        return () => clearInterval(interval);
    }, [transactions]);

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
        // Find book and member information
        const book = mockBooks.find(b => b.id === borrowData.bookId);
        const member = mockMembers.find(m => m.id === borrowData.memberId);

        if (!book || !member) {
            console.error('Book or member not found');
            return;
        }

        // Generate new transaction
        const newTransaction: Transaction = {
            id: `${MOCK_ID_PREFIX.TRANSACTION}${padId(transactions.length + 1)}`,
            type: 'borrow',
            bookId: borrowData.bookId,
            bookTitle: book.title,
            bookIsbn: book.isbn,
            memberId: borrowData.memberId,
            memberName: member.name,
            memberNumber: member.memberNumber,
            borrowDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + DEFAULT_BORROW_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
            status: 'active',
            librarianId: 'LIB001', // Would come from current user
            librarianName: 'บรรณารักษ์ปัจจุบัน', // Would come from current user
            notes: borrowData.notes
        };

        // Update transactions
        const updatedTransactions = [newTransaction, ...transactions];
        updateMockData(updatedTransactions);

        // Update book copies status
        const bookIndex = mockBooks.findIndex(b => b.id === borrowData.bookId);
        if (bookIndex !== -1) {
            const availableCopyIndex = mockBooks[bookIndex].copies.findIndex(copy => copy.status === 'available');
            if (availableCopyIndex !== -1) {
                mockBooks[bookIndex].copies[availableCopyIndex] = {
                    ...mockBooks[bookIndex].copies[availableCopyIndex],
                    status: 'borrowed',
                    borrowedBy: member.name,
                    dueDate: newTransaction.dueDate
                };
            }
        }

        // Update member's borrowed books count
        const memberIndex = mockMembers.findIndex(m => m.id === borrowData.memberId);
        if (memberIndex !== -1) {
            mockMembers[memberIndex].borrowedBooks += 1;
        }

    };

    const handleReturnBook = (transactionId: string) => {
        const updatedTransactions = transactions.map(transaction => {
            if (transaction.id === transactionId) {
                // Find and update book copy status
                const bookIndex = mockBooks.findIndex(b => b.id === transaction.bookId);
                if (bookIndex !== -1) {
                    const borrowedCopyIndex = mockBooks[bookIndex].copies.findIndex(
                        copy => copy.status === 'borrowed' && copy.borrowedBy === transaction.memberName
                    );
                    if (borrowedCopyIndex !== -1) {
                        mockBooks[bookIndex].copies[borrowedCopyIndex] = {
                            copyId: mockBooks[bookIndex].copies[borrowedCopyIndex].copyId,
                            status: 'available'
                        };
                    }
                }

                // Update member's borrowed books count
                const memberIndex = mockMembers.findIndex(m => m.id === transaction.memberId);
                if (memberIndex !== -1 && mockMembers[memberIndex].borrowedBooks > 0) {
                    mockMembers[memberIndex].borrowedBooks -= 1;
                }

                return {
                    ...transaction,
                    status: 'returned' as const,
                    returnDate: new Date().toISOString().split('T')[0]
                };
            }
            return transaction;
        });

        updateMockData(updatedTransactions);
    };

    const handleExtendDueDate = (transactionId: string) => {
        const updatedTransactions = transactions.map(transaction => {
            if (transaction.id === transactionId) {
                const newDueDate = new Date(Date.now() + DEFAULT_BORROW_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

                // Update book copy due date
                const bookIndex = mockBooks.findIndex(b => b.id === transaction.bookId);
                if (bookIndex !== -1) {
                    const borrowedCopyIndex = mockBooks[bookIndex].copies.findIndex(
                        copy => copy.status === 'borrowed' && copy.borrowedBy === transaction.memberName
                    );
                    if (borrowedCopyIndex !== -1) {
                        mockBooks[bookIndex].copies[borrowedCopyIndex] = {
                            ...mockBooks[bookIndex].copies[borrowedCopyIndex],
                            dueDate: newDueDate
                        };
                    }
                }

                return {
                    ...transaction,
                    dueDate: newDueDate,
                    status: 'active' as const // Reset status if it was overdue
                };
            }
            return transaction;
        });

        updateMockData(updatedTransactions);
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
        <ProtectedRoute>
            <DashboardLayout>
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("page.transactions.title")}</h1>
                            <p className="text-gray-600 mt-1">{t("page.transactions.subtitle")}</p>
                        </div>
                        <button
                            onClick={() => setShowBorrowDialog(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {t("button.borrow.book")}
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
        </ProtectedRoute>
    );
}
