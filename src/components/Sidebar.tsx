"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string | number;
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  className?: string;
  isCollapsed?: boolean;
}

export default function Sidebar({
  items,
  className = "",
  isCollapsed = false,
}: SidebarProps) {
  const pathname = usePathname();

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    // Check if current path matches item href or any child href
    const isActive = pathname === item.href ||
      (hasChildren && item.children?.some(child => pathname === child.href));
    const isParentActive = isActive ||
      (hasChildren && item.children?.some(child => pathname === child.href));

    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <Link href={item.href}>
            <div
              className={`group flex items-center justify-between text-sm font-medium rounded-lg transition-colors cursor-pointer
                ${level > 0 ? "ml-4" : ""}
                ${isCollapsed ? "px-2 py-2" : "px-3 py-2"}
                ${isParentActive
                  ? "bg-indigo-100 text-indigo-700 border-r-2 border-indigo-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <div
                className={`flex items-center ${isCollapsed ? "justify-center w-full" : ""}`}
              >
                <div
                  className={`${isCollapsed ? "" : "mr-3"} flex-shrink-0 ${isParentActive ? "text-indigo-600" : "text-gray-500"
                    }`}
                >
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <>
                    <span className="truncate ml-3">{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </div>
              {!isCollapsed && (
                <svg
                  className={`w-4 h-4 transition-transform ${isParentActive ? "rotate-90" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </div>
          </Link>

          {/* Render children */}
          {!isCollapsed && isParentActive && (
            <div className="mt-1 space-y-1">
              {item.children!.map((child) =>
                renderSidebarItem(child, level + 1),
              )}
            </div>
          )}
        </div>
      );
    }

    // For items without children, render as link
    const isChildActive = pathname === item.href;
    return (
      <div key={item.id} className="mb-1">
        <Link href={item.href}>
          <div
            className={`group flex items-center text-sm font-medium rounded-lg transition-colors cursor-pointer
              ${level > 0 ? "ml-4" : ""}
              ${isCollapsed ? "px-2 py-2" : "px-3 py-2"}
              ${isChildActive
                ? "bg-indigo-100 text-indigo-700 border-r-2 border-indigo-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <div
              className={`flex items-center w-full ${isCollapsed ? "justify-center" : ""}`}
            >
              <div
                className={`${isCollapsed ? "" : "mr-3"} flex-shrink-0 ${isChildActive ? "text-indigo-600" : "text-gray-500"
                  }`}
              >
                {item.icon}
              </div>
              {!isCollapsed && (
                <>
                  <span className="truncate ml-3">{item.label}</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div
      className={`bg-white shadow-sm border-r border-gray-200 transition-all duration-300 flex flex-col min-h-full ${isCollapsed ? "w-16" : "w-64"
        } ${className}`}
    >
      {/* Navigation */}
      <nav className="p-4 space-y-1 overflow-y-auto flex-1">
        {items.map((item) => renderSidebarItem(item))}
      </nav>
    </div>
  );
}

// Predefined menu items for different user roles
export const getAdminSidebarItems = (): SidebarItem[] => [
  {
    id: "dashboard",
    label: "แดชบอร์ด",
    href: "/dashboard",
    icon: (
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
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
        />
      </svg>
    ),
  },
  {
    id: "books",
    label: "จัดการหนังสือ",
    href: "/books",
    icon: (
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
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    children: [
      {
        id: "books-list",
        label: "รายการหนังสือ",
        href: "/books",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        ),
      },
      {
        id: "books-add",
        label: "เพิ่มหนังสือใหม่",
        href: "/admin/books/add",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        ),
      },
    ],
  },
  {
    id: "members",
    label: "จัดการสมาชิก",
    href: "/members",
    icon: (
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
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: "transactions",
    label: "การยืม-คืน",
    href: "/transactions",
    badge: "5", // Static badge for UI demo
    icon: (
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
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    id: "reports",
    label: "รายงาน",
    href: "/reports",
    icon: (
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
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "ตั้งค่าระบบ",
    href: "/admin/settings",
    icon: (
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
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export const adminSidebarItems: SidebarItem[] = getAdminSidebarItems();

export const librarianSidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "แดชบอร์ด",
    href: "/librarian/dashboard",
    icon: (
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
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
        />
      </svg>
    ),
  },
  {
    id: "books",
    label: "จัดการหนังสือ",
    href: "/librarian/books",
    icon: (
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
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    id: "borrowing",
    label: "การยืม-คืน",
    href: "/librarian/borrowing",
    badge: "8",
    icon: (
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
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    id: "members",
    label: "ดูข้อมูลสมาชิก",
    href: "/librarian/members",
    icon: (
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
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
];

export const memberSidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "แดชบอร์ด",
    href: "/member/dashboard",
    icon: (
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
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
        />
      </svg>
    ),
  },
  {
    id: "search",
    label: "ค้นหาหนังสือ",
    href: "/member/search",
    icon: (
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
  {
    id: "my-books",
    label: "หนังสือที่ยืม",
    href: "/member/borrowed",
    badge: "3",
    icon: (
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
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    id: "history",
    label: "ประวัติการยืม",
    href: "/member/history",
    icon: (
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "ข้อมูลส่วนตัว",
    href: "/member/profile",
    icon: (
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];
