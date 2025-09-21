"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BookEditDialog from "./BookEditDialog";

interface BookCopy {
    copyId: string;
    status: "available" | "borrowed";
    borrowedBy?: string;
    dueDate?: string;
}

export interface Book {
    id: string;
    title: string;
    isbn: string;
    author: string;
    publisher: string;
    publishYear: number;
    category: string;
    totalCopies: number;
    copies: BookCopy[];
    coverImage?: string;
    description?: string;
}

interface BookListProps {
    books: Book[];
    loading?: boolean;
    onBorrow?: (bookId: string) => void;
    onDelete?: (bookId: string) => void;
    onReturn?: (bookId: string) => void;
    onEdit?: (bookId: string, updatedBook: any) => Promise<{ success: boolean; message?: string }>;
    sidebarCollapsed?: boolean;
}

function BookCard({
    book,
    onBorrow,
    onDelete,
    onEdit
}: {
    book: Book;
    onBorrow?: (bookId: string) => void;
    onDelete?: (bookId: string) => void;
    onReturn?: (bookId: string) => void;
    onEdit?: (bookId: string, updatedBook: any) => Promise<{ success: boolean; message?: string }>;
}) {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getAvailableCopies = () => {
        return book.copies.filter((copy) => copy.status === "available").length;
    };

    const getBorrowedCopies = () => {
        return book.copies.filter((copy) => copy.status === "borrowed").length;
    };

    const availableCopies = getAvailableCopies();
    const borrowedCopies = getBorrowedCopies();
    const canDelete = borrowedCopies === 0; // Can only delete if no borrowed copies

    const handleEdit = () => {
        setShowEditDialog(true);
        setShowMenu(false);
    };

    const handleEditBook = async (bookId: string, updatedBook: any) => {
        if (onEdit) {
            return await onEdit(bookId, updatedBook);
        }
        return { success: false, message: 'ฟังก์ชันแก้ไขไม่พร้อมใช้งาน' };
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(book.id);
        }
        setShowMenu(false);
    };



    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible relative">
            {/* Book Cover Placeholder */}
            <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                {book.coverImage ? (
                    <Image
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        width={300}
                        height={400}
                    />
                ) : (
                    <div className="text-center text-white">
                        <svg
                            className="w-16 h-16 mx-auto mb-2 opacity-80"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
                        </svg>
                        <p className="text-sm font-medium">หนังสือ</p>
                    </div>
                )}
            </div>

            <div className="p-4">
                {/* Title and Availability */}
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2">
                        {book.title}
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            ผู้แต่ง: {book.author}
                        </span>
                        <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${availableCopies > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}
                        >
                            {availableCopies}/{book.totalCopies} เล่ม
                        </span>
                    </div>
                </div>

                {/* Book Details */}
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>
                        <span className="font-medium">ISBN:</span> {book.isbn}
                    </p>
                    <p>
                        <span className="font-medium">สำนักพิมพ์:</span> {book.publisher}
                    </p>
                    <p>
                        <span className="font-medium">ปีที่พิมพ์:</span> {book.publishYear}
                    </p>
                    <p>
                        <span className="font-medium">หมวดหมู่:</span> {book.category}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 relative">
                    <button
                        onClick={() => router.push(`/books/${book.id}`)}
                        className="flex-1 px-3 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors text-center font-medium"
                    >
                        รายละเอียด
                    </button>

                    {onBorrow && (
                        <button
                            onClick={() => onBorrow(book.id)}
                            disabled={availableCopies === 0}
                            className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors text-center font-medium ${availableCopies > 0
                                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            ยืม
                        </button>
                    )}

                    {/* Three Dots Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <button
                                    onClick={handleEdit}
                                    className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left rounded-t-md"
                                >
                                    แก้ไข
                                </button>

                                {/* Show delete option only if no borrowed copies */}
                                {onDelete && (
                                    <button
                                        onClick={handleDelete}
                                        disabled={!canDelete}
                                        className={`w-full px-3 py-2 text-sm text-left rounded-b-md ${canDelete
                                            ? "text-red-600 hover:bg-red-50"
                                            : "text-gray-400 cursor-not-allowed bg-gray-50"
                                            }`}
                                        title={!canDelete ? "ไม่สามารถลบได้ เนื่องจากมีคนยืมอยู่" : "ลบหนังสือ"}
                                    >
                                        ลบ {!canDelete && "(มีคนยืม)"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <BookEditDialog
                isOpen={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                onUpdateBook={handleEditBook}
                book={book}
            />
        </div>
    );
} function LoadingSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Cover skeleton */}
            <div className="h-48 bg-gray-200 animate-pulse"></div>

            <div className="p-4">
                {/* Title skeleton */}
                <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>

                {/* Details skeleton */}
                <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>

                {/* Buttons skeleton */}
                <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded animate-pulse flex-1"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse flex-1"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

export default function BookList({ books, loading = false, onBorrow, onDelete, onEdit, sidebarCollapsed = false }: BookListProps) {
    // Dynamic grid classes based on sidebar state
    const gridClasses = sidebarCollapsed
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";

    if (loading) {
        return (
            <div className={gridClasses}>
                {Array.from({ length: sidebarCollapsed ? 12 : 9 }, (_, i) => (
                    <LoadingSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="text-center py-12 col-span-full">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบหนังสือ</h3>
                <p className="mt-1 text-sm text-gray-500">ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองดู</p>
            </div>
        );
    }

    return (
        <div className={gridClasses}>
            {books.map((book) => (
                <BookCard
                    key={book.id}
                    book={book}
                    onBorrow={onBorrow}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}
