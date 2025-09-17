'use client';

interface TransactionStatsProps {
    activeTransactions: number;
    overdueTransactions: number;
    todayTransactions: number;
    totalTransactions: number;
}

export default function TransactionStats({
    activeTransactions,
    overdueTransactions,
    todayTransactions,
    totalTransactions
}: TransactionStatsProps) {
    const stats = [
        {
            title: 'กำลังยืม',
            value: activeTransactions,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
        },
        {
            title: 'เกินกำหนด',
            value: overdueTransactions,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-red-100',
            textColor: 'text-red-600'
        },
        {
            title: 'วันนี้',
            value: todayTransactions,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            bgColor: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            title: 'ทั้งหมด',
            value: totalTransactions,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg shadow p-6"
                >
                    <div className="flex items-center">
                        <div className={`p-3 rounded-full ${stat.bgColor} ${stat.textColor}`}>
                            {stat.icon}
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
