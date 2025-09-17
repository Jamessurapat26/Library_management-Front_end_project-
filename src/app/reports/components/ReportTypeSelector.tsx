interface ReportType {
    id: string;
    name: string;
    icon: string;
}

interface ReportTypeSelectorProps {
    reportTypes: ReportType[];
    selectedReport: string;
    onSelectReport: (reportId: string) => void;
}

export default function ReportTypeSelector({ reportTypes, selectedReport, onSelectReport }: ReportTypeSelectorProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {reportTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => onSelectReport(type.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${selectedReport === type.id
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="font-medium">{type.name}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
