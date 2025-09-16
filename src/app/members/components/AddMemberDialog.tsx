interface NewMemberForm {
    name: string;
    email: string;
    phone: string;
    role: "librarian" | "member";
    username?: string;
    password?: string;
}

interface AddMemberDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAddMember: () => void;
    currentUserType: "admin" | "librarian";
    newMemberForm: NewMemberForm;
    setNewMemberForm: (form: NewMemberForm) => void;
}

export default function AddMemberDialog({
    isOpen,
    onClose,
    onAddMember,
    currentUserType,
    newMemberForm,
    setNewMemberForm
}: AddMemberDialogProps) {
    if (!isOpen) return null;

    // Generate username and password for librarian
    const generateCredentials = () => {
        const username = newMemberForm.email.split('@')[0] + '_lib';
        const password = Math.random().toString(36).slice(-8);
        return { username, password };
    };

    // Auto-generate credentials when role changes to librarian
    const handleRoleChange = (role: "librarian" | "member") => {
        if (role === "librarian") {
            const { username, password } = generateCredentials();
            setNewMemberForm({
                ...newMemberForm,
                role,
                username,
                password
            });
        } else {
            setNewMemberForm({
                ...newMemberForm,
                role,
                username: undefined,
                password: undefined
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">เพิ่มสมาชิกใหม่</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ชื่อ-สกุล
                        </label>
                        <input
                            type="text"
                            value={newMemberForm.name}
                            onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="กรอกชื่อ-สกุล"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            อีเมล
                        </label>
                        <input
                            type="email"
                            value={newMemberForm.email}
                            onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="กรอกอีเมล"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            เบอร์โทรศัพท์
                        </label>
                        <input
                            type="tel"
                            value={newMemberForm.phone}
                            onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="กรอกเบอร์โทรศัพท์"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            บทบาท
                        </label>
                        <select
                            value={newMemberForm.role}
                            onChange={(e) => handleRoleChange(e.target.value as "librarian" | "member")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="member">สมาชิก</option>
                            {currentUserType === "admin" && (
                                <option value="librarian">บรรณารักษ์</option>
                            )}
                        </select>
                        {currentUserType === "librarian" && (
                            <p className="text-sm text-gray-500 mt-1">
                                บรรณารักษ์สามารถเพิ่มเฉพาะสมาชิกธรรมดาเท่านั้น
                            </p>
                        )}
                    </div>

                    {/* Show credentials for librarian */}
                    {newMemberForm.role === "librarian" && newMemberForm.username && newMemberForm.password && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-yellow-800 mb-2">ข้อมูลการเข้าสู่ระบบ (สำหรับบรรณารักษ์)</h4>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-xs font-medium text-yellow-700">Username:</label>
                                    <input
                                        type="text"
                                        value={newMemberForm.username}
                                        onChange={(e) => setNewMemberForm({ ...newMemberForm, username: e.target.value })}
                                        className="w-full px-2 py-1 text-sm border border-yellow-300 rounded bg-yellow-50 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-yellow-700">Password:</label>
                                    <input
                                        type="text"
                                        value={newMemberForm.password}
                                        onChange={(e) => setNewMemberForm({ ...newMemberForm, password: e.target.value })}
                                        className="w-full px-2 py-1 text-sm border border-yellow-300 rounded bg-yellow-50 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const { username, password } = generateCredentials();
                                        setNewMemberForm({ ...newMemberForm, username, password });
                                    }}
                                    className="text-xs text-yellow-700 hover:text-yellow-800 underline"
                                >
                                    สร้างข้อมูลใหม่
                                </button>
                            </div>
                            <p className="text-xs text-yellow-600 mt-2">
                                โปรดบันทึกข้อมูลนี้เพื่อให้กับบรรณารักษ์ใหม่
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={onAddMember}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        เพิ่มสมาชิก
                    </button>
                </div>
            </div>
        </div>
    );
}
