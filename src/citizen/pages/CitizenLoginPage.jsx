import React, { useState } from 'react';
import { Button, Card, Container, Form, InputGroup } from 'react-bootstrap';
import { Eye, EyeSlash, Lock, ShieldCheck, Telephone } from 'react-bootstrap-icons';
import '../../styles/citizen-login.css';

export default function CitizenLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmit = (event) => { event.preventDefault(); setMessage(/^0\d{9}$/.test(phone) && password.length >= 6 ? 'Đăng nhập mô phỏng thành công.' : 'Vui lòng kiểm tra số điện thoại và mật khẩu.'); };

  return (
    <section className="citizen-login-page">
      <Card className="citizen-login-card">
        <Card.Body className="text-center">
          <div className="citizen-login-mark">
            <ShieldCheck size={30} />
          </div>
          <p className="citizen-eyebrow">Khu vực người dân</p>
          <h1>Đăng nhập tài khoản</h1>
          <p className="citizen-login-description">Đăng nhập để quản lý thông tin cá nhân và theo dõi các phản ánh đã gửi.</p>

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="form-field text-start mb-3">
              <Form.Label><span>Số điện thoại</span></Form.Label>
              <InputGroup className="citizen-input-with-icon">
                <InputGroup.Text className="border-0 bg-transparent pe-0">
                  <Telephone size={18} />
                </InputGroup.Text>
                <Form.Control
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Ví dụ: 0901234567"
                  inputMode="tel"
                  className="border-0 shadow-none"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="form-field text-start mb-3">
              <Form.Label><span>Mật khẩu</span></Form.Label>
              <InputGroup className="citizen-input-with-icon">
                <InputGroup.Text className="border-0 bg-transparent pe-0">
                  <Lock size={18} />
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="border-0 shadow-none"
                />
                <Button
                  variant="link"
                  className="border-0 text-muted"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </Button>
              </InputGroup>
            </Form.Group>

            {message && <p className="citizen-login-message">{message}</p>}

            <Button variant="primary" type="submit" className="w-100 citizen-button">
              Đăng nhập
            </Button>
          </Form>

          <p className="citizen-login-note mt-3">Đây là màn hình mô phỏng, chưa kết nối hệ thống tài khoản.</p>
        </Card.Body>
      </Card>
    </section>
  );
}
