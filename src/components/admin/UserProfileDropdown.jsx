import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, User, Lock, ChevronDown, Key } from 'lucide-react';
import { logout } from '../../features/auth/authSlice';
import { fetchMyProfile } from '../../features/userProfile/userProfileThunks';
import { selectProfile, selectLoading } from '../../features/userProfile/userProfileSelectors';
import { clearProfile } from '../../features/userProfile/userProfileSlice';
import { AUTH_API } from '../../apis/auth';
import UserProfileModal from './UserProfileModal';
import TwoFactorToggleModal from '../twoFactor/TwoFactorToggleModal';
import TwoFactorOTPModal from '../twoFactor/TwoFactorOTPModal';
import ChangePasswordModal from './ChangePasswordModal';

const UserProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [is2FAToggleModalOpen, setIs2FAToggleModalOpen] = useState(false);
    const [is2FAOTPModalOpen, setIs2FAOTPModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [is2FALoading, setIs2FALoading] = useState(false);
    const dropdownRef = useRef(null);

    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const loading = useSelector(selectLoading);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!profile) {
            dispatch(fetchMyProfile());
        }
    }, [dispatch, profile]);

    const handleViewProfile = () => {
        setIsOpen(false);
        setIsProfileModalOpen(true);
        if (!profile) {
            dispatch(fetchMyProfile());
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await AUTH_API.logout();
        } catch (error) {
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            dispatch(logout());
            dispatch(clearProfile());
            setIsLoggingOut(false);
            setIsOpen(false);
        }
    };

    const handleOpen2FAToggle = () => {
        setIsOpen(false);
        setIs2FAToggleModalOpen(true);
    };

    const handleOpenChangePassword = () => {
        setIsOpen(false);
        setIsChangePasswordModalOpen(true);
    };

    const handle2FAToggle = async () => {
        setIs2FALoading(true);
        try {
            await AUTH_API.enableOrDisable2FA();
            setIs2FAToggleModalOpen(false);
            setIs2FAOTPModalOpen(true);
        } catch (error) {
            throw error;
        } finally {
            setIs2FALoading(false);
        }
    };

    const handle2FAOTPVerify = async (otp) => {
        setIs2FALoading(true);
        try {
            const result = await AUTH_API.verifiedStatus2FA(otp);
            
            await dispatch(fetchMyProfile());
            
            setIs2FAOTPModalOpen(false);
        } catch (error) {
            throw error;
        } finally {
            setIs2FALoading(false);
        }
    };

    const userName = profile?.hoVaTen || profile?.tenDangNhap || 'Quản trị viên';
    const userInitial = userName.charAt(0).toUpperCase();
    const twoFactorStatus = profile?.xacThucHaiYeuTo ? 'Đã bật' : 'Chưa bật';

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 md:gap-3 hover:bg-gray-100 rounded-lg px-2 md:px-3 py-1.5 transition-colors"
                >
                    <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs md:text-sm font-medium">{userInitial}</span>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-xs md:text-sm font-medium text-gray-700 truncate">{userName}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                            <p className="text-xs font-medium text-gray-600">Tài khoản</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">{profile?.tenDangNhap || userName}</p>
                            <p className="text-xs text-gray-500 truncate">{profile?.email || '-'}</p>
                        </div>

                        <div className="py-2">
                            <button
                                onClick={handleViewProfile}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 text-sm"
                            >
                                <User className="w-4 h-4 text-gray-600" />
                                <span>Hồ sơ</span>
                            </button>

                            <button
                                onClick={handleOpen2FAToggle}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 text-sm"
                            >
                                <Lock className="w-4 h-4 text-gray-600" />
                                <div className="flex items-center justify-between flex-1">
                                    <span>Xác thực 2FA</span>
                                    <span className={`text-xs font-medium ${profile?.xacThucHaiYeuTo ? 'text-green-600' : 'text-gray-500'}`}>
                                        {twoFactorStatus}
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={handleOpenChangePassword}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700 text-sm"
                            >
                                <Key className="w-4 h-4 text-gray-600" />
                                <span>Đổi mật khẩu</span>
                            </button>

                            <div className="my-2 border-t border-gray-200"></div>

                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>{isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <UserProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                profile={profile}
                loading={loading}
            />

            <TwoFactorToggleModal
                isOpen={is2FAToggleModalOpen}
                onClose={() => setIs2FAToggleModalOpen(false)}
                currentStatus={profile?.xacThucHaiYeuTo}
                onToggle={handle2FAToggle}
                isLoading={is2FALoading}
            />

            <TwoFactorOTPModal
                isOpen={is2FAOTPModalOpen}
                onClose={() => setIs2FAOTPModalOpen(false)}
                onVerify={handle2FAOTPVerify}
                isLoading={is2FALoading}
                action={profile?.xacThucHaiYeuTo ? 'tắt' : 'bật'}
            />

            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={() => setIsChangePasswordModalOpen(false)}
            />
        </>
    );
};

export default UserProfileDropdown;