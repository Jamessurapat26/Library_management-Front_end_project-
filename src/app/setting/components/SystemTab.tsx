'use client';

import { Globe, Save } from 'lucide-react';

interface SystemTabProps {
    onSystemSave: () => void;
}

export default function SystemTab({ onSystemSave }: SystemTabProps) {
    return (
        <div>
            <div className="flex items-center space-x-2 mb-6">
                <Globe className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">การตั้งค่าระบบ</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">ภาษา</h3>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="th">ไทย</option>
                        <option value="en">English</option>
                    </select>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">เขตเวลา</h3>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="asia/bangkok">Asia/Bangkok (GMT+7)</option>
                        <option value="utc">UTC (GMT+0)</option>
                    </select>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">รูปแบบวันที่</h3>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                        <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                        <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onSystemSave}
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
