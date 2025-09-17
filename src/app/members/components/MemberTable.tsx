import { Member } from "@/mock/members";
import { useState, Fragment } from "react";

interface MemberTableProps {
    members: Member[];
    onToggleStatus: (memberId: string) => void;
    onDeleteMember: (memberId: string) => void;
    currentUserType?: "admin" | "librarian";
}

export default function MemberTable({ members, onToggleStatus, onDeleteMember, currentUserType = "admin" }: MemberTableProps) {
    const [showCredentialsFor, setShowCredentialsFor] = useState<string | null>(null);

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case "admin": return "ผู้ดูแลระบบ";
            case "librarian": return "บรรณารักษ์";
            case "member": return "สมาชิก";
            default: return role;
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
        if (status === "active") {
            return `${baseClasses} bg-green-100 text-green-800`;
        }
        return `${baseClasses} bg-red-100 text-red-800`;
    };

    const getRoleBadge = (role: string) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
        switch (role) {
            case "admin":
                return `${baseClasses} bg-purple-100 text-purple-800`;
            case "librarian":
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case "member":
                return `${baseClasses} bg-gray-100 text-gray-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    รายการสมาชิก ({members.length})
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                รหัส/ชื่อ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ติดต่อ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                บทบาท
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                สถานะ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                การยืม
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                วันที่เข้าร่วม
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                จัดการ
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {members.map((member) => (
                            <Fragment key={member.id}>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                            <p className="text-sm text-gray-500">{member.memberNumber}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className="text-sm text-gray-900">{member.email}</p>
                                            <p className="text-sm text-gray-500">{member.phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={getRoleBadge(member.role)}>
                                            {getRoleDisplayName(member.role)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={getStatusBadge(member.status)}>
                                            {member.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div>
                                            <p>ยืม: {member.borrowedBooks} เล่ม</p>
                                            {member.overdueBooks > 0 && (
                                                <p className="text-red-600">เกินกำหนด: {member.overdueBooks}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(member.joinDate).toLocaleDateString("th-TH")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        {/* View Credentials Button for Librarians (Admin only) */}
                                        {currentUserType === "admin" && member.role === "librarian" && member.username && member.password && (
                                            <button
                                                onClick={() => setShowCredentialsFor(showCredentialsFor === member.id ? null : member.id)}
                                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                                            >
                                                {showCredentialsFor === member.id ? "ซ่อน" : "ดู Login"}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => onToggleStatus(member.id)}
                                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${member.status === "active"
                                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                                : "bg-green-100 text-green-700 hover:bg-green-200"
                                                }`}
                                        >
                                            {member.status === "active" ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                                        </button>
                                        {member.role !== "admin" && (
                                            <button
                                                onClick={() => onDeleteMember(member.id)}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                                            >
                                                ลบ
                                            </button>
                                        )}
                                    </td>
                                </tr>

                                {/* Credentials Row */}
                                {showCredentialsFor === member.id && currentUserType === "admin" && member.role === "librarian" && (
                                    <tr key={`${member.id}-credentials`} className="bg-blue-50">
                                        <td colSpan={7} className="px-6 py-4">
                                            <div className="bg-blue-100 rounded-lg p-4 border border-blue-200">
                                                <h4 className="text-sm font-medium text-blue-800 mb-3">ข้อมูลการเข้าสู่ระบบ - {member.name}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-blue-700 mb-1">Username:</label>
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                value={member.username || ''}
                                                                readOnly
                                                                className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                            />
                                                            <button
                                                                onClick={() => navigator.clipboard.writeText(member.username || '')}
                                                                className="px-2 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                                                                title="คัดลอก username"
                                                            >
                                                                📋
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-blue-700 mb-1">Password:</label>
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="text"
                                                                value={member.password || ''}
                                                                readOnly
                                                                className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                            />
                                                            <button
                                                                onClick={() => navigator.clipboard.writeText(member.password || '')}
                                                                className="px-2 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                                                                title="คัดลอก password"
                                                            >
                                                                📋
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-blue-600 mt-3">
                                                    💡 คลิกที่ไอคอน 📋 เพื่อคัดลอกข้อมูล
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {members.length === 0 && (
                <div className="text-center py-12">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 715.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500">ไม่พบสมาชิกที่ตรงตามเงื่อนไข</p>
                </div>
            )}
        </div>
    );
}
