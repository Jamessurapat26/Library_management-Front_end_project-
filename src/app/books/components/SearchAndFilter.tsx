"use client";

import { useState } from "react";
import type { BookFilters } from "@/types";
import { BOOK_CATEGORIES } from "@/constants";

export type { BookFilters };

interface SearchAndFilterProps {
    onSearch: (searchTerm: string) => void;
    onFilterChange: (filters: BookFilters) => void;
    totalBooks: number;
}

export default function SearchAndFilter({ onSearch, onFilterChange, totalBooks }: SearchAndFilterProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<BookFilters>({
        category: "",
        availability: "",
        year: "",
        author: ""
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        onSearch(value);
    };

    const handleFilterChange = (key: keyof BookFilters, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const emptyFilters = { category: "", availability: "", year: "", author: "" };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
        setSearchTerm("");
        onSearch("");
    };

    const categories = BOOK_CATEGORIES;

    const years = Array.from({ length: 20 }, (_, i) => (2024 - i).toString());

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">ค้นหาหนังสือ</h2>
                    <p className="text-sm text-gray-600">พบหนังสือทั้งหมด {totalBooks} เล่ม</p>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    <span>ตัวกรอง</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="ค้นหาด้วยชื่อหนังสือ, ผู้แต่ง, หรือ ISBN..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange("category", e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">ทุกหมวดหมู่</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Availability Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                            <select
                                value={filters.availability}
                                onChange={(e) => handleFilterChange("availability", e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">ทุกสถานะ</option>
                                <option value="available">พร้อมให้ยืม</option>
                                <option value="borrowed">ถูกยืมแล้ว</option>
                                <option value="reserved">ถูกจอง</option>
                            </select>
                        </div>

                        {/* Year Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ปีที่พิมพ์</label>
                            <select
                                value={filters.year}
                                onChange={(e) => handleFilterChange("year", e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">ทุกปี</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        {/* Author Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ผู้แต่ง</label>
                            <input
                                type="text"
                                placeholder="ชื่อผู้แต่ง"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                value={filters.author}
                                onChange={(e) => handleFilterChange("author", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            ล้างตัวกรอง
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
