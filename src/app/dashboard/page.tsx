import { DashboardLayout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardHeader, StatsCards, QuickActions, Announcements } from "./components";

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <DashboardHeader />
                <StatsCards />
                <QuickActions />
                <Announcements />
            </DashboardLayout>
        </ProtectedRoute>
    );
}
