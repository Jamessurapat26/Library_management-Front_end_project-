interface PopularBook {
    id: string;
    title: string;
    author: string;
    borrowCount: number;
}

interface PopularBooksProps {
    books: PopularBook[];
}

export default function PopularBooks({ books }: PopularBooksProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">หนังสือยอดนิยม</h3>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    {books.map((book, index) => (
                        <div key={book.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{book.title}</p>
                                    <p className="text-sm text-gray-600">{book.author}</p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">{book.borrowCount} ครั้ง</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
