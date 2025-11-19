import React from 'react';
import './About.css';

export const AboutUs = () => (
  <section id="about" className="content-section">
    <div className="section-container">
      <h1 className="section-title">Về chúng tôi</h1>
      <div className="section-content">
        <p className="intro-text">
          <strong>GZCONNECT</strong> là nền tảng tuyển dụng chuyên biệt dành riêng cho ngành Công nghệ Thông tin, 
          được thành lập với sứ mệnh kết nối những tài năng IT xuất sắc với các doanh nghiệp công nghệ hàng đầu tại Việt Nam.
        </p>
        <p>
          Chúng tôi hiểu rằng ngành IT có những yêu cầu đặc thù và độc đáo. Vì vậy, chúng tôi đã xây dựng một hệ thống 
          tìm kiếm thông minh, cho phép ứng viên lọc công việc theo ngôn ngữ lập trình, framework, công nghệ và cấp độ kinh nghiệm.
        </p>
        <div className="highlight-box">
          <h3>Giá trị cốt lõi của chúng tôi:</h3>
          <ul className="value-list">
            <li>
              <strong>Chuyên nghiệp:</strong> Đội ngũ tư vấn am hiểu sâu về công nghệ và thị trường IT
            </li>
            <li>
              <strong>Minh bạch:</strong> Thông tin lương, quyền lợi được công khai rõ ràng
            </li>
            <li>
              <strong>Hiệu quả:</strong> Quy trình tuyển dụng nhanh chóng, phản hồi kịp thời
            </li>
          </ul>
        </div>
        <p>
          Với hơn <strong>5,000+ công ty công nghệ</strong> và <strong>50,000+ ứng viên</strong> tin tưởng, 
          chúng tôi tự hào là cầu nối đáng tin cậy trong cộng đồng IT Việt Nam.
        </p>
      </div>
    </div>
  </section>
);

export const TermsOfService = () => (
  <section id="regulations" className="content-section">
    <div className="section-container">
      <h1 className="section-title">Quy chế hoạt động</h1>
      <div className="section-content">
        <div className="subsection">
          <h3>1. Quy định đối với Nhà tuyển dụng</h3>
          <ul>
            <li>Thông tin tuyển dụng phải chính xác, trung thực và không vi phạm pháp luật</li>
            <li>Không được yêu cầu ứng viên nộp phí hoặc đặt cọc dưới bất kỳ hình thức nào</li>
            <li>Phải công khai mức lương hoặc khoảng lương cụ thể cho từng vị trí</li>
            <li>Cam kết phản hồi ứng viên trong vòng 7 ngày làm việc kể từ khi nhận hồ sơ</li>
            <li>Tuân thủ quy trình phỏng vấn chuyên nghiệp, tôn trọng ứng viên</li>
          </ul>
        </div>
        
        <div className="subsection">
          <h3>2. Quy định đối với Ứng viên</h3>
          <ul>
            <li>Thông tin cá nhân và CV phải trung thực, chính xác</li>
            <li>Không tạo nhiều tài khoản để spam hồ sơ ứng tuyển</li>
            <li>Tôn trọng lịch hẹn phỏng vấn, thông báo trước nếu không thể tham dự</li>
            <li>Giữ bí mật thông tin của công ty được tiếp cận trong quá trình ứng tuyển</li>
            <li>Không sử dụng nền tảng cho mục đích thương mại trái phép</li>
          </ul>
        </div>

        <div className="subsection">
          <h3>3. Cơ chế giải quyết tranh chấp</h3>
          <p>
            Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng, hòa giải. 
            Trường hợp không đạt được thỏa thuận, các bên có quyền khởi kiện tại Tòa án có thẩm quyền.
          </p>
        </div>

        <div className="warning-box">
          <strong>Lưu ý:</strong> Nền tảng có quyền tạm khóa hoặc xóa tài khoản vi phạm quy chế mà không cần báo trước.
        </div>
      </div>
    </div>
  </section>
);

export const PrivacyPolicy = () => (
  <section id="privacy" className="content-section">
    <div className="section-container">
      <h1 className="section-title">Quy định bảo mật</h1>
      <div className="section-content">
        <div className="subsection">
          <h3>1. Thu thập thông tin</h3>
          <p>Chúng tôi thu thập các thông tin sau:</p>
          <ul>
            <li>Thông tin cá nhân: Họ tên, email, số điện thoại, địa chỉ</li>
            <li>Thông tin nghề nghiệp: Kinh nghiệm, kỹ năng, bằng cấp</li>
            <li>Dữ liệu sử dụng: Lịch sử tìm kiếm, công việc đã xem, đã ứng tuyển</li>
            <li>Thông tin kỹ thuật: IP address, loại thiết bị, trình duyệt</li>
          </ul>
        </div>

        <div className="subsection">
          <h3>2. Mục đích sử dụng thông tin</h3>
          <ul>
            <li>Kết nối ứng viên với nhà tuyển dụng phù hợp</li>
            <li>Cải thiện trải nghiệm người dùng và thuật toán gợi ý công việc</li>
            <li>Gửi thông báo về cơ hội việc làm phù hợp</li>
            <li>Phân tích và thống kê để phát triển dịch vụ</li>
            <li>Tuân thủ các yêu cầu pháp lý</li>
          </ul>
        </div>

        <div className="subsection">
          <h3>3. Bảo vệ thông tin</h3>
          <p>Chúng tôi áp dụng các biện pháp bảo mật tiên tiến:</p>
          <ul>
            <li>Mã hóa dữ liệu SSL/TLS 256-bit</li>
            <li>Xác thực hai yếu tố (2FA) cho tài khoản</li>
            <li>Firewall và hệ thống phát hiện xâm nhập</li>
            <li>Sao lưu dữ liệu định kỳ</li>
            <li>Kiểm tra bảo mật thường xuyên bởi bên thứ ba</li>
          </ul>
        </div>

        <div className="subsection">
          <h3>4. Quyền của người dùng</h3>
          <p>
            Bạn có quyền truy cập, chỉnh sửa, xóa hoặc yêu cầu xuất dữ liệu cá nhân của mình. 
            Bạn cũng có thể từ chối nhận email marketing bất cứ lúc nào thông qua liên kết 
            "Hủy đăng ký" trong email hoặc cài đặt tài khoản.
          </p>
        </div>

        <div className="success-box">
          🔒 <strong>Cam kết:</strong> Chúng tôi không bao giờ bán hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba 
          vì mục đích thương mại mà không có sự đồng ý của bạn.
        </div>
      </div>
    </div>
  </section>
);

export const TermsAndConditions = () => (
  <section id="terms" className="content-section">
    <div className="section-container">
      <h1 className="section-title">Thỏa thuận sử dụng</h1>
      <div className="section-content">
        <div className="subsection">
          <h3>1. Điều khoản chung</h3>
          <p>
            Khi sử dụng dịch vụ của GZCONNECT, bạn đồng ý tuân thủ các điều khoản và điều kiện 
            được quy định trong văn bản này. Nếu không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.
          </p>
        </div>

        <div className="subsection">
          <h3>2. Tài khoản người dùng</h3>
          <ul>
            <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình</li>
            <li>Một người chỉ được tạo một tài khoản duy nhất</li>
            <li>Bạn phải từ 16 tuổi trở lên để tạo tài khoản</li>
            <li>Bạn phải thông báo ngay lập tức nếu phát hiện tài khoản bị sử dụng trái phép</li>
          </ul>
        </div>

        <div className="subsection">
          <h3>3. Quyền sở hữu trí tuệ</h3>
          <p>
            Tất cả nội dung trên nền tảng (logo, thiết kế, mã nguồn, văn bản) là tài sản của 
            GZCONNECT và được bảo vệ bởi luật sở hữu trí tuệ. Người dùng không được:
          </p>
          <ul>
            <li>Sao chép, sửa đổi hoặc phân phối nội dung mà không có sự cho phép</li>
            <li>Sử dụng robots, crawlers để thu thập dữ liệu tự động</li>
            <li>Đảo ngược kỹ thuật (reverse engineer) bất kỳ phần nào của hệ thống</li>
          </ul>
        </div>

        <div className="subsection">
          <h3>4. Trách nhiệm của người dùng</h3>
          <ul>
            <li>Không đăng tải nội dung vi phạm pháp luật, xúc phạm, phỉ báng</li>
            <li>Không spam, gửi thông tin quảng cáo trái phép</li>
            <li>Không giả mạo danh tính người khác hoặc tổ chức</li>
            <li>Không cố gắng xâm nhập hệ thống hoặc làm gián đoạn dịch vụ</li>
          </ul>
        </div>

        <div className="subsection">
          <h3>5. Miễn trừ trách nhiệm</h3>
          <p>
            GZCONNECT cung cấp nền tảng kết nối và không chịu trách nhiệm về: nội dung do 
            người dùng đăng tải, kết quả tuyển dụng, các tranh chấp phát sinh giữa nhà tuyển dụng 
            và ứng viên. Chúng tôi không đảm bảo nền tảng hoạt động liên tục không gián đoạn hoặc 
            không có lỗi.
          </p>
        </div>

        <div className="subsection">
          <h3>6. Thay đổi điều khoản</h3>
          <p>
            Chúng tôi có quyền cập nhật các điều khoản sử dụng này bất cứ lúc nào. Phiên bản cập nhật 
            sẽ được đăng tải trên website với ngày hiệu lực. Việc bạn tiếp tục sử dụng dịch vụ sau khi 
            có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
          </p>
        </div>

        {/* <div className="info-box">
          <strong>Ngày hiệu lực:</strong> 01/01/2024<br/>
          <strong>Phiên bản:</strong> 2.0
        </div> */}
      </div>
    </div>
  </section>
);

export const Contact = () => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
//   };

  return (
    <section id="contact" className="content-section">
      <div className="section-container">
        <h1 className="section-title">Liên hệ</h1>
        <div className="section-content">
          <p className="intro-text">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh sau:
          </p>

          <div className="contact-grid">
            <div className="contact-card">
              <h3>Thông tin liên hệ</h3>
              <div className="contact-info">
                <div className="info-item">
                  <strong>Địa chỉ:</strong>
                  <span>Thủ Đức, Thành phố Hồ Chí Minh</span>
                </div>
                <div className="info-item">
                  <strong>Hotline:</strong>
                  <span>1900-xxxx (8:00 - 18:00, T2-T6)</span>
                </div>
                <div className="info-item">
                  <strong>Email:</strong>
                  <span>gzconnect.team@gmail.com</span>
                </div>
              </div>
            </div>

            {/* <div className="contact-card">
              <h3>Phòng ban chuyên biệt</h3>
              <div className="contact-info">
                <div className="info-item">
                  <strong>Hỗ trợ ứng viên:</strong>
                  <span>candidate@gzconnect.vn</span>
                </div>
                <div className="info-item">
                  <strong>Hỗ trợ nhà tuyển dụng:</strong>
                  <span>employer@gzconnect.vn</span>
                </div>
                <div className="info-item">
                  <strong>Hợp tác kinh doanh:</strong>
                  <span>business@gzconnect.vn</span>
                </div>
              </div>
            </div> */}
          </div>

          {/* <div className="social-links">
            <h3>Kết nối với chúng tôi</h3>
            <div className="social-buttons">
              <a href="#" className="social-btn facebook">Facebook</a>
              <a href="#" className="social-btn linkedin">LinkedIn</a>
              <a href="#" className="social-btn youtube">YouTube</a>
              <a href="#" className="social-btn zalo">Zalo</a>
            </div>
          </div> */}
{/* 
          <div className="contact-form-wrapper">
            <h3>Gửi tin nhắn cho chúng tôi</h3>
            <div className="contact-form">
              <div className="form-row">
                <input 
                  type="text" 
                  placeholder="Họ và tên *" 
                  className="form-input"
                />
                <input 
                  type="email" 
                  placeholder="Email *" 
                  className="form-input"
                />
              </div>
              <input 
                type="text" 
                placeholder="Tiêu đề" 
                className="form-input full-width"
              />
              <textarea 
                placeholder="Nội dung tin nhắn *" 
                rows="5"
                className="form-textarea"
              ></textarea>
              <button 
                onClick={handleSubmit}
                className="submit-btn"
              >
                Gửi tin nhắn
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};