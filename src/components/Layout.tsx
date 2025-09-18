"use client";

import { ReactNode } from "react";
import Sidebar, { SidebarItem, adminSidebarItems, librarianSidebarItems, memberSidebarItems } from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SessionStatus } from "./SessionStatus";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
    children: ReactNode;
    sidebarItems?: SidebarItem[];
    title?: string;
    username?: string;
    userRole?: string;
    showSidebar?: boolean;
    showFooter?: boolean;
    className?: string;
}

export default function Layout({
    children,
    sidebarItems = [],
    title = "ระบบจัดการห้องสมุด",
    username = "Admin",
    userRole = "ผู้ดูแลระบบ",
    showSidebar = true,
    showFooter = true,
    className = "",
}: LayoutProps) {
    const { isCollapsed, toggleCollapse } = useSidebarCollapse(false);

    return (
        <div className={`min-h-screen bg-gray-100 flex flex-col ${className}`}>
            {/* Navbar - Always at top */}
            <Navbar
                username={username}
                userRole={userRole}
                title={title}
                onToggleSidebar={showSidebar ? toggleCollapse : undefined}
            />

            {/* Main Layout Container */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Conditionally rendered */}
                {showSidebar && sidebarItems.length > 0 && (
                    <Sidebar
                        items={sidebarItems}
                        isCollapsed={isCollapsed}
                    />
                )}

                {/* Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Session Status Warning */}
                    <SessionStatus className="mx-6 mt-2" />

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>

                    {/* Footer - Always at bottom */}
                    {showFooter && <Footer />}
                </div>
            </div>
        </div>
    );
}

// Pre-configured layout variants for different user roles
interface DashboardLayoutProps extends Omit<LayoutProps, 'sidebarItems' | 'username' | 'userRole'> {
    userType?: 'admin' | 'librarian' | 'member'; // Optional for backward compatibility
}

export function DashboardLayout({ userType, ...props }: DashboardLayoutProps) {
    const { user } = useAuth();

    // Use authentication context data if available, fallback to userType prop
    const currentUserType = user?.role || userType || 'admin';
    const currentUsername = user?.displayName || user?.username || 'User';
    const currentUserRole = user ? getRoleDisplayName(user.role) : (
        currentUserType === 'admin' ? 'ผู้ดูแลระบบ' :
            currentUserType === 'librarian' ? 'บรรณารักษ์' : 'สมาชิก'
    );

    // Import sidebar items based on user type
    const getSidebarItems = () => {
        switch (currentUserType) {
            case 'admin':
                return adminSidebarItems;
            case 'librarian':
                return librarianSidebarItems;
            case 'member':
                return memberSidebarItems;
            default:
                return [];
        }
    };

    return (
        <Layout
            sidebarItems={getSidebarItems()}
            username={currentUsername}
            userRole={currentUserRole}
            {...props}
        />
    );
}

// Helper function to get Thai display names for roles
function getRoleDisplayName(role: string): string {
    switch (role) {
        case 'admin':
            return 'ผู้ดูแลระบบ';
        case 'librarian':
            return 'บรรณารักษ์';
        default:
            return role;
    }
}

// Simple layout without sidebar for public pages
export function PublicLayout({ children, showFooter = true, ...props }: Omit<LayoutProps, 'sidebarItems' | 'showSidebar'>) {
    return (
        <Layout
            sidebarItems={[]}
            showSidebar={false}
            showFooter={showFooter}
            {...props}
        >
            {children}
        </Layout>
    );
}

// Full-width layout without sidebar and footer
export function FullscreenLayout({ children, ...props }: Omit<LayoutProps, 'sidebarItems' | 'showSidebar' | 'showFooter'>) {
    return (
        <Layout
            sidebarItems={[]}
            showSidebar={false}
            showFooter={false}
            {...props}
        >
            {children}
        </Layout>
    );
}