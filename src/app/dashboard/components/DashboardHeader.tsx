interface DashboardHeaderProps {
    title?: string;
    subtitle?: string;
}

export default function DashboardHeader({
    title = "แดชบอร์ด",
    subtitle = "ภาพรวมของระบบจัดการห้องสมุด"
}: DashboardHeaderProps) {
    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
        </div>
    );
}
