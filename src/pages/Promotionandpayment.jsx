import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Promotionandpayment = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // Thêm state này
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavigate = (page) => {
    setMobileMenuOpen(false);
    switch (page) {
      case "about":
        navigate("/about");
        break;
      case "explore":
        navigate("/explore");
        break;
      case "bookings":
        navigate("/bookings");
        break;
      case "contact":
        navigate("/contact");
        break;
      case "login":
        navigate("/login");
        break;
      case "signup":
        navigate("/signup");
        break;
      default:
        navigate("/");
        break;
    }
  };

  // Thêm hàm lấy QR code
  const getQRCode = () => {
    const qrCodes = {
      "MoMo": "/assets/images/momo-qr.png",
      "ZaloPay": "/assets/images/zalopay-qr.png",
      "Visa": "/assets/images/visa-qr.png",
      "Mastercard": "/assets/images/mastercard-qr.png"
    };
    return qrCodes[selectedPaymentMethod] || "";
  };

  return (
    <div className="flight-select-root">
      <div className="flight-bg" />

      {/* Top Info Bar */}
      {!isMobile && (
        <div className="top-info-bar">
          <div className="info-left">
            <span>+84 395908838</span>
            <span style={{ marginLeft: 24 }}>bookingflight@gmail.com</span>
          </div>
          <div className="info-right">
            <span className="link" onClick={() => handleNavigate("login")}>Log In</span>
            <button className="btn-outline" onClick={() => handleNavigate("signup")}>Sign Up</button>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="nav-bar" style={isMobile ? { display: "flex", alignItems: "center", justifyContent: "space-between" } : {}}>
        <div className="logo" onClick={() => handleNavigate("/")}>SkyJourney</div>
        {!isMobile && (
          <div className="nav-items">
            <span className="link" onClick={() => handleNavigate("about")}>About</span>
            <span className="link" onClick={() => handleNavigate("explore")}>Explore</span>
            <span className="link" onClick={() => handleNavigate("bookings")}>Bookings</span>
            <span className="link" onClick={() => handleNavigate("contact")}>Contact Us</span>
          </div>
        )}
        {isMobile && (
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              fontSize: "28px",
              color: "#e0b100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "auto"
            }}
          >
            <span style={{ fontSize: "28px", fontWeight: "bold", lineHeight: 1 }}>☰</span>
          </button>
        )}
      </nav>

      {/* Mobile Menu Popup */}
      {mobileMenuOpen && isMobile && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="mobile-menu-popup"
            style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              padding: '32px 24px',
              minWidth: '280px',
              maxWidth: '90vw',
              textAlign: 'center',
              position: 'relative',
              animation: 'slideIn 0.3s ease-out'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="mobile-menu-close"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                color: '#999',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close menu"
            >
              ×
            </button>
            <h3
              style={{
                color: '#e0b100',
                fontSize: '20px',
                fontWeight: '700',
                margin: '0 0 24px 0',
                letterSpacing: '0.5px'
              }}
            >
              MENU
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a
                href="#"
                style={{
                  display: 'block',
                  color: '#e0b100',
                  fontSize: '18px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#f0f0f0',
                  transition: 'background-color 0.2s, color 0.2s',
                  cursor: 'pointer'
                }}
                onClick={e => {
                  e.preventDefault();
                  handleNavigate('about');
                }}
              >
                About
              </a>
              <a
                href="#"
                style={{
                  display: 'block',
                  color: '#333',
                  fontSize: '18px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s, color 0.2s',
                  cursor: 'pointer'
                }}
                onClick={e => {
                  e.preventDefault();
                  handleNavigate('explore');
                }}
              >
                Explore
              </a>
              <a
                href="#"
                style={{
                  display: 'block',
                  color: '#333',
                  fontSize: '18px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s, color 0.2s',
                  cursor: 'pointer'
                }}
                onClick={e => {
                  e.preventDefault();
                  handleNavigate('bookings');
                }}
              >
                Bookings
              </a>
              <a
                href="#"
                style={{
                  display: 'block',
                  color: '#333',
                  fontSize: '18px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s, color 0.2s',
                  cursor: 'pointer'
                }}
                onClick={e => {
                  e.preventDefault();
                  handleNavigate('contact');
                }}
              >
                Contact Us
              </a>
              <div style={{ borderTop: '1px solid #eee', marginTop: 10, paddingTop: 10 }}>
                <a
                  href="#"
                  style={{
                    color: '#e0b100',
                    fontSize: '16px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    padding: '12px 16px',
                    display: 'block',
                    cursor: 'pointer'
                  }}
                  onClick={e => {
                    e.preventDefault();
                    handleNavigate('login');
                  }}
                >
                  Log In
                </a>
                <button
                  style={{
                    marginTop: 12,
                    width: '80%',
                    background: '#e0b100',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleNavigate('signup')}
                >
                  Sign Up
                </button>
              </div>
            </div>
            <style>{`
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: scale(0.9);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flight-content">
        <div className="flight-summary">
          <div className="flight-route">
            <span className="flight-title">HAN - ICN</span>
            <span className="flight-type">Round trip</span>
          </div>
          <div className="flight-date">Tue, July 8, 2025 - Sat, July 19, 2025</div>
          <div className="flight-passenger">1 Adult</div>
          <div className="flight-class">Economy</div>
        </div>
        <div className="main-content-container">
          {/* Left side - Promotion and Payment form */}
          <div className="flight-section" style={{ flex: 1 }}>
            <h2 className="section-title">Promotion & Payment</h2>
            <form className="promotion-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Promotion code / Voucher</label>
                  <input type="text" placeholder="Enter code" />
                </div>
                <div className="form-group" style={{ alignSelf: "flex-end" }}>
                  <button type="button" className="btn-primary" style={{ minWidth: 120 }}>Apply</button>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Payment method</label>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className={`btn-payment-method${selectedPaymentMethod === "MoMo" ? " active" : ""}`}
                      onClick={() => setSelectedPaymentMethod("MoMo")}
                    >
                      MoMo
                    </button>
                    <button
                      type="button"
                      className={`btn-payment-method${selectedPaymentMethod === "ZaloPay" ? " active" : ""}`}
                      onClick={() => setSelectedPaymentMethod("ZaloPay")}
                    >
                      ZaloPay
                    </button>
                    <button
                      type="button"
                      className={`btn-payment-method${selectedPaymentMethod === "Visa" ? " active" : ""}`}
                      onClick={() => setSelectedPaymentMethod("Visa")}
                    >
                      Visa
                    </button>
                    <button
                      type="button"
                      className={`btn-payment-method${selectedPaymentMethod === "Mastercard" ? " active" : ""}`}
                      onClick={() => setSelectedPaymentMethod("Mastercard")}
                    >
                      Mastercard
                    </button>
                  </div>
                </div>
              </div>
              {/* Hiển thị QR code khi chọn payment method */}
              {selectedPaymentMethod && (
                <div className="qr-code-section">
                  <h3 className="qr-title">Scan QR Code to Pay</h3>
                  <div className="qr-container">
                    <img
                      src={getQRCode()}
                      alt={`${selectedPaymentMethod} QR Code`}
                      className="qr-image"
                    />
                  </div>
                  <p className="qr-instruction">
                    Open your {selectedPaymentMethod} app and scan this QR code to complete the payment
                  </p>
                </div>
              )}
              <div className="form-row" style={{ justifyContent: "flex-end", gap: 16 }}>
                <button type="button" className="btn-outline" onClick={() => navigate(-1)}>Back</button>
                <button type="submit" className="btn-primary">Pay now</button>
              </div>
            </form>
          </div>
          {/* Right side - Flight Details & Pricing */}
          <div className="pricing-sidebar">
            {/* Departure Flight */}
            <div className="flight-detail-card">
              <div className="flight-header">
                <span className="flight-label">Departure flight</span>
                <span className="flight-price">220.90 USD</span>
              </div>
              <div className="flight-info">
                <div className="route-info">
                  <span className="airport-code">Hanoi (HAN)</span>
                  <span className="arrow">→</span>
                  <span className="airport-code">Incheon/Seoul (ICN)</span>
                </div>
                <div className="flight-time">
                  <span>Tue, 08/07/2025 | 12:00 - 18:25 | KE123 | Eco</span>
                </div>
              </div>
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Price</span>
                  <span>105.00 USD</span>
                </div>
                <div className="price-row">
                  <span>Taxes and fees</span>
                  <span>115.90 USD</span>
                </div>
                <div className="price-row">
                  <span>Add-on</span>
                  <span>0 USD</span>
                </div>
              </div>
            </div>

            {/* Return Flight */}
            <div className="flight-detail-card">
              <div className="flight-header">
                <span className="flight-label">Return flight</span>
                <span className="flight-price">220.90 USD</span>
              </div>
              <div className="flight-info">
                <div className="route-info">
                  <span className="airport-code">Incheon/Seoul (ICN)</span>
                  <span className="arrow">→</span>
                  <span className="airport-code">Hanoi (HAN)</span>
                </div>
                <div className="flight-time">
                  <span>Sat, 19/07/2025 | 12:00 - 18:25 | KE456 | Eco</span>
                </div>
              </div>
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Price</span>
                  <span>105.00 USD</span>
                </div>
                <div className="price-row">
                  <span>Taxes and fees</span>
                  <span>115.90 USD</span>
                </div>
                <div className="price-row">
                  <span>Add-on</span>
                  <span>0 USD</span>
                </div>
              </div>
            </div>

            {/* Payment Detail Section */}
            <div className="payment-detail-card">
              <div className="payment-header">
                <span className="payment-label">Payment Summary</span>
              </div>
              <div className="payment-breakdown">
                <div className="price-row">
                  <span>Original Price</span>
                  <span>441.80 USD</span>
                </div>
                <div className="price-row discount-row">
                  <span>Promotion Discount</span>
                  <span style={{ color: '#28a745' }}>-0.00 USD</span>
                </div>
                <div className="price-row total-row">
                  <span style={{ fontWeight: '700', fontSize: '16px' }}>Final Amount</span>
                  <span style={{ fontWeight: '700', fontSize: '18px', color: '#e0b100' }}>441.80 USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .flight-select-root {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          background: #f5f7fa;
        }
        .flight-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100%;
          height: 350px;
          background: linear-gradient(270deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%), 
                     url('assets/images/hero_image.png') center/cover no-repeat;
          z-index: 0;
        }
        .top-info-bar {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 48px;
          background: #fff;
          border-bottom: 1px solid #eee;
          font-size: 15px;
        }
        .info-left span {
          color: #666;
          font-size: 14px;
        }
        .info-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .link {
          color: #e0b100;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }
        .btn-outline {
          border: 1px solid #e0b100;
          background: transparent;
          color: #666;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
          margin-left: 8px;
          transition: all 0.2s;
        }
        .btn-outline:hover {
          background: #e0b100;
          color: #fff;
        }
        .btn-primary {
          background: #e0b100;
          color: #fff;
          font-weight: 600;
          border: none;
          border-radius: 24px;
          padding: 12px 36px;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          background: #c09600;
          color: #fff;
        }
        .nav-bar {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 48px;
          background: #fff;
          border-bottom: 1px solid #eee;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .logo {
          color: #e0b100;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
          cursor: pointer;
        }
        .nav-items {
          display: flex;
          gap: 32px;
        }
        .flight-content {
          position: relative;
          z-index: 1;
          margin: 40px auto 80px auto;
          max-width: 1200px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .flight-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          background: rgba(255,255,255,0.95);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          padding: 24px 32px;
          align-items: center;
        }
        .flight-route {
          display: flex;
          flex-direction: column;
          min-width: 160px;
        }
        .flight-title {
          font-size: 32px;
          font-weight: 700;
          color: #222;
          letter-spacing: -0.5px;
        }
        .flight-type {
          font-size: 14px;
          color: #888;
        }
        .flight-date, .flight-passenger, .flight-class {
          font-size: 18px;
          color: #222;
          font-weight: 500;
        }
        .main-content-container {
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }
        .flight-section {
          background: rgba(255,255,255,0.95);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          padding: 24px 32px;
          width: 100%;
        }
        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #222;
          margin-bottom: 20px;
          text-align: left;
        }
        .promotion-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .form-row {
          display: flex;
          gap: 24px;
          width: 100%;
          align-items: flex-end;
        }
        .form-group {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          color: #222;
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 8px;
          display: block;
          text-align: left;
          line-height: 1.4;
        }
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1.5px solid #e0b100;
          background: #fff;
          color: #222;
          font-size: 16px;
          outline: none;
          box-shadow: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .form-group input:focus, .form-group textarea:focus {
          border-color: #c09600;
        }
        .btn-payment-method {
          background: #fff;
          color: #e0b100;
          border: 1.5px solid #e0b100;
          border-radius: 16px;
          padding: 10px 28px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-payment-method:hover, .btn-payment-method.active {
          background: #e0b100;
          color: #fff;
        }
        .pricing-sidebar {
          min-width: 320px;
          width: 320px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .flight-detail-card {
          background: rgba(255,255,255,0.95);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        .flight-header {
          background: #e0b100;
          color: #fff;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .flight-label {
          font-size: 16px;
          font-weight: 600;
        }
        .flight-price {
          font-size: 18px;
          font-weight: 700;
        }
        .flight-info {
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
        }
        .route-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .airport-code {
          font-size: 14px;
          font-weight: 600;
          color: #222;
        }
        .arrow {
          color: #e0b100;
          font-weight: bold;
        }
        .flight-time {
          font-size: 12px;
          color: #666;
        }
        .price-breakdown {
          padding: 16px 20px;
        }
        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
          color: #666;
        }
        .price-row:last-child {
          margin-bottom: 0;
        }
        .total-section {
          background: #8b0000;
          color: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .total-label {
          font-size: 18px;
          font-weight: 600;
        }
        .total-amount {
          font-size: 20px;
          font-weight: 700;
        }
        .payment-detail-card {
          background: rgba(255,255,255,0.95);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          overflow: hidden;
          border: 2px solid #e0b100;
        }
        .payment-header {
          background: #f8f9fa;
          color: #333;
          padding: 16px 20px;
          border-bottom: 1px solid #e0b100;
        }
        .payment-label {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        .payment-breakdown {
          padding: 16px 20px;
        }
        .discount-row {
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        .total-row {
          border-top: 2px solid #e0b100;
          padding-top: 12px;
          margin-top: 8px;
        }
        @media (max-width: 1100px) {
          .main-content-container {
            flex-direction: column;
            gap: 24px;
          }
          .pricing-sidebar {
            width: 100%;
            min-width: auto;
          }
        }
        @media (max-width: 900px) {
          .top-info-bar, .nav-bar {
            padding: 12px 16px;
          }
          .nav-items {
            gap: 18px;
          }
          .flight-content {
            padding: 12px;
          }
          .flight-summary, .flight-section {
            padding: 16px;
          }
          .form-row {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          .main-content-container {
            gap: 16px;
          }
        }
        @media (max-width: 600px) {
          .flight-content {
            margin-top: 16px;
            padding: 4px;
          }
          .flight-bg {
            height: 180px;
          }
          .flight-summary {
            gap: 10px;
            padding: 10px;
          }
          .flight-title {
            font-size: 20px;
          }
          .flight-date, .flight-passenger, .flight-class {
            font-size: 16px;
          }
          .section-title {
            font-size: 18px;
          }
          .form-row {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          .form-group label {
            font-size: 15px;
          }
          .form-group input, .form-group textarea {
            font-size: 15px;
            padding: 8px 10px;
          }
          .pricing-sidebar {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Promotionandpayment;
