"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/Layout";
import { mockBooks } from "@/mock";
import Image from "next/image";

interface BookCopy {
    copyId: string;
    status: "available" | "borrowed";
    borrowedBy?: string;
    dueDate?: string;
}

interface Book {
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

export default function BookDetailPage() {
    const router = useRouter();
    const params = useParams();
    const bookId = params.id as string;

    const [book, setBook] = useState<Book | null>(null);
    const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");

    useEffect(() => {
        // Find book from mock data
        const foundBook = mockBooks.find(b => b.id === bookId);
        if (foundBook) {
            setBook(foundBook);
        } else {
            // Book not found, redirect to books list
            router.push("/books");
        }
    }, [bookId, router]);

    const getAvailableCopies = () => {
        if (!book) return 0;
        return book.copies.filter(copy => copy.status === "available").length;
    };

    const getBorrowedCopies = () => {
        if (!book) return [];
        return book.copies.filter(copy => copy.status === "borrowed");
    };

    const handleBorrowBook = () => {
        if (!book || getAvailableCopies() === 0) return;
        // TODO: Implement borrow functionality
        alert("ขณะนี้ระบบการยืมหนังสือยังไม่เปิดใช้งาน");
    };

    const handleReturnBook = (copyId: string) => {
        // TODO: Implement return functionality
        alert(`ขณะนี้ระบบการคืนหนังสือยังไม่เปิดใช้งาน (รหัสเล่ม: ${copyId})`);
    };

    const handleEditBook = () => {
        // TODO: Implement edit functionality
        alert("ขณะนี้ระบบแก้ไขข้อมูลหนังสือยังไม่เปิดใช้งาน");
    };

    const handleDeleteBook = () => {
        if (window.confirm('คุณต้องการลบหนังสือเล่มนี้หรือไม่?')) {
            // TODO: Implement delete functionality
            alert("ขณะนี้ระบบลบหนังสือยังไม่เปิดใช้งาน");
        }
    };

    if (!book) {
        return (
            <DashboardLayout userType="admin" username="Admin" userRole="ผู้ดูแลระบบ">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">กำลังโหลดข้อมูลหนังสือ...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout userType="admin" username="Admin" userRole="ผู้ดูแลระบบ">
            {/* Back Button */}
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    กลับไปรายการหนังสือ
                </button>
            </div>

            {/* Book Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Book Cover */}
                        <div className="lg:w-48 flex-shrink-0">
                            <div className="h-64 lg:h-72 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                {book.coverImage ? (
                                    <Image
                                        src={book.coverImage}
                                        alt={book.title}
                                        className="w-full h-full object-cover rounded-lg"
                                        width={300}
                                        height={400}
                                    />
                                ) : (
                                    <div className="text-center text-white">
                                        <svg
                                            className="w-20 h-20 mx-auto mb-3 opacity-80"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
                                        </svg>
                                        <p className="text-sm font-medium">หนังสือ</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {book.title}
                                </h1>
                                <div className="flex flex-col items-end">
                                    <span
                                        className={`px-3 py-1 text-sm font-semibold rounded-full ${getAvailableCopies() > 0
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {getAvailableCopies() > 0 ? "มีให้ยืม" : "ยืมหมด"}
                                    </span>
                                    <span className="text-sm text-gray-500 mt-1">
                                        {getAvailableCopies()}/{book.totalCopies} เล่ม
                                    </span>
                                </div>
                            </div>

                            {/* Book Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">ผู้แต่ง</p>
                                    <p className="font-semibold text-gray-900">{book.author}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">ISBN</p>
                                    <p className="font-semibold text-gray-900">{book.isbn}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">สำนักพิมพ์</p>
                                    <p className="font-semibold text-gray-900">{book.publisher}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">ปีที่พิมพ์</p>
                                    <p className="font-semibold text-gray-900">{book.publishYear}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">หมวดหมู่</p>
                                    <p className="font-semibold text-gray-900">{book.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">จำนวนเล่มทั้งหมด</p>
                                    <p className="font-semibold text-gray-900">{book.totalCopies} เล่ม</p>
                                </div>
                            </div>

                            {/* Description */}
                            {book.description && (
                                <div className="mb-6">
                                    <p className="text-sm text-gray-600 mb-2">คำอธิบาย</p>
                                    <p className="text-gray-900 leading-relaxed">{book.description}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                {getAvailableCopies() > 0 ? (
                                    <button
                                        onClick={handleBorrowBook}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                                    >
                                        ยืมหนังสือ ({getAvailableCopies()} เล่มว่าง)
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium cursor-not-allowed"
                                    >
                                        ยืมหมดแล้ว
                                    </button>
                                )}
                                <button
                                    onClick={handleEditBook}
                                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    แก้ไขข้อมูล
                                </button>
                                <button
                                    onClick={handleDeleteBook}
                                    className="border border-red-300 text-red-700 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium"
                                >
                                    ลบหนังสือ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`py-4 px-6 border-b-2 font-medium text-sm ${activeTab === "overview"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            ภาพรวมการยืม
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`py-4 px-6 border-b-2 font-medium text-sm ${activeTab === "history"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            รายละเอียดเล่ม ({book.totalCopies})
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === "overview" && (
                        <div>
                            {/* Current Borrowed Copies */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    เล่มที่กำลังถูกยืม ({getBorrowedCopies().length})
                                </h3>
                                {getBorrowedCopies().length > 0 ? (
                                    <div className="space-y-3">
                                        {getBorrowedCopies().map((copy) => (
                                            <div
                                                key={copy.copyId}
                                                className="bg-red-50 rounded-lg p-4 flex justify-between items-center"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        รหัสเล่ม: {copy.copyId}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        ผู้ยืม: {copy.borrowedBy || "ไม่ระบุ"} • กำหนดคืน: {copy.dueDate || "ไม่ระบุ"}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleReturnBook(copy.copyId)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    คืนหนังสือ
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <p className="text-gray-500">ไม่มีเล่มที่กำลังถูกยืม</p>
                                    </div>
                                )}
                            </div>

                            {/* Available Copies */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    เล่มที่ว่าง ({getAvailableCopies()})
                                </h3>
                                {getAvailableCopies() > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {book.copies
                                            .filter((copy) => copy.status === "available")
                                            .map((copy) => (
                                                <div
                                                    key={copy.copyId}
                                                    className="bg-green-50 rounded-lg p-4 text-center border border-green-200"
                                                >
                                                    <p className="font-medium text-green-800">
                                                        {copy.copyId}
                                                    </p>
                                                    <p className="text-xs text-green-600 mt-1">พร้อมให้ยืม</p>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <p className="text-gray-500">ไม่มีเล่มว่าง</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "history" && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                รายละเอียดเล่มทั้งหมด
                            </h3>
                            <div className="space-y-3">
                                {book.copies.map((copy) => (
                                    <div
                                        key={copy.copyId}
                                        className={`border rounded-lg p-4 ${copy.status === "available"
                                            ? "border-green-200 bg-green-50"
                                            : "border-red-200 bg-red-50"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    รหัสเล่ม: {copy.copyId}
                                                </p>
                                                {copy.status === "borrowed" && (
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        <p>ผู้ยืม: {copy.borrowedBy || "ไม่ระบุ"}</p>
                                                        <p>กำหนดคืน: {copy.dueDate || "ไม่ระบุ"}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${copy.status === "available"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {copy.status === "available" ? "ว่าง" : "ถูกยืม"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}