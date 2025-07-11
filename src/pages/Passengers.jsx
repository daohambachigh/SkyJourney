import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Passengers = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavigate = (page) => {
    setMobileMenuOpen(false);
// Navigation logic would go here
    switch (page) {
      case "passengers":
        navigate("/passengers");
        break;
      case "about":
        navigate("/about");
        break;
      case "explore":
        navigate("/explore");
        break;
      case "FlightSelect":
        navigate("/flightselect");
        break;
      case "AddonServices":
        navigate("/addonservices");
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
          {/* Left side - Passenger Form */}
          <div className="flight-section">
            <h2 className="section-title">Passenger information</h2>
            <div className="passenger-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Last/Family name (as in passport)</label>
                  <input type="text" placeholder="Nguyen" />
                </div>
                <div className="form-group">
                  <label>First/Given name and Middle name (as in passport)</label>
                  <input type="text" placeholder="Van A" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth (DD/MM/YYYY)</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input type="text" placeholder="Vietnam" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>National ID / Passport</label>
                  <input type="text" placeholder="012345678" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="your@email.com" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" placeholder="123 Street, City" />
                </div>
                <div className="form-group">
                  <label>Phone number</label>
                  <input type="text" placeholder="+84 123456789" />
                </div>
              </div>
              <div className="form-row" style={{ justifyContent: "flex-end", gap: 16 }}>
                <button type="button" className="btn-outline" onClick={() => handleNavigate("FlightSelect")}>Back</button>
                <button type="button" className="btn-primary" onClick={() => handleNavigate("AddonServices")}>Continue</button>
              </div>
            </div>
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

            {/* Total */}
            <div className="total-section">
              <div className="total-row">
                <span className="total-label">Total</span>
                <span className="total-amount">441.80 USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
      body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f5f7fa;
          color: #333;
        }
        .flight-select-root {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          background: #f5f7fa;
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
          color: #fff;
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
          flex: 1;
          background: rgba(255,255,255,0.95);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          padding: 24px 32px;
        }
        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #222;
          margin-bottom: 20px;
          text-align: left;
        }
        .passenger-form {
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
        .form-group input {
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
          height: 48px;
        }
        .form-group input:focus {
          border-color: #c09600;
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
          .flight-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100%;
          height: 350px;
          background: linear-gradient(270deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%), 
                     url('assets/images/hero_image.png') center/cover no-repeat;
          z-index: 0;
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
          .form-group input {
            font-size: 15px;
            padding: 10px 12px;
            height: 44px;
          }
          .pricing-sidebar {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Passengers;