"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
    MemberFilters,
    MemberStats,
    MemberTable,
    AddMemberDialog,
    EditMemberDialog,
    type Member,
    type EditMemberForm
} from "./components";
import { mockMembers } from "@/mock";
import { createMemberWithUser, updateMemberWithUser } from "@/mock/userMemberMapping";
import { useAuth } from "@/hooks/useAuth";
import { useUserCreationValidation } from "@/hooks/useRolePermissions";
import { useLanguage } from "@/hooks/useLanguage";

interface NewMemberForm {
    name: string;
    email: string;
    phone: string;
    role: "librarian" | "member";
    username?: string;
    password?: string;
}

export default function MemberManagementPage() {
    const { user } = useAuth();
    const { canCreateUser } = useUserCreationValidation();
    const { t } = useLanguage();
    const [members, setMembers] = useState<Member[]>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "librarian" | "member">("all");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [newMemberForm, setNewMemberForm] = useState<NewMemberForm>({
        name: "",
        email: "",
        phone: "",
        role: "member"
    });
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Load mock data and set up real-time updates
    useEffect(() => {
        const updateMembersData = () => {
            // Create a deep copy to avoid direct mutation
            const membersCopy = JSON.parse(JSON.stringify(mockMembers));
            setMembers(membersCopy);
        };

        // Initial load
        updateMembersData();

        // Set up interval for real-time updates (every 5 seconds)
        const interval = setInterval(updateMembersData, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Reset form when dialog opens to ensure valid default role
    const handleOpenAddDialog = () => {
        setNewMemberForm({
            name: "",
            email: "",
            phone: "",
            role: "member" // Always default to member as it's available for all users
        });
        setShowAddDialog(true);
    };

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.memberNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || member.role === roleFilter;
        const matchesStatus = statusFilter === "all" || member.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleAddMember = () => {
        // Basic validation (detailed validation is now handled in the dialog)
        if (!newMemberForm.name || !newMemberForm.email || !newMemberForm.phone) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        // Final validation of user creation permissions
        const validation = canCreateUser(newMemberForm.role);
        if (!validation.allowed) {
            alert(validation.errorMessage);
            return;
        }

        // Additional validation for librarian credentials
        if (newMemberForm.role === "librarian" && (!newMemberForm.username || !newMemberForm.password)) {
            alert("กรุณากรอกข้อมูล Username และ Password สำหรับบรรณารักษ์");
            return;
        }

        // Use the new function to create member and user account
        const result = createMemberWithUser({
            name: newMemberForm.name,
            email: newMemberForm.email,
            phone: newMemberForm.phone,
            role: newMemberForm.role,
            username: newMemberForm.username,
            password: newMemberForm.password
        });

        if (result.success) {
            // Update local state with the new member
            setMembers([...members, result.member!]);
            setNewMemberForm({ name: "", email: "", phone: "", role: "member" });
            setShowAddDialog(false);

            const userMessage = result.user
                ? `เพิ่มสมาชิกและบัญชีผู้ใช้เรียบร้อยแล้ว\nUsername: ${result.user.username}`
                : "เพิ่มสมาชิกเรียบร้อยแล้ว";

            alert(userMessage);
        } else {
            alert(result.error || "เกิดข้อผิดพลาดในการเพิ่มสมาชิก");
        }
    };

    const handleToggleStatus = (memberId: string) => {
        const updatedMembers = members.map(member =>
            member.id === memberId
                ? { ...member, status: (member.status === "active" ? "inactive" : "active") as "active" | "inactive" }
                : member
        );

        setMembers(updatedMembers);

        // Update original mock data
        const memberIndex = mockMembers.findIndex(m => m.id === memberId);
        if (memberIndex !== -1) {
            const updatedMember = updatedMembers.find(m => m.id === memberId);
            if (updatedMember) {
                mockMembers[memberIndex] = updatedMember;
            }
        }
    };

    const handleDeleteMember = (memberId: string) => {
        if (window.confirm("คุณต้องการลบสมาชิกนี้หรือไม่?")) {
            const updatedMembers = members.filter(member => member.id !== memberId);
            setMembers(updatedMembers);

            // Update original mock data
            const memberIndex = mockMembers.findIndex(m => m.id === memberId);
            if (memberIndex !== -1) {
                mockMembers.splice(memberIndex, 1);
            }
        }
    };    // Handle opening edit dialog with selected member
    const handleEditMember = (member: Member) => {
        setSelectedMember(member);
        setShowEditDialog(true);
        // Clear any existing messages
        setSuccessMessage("");
        setErrorMessage("");
    };

    // Handle updating member data
    const handleUpdateMember = async (updatedMember: EditMemberForm): Promise<{ success: boolean; message?: string }> => {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Check for duplicate email (excluding current member)
            const duplicateEmail = members.find(m =>
                m.id !== updatedMember.id &&
                m.email.toLowerCase() === updatedMember.email.toLowerCase()
            );
            if (duplicateEmail) {
                return {
                    success: false,
                    message: 'อีเมลนี้มีการใช้งานแล้วโดยสมาชิกคนอื่น'
                };
            }

            // Check for duplicate phone (excluding current member)
            const duplicatePhone = members.find(m =>
                m.id !== updatedMember.id &&
                m.phone === updatedMember.phone
            );
            if (duplicatePhone) {
                return {
                    success: false,
                    message: 'เบอร์โทรศัพท์นี้มีการใช้งานแล้วโดยสมาชิกคนอื่น'
                };
            }

            // Use the new function to update member and user account
            const result = updateMemberWithUser(updatedMember.id, {
                name: updatedMember.name,
                email: updatedMember.email,
                phone: updatedMember.phone
            });

            if (result.success) {
                // Update local state
                const updatedMembers = members.map(member =>
                    member.id === updatedMember.id ? result.member! : member
                );

                setMembers(updatedMembers);
                setShowEditDialog(false);
                setSelectedMember(null);
                setSuccessMessage("อัพเดทข้อมูลสมาชิกและบัญชีผู้ใช้เรียบร้อยแล้ว");
                setErrorMessage("");

                // Clear success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage("");
                }, 5000);

                return { success: true };
            } else {
                return {
                    success: false,
                    message: result.error || 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล'
                };
            }
        } catch (error) {
            console.error("Error updating member:", error);
            return {
                success: false,
                message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์'
            };
        }
    };

    // Handle closing edit dialog
    const handleCloseEditDialog = () => {
        setShowEditDialog(false);
        setSelectedMember(null);
        // Don't clear success/error messages here as they should persist after dialog closes
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setRoleFilter("all");
        setStatusFilter("all");
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{t("page.members.title")}</h1>
                            <p className="text-gray-600">
                                {t("page.members.subtitle")
                                    .replace("{count}", members.length.toString())
                                    .replace("{active}", members.filter(m => m.status === "active").length.toString())}
                            </p>
                        </div>
                        <button
                            onClick={handleOpenAddDialog}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {t("button.add.member")}
                        </button>
                    </div>

                    {/* Success/Error Messages */}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{successMessage}</span>
                            </div>
                            <button
                                onClick={() => setSuccessMessage("")}
                                className="text-green-600 hover:text-green-800 ml-4"
                                aria-label="ปิดข้อความ"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{errorMessage}</span>
                            </div>
                            <button
                                onClick={() => setErrorMessage("")}
                                className="text-red-600 hover:text-red-800 ml-4"
                                aria-label="ปิดข้อความ"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

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
                        onEditMember={handleEditMember}
                        currentUserType={user?.role === "admin" || user?.role === "librarian" ? user.role : "librarian"}
                    />

                    {/* Add Member Dialog */}
                    <AddMemberDialog
                        isOpen={showAddDialog}
                        onClose={() => setShowAddDialog(false)}
                        onAddMember={handleAddMember}
                        newMemberForm={newMemberForm}
                        setNewMemberForm={setNewMemberForm}
                        userRole={user?.role || 'member'}
                    />

                    {/* Edit Member Dialog */}
                    <EditMemberDialog
                        isOpen={showEditDialog}
                        onClose={handleCloseEditDialog}
                        onUpdateMember={handleUpdateMember}
                        member={selectedMember}
                        existingMembers={members}
                    />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
