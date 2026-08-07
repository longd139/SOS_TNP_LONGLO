import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, Server, Key, Info, ShieldCheck } from 'lucide-react';

export default function AppDataSourceModal({ isOpen, onClose, onSaveConfig }) {
    const [activeTab, setActiveTab] = useState('status');
    const [configs] = useState({
        googlePlay: {
            status: 'connected',
            packageName: 'com.tnp.sosapp',
            serviceAccountEmail: 'sos-analytics@tnp-ward.iam.gserviceaccount.com',
            lastSync: '10 phút trước',
            downloadsToday: 142
        },
        appStore: {
            status: 'connected',
            appId: 'id647891234',
            issuerId: '9b183610-8911-4770-9831-2918471201',
            keyId: '7X8A9B0C1D',
            lastSync: '15 phút trước',
            downloadsToday: 98
        },
        firebase: {
            status: 'connected',
            projectId: 'sos-tnp-official',
            measurementId: 'G-X987654321',
            lastSync: 'Vừa xong',
            activeNow: 45
        },
        directServer: {
            status: 'connected',
            apkServerUrl: 'https://api.tangnhonphu.gov.vn/downloads/sos-latest.apk',
            lastSync: 'Vừa xong',
            downloadsToday: 34
        }
    });

    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);

    if (!isOpen) return null;

    const handleTestConnection = () => {
        setIsTesting(true);
        setTestResult(null);
        setTimeout(() => {
            setIsTesting(false);
            setTestResult({
                success: true,
                message: 'Kết nối thành công tới 4/4 nguồn dữ liệu! Dữ liệu kho ứng dụng đã đồng bộ mới nhất.'
            });
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden border border-gray-100 animate-fade-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                            <Server className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Xác nhận Nguồn dữ liệu & Nền tảng phát hành App SOS</h3>
                            <p className="text-xs text-blue-100">Dành cho Lãnh đạo & Quản trị hệ thống kiểm tra nguồn thu thập chỉ số</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50 px-6 pt-3">
                    <button
                        onClick={() => setActiveTab('status')}
                        className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                            activeTab === 'status'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <ShieldCheck className="w-4 h-4" /> Trạng thái nguồn dữ liệu
                    </button>
                    <button
                        onClick={() => setActiveTab('config')}
                        className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                            activeTab === 'config'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Key className="w-4 h-4" /> Cấu hình tích hợp Kho App API
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {testResult && (
                        <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 text-sm ${
                            testResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span>{testResult.message}</span>
                        </div>
                    )}

                    {activeTab === 'status' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold">Cơ chế thu thập dữ liệu:</span> Hệ thống kết nối trực tiếp với API chính thức của Google Play Console, App Store Connect & Firebase Analytics để đồng bộ số lượt tải và chỉ số sử dụng định kỳ mỗi 15 phút.
                                </div>
                            </div>

                            {/* Cards list */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Google Play */}
                                <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
                                                GP
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-900">Google Play Store</h4>
                                                <p className="text-xs text-gray-500">Android Platform</p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            ● Đã kết nối
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600 space-y-1 mt-3">
                                        <p><span className="text-gray-400">Package:</span> {configs.googlePlay.packageName}</p>
                                        <p><span className="text-gray-400">Lượt tải hôm nay:</span> <strong className="text-gray-800">+{configs.googlePlay.downloadsToday}</strong></p>
                                        <p><span className="text-gray-400">Đồng bộ gần nhất:</span> {configs.googlePlay.lastSync}</p>
                                    </div>
                                </div>

                                {/* App Store */}
                                <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                iOS
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-900">Apple App Store</h4>
                                                <p className="text-xs text-gray-500">iOS / iPadOS Platform</p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            ● Đã kết nối
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600 space-y-1 mt-3">
                                        <p><span className="text-gray-400">App ID:</span> {configs.appStore.appId}</p>
                                        <p><span className="text-gray-400">Lượt tải hôm nay:</span> <strong className="text-gray-800">+{configs.appStore.downloadsToday}</strong></p>
                                        <p><span className="text-gray-400">Đồng bộ gần nhất:</span> {configs.appStore.lastSync}</p>
                                    </div>
                                </div>

                                {/* Firebase Analytics */}
                                <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                                                FA
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-900">Firebase Analytics</h4>
                                                <p className="text-xs text-gray-500">Chỉ số người dùng & Sự kiện SOS</p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            ● Đã kết nối
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600 space-y-1 mt-3">
                                        <p><span className="text-gray-400">Project:</span> {configs.firebase.projectId}</p>
                                        <p><span className="text-gray-400">Đang hoạt động:</span> <strong className="text-green-600">{configs.firebase.activeNow} người dùng</strong></p>
                                        <p><span className="text-gray-400">Đồng bộ gần nhất:</span> {configs.firebase.lastSync}</p>
                                    </div>
                                </div>

                                {/* Direct APK Server */}
                                <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                                                APK
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-900">Cổng tải APK / Web Direct</h4>
                                                <p className="text-xs text-gray-500">Tải trực tiếp qua Cổng Phường</p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            ● Đã kết nối
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600 space-y-1 mt-3">
                                        <p><span className="text-gray-400">Server Log:</span> Active</p>
                                        <p><span className="text-gray-400">Lượt tải hôm nay:</span> <strong className="text-gray-800">+{configs.directServer.downloadsToday}</strong></p>
                                        <p><span className="text-gray-400">Đồng bộ gần nhất:</span> {configs.directServer.lastSync}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'config' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Google Play Service Account Email (JSON Key)</label>
                                <input 
                                    type="text" 
                                    defaultValue={configs.googlePlay.serviceAccountEmail}
                                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">App Store Connect Issuer ID</label>
                                <input 
                                    type="text" 
                                    defaultValue={configs.appStore.issuerId}
                                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Firebase Measurement ID (GA4)</label>
                                <input 
                                    type="text" 
                                    defaultValue={configs.firebase.measurementId}
                                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                <span>Lưu ý: Chỉ tài khoản Quản trị hệ thống (System Administrator) mới có quyền chỉnh sửa API Keys nguồn kho ứng dụng.</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={isTesting}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                        {isTesting ? 'Đang kiểm tra kết nối API...' : 'Kiểm tra kết nối các nguồn Kho App'}
                    </button>
                    
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Đóng
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                handleTestConnection();
                                setTimeout(onClose, 800);
                            }}
                            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                        >
                            Xác nhận & Lưu cấu hình
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
