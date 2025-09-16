interface NavbarProps {
  username?: string;
  userRole?: string;
  title?: string;
  onToggleSidebar?: () => void;
}

export default function Navbar({
  username = "Admin",
  userRole = "ผู้ดูแลระบบ",
  title,
  onToggleSidebar,
}: NavbarProps) {

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="mr-4 p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="text-xl font-semibold text-gray-900">
          {title || "ระบบจัดการห้องสมุด"}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{username}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
}
