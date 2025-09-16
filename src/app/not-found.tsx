"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function NotFound() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center">
                {/* Animated Book Icon */}
                <div className="relative mb-8">
                    <div className="inline-block animate-bounce">
                        <svg
                            className="w-24 h-24 mx-auto text-indigo-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>

                    {/* Floating question marks */}
                    <div className="absolute -top-2 -left-2 animate-pulse">
                        <span className="text-2xl text-gray-400">?</span>
                    </div>
                    <div className="absolute -top-4 -right-1 animate-pulse delay-300">
                        <span className="text-lg text-gray-300">?</span>
                    </div>
                    <div className="absolute -bottom-1 -left-3 animate-pulse delay-500">
                        <span className="text-sm text-gray-300">?</span>
                    </div>
                </div>

                {/* 404 Title */}
                <div className="mb-6">
                    <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        ไม่พบหน้าที่คุณค้นหา
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        เหมือนหนังสือเล่มที่หายไปจากชั้น<br />
                        หน้าที่คุณกำลังมองหาอาจจะถูกย้าย หรือไม่มีอยู่จริง
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-6 mb-8">
                    <Link href="/">
                        <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl mb-6">
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
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
                                />
                            </svg>
                            กลับสู่หน้าหลัก
                        </button>
                    </Link>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link href="/books">
                            <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors duration-200">
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                                ดูหนังสือ
                            </button>
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-white text-gray-600 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            กลับหน้าก่อน
                        </button>
                    </div>
                </div>

                {/* Helpful Links */}
                <div className="text-sm text-gray-500">
                    <p className="mb-2">หรือลองเข้าไปที่:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
                            แดชบอร์ด
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/books" className="hover:text-indigo-600 transition-colors">
                            จัดการหนังสือ
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/auth/login" className="hover:text-indigo-600 transition-colors">
                            เข้าสู่ระบบ
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 opacity-10">
                    <svg className="w-16 h-16 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                    </svg>
                </div>
                <div className="absolute bottom-10 right-10 opacity-10">
                    <svg className="w-12 h-12 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
