'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { mockBooks } from '@/mock/books';
import { mockMembers } from '@/mock/members';
import { mockTransactions } from '@/mock/transactions';
import {
    ReportTypeSelector,
    StatsCards,
    PopularBooks,
    ActiveBorrowers,
    BooksReport,
    MembersReport,
    TransactionsReport
} from './components';

export default function ReportsPage() {
    const [books] = useState(mockBooks);
    const [members] = useState(mockMembers);
    const [transactions] = useState(mockTransactions);
    const [selectedReport, setSelectedReport] = useState('overview');

    // Calculate statistics
    const stats = {
        totalBooks: books.length,
        totalMembers: members.length,
        activeMembers: members.filter(m => m.status === 'active').length,
        totalTransactions: transactions.length,
        activeTransactions: transactions.filter(t => t.status === 'active').length,
        overdueTransactions: transactions.filter(t => t.status === 'overdue').length,
        booksAvailable: books.reduce((sum, book) =>
            sum + book.copies.filter(copy => copy.status === 'available').length, 0),
        booksBorrowed: books.reduce((sum, book) =>
            sum + book.copies.filter(copy => copy.status === 'borrowed').length, 0),
    };

    // Popular books data
    const popularBooks = books
        .map(book => ({
            ...book,
            borrowCount: transactions.filter(t => t.bookId === book.id).length
        }))
        .sort((a, b) => b.borrowCount - a.borrowCount)
        .slice(0, 5);

    // Active borrowers
    const activeBorrowers = members
        .filter(m => m.borrowedBooks > 0)
        .sort((a, b) => b.borrowedBooks - a.borrowedBooks)
        .slice(0, 5);

    // Category statistics
    const categoryStats = books.reduce((acc, book) => {
        const category = book.category;
        if (!acc[category]) {
            acc[category] = { total: 0, available: 0, borrowed: 0 };
        }
        acc[category].total += book.copies.length;
        acc[category].available += book.copies.filter(c => c.status === 'available').length;
        acc[category].borrowed += book.copies.filter(c => c.status === 'borrowed').length;
        return acc;
    }, {} as Record<string, { total: number, available: number, borrowed: number }>);

    const reportTypes = [
        { id: 'overview', name: 'ภาพรวม', icon: '📊' },
        { id: 'books', name: 'รายงานหนังสือ', icon: '📚' },
        { id: 'members', name: 'รายงานสมาชิก', icon: '👥' },
        { id: 'transactions', name: 'รายงานการยืม-คืน', icon: '🔄' },
    ];

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">รายงาน</h1>
                        <p className="text-gray-600">รายงานสถิติและข้อมูลของระบบห้องสมุด</p>
                    </div>

                    {/* Report Type Selector */}
                    <ReportTypeSelector
                        reportTypes={reportTypes}
                        selectedReport={selectedReport}
                        onSelectReport={setSelectedReport}
                    />

                    {/* Overview Report */}
                    {selectedReport === 'overview' && (
                        <div className="space-y-6">
                            {/* Statistics Cards */}
                            <StatsCards stats={stats} />

                            {/* Popular Books and Active Borrowers */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <PopularBooks books={popularBooks} />
                                <ActiveBorrowers borrowers={activeBorrowers} />
                            </div>
                        </div>
                    )}

                    {/* Books Report */}
                    {selectedReport === 'books' && (
                        <BooksReport categoryStats={categoryStats} />
                    )}

                    {/* Members Report */}
                    {selectedReport === 'members' && (
                        <MembersReport stats={stats} members={members} />
                    )}

                    {/* Transactions Report */}
                    {selectedReport === 'transactions' && (
                        <TransactionsReport stats={stats} transactions={transactions} />
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
