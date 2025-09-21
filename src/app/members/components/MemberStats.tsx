'use client';

import { useState, useEffect } from "react";
import { Member, mockMembers } from "@/mock/members";

interface MemberStatsProps {
    members: Member[];
}

export default function MemberStats({ members }: MemberStatsProps) {
    const [realTimeStats, setRealTimeStats] = useState({
        adminCount: 0,
        librarianCount: 0,
        memberCount: 0,
        activeCount: 0
    });

    // Calculate stats from real-time data
    const calculateStats = () => {
        const adminCount = mockMembers.filter(m => m.role === "admin").length;
        const librarianCount = mockMembers.filter(m => m.role === "librarian").length;
        const memberCount = mockMembers.filter(m => m.role === "member").length;
        const activeCount = mockMembers.filter(m => m.status === "active").length;

        return { adminCount, librarianCount, memberCount, activeCount };
    };

    // Update stats in real-time
    useEffect(() => {
        const updateStats = () => {
            setRealTimeStats(calculateStats());
        };

        // Initial calculation
        updateStats();

        // Set up interval for real-time updates (every 3 seconds)
        const interval = setInterval(updateStats, 3000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Use props data as fallback but prefer real-time data
    const stats = {
        adminCount: realTimeStats.adminCount || members.filter(m => m.role === "admin").length,
        librarianCount: realTimeStats.librarianCount || members.filter(m => m.role === "librarian").length,
        memberCount: realTimeStats.memberCount || members.filter(m => m.role === "member").length,
        activeCount: realTimeStats.activeCount || members.filter(m => m.status === "active").length
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-600">ผู้ดูแลระบบ</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.adminCount}</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-600">บรรณารักษ์</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.librarianCount}</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-gray-100">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-600">สมาชิก</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.memberCount}</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-600">ใช้งาน</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activeCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
