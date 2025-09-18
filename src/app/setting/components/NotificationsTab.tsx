'use client';

import { useState } from 'react';
import { Bell, Save } from 'lucide-react';

interface NotificationSettings {
    emailNotifications: boolean;
    overdueReminders: boolean;
    newBookAlerts: boolean;
    systemUpdates: boolean;
}

interface NotificationsTabProps {
    onNotificationSave: (notifications: NotificationSettings) => void;
}

export default function NotificationsTab({ onNotificationSave }: NotificationsTabProps) {
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        overdueReminders: true,
        newBookAlerts: false,
        systemUpdates: true
    });

    const handleSave = () => {
        onNotificationSave(notifications);
    };

    return (
        <div>
            <div className="flex items-center space-x-2 mb-6">
                <Bell className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">การแจ้งเตือน</h2>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">การแจ้งเตือนทางอีเมล</h3>
                        <p className="text-sm text-gray-500">รับการแจ้งเตือนผ่านอีเมล</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">แจ้งเตือนหนังสือเกินกำหนด</h3>
                        <p className="text-sm text-gray-500">แจ้งเตือนเมื่อมีหนังสือเกินกำหนดส่งคืน</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={notifications.overdueReminders}
                        onChange={(e) => setNotifications({ ...notifications, overdueReminders: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">แจ้งเตือนหนังสือใหม่</h3>
                        <p className="text-sm text-gray-500">แจ้งเตือนเมื่อมีหนังสือใหม่เข้าระบบ</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={notifications.newBookAlerts}
                        onChange={(e) => setNotifications({ ...notifications, newBookAlerts: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">อัปเดตระบบ</h3>
                        <p className="text-sm text-gray-500">แจ้งเตือนเมื่อมีการอัปเดตระบบ</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={notifications.systemUpdates}
                        onChange={(e) => setNotifications({ ...notifications, systemUpdates: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        <Save className="w-4 h-4" />
                        <span>บันทึกการตั้งค่า</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
