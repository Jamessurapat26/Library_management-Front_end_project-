"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout";
import {
    MemberFilters,
    MemberStats,
    MemberTable,
    AddMemberDialog,
    type Member
} from "./components";
import { mockMembers } from "@/mock";

interface NewMemberForm {
    name: string;
    email: string;
    phone: string;
    role: "librarian" | "member";
}

export default function MemberManagementPage() {
    const [currentUserType] = useState<"admin" | "librarian">("admin"); // This would come from auth
    const [members, setMembers] = useState<Member[]>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "librarian" | "member">("all");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [newMemberForm, setNewMemberForm] = useState<NewMemberForm>({
        name: "",
        email: "",
        phone: "",
        role: "member"
    });

    // Load mock data
    useEffect(() => {
        setMembers(mockMembers);
    }, []);

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.memberNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || member.role === roleFilter;
        const matchesStatus = statusFilter === "all" || member.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const generateMemberNumber = (role: "librarian" | "member"): string => {
        const prefix = role === "librarian" ? "LIB" : "MEM";
        const existingNumbers = members
            .filter(m => m.memberNumber.startsWith(prefix))
            .map(m => parseInt(m.memberNumber.slice(3)))
            .filter(n => !isNaN(n));

        const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
        return `${prefix}${nextNumber.toString().padStart(3, "0")}`;
    };

    const handleAddMember = () => {
        if (!newMemberForm.name || !newMemberForm.email || !newMemberForm.phone) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        // Check if librarian is trying to create admin/librarian
        if (currentUserType === "librarian" && newMemberForm.role === "librarian") {
            alert("บรรณารักษ์ไม่สามารถเพิ่มบรรณารักษ์ได้");
            return;
        }

        const newMember: Member = {
            id: (members.length + 1).toString(),
            memberNumber: generateMemberNumber(newMemberForm.role),
            name: newMemberForm.name,
            email: newMemberForm.email,
            phone: newMemberForm.phone,
            role: newMemberForm.role,
            status: "active",
            joinDate: new Date().toISOString().split("T")[0],
            borrowedBooks: 0,
            overdueBooks: 0
        };

        setMembers([...members, newMember]);
        setNewMemberForm({ name: "", email: "", phone: "", role: "member" });
        setShowAddDialog(false);
        alert("เพิ่มสมาชิกเรียบร้อยแล้ว");
    };

    const handleToggleStatus = (memberId: string) => {
        setMembers(members.map(member =>
            member.id === memberId
                ? { ...member, status: member.status === "active" ? "inactive" : "active" }
                : member
        ));
    };

    const handleDeleteMember = (memberId: string) => {
        if (window.confirm("คุณต้องการลบสมาชิกนี้หรือไม่?")) {
            setMembers(members.filter(member => member.id !== memberId));
        }
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setRoleFilter("all");
        setStatusFilter("all");
    };

    return (
        <DashboardLayout userType={currentUserType} username="Admin" userRole="ผู้ดูแลระบบ">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">จัดการสมาชิก</h1>
                        <p className="text-gray-600">
                            จำนวนสมาชิกทั้งหมด {members.length} คน
                            (ใช้งาน {members.filter(m => m.status === "active").length} คน)
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddDialog(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        เพิ่มสมาชิกใหม่
                    </button>
                </div>

                {/* Filters */}
                <MemberFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    roleFilter={roleFilter}
                    setRoleFilter={setRoleFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    onClearFilters={handleClearFilters}
                />

                {/* Statistics Cards */}
                <MemberStats members={members} />

                {/* Members Table */}
                <MemberTable
                    members={filteredMembers}
                    onToggleStatus={handleToggleStatus}
                    onDeleteMember={handleDeleteMember}
                    currentUserType={currentUserType}
                />

                {/* Add Member Dialog */}
                <AddMemberDialog
                    isOpen={showAddDialog}
                    onClose={() => setShowAddDialog(false)}
                    onAddMember={handleAddMember}
                    currentUserType={currentUserType}
                    newMemberForm={newMemberForm}
                    setNewMemberForm={setNewMemberForm}
                />
            </div>
        </DashboardLayout>
    );
}
