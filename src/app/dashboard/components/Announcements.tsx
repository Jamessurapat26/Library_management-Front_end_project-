'use client';

import { Bell, User, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface AnnouncementItem {
    id: number;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'urgent';
    date: string;
    author: string;
    isNew?: boolean;
}

function getTypeStyles(type: string) {
    switch (type) {
        case 'urgent':
            return {
                icon: <AlertCircle className="w-5 h-5" />,
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                iconColor: 'text-red-500',
                titleColor: 'text-red-800',
                badge: 'bg-red-100 text-red-800'
            };
        case 'warning':
            return {
                icon: <AlertCircle className="w-5 h-5" />,
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                iconColor: 'text-yellow-500',
                titleColor: 'text-yellow-800',
                badge: 'bg-yellow-100 text-yellow-800'
            };
        case 'success':
            return {
                icon: <CheckCircle className="w-5 h-5" />,
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                iconColor: 'text-green-500',
                titleColor: 'text-green-800',
                badge: 'bg-green-100 text-green-800'
            };
        default:
            return {
                icon: <Info className="w-5 h-5" />,
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                iconColor: 'text-blue-500',
                titleColor: 'text-blue-800',
                badge: 'bg-blue-100 text-blue-800'
            };
    }
}

function AnnouncementCard({ announcement }: { announcement: AnnouncementItem }) {
    const styles = getTypeStyles(announcement.type);

    return (
        <div className={`${styles.bgColor} ${styles.borderColor} border rounded-lg p-4 transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-start space-x-3">
                <div className={`${styles.iconColor} mt-1`}>
                    {styles.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${styles.titleColor} text-base leading-tight`}>
                            {announcement.title}
                            {announcement.isNew && (
                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    ใหม่
                                </span>
                            )}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
                            {announcement.type === 'urgent' ? 'เร่งด่วน' :
                                announcement.type === 'warning' ? 'แจ้งเตือน' :
                                    announcement.type === 'success' ? 'ประกาศ' : 'ข้อมูล'}
                        </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                        {announcement.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>{announcement.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <span>{announcement.date}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Announcements() {
    const announcements: AnnouncementItem[] = [
        {
            id: 1,
            title: "ปรับปรุงระบบห้องสมุดในช่วงสุดสัปดาห์",
            content: "ระบบจะปิดปรับปรุงเพื่อเพิ่มประสิทธิภาพในวันเสาร์ที่ 20 กันยายน 2568 เวลา 18:00-22:00 น. ขออภัยในความไม่สะดวก",
            type: "warning",
            date: "17 กันยายน 2568",
            author: "ผู้ดูแลระบบ",
            isNew: true
        },
        {
            id: 2,
            title: "เปิดให้บริการหนังสือใหม่ประจำเดือนกันยายน",
            content: "หนังสือใหม่จำนวน 150 เล่ม พร้อมให้บริการแล้ว ครอบคลุมหมวดหมู่วิทยาศาสตร์ เทคโนโลยี และวรรณกรรม",
            type: "success",
            date: "15 กันยายน 2568",
            author: "ฝ่ายบริการ"
        },
        {
            id: 3,
            title: "แจ้งเตือน: หนังสือค้างส่งเกิน 30 วัน",
            content: "พบสมาชิก 12 ราย มีหนังสือค้างส่งเกินกำหนด กรุณาติดต่อสมาชิกเพื่อส่งคืนหนังสือหรือชำระค่าปรับ",
            type: "urgent",
            date: "16 กันยายน 2568",
            author: "ฝ่ายหนังสือ",
            isNew: true
        },
        {
            id: 4,
            title: "การอบรมระบบจัดการห้องสมุดใหม่",
            content: "กำหนดการอบรมการใช้งานระบบใหม่สำหรับเจ้าหน้าที่ วันจันทร์ที่ 22 กันยายน 2568 เวลา 09:00-16:00 น.",
            type: "info",
            date: "14 กันยายน 2568",
            author: "ฝ่ายพัฒนา"
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">ประกาศและข่าวสาร</h2>
                </div>
                <span className="text-sm text-gray-500">ทั้งหมด {announcements.length} รายการ</span>
            </div>

            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <AnnouncementCard
                        key={announcement.id}
                        announcement={announcement}
                    />
                ))}
            </div>

            <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200">
                    ดูประกาศทั้งหมด →
                </button>
            </div>
        </div>
    );
}
