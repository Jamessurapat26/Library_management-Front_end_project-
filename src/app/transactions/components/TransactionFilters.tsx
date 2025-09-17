'use client';

import { useState } from 'react';

interface TransactionFiltersProps {
    onFilterChange: (filters: TransactionFilters) => void;
    onSearch: (searchTerm: string) => void;
}

export interface TransactionFilters {
    status: 'all' | 'active' | 'returned' | 'overdue';
    type: 'all' | 'borrow' | 'return';
    dateRange: 'all' | 'today' | 'week' | 'month';
}

export default function TransactionFilters({ onFilterChange, onSearch }: TransactionFiltersProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<TransactionFilters>({
        status: 'all',
        type: 'all',
        dateRange: 'all'
    });

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        onSearch(value);
    };

    const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const emptyFilters: TransactionFilters = {
            status: 'all',
            type: 'all',
            dateRange: 'all'
        };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">ค้นหารายการ</h2>
                <p className="text-sm text-gray-600">ค้นหาและกรองรายการยืม-คืนหนังสือ</p>
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
                    placeholder="ค้นหาด้วยชื่อหนังสือ, ชื่อสมาชิก, หรือรหัสรายการ..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">ทั้งหมด</option>
                        <option value="active">กำลังยืม</option>
                        <option value="returned">คืนแล้ว</option>
                        <option value="overdue">เกินกำหนด</option>
                    </select>
                </div>

                {/* Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ประเภท</label>
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">ทั้งหมด</option>
                        <option value="borrow">ยืม</option>
                        <option value="return">คืน</option>
                    </select>
                </div>

                {/* Date Range Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ช่วงเวลา</label>
                    <select
                        value={filters.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">ทั้งหมด</option>
                        <option value="today">วันนี้</option>
                        <option value="week">สัปดาห์นี้</option>
                        <option value="month">เดือนนี้</option>
                    </select>
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
    );
}
