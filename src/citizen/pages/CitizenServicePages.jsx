import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { ArrowRight, Calendar3, CheckCircle, Clock, FileText, GeoAlt, ShieldCheck, Telephone } from 'react-bootstrap-icons';
import { citizenReceptionSchedule, publicServices } from '../data/citizenMockDb';
import { PageHero, SectionHeading } from '../components/CitizenPrimitives';

const serviceIcons = [FileText, ShieldCheck, CheckCircle, Clock];

export function PublicServicesPage() {
  return <>
    <PageHero eyebrow="Dịch vụ công" title="Thực hiện việc cần thiết, theo cách đơn giản" description="Chọn một dịch vụ để xem hướng dẫn rõ ràng trước khi nộp hồ sơ hoặc đến Bộ phận Một cửa." />
    <section className="citizen-section citizen-section-soft">
      <div className="citizen-container">
        <SectionHeading eyebrow="Dành cho người dân" title="Dịch vụ trực tuyến" description="Các lựa chọn thường dùng được trình bày ngắn gọn để bạn dễ bắt đầu." />
        <Row className="g-3">
          {publicServices.map((service, index) => {
            const Icon = serviceIcons[index];
            return (
              <Col md={3} sm={6} key={service.id}>
                <Card as={Link} to={service.to} className="citizen-service-card text-decoration-none text-dark h-100">
                  <Card.Body className="d-flex flex-column">
                    <span className="citizen-service-icon"><Icon size={25} /></span>
                    <h2 className="h5 mt-3 mb-2">{service.title}</h2>
                    <p className="text-muted small">{service.description}</p>
                    <span className="citizen-text-link mt-auto pt-3">{service.action} <ArrowRight size={16} /></span>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </section>
    <section className="citizen-section">
      <div className="citizen-container citizen-guidance-panel">
        <div>
          <p className="citizen-eyebrow">Cần bắt đầu từ đâu?</p>
          <h2>Chuẩn bị hồ sơ trước, tiết kiệm thời gian sau</h2>
          <p className="text-muted">Hãy xem thành phần hồ sơ và thời hạn giải quyết của từng thủ tục. Nếu cần hỗ trợ, Bộ phận Một cửa luôn sẵn sàng hướng dẫn.</p>
        </div>
        <Button as={Link} to="/cong-dong/thu-tuc" variant="primary" className="d-inline-flex align-items-center gap-2">
          Xem thủ tục hành chính <ArrowRight size={17} />
        </Button>
      </div>
    </section>
  </>;
}

export function ReceptionSchedulePage() {
  return <>
    <section className="schedule-page">
      <div className="schedule-hero">
        <div className="citizen-container">
          <h1>Lịch <em>tiếp công dân</em></h1>
          <p>Người dân có thể đến đúng khung giờ để được hướng dẫn, trao đổi và gửi ý kiến trực tiếp.</p>
        </div>
      </div>

      <div className="citizen-container">
        <Row className="sch-layout g-4">
          <Col lg={8}>
            <h2>Lịch trong tuần</h2>
            <div className="sch-list">
              {citizenReceptionSchedule.map((schedule) => (
                <div key={schedule.day} className="sch-item">
                  <div className="sch-day">
                    <Calendar3 size={20} />
                    <div>
                      <strong>{schedule.day}</strong>
                      <span>{schedule.time}</span>
                    </div>
                  </div>
                  <div className="sch-info">
                    <strong>{schedule.host}</strong>
                    <p><GeoAlt size={14} /> {schedule.place}</p>
                  </div>
                  <div className="sch-status">
                    <span className="sch-status-dot" />
                    <span>Đang áp dụng</span>
                  </div>
                </div>
              ))}
            </div>
          </Col>

          <Col lg={4}>
            <div className="sch-sidebar">
              <Card className="sch-card mb-3">
                <Card.Body>
                  <div className="sch-card-head">
                    <Telephone size={20} />
                    <h3>Đặt lịch trao đổi</h3>
                  </div>
                  <p className="text-muted small">Nếu nội dung cần trao đổi nhiều, hãy liên hệ trước để được sắp xếp thời gian phù hợp.</p>
                  <Button as="a" href="tel:(028)38961234" variant="primary" className="w-100">Gọi Bộ phận Một cửa</Button>
                </Card.Body>
              </Card>
              <Card className="sch-card sch-note">
                <Card.Body>
                  <div className="sch-card-head">
                    <FileText size={20} />
                    <h3>Lưu ý</h3>
                  </div>
                  <p className="text-muted small">Vui lòng mang theo CCCD và các giấy tờ liên quan để việc trao đổi được thuận tiện.</p>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  </>;
}

export function CitizenGuidePage() {
  const steps = ['Chọn thủ tục hoặc dịch vụ phù hợp', 'Đọc kỹ thành phần hồ sơ và thời hạn xử lý', 'Nộp trực tuyến hoặc đến Bộ phận Một cửa', 'Lưu mã phản ánh hoặc giấy hẹn để tra cứu'];
  return <>
    <PageHero eyebrow="Hướng dẫn sử dụng" title="Dễ tìm, dễ gửi, dễ theo dõi" description="Cổng thông tin được thiết kế để mọi người dân đều có thể sử dụng nhanh chóng." />
    <section className="citizen-section citizen-section-soft">
      <div className="citizen-container">
        <SectionHeading title="4 bước để sử dụng cổng thông tin" />
        <Row className="citizen-guide-steps g-3">
          {steps.map((step, index) => (
            <Col md={3} sm={6} key={step}>
              <div>
                <span>{index + 1}</span>
                <h2 className="h6 mt-3">{step}</h2>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  </>;
}
