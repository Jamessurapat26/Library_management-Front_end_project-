export default function LoginPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
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
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              ระบบจัดการห้องสมุด
            </h2>
            <p className="mt-2 text-gray-600">เข้าสู่ระบบเพื่อใช้งาน</p>
          </div>

          {/* Login Form */}
          <form className="space-y-6">
            {/* Error Message - Hidden by default, can be shown for demo */}
            {false && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
              </div>
            )}

            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ชื่อผู้ใช้
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-600 text-gray-900"
                placeholder="กรอกชื่อผู้ใช้"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors placeholder:text-gray-600 text-gray-900"
                placeholder="กรอกรหัสผ่าน"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  จดจำการเข้าสู่ระบบ
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                ลืมรหัสผ่าน?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center font-medium mb-2">
              บัญชีทดสอบ:
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>
                <strong>ผู้ดูแล:</strong> admin / password
              </p>
              <p>
                <strong>บรรณารักษ์:</strong> librarian / password123
              </p>
              <p>
                <strong>สมาชิก:</strong> member / member123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
