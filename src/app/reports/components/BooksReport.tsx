interface CategoryData {
    total: number;
    available: number;
    borrowed: number;
}

interface BooksReportProps {
    categoryStats: Record<string, CategoryData>;
}

export default function BooksReport({ categoryStats }: BooksReportProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">รายงานหนังสือตามหมวดหมู่</h3>
            </div>
            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">หมวดหมู่</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จำนวนทั้งหมด</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">พร้อมให้ยืม</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ถูกยืมแล้ว</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">อัตราการยืม</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {Object.entries(categoryStats).map(([category, data]) => (
                                <tr key={category}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{data.total}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-green-600">{data.available}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-blue-600">{data.borrowed}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        {((data.borrowed / data.total) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
