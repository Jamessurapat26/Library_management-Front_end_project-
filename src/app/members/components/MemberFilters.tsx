import { ROLE_DISPLAY_NAMES, MEMBER_STATUS_LABELS } from '@/constants';

interface MemberFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    roleFilter: "all" | "admin" | "librarian" | "member";
    setRoleFilter: (role: "all" | "admin" | "librarian" | "member") => void;
    statusFilter: "all" | "active" | "inactive";
    setStatusFilter: (status: "all" | "active" | "inactive") => void;
    onClearFilters: () => void;
}

export default function MemberFilters({
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    onClearFilters
}: MemberFiltersProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        ค้นหา
                    </label>
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อ, รหัส, อีเมล..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        บทบาท
                    </label>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as "all" | "admin" | "librarian" | "member")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="all">ทั้งหมด</option>
                        <option value="admin">{ROLE_DISPLAY_NAMES.admin}</option>
                        <option value="librarian">{ROLE_DISPLAY_NAMES.librarian}</option>
                        <option value="member">{ROLE_DISPLAY_NAMES.member}</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        สถานะ
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="all">ทั้งหมด</option>
                        <option value="active">{MEMBER_STATUS_LABELS.active}</option>
                        <option value="inactive">{MEMBER_STATUS_LABELS.inactive}</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={onClearFilters}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ล้างตัวกรอง
                    </button>
                </div>
            </div>
        </div>
    );
}
