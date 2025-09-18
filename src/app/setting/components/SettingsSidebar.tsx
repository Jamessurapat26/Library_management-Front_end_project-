'use client';

import { User, Lock, Bell, Settings } from 'lucide-react';

interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface SettingsSidebarProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
    const tabs: Tab[] = [
        { id: 'profile', label: 'ข้อมูลส่วนตัว', icon: <User className="w-4 h-4" /> },
        { id: 'security', label: 'ความปลอดภัย', icon: <Lock className="w-4 h-4" /> },
        { id: 'notifications', label: 'การแจ้งเตือน', icon: <Bell className="w-4 h-4" /> },
        { id: 'system', label: 'ระบบ', icon: <Settings className="w-4 h-4" /> }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${activeTab === tab.id
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {tab.icon}
                        <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}
