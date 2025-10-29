
import React, { useState } from 'react';
import { sendOtpApi } from '../apis/auth'; 

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Vui lòng nhập địa chỉ email.');
            return;
        }

        try {
            await sendOtpApi(email);  
            setSuccess(true);
            setError('');
        } catch (err) {
            setError('Đã xảy ra lỗi khi gửi OTP.');
        }
    };

    return (
        <div className="forgot-password-page">
            <h2>Quên mật khẩu?</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Gửi OTP</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>OTP đã được gửi thành công!</p>}
        </div>
    );
};

export default ForgotPasswordPage;
