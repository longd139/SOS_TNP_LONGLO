import React from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, FileText, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { citizenReceptionSchedule, publicServices } from '../data/citizenMockDb';
import { PageHero, SectionHeading } from '../components/CitizenPrimitives';

const serviceIcons = [FileText, ShieldCheck, CheckCircle2, Clock3];

export function PublicServicesPage() {
  return <>
    <PageHero eyebrow="Dịch vụ công" title="Thực hiện việc cần thiết, theo cách đơn giản" description="Chọn một dịch vụ để xem hướng dẫn rõ ràng trước khi nộp hồ sơ hoặc đến Bộ phận Một cửa." />
    <section className="citizen-section citizen-section-soft"><div className="citizen-container">
      <SectionHeading eyebrow="Dành cho người dân" title="Dịch vụ trực tuyến" description="Các lựa chọn thường dùng được trình bày ngắn gọn để bạn dễ bắt đầu." />
      <div className="citizen-service-grid">{publicServices.map((service, index) => {
        const Icon = serviceIcons[index];
        return <Link className="citizen-service-card" to={service.to} key={service.id}><span className="citizen-service-icon"><Icon size={25} /></span><h2>{service.title}</h2><p>{service.description}</p><span className="citizen-card-link">{service.action} <ArrowRight size={16} /></span></Link>;
      })}</div>
    </div></section>
    <section className="citizen-section"><div className="citizen-container citizen-guidance-panel"><div><p className="citizen-eyebrow">Cần bắt đầu từ đâu?</p><h2>Chuẩn bị hồ sơ trước, tiết kiệm thời gian sau</h2><p>Hãy xem thành phần hồ sơ và thời hạn giải quyết của từng thủ tục. Nếu cần hỗ trợ, Bộ phận Một cửa luôn sẵn sàng hướng dẫn.</p></div><Link className="citizen-button citizen-button-primary" to="/cong-dong/thu-tuc">Xem thủ tục hành chính <ArrowRight size={17} /></Link></div></section>
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
        <div className="sch-layout">
          <div className="sch-main">
            <h2>Lịch trong tuần</h2>
            <div className="sch-list">
              {citizenReceptionSchedule.map((schedule) => (
                <div key={schedule.day} className="sch-item">
                  <div className="sch-day">
                    <CalendarDays size={20} />
                    <div>
                      <strong>{schedule.day}</strong>
                      <span>{schedule.time}</span>
                    </div>
                  </div>
                  <div className="sch-info">
                    <strong>{schedule.host}</strong>
                    <p>📍 {schedule.place}</p>
                  </div>
                  <div className="sch-status">
                    <span className="sch-status-dot" />
                    <span>Đang áp dụng</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="sch-sidebar">
            <div className="sch-card">
              <div className="sch-card-head">
                <Phone size={20} />
                <h3>Đặt lịch trao đổi</h3>
              </div>
              <p>Nếu nội dung cần trao đổi nhiều, hãy liên hệ trước để được sắp xếp thời gian phù hợp.</p>
              <a className="citizen-button citizen-button-primary full-width" href="tel:(028)38961234">Gọi Bộ phận Một cửa</a>
            </div>
            <div className="sch-card sch-note">
              <div className="sch-card-head">
                <FileText size={20} />
                <h3>Lưu ý</h3>
              </div>
              <p>Vui lòng mang theo CCCD và các giấy tờ liên quan để việc trao đổi được thuận tiện.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </>;
}

export function CitizenGuidePage() {
  const steps = ['Chọn thủ tục hoặc dịch vụ phù hợp', 'Đọc kỹ thành phần hồ sơ và thời hạn xử lý', 'Nộp trực tuyến hoặc đến Bộ phận Một cửa', 'Lưu mã phản ánh hoặc giấy hẹn để tra cứu'];
  return <><PageHero eyebrow="Hướng dẫn sử dụng" title="Dễ tìm, dễ gửi, dễ theo dõi" description="Cổng thông tin được thiết kế để mọi người dân đều có thể sử dụng nhanh chóng." /><section className="citizen-section citizen-section-soft"><div className="citizen-container"><SectionHeading title="4 bước để sử dụng cổng thông tin" /> <div className="citizen-guide-steps">{steps.map((step, index) => <div key={step}><span>{index + 1}</span><h2>{step}</h2></div>)}</div></div></section></>;
}
