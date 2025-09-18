'use client';

import { useState } from 'react';
import { User, Save } from 'lucide-react';
import { Member } from '@/mock/members';

interface ProfileData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    memberNumber: string;
    joinDate: string;
    status: string;
}

interface ProfileTabProps {
    currentUser: Member | null;
    onProfileUpdate: (profileData: ProfileData) => void;
}

export default function ProfileTab({ currentUser, onProfileUpdate }: ProfileTabProps) {
    const [profileData, setProfileData] = useState({
        username: currentUser?.username || '',
        firstName: currentUser?.name.split(' ')[0] || '',
        lastName: currentUser?.name.split(' ').slice(1).join(' ') || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        position: getPositionFromRole(currentUser?.role || ''),
        department: 'ฝ่ายเทคโนโลยีสารสนเทศ',
        memberNumber: currentUser?.memberNumber || '',
        joinDate: currentUser?.joinDate || '',
        status: currentUser?.status || 'active'
    });

    function getPositionFromRole(role: string) {
        switch (role) {
            case 'admin':
                return 'ผู้ดูแลระบบ';
            case 'librarian':
                return 'บรรณารักษ์';
            case 'member':
                return 'สมาชิก';
            default:
                return 'ไม่ระบุ';
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onProfileUpdate(profileData);
    };

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">ข้อมูลส่วนตัว</h2>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">สมาชิกตั้งแต่</p>
                    <p className="font-medium text-gray-900">
                        {new Date(currentUser.joinDate).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            รหัสสมาชิก
                        </label>
                        <input
                            type="text"
                            value={profileData.memberNumber}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">รหัสสมาชิกไม่สามารถแก้ไขได้</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ชื่อผู้ใช้
                        </label>
                        <input
                            type="text"
                            value={profileData.username}
                            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            อีเมล
                        </label>
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            หมายเลขโทรศัพท์
                        </label>
                        <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ชื่อ
                        </label>
                        <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            นามสกุล
                        </label>
                        <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ตำแหน่ง
                        </label>
                        <input
                            type="text"
                            value={profileData.position}
                            onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            สถานะ
                        </label>
                        <select
                            value={profileData.status}
                            onChange={(e) => setProfileData({ ...profileData, status: e.target.value as 'active' | 'inactive' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="active">ใช้งานได้</option>
                            <option value="inactive">ไม่ใช้งาน</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            แผนก/หน่วยงาน
                        </label>
                        <input
                            type="text"
                            value={profileData.department}
                            onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            วันที่เข้าร่วม
                        </label>
                        <input
                            type="date"
                            value={profileData.joinDate}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">วันที่เข้าร่วมไม่สามารถแก้ไขได้</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        <Save className="w-4 h-4" />
                        <span>บันทึกการเปลี่ยนแปลง</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
