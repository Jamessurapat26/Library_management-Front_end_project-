import { DashboardLayout } from "@/components/Layout";
import { DashboardHeader, StatsCards, RecentActivities } from "./components";

export default function DashboardPage() {
    return (
        <DashboardLayout userType="admin" username="Admin" userRole="ผู้ดูแลระบบ">
            <DashboardHeader />
            <StatsCards />
            <RecentActivities />
        </DashboardLayout>
    );
}
