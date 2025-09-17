'use client';

import Link from 'next/link';
import {
    BookOpen,
    Users,
    ArrowLeftRight,
    FileText,
    UserPlus,
    BookPlus,
    Settings
} from 'lucide-react';

interface QuickActionProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    color: string;
}

function QuickActionCard({ icon, title, description, href, color }: QuickActionProps) {
    return (
        <Link href={href} className="group block h-full">
            <div className={`${color} rounded-lg p-6 h-full transition-all duration-200 hover:shadow-lg hover:scale-105 flex flex-col justify-between min-h-[140px] border border-gray-200`}>
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-white/60 rounded-lg flex items-center justify-center border border-white/40">
                            {icon}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">{title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function QuickActions() {
    const quickActions = [
        {
            icon: <BookOpen className="w-6 h-6 text-gray-700" />,
            title: "จัดการหนังสือ",
            description: "เพิ่ม แก้ไข หรือดูรายการหนังสือ",
            href: "/books",
            color: "bg-gradient-to-r from-blue-100 to-blue-200"
        },
        {
            icon: <Users className="w-6 h-6 text-gray-700" />,
            title: "จัดการสมาชิก",
            description: "เพิ่มสมาชิกใหม่ หรือดูข้อมูลสมาชิก",
            href: "/members",
            color: "bg-gradient-to-r from-green-100 to-green-200"
        },
        {
            icon: <ArrowLeftRight className="w-6 h-6 text-gray-700" />,
            title: "จัดการการยืม-คืน",
            description: "บันทึกการยืม-คืนหนังสือ",
            href: "/transactions",
            color: "bg-gradient-to-r from-purple-100 to-purple-200"
        },
        {
            icon: <FileText className="w-6 h-6 text-gray-700" />,
            title: "รายงาน",
            description: "ดูรายงานและสถิติการใช้งาน",
            href: "/reports",
            color: "bg-gradient-to-r from-orange-100 to-orange-200"
        },
        {
            icon: <UserPlus className="w-6 h-6 text-gray-700" />,
            title: "เพิ่มสมาชิกใหม่",
            description: "ลงทะเบียนสมาชิกใหม่",
            href: "/members?action=add",
            color: "bg-gradient-to-r from-teal-100 to-teal-200"
        },
        {
            icon: <BookPlus className="w-6 h-6 text-gray-700" />,
            title: "เพิ่มหนังสือใหม่",
            description: "เพิ่มหนังสือเข้าสู่ระบบ",
            href: "/books?action=add",
            color: "bg-gradient-to-r from-indigo-100 to-indigo-200"
        },
        {
            icon: <Settings className="w-6 h-6 text-gray-700" />,
            title: "ตั้งค่าระบบ",
            description: "จัดการการตั้งค่าและคอนฟิกระบบ",
            href: "/setting",
            color: "bg-gradient-to-r from-pink-100 to-pink-200"
        }
    ];

    return (
        <div className="mb-8">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">การดำเนินการด่วน</h2>
                <p className="text-gray-600">เลือกเมนูที่ต้องการเพื่อเข้าถึงฟังก์ชันต่างๆ ได้อย่างรวดเร็ว</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
                {quickActions.map((action, index) => (
                    <QuickActionCard
                        key={index}
                        icon={action.icon}
                        title={action.title}
                        description={action.description}
                        href={action.href}
                        color={action.color}
                    />
                ))}
            </div>
        </div>
    );
}
