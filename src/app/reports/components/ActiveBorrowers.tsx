interface ActiveBorrower {
    id: string;
    name: string;
    memberNumber: string;
    borrowedBooks: number;
}

interface ActiveBorrowersProps {
    borrowers: ActiveBorrower[];
}

export default function ActiveBorrowers({ borrowers }: ActiveBorrowersProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">สมาชิกที่ยืมมากที่สุด</h3>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    {borrowers.map((member, index) => (
                        <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{member.name}</p>
                                    <p className="text-sm text-gray-600">{member.memberNumber}</p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">{member.borrowedBooks} เล่ม</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
