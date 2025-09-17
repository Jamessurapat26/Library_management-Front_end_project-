import { DashboardLayout } from "@/components/Layout";
import { DashboardHeader, StatsCards, QuickActions, Announcements } from "./components";

export default function DashboardPage() {
    return (
        <DashboardLayout userType="admin" username="Admin" userRole="ผู้ดูแลระบบ">
            <DashboardHeader />
            <StatsCards />
            <QuickActions />
            <Announcements />
        </DashboardLayout>
    );
}
