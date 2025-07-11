import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Landingpage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [tripType, setTripType] = useState("roundtrip");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Traveler popup state
  const [travelerOpen, setTravelerOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const travelerRef = useRef(null);

  const navigate = useNavigate();

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close traveler popup when click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (travelerRef.current && !travelerRef.current.contains(event.target)) {
        setTravelerOpen(false);
      }
    }
    if (travelerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [travelerOpen]);

  // Navigation handler
  const handleNavigate = (page) => {
    setMobileMenuOpen(false);
    switch (page) {
      case "about":
        navigate("/about");
        break;
      case "explore":
        navigate("/explore");
        break;
      case "flightselect":
        navigate("/flightselect");
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

  // Tổng số khách
  const totalPassengers = adults + children + infants;

  return (
    <div className="landing-root">
      {/* Background Image - Full Screen */}
      <div className="hero-bg" />
      {/* Top Info Bar */}
      {!isMobile && (
        <div className="top-info-bar">
          <div>
            <span>+84 395908838</span>
            <span style={{ marginLeft: 24 }}>bookingflight@gmail.com</span>
          </div>
          <div className="desktop-auth">
            <span className="link" onClick={() => handleNavigate("login")}>Log In</span>
            <button className="btn-outline" onClick={() => handleNavigate("signup")}>Sign Up</button>
          </div>
        </div>
      )}
      {/* bar */}
      <nav className="nav-bar">
        <div className="logo" onClick={() => handleNavigate("/")}>SkyJourney</div>
        {/* Desktop Menu */}
        {!isMobile && (
          <div className="nav-items desktop-menu">
            <span
              className="link"
              style={{ color: window.location.pathname === "/about" ? "#e0b100" : "#fff", borderBottom: window.location.pathname === "/about" ? "2px solid #e0b100" : "none" }}
              onClick={() => handleNavigate("about")}
            >
              About
            </span>
            <span className="link" onClick={() => handleNavigate("explore")}>Explore</span>
            <span className="link" onClick={() => handleNavigate("bookings")}>Bookings</span>
            <span className="link" onClick={() => handleNavigate("contact")}>Contact Us</span>
          </div>
        )}
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
      </nav>

      {/* Mobile Menu Popup */}
      {mobileMenuOpen && isMobile && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-popup" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menu</span>
              <button
                className="mobile-menu-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>
            <div className="mobile-menu-items">
              <span
                className="mobile-menu-link"
                style={{ color: "#e0b100", fontWeight: 700 }}
                onClick={() => handleNavigate("about")}
              >
                About
              </span>
              <span className="mobile-menu-link" onClick={() => handleNavigate("explore")}>Explore</span>
              <span className="mobile-menu-link" onClick={() => handleNavigate("bookings")}>Bookings</span>
              <span className="mobile-menu-link" onClick={() => handleNavigate("contact")}>Contact Us</span>
              <div className="mobile-auth">
                <span className="mobile-menu-link" onClick={() => handleNavigate("login")}>Log In</span>
                <button className="btn-outline mobile-signup" onClick={() => handleNavigate("signup")}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">SkyJourney</h1>
          <p className="hero-desc">The best Airline in HCMUT</p>
          {/* Trip type selector - đặt lên trên */}
          <div className="form-group trip-type-group trip-type-row">
            <label>Trip Type</label>
            <div className="trip-type-options">
              <label className={`trip-type-option${tripType === "roundtrip" ? " active" : ""}`}>
                <input
                  type="radio"
                  name="tripType"
                  value="roundtrip"
                  checked={tripType === "roundtrip"}
                  onChange={() => setTripType("roundtrip")}
                />
                Round Trip
              </label>
              <label className={`trip-type-option${tripType === "oneway" ? " active" : ""}`}>
                <input
                  type="radio"
                  name="tripType"
                  value="oneway"
                  checked={tripType === "oneway"}
                  onChange={() => setTripType("oneway")}
                />
                One Way
              </label>
            </div>
          </div>
          <div className="booking-form">
            <div className="form-group">
              <label>Departure Airport</label>
              <div className="input-icon">
                <input
                  type="text"
                  placeholder="Where are you now?"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Arrival Airport</label>
              <div className="input-icon">

                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Date</label>
              <div className="input-icon">

                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
            </div>
            {/* Traveler selector */}
            <div className="form-group" style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <label>Travellers</label>
              <div
                className="input-icon"
                style={{ cursor: "pointer" }}
                onClick={() => setTravelerOpen((open) => !open)}
              >
                <span className="icon">👤</span>
                <input
                  type="text"
                  value={
                    `${adults} Adult${adults > 1 ? "s" : ""}` +
                    (children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : "") +
                    (infants > 0 ? `, ${infants} Infant${infants > 1 ? "s" : ""}` : "")
                  }
                  readOnly
                  placeholder="Number of passengers"
                  style={{
                    background: "transparent",
                    color: "#fff",
                    cursor: "pointer",
                    minHeight: 48,
                    minWidth: 220,
                    fontSize: 16,
                    whiteSpace: "normal",
                    lineHeight: "1.4"
                  }}
                  onFocus={() => setTravelerOpen(true)}
                />
              </div>
              {travelerOpen && (
                <div className="traveler-popup" ref={travelerRef}>
                  <div className="traveler-row">
                    <span>Adults <span className="traveler-age">(12+)</span></span>
                    <div className="traveler-counter">
                      <button
                        type="button"
                        disabled={adults <= 1}
                        onClick={() => setAdults(adults - 1)}
                      >-</button>
                      <span>{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                      >+</button>
                    </div>
                  </div>
                  <div className="traveler-row">
                    <span>Children <span className="traveler-age">(2-12)</span></span>
                    <div className="traveler-counter">
                      <button
                        type="button"
                        disabled={children <= 0}
                        onClick={() => setChildren(children - 1)}
                      >-</button>
                      <span>{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                      >+</button>
                    </div>
                  </div>
                  <div className="traveler-row">
                    <span>Infants <span className="traveler-age">(&lt;2)</span></span>
                    <div className="traveler-counter">
                      <button
                        type="button"
                        disabled={infants <= 0}
                        onClick={() => setInfants(infants - 1)}
                      >-</button>
                      <span>{infants}</span>
                      <button
                        type="button"
                        onClick={() => setInfants(infants + 1)}
                      >+</button>
                    </div>
                  </div>
                  <button
                    className="traveler-done-btn"
                    type="button"
                    onClick={() => setTravelerOpen(false)}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Nút search xuống dòng riêng */}
          <div style={{ width: "100%", marginTop: 24 }}>
            <button className="btn-primary" style={{ width: "100%" }} onClick={() => handleNavigate("flightselect")}>
              Search Your Flight
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: url('/assets/images/hero_image.png') center/cover no-repeat;
  z-index: 0;
}

.landing-root {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
}

.top-info-bar,
.nav-bar {
  position: relative;
  z-index: 1;
  /* Nếu muốn nền mờ hơn, có thể thêm thuộc tính background: rgba(0, 0, 0, 0.5); vào đây */
}

.top-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 40px;
  font-size: 15px;
  color: #fff;
  border-bottom: 0.5px solid #e5e5e5;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  position: relative;
  background: inherit; /* Giữ nguyên màu nền */
}

.logo {
  color: #e0b100;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  text-align: left;
  cursor: pointer;
  letter-spacing: -0.5px;
  line-height: 1;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-items .link {
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  text-decoration: none;
  border-bottom: none;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0 2px;
}
.nav-items .link:hover,
.nav-items .link[style*="color: #e0b100"] {
  color: #e0b100 !important;
  border-bottom: 2px solid #e0b100;
}

/* Desktop-auth giống FlightSelect */
.desktop-auth {
  display: flex;
  align-items: center;
  gap: 16px;
}
.desktop-auth .link {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}
.desktop-auth .link:hover {
  color: #e0b100;
}

.btn-outline {
  border: 1px solid #e0b100;
  background: transparent;
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 15px;
  cursor: pointer;
  margin-left: 8px;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-outline:hover {
  background: #e0b100;
  color: #fff;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  gap: 4px;
}

.mobile-menu-btn span {
  width: 25px;
  height: 3px;
  background: #fff;
  transition: 0.3s;
  border-radius: 3px;
}

/* Mobile Menu Popup */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.mobile-menu-popup {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  padding: 0;
  transform: scale(1);
  animation: popupIn 0.3s ease-out;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

@keyframes popupIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.mobile-menu-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 24px 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
}

.mobile-menu-title {
  color: #e0b100;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.mobile-menu-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: #666;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.mobile-menu-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #e0b100;
}

.mobile-menu-items {
  padding: 20px 0 30px 0;
  text-align: center;
}

.mobile-menu-link {
  display: block;
  color: #333;
  padding: 18px 24px;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0;
}

.mobile-menu-link:hover {
  background: rgba(224, 177, 0, 0.1);
  color: #e0b100;
}

.mobile-auth {
  padding: 20px 24px 10px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  text-align: center;
}

.mobile-auth .mobile-menu-link {
  color: #e0b100;
  font-size: 16px;
  padding: 12px 24px;
}

.mobile-signup {
  margin-left: 0;
  margin-top: 12px;
  width: 80%;
  background: #e0b100;
  color: #fff;
  border: none;
  padding: 12px 24px;
}

.mobile-signup:hover {
  background: #c09600;
  color: #fff;
}

.hero-section {
  position: relative;
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 80px 0 0 60px;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  text-align: left;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.hero-desc {
  font-size: 20px;
  color: #fff;
  margin-bottom: 36px;
  text-align: left;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.booking-form {
  display: flex;
  flex-direction: row;
  gap: 32px;
  align-items: flex-end;
  width: 100%;
  max-width: 900px;
  flex-wrap: nowrap;
  background: transparent;
}

.trip-type-row {
  width: 100%;
  margin-bottom: 18px;
  display: flex;
  flex-direction: row;
  align-items: flex-start; /* Đảm bảo label và options cùng baseline */
  gap: 24px;
}

.trip-type-row > label {
  margin-bottom: 0;
  margin-right: 18px;
  font-size: 16px;
  min-width: 80px;
  line-height: 40px; /* Đảm bảo chiều cao bằng với option */
  padding-top: 2px;
}

.trip-type-options {
  display: flex;
  gap: 24px;
  align-items: center; /* Căn giữa theo chiều dọc với label */
  margin-top: 0 !important; /* Xóa margin-top nếu có */
}

.trip-type-row {
    width: 100%;
    margin-bottom: 18px;
    flex-direction: row;
    align-items: center;
    display: flex;
    gap: 24px;
}

.trip-type-row label {
    margin-bottom: 0;
    margin-right: 18px;
    font-size: 16px;
    min-width: 80px;
}

.trip-type-options {
    flex-wrap: wrap;
}

.form-group {
  flex: 1 1 0;
  min-width: 180px;
  align-items: flex-start;
  text-align: left;
  width: auto;
}

.input-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* căn icon và input về bên trái */
}

.input-icon .icon {
  position: absolute;
  left: 12px;
  color: #e0b100;
  font-size: 18px;
  pointer-events: none;
  top: 50%;
  transform: translateY(-50%);
}

.form-group input {
  width: 100%;
  padding: 10px 10px 10px 36px;
  border-radius: 0;
  border: none;
  border-bottom: 2px solid #e0b100;
  background: transparent;
  color: #fff;
  font-size: 16px;
  outline: none;
  box-shadow: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-bottom: 2.5px solid #fff;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.btn-primary {
  background: transparent;
  color: #fff;
  font-weight: 600;
  border: 1.5px solid #e0b100;
  border-radius: 24px;
  padding: 12px 36px;
  margin-left: 18px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #e0b100;
  color: #222;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(224, 177, 0, 0.3);
}

/* Responsive */
@media (max-width: 900px) {
  .desktop-menu {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .desktop-auth {
    display: none;
  }
  
  .hero-content {
    margin: 30px 0 0 0;
    max-width: 95vw;
    padding: 0 20px;
  }
  
  .booking-form {
    flex-direction: column;
    gap: 18px;
    max-width: 100%;
    flex-wrap: wrap;
  }
  
  .btn-primary {
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 600px) {
  .top-info-bar {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .top-info-bar span:first-child {
    display: none;
  }
  
  .nav-bar {
    padding: 16px 20px;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-desc {
    font-size: 16px;
  }
  
  .booking-form {
    flex-direction: column;
    gap: 16px;
  }
  
  .form-group {
    width: 100%;
  }
  
  .mobile-menu-popup {
    width: 100vw;
  }
  
  .trip-type-options {
    gap: 8px;
  }
  
  .trip-type-option {
    font-size: 15px;
    padding: 4px 6px;
  }
}
.trip-type-group {
    min-width: 180px;
    color: #fff;
    align-items: flex-start;
    text-align: left;
  }
  .trip-type-options {
    display: flex;
    gap: 24px;
    margin-top: 4px;
  }
  .trip-type-option {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: color 0.2s;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 16px;
    border: 1.5px solid transparent;
  }
  .trip-type-option input[type="radio"] {
    accent-color: #e0b100;
    margin-right: 4px;
  }
  .trip-type-option.active, .trip-type-option:hover {
    color: #e0b100;
    border: 1.5px solid #e0b100;
    background: rgba(224, 177, 0, 0.08);
  }
  @media (max-width: 900px) {
    .trip-type-options {
      gap: 12px;
    }
    .trip-type-group {
      min-width: 100%;
    }
  }
  @media (max-width: 600px) {
    .trip-type-options {
      gap: 8px;
    }
    .trip-type-option {
      font-size: 15px;
      padding: 4px 6px;
    }
  }
        .traveler-popup {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 260px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          padding: 18px 20px 12px 20px;
          z-index: 10;
          margin-top: 8px;
          color: #222;
          animation: popupIn 0.2s;
        }
        .traveler-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .traveler-age {
          color: #888;
          font-size: 13px;
          margin-left: 4px;
        }
        .traveler-counter {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .traveler-counter button {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid #e0b100;
          background: #fff;
          color: #e0b100;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .traveler-counter button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .traveler-counter button:hover:not(:disabled) {
          background: #e0b100;
          color: #fff;
        }
        .traveler-counter span {
          min-width: 18px;
          text-align: center;
          font-size: 16px;
        }
        .traveler-done-btn {
          margin-top: 8px;
          width: 100%;
          background: #e0b100;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 0;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .traveler-done-btn:hover {
          background: #c09600;
        }

        /* Đổi font giống trang FlightSelect */
body, .landing-root, .hero-content, .booking-form, .form-group, .btn-primary {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Đổi màu label các trường form sang trắng */
.booking-form .form-group > label {
  color: #fff !important;
  font-weight: 600;
  font-size: 17px;
  margin-bottom: 6px;
  display: block;
  padding-left: 0;
}

/* Căn label Travellers thẳng hàng với các label khác */
.booking-form .form-group:last-child > label {
  padding-left: 0;
}

/* Đảm bảo input Travellers và các input khác cùng style */
.booking-form .form-group input,
.booking-form .form-group input[type="text"][readOnly] {
  color: #fff;
  font-family: inherit;
  font-size: 16px;
  background: transparent;
  text-align: left;
  min-height: 48px;
  min-width: 220px;
  white-space: normal;
  line-height: 1.4;
}

/* Responsive giữ nguyên */
@media (max-width: 900px) {
  .booking-form {
    flex-direction: column;
    gap: 18px;
    max-width: 100%;
    flex-wrap: wrap;
  }
  .form-group {
    width: 100%;
    min-width: 0;
  }
}
      `}</style>
    </div>
  );
};

export default Landingpage;