import { useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function Login() {
    const [twoFA, setTwoFA] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-[380px] text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <ShieldCheck className="text-blue-600 w-8 h-8" />
                    </div>
                </div>

                <h1 className="text-lg font-semibold">Cổng quản trị viên</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Ứng dụng công dân Phường Tăng Nhơn Phú
                </p>

                <form className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập tên đăng nhập"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="2fa"
                            type="checkbox"
                            checked={twoFA}
                            onChange={(e) => setTwoFA(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="2fa" className="text-sm text-gray-700">
                            Bật xác thực 2 yếu tố (2FA)
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Đăng nhập
                    </button>

                    <div className="text-center mt-2">
                        <a href="#" className="text-sm text-blue-600 hover:underline">
                            Quên mật khẩu?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
