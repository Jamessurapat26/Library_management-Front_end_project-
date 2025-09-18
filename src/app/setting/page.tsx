'use client';

import { DashboardLayout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { mockMembers, Member } from "@/mock/members";
import {
    ProfileTab,
    SecurityTab,
    NotificationsTab,
    SystemTab,
    SettingsSidebar
} from "@/app/setting/components";

// Define types for the settings
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

interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface NotificationSettings {
    emailNotifications: boolean;
    overdueReminders: boolean;
    newBookAlerts: boolean;
    systemUpdates: boolean;
}

export default function SettingPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [currentUser, setCurrentUser] = useState<Member | null>(null);

    // Initialize user data from mock data (assuming current user is admin)
    useEffect(() => {
        const adminUser = mockMembers.find(member => member.role === 'admin');
        if (adminUser) {
            setCurrentUser(adminUser);
        }
    }, []);

    const handleProfileUpdate = (profileData: ProfileData) => {
        // Update current user state
        if (currentUser) {
            const updatedUser: Member = {
                ...currentUser,
                name: `${profileData.firstName} ${profileData.lastName}`,
                email: profileData.email,
                phone: profileData.phone,
                status: profileData.status as "active" | "inactive",
                username: profileData.username
            };
            setCurrentUser(updatedUser);

            // In a real application, you would send this data to a backend API
            console.log('Profile updated:', updatedUser);
        }

        alert(`ข้อมูลโปรไฟล์ถูกอัปเดตเรียบร้อยแล้ว\n\nรายละเอียดที่อัปเดต:\n• ชื่อ: ${profileData.firstName} ${profileData.lastName}\n• อีเมล: ${profileData.email}\n• โทรศัพท์: ${profileData.phone}\n• สถานะ: ${profileData.status === 'active' ? 'ใช้งานได้' : 'ไม่ใช้งาน'}`);
    };

    const handlePasswordChange = (passwordData: PasswordData) => {
        console.log('Password changed:', passwordData);
        // Handle password change logic here
        alert('รหัสผ่านถูกเปลี่ยนเรียบร้อยแล้ว');
    };

    const handleNotificationSave = (notifications: NotificationSettings) => {
        console.log('Notifications updated:', notifications);
        alert('การตั้งค่าการแจ้งเตือนถูกบันทึกแล้ว');
    };

    const handleSystemSave = () => {
        console.log('System settings updated');
        alert('การตั้งค่าระบบถูกบันทึกแล้ว');
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">การตั้งค่า</h1>
                        <p className="text-gray-600">จัดการข้อมูลส่วนตัวและการตั้งค่าระบบ</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <SettingsSidebar
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                {activeTab === 'profile' && (
                                    <ProfileTab
                                        currentUser={currentUser}
                                        onProfileUpdate={handleProfileUpdate}
                                    />
                                )}

                                {activeTab === 'security' && (
                                    <SecurityTab onPasswordChange={handlePasswordChange} />
                                )}

                                {activeTab === 'notifications' && (
                                    <NotificationsTab onNotificationSave={handleNotificationSave} />
                                )}

                                {activeTab === 'system' && (
                                    <SystemTab onSystemSave={handleSystemSave} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    )
}