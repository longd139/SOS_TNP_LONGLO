import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Phone, ShieldCheck } from 'lucide-react';
import '../../styles/citizen-login.css';

export default function CitizenLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmit = (event) => { event.preventDefault(); setMessage(/^0\d{9}$/.test(phone) && password.length >= 6 ? 'Đăng nhập mô phỏng thành công.' : 'Vui lòng kiểm tra số điện thoại và mật khẩu.'); };
  return <section className="citizen-login-page"><div className="citizen-login-card"><div className="citizen-login-mark"><ShieldCheck size={30} /></div><p className="citizen-eyebrow">Khu vực người dân</p><h1>Đăng nhập tài khoản</h1><p className="citizen-login-description">Đăng nhập để quản lý thông tin cá nhân và theo dõi các phản ánh đã gửi.</p><form onSubmit={handleSubmit} noValidate><label className="form-field"><span>Số điện thoại</span><div className="citizen-input-with-icon"><Phone size={18} /><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Ví dụ: 0901234567" inputMode="tel" /></div></label><label className="form-field"><span>Mật khẩu</span><div className="citizen-input-with-icon"><LockKeyhole size={18} /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nhập mật khẩu" /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>{message && <p className="citizen-login-message">{message}</p>}<button className="citizen-button citizen-button-primary full-width" type="submit">Đăng nhập</button></form><p className="citizen-login-note">Đây là màn hình mô phỏng, chưa kết nối hệ thống tài khoản.</p></div></section>;
}
