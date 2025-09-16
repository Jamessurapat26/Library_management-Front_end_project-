interface ActivityItem {
    bookTitle: string;
    user: string;
    type: 'borrow' | 'return';
}

interface PopularBook {
    title: string;
    borrowCount: number;
}

function ActivityCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

function RecentBorrowReturns() {
    const activities: ActivityItem[] = [
        {
            bookTitle: "หนังสือภาษาไทย",
            user: "นายสมชาย ใจดี",
            type: "borrow"
        },
        {
            bookTitle: "คณิตศาสตร์ ม.6",
            user: "นางสมใส รักเรียน",
            type: "return"
        },
        {
            bookTitle: "วิทยาศาสตร์ ม.3",
            user: "นายปัญญา เก่งกาจ",
            type: "borrow"
        }
    ];

    return (
        <ActivityCard title="การยืม-คืนล่าสุด">
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">{activity.bookTitle}</p>
                            <p className="text-sm text-gray-600">
                                {activity.type === 'borrow' ? 'ยืมโดย' : 'คืนโดย'}: {activity.user}
                            </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${activity.type === 'borrow'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                            {activity.type === 'borrow' ? 'ยืม' : 'คืน'}
                        </span>
                    </div>
                ))}
            </div>
        </ActivityCard>
    );
}

function PopularBooks() {
    const popularBooks: PopularBook[] = [
        { title: "แฮร์รี่ พอตเตอร์", borrowCount: 45 },
        { title: "เดอะ ลอร์ด ออฟ เดอะ ริงส์", borrowCount: 38 },
        { title: "อนุสรณ์ในป่าไผ่", borrowCount: 32 }
    ];

    return (
        <ActivityCard title="หนังสือยอดนิยม">
            <div className="space-y-4">
                {popularBooks.map((book, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">{book.title}</p>
                            <p className="text-sm text-gray-600">ยืม {book.borrowCount} ครั้งในเดือนนี้</p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{book.borrowCount}</span>
                    </div>
                ))}
            </div>
        </ActivityCard>
    );
}

export default function RecentActivities() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentBorrowReturns />
            <PopularBooks />
        </div>
    );
}
