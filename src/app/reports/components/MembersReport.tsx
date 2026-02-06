import { ROLE_DISPLAY_NAMES } from '@/constants';

interface MembersReportProps {
    stats: {
        totalMembers: number;
        activeMembers: number;
    };
    members: Array<{
        role: string;
    }>;
}

export default function MembersReport({ stats, members }: MembersReportProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">{stats.totalMembers}</p>
                        <p className="text-sm text-gray-600">สมาชิกทั้งหมด</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">{stats.activeMembers}</p>
                        <p className="text-sm text-gray-600">สมาชิกที่ใช้งาน</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-red-600">{stats.totalMembers - stats.activeMembers}</p>
                        <p className="text-sm text-gray-600">สมาชิกที่ไม่ใช้งาน</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">รายงานสมาชิกตามบทบาท</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {['admin', 'librarian', 'member'].map(role => {
                            const roleMembers = members.filter(m => m.role === role);
                            return (
                                <div key={role} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <span className="font-medium">{ROLE_DISPLAY_NAMES[role as keyof typeof ROLE_DISPLAY_NAMES]}</span>
                                    <span className="text-lg font-bold">{roleMembers.length} คน</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
