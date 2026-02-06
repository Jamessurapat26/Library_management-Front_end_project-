import type { TransactionReportItem } from '@/types';
import { TRANSACTION_STATUS_LABELS } from '@/constants';

interface TransactionsReportProps {
    stats: {
        totalTransactions: number;
        activeTransactions: number;
        overdueTransactions: number;
    };
    transactions: TransactionReportItem[];
}

export default function TransactionsReport({ stats, transactions }: TransactionsReportProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</p>
                        <p className="text-sm text-gray-600">รายการทั้งหมด</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">{stats.activeTransactions}</p>
                        <p className="text-sm text-gray-600">กำลังยืมอยู่</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-red-600">{stats.overdueTransactions}</p>
                        <p className="text-sm text-gray-600">เกินกำหนด</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">รายการล่าสุด</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {transactions.slice(0, 10).map(transaction => (
                            <div key={transaction.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">{transaction.bookTitle}</p>
                                    <p className="text-sm text-gray-600">{transaction.memberName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm">{transaction.borrowDate}</p>
                                    <span className={`px-2 py-1 text-xs rounded-full ${transaction.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                            transaction.status === 'returned' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {TRANSACTION_STATUS_LABELS[transaction.status as keyof typeof TRANSACTION_STATUS_LABELS] ?? transaction.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
