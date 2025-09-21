'use client';

import { useState, useEffect } from 'react';
import { mockBooks, mockMembers, mockTransactions } from '@/mock';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
}

function StatCard({ title, value, icon, bgColor, textColor }: StatCardProps) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
                <div className={`p-3 rounded-full ${bgColor} ${textColor}`}>
                    {icon}
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}

export default function StatsCards() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalMembers: 0,
        todayBorrows: 0,
        overdueBooks: 0
    });

    // Function to calculate statistics
    const calculateStats = () => {
        const now = new Date();

        // Calculate statistics from mock data
        const totalBooks = mockBooks.reduce((sum, book) => sum + book.totalCopies, 0);
        const totalMembers = mockMembers.filter(member => member.status === 'active').length;

        // Get today's date for filtering transactions
        const today = now.toISOString().split('T')[0];
        const todayBorrows = mockTransactions.filter(
            transaction => transaction.type === 'borrow' &&
                transaction.borrowDate === today
        ).length;

        // Calculate overdue books
        const overdueBooks = mockTransactions.filter(transaction => {
            if (transaction.status === 'active') {
                const dueDate = new Date(transaction.dueDate);
                return dueDate < now;
            }
            return false;
        }).length;

        return {
            totalBooks,
            totalMembers,
            todayBorrows,
            overdueBooks
        };
    };

    // Update stats on component mount and every 30 seconds
    useEffect(() => {
        const updateStats = () => {
            setStats(calculateStats());
            setCurrentTime(new Date());
        };

        // Initial calculation
        updateStats();

        // Set up interval for real-time updates (every 30 seconds)
        const interval = setInterval(updateStats, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const statsData = [
        {
            title: "จำนวนหนังสือทั้งหมด",
            value: stats.totalBooks.toLocaleString(),
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            title: "สมาชิกทั้งหมด",
            value: stats.totalMembers.toLocaleString(),
            bgColor: "bg-green-100",
            textColor: "text-green-600",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            title: "หนังสือที่ยืมวันนี้",
            value: stats.todayBorrows.toLocaleString(),
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-600",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            title: "หนังสือเกินกำหนด",
            value: stats.overdueBooks.toLocaleString(),
            bgColor: "bg-red-100",
            textColor: "text-red-600",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className="space-y-4">
            {/* Last Updated Timestamp */}
            <div className="text-xs text-gray-500 text-right">
                อัพเดทล่าสุด: {currentTime.toLocaleTimeString('th-TH')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        bgColor={stat.bgColor}
                        textColor={stat.textColor}
                    />
                ))}
            </div>
        </div>
    );
}
