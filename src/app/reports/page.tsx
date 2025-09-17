'use client';

import { DashboardLayout } from '@/components/Layout';

export default function ReportsPage() {
    return (
        <DashboardLayout userType="admin">
            <div className="p-6">
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">📊</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">หน้ารายงาน</h1>
                    <p className="text-gray-600">กำลังพัฒนา...</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
