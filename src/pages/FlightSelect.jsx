import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FlightSelect = () => {
  const [selectedDate, setSelectedDate] = useState("08 (Tue)");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [displayedDates, setDisplayedDates] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Dữ liệu mẫu cho các ngày bay
  const flightDates = [
    { date: "05 (Sat)", price: "310.90" },
    { date: "06 (Sun)", price: "420.90" },
    { date: "07 (Mon)", price: "256.90" },
    { date: "08 (Tue)", price: "220.90" },
    { date: "09 (Wed)", price: "310.90" },
    { date: "10 (Thu)", price: "222.90" },
    { date: "11 (Fri)", price: "310.90" },
    { date: "12 (Sat)", price: "330.90" },
    { date: "13 (Sun)", price: "380.90" },
    { date: "14 (Mon)", price: "290.90" },
  ];

  // Dữ liệu mẫu cho các chuyến bay
  const flights = [
    { id: 1, departure: "12:20 HAN", arrival: "18:25 ICN", code: "KET23", duration: "6h 5m" },
    { id: 2, departure: "08:45 HAN", arrival: "14:30 ICN", code: "KET24", duration: "5h 45m" },
    { id: 3, departure: "15:10 HAN", arrival: "21:05 ICN", code: "KET25", duration: "5h 55m" },
    { id: 4, departure: "19:30 HAN", arrival: "01:15 ICN", code: "KET26", duration: "5h 45m" },
    { id: 5, departure: "22:00 HAN", arrival: "03:55 ICN", code: "KET27", duration: "5h 55m" },
  ];

  // Tùy chọn sắp xếp
  const sortOptions = [
    "Recommended", 
    "Price: Low to High", 
    "Price: High to Low", 
    "Duration: Shortest", 
    "Departure: Earliest"
  ];

  // Quyền lợi của từng hạng vé
  const classBenefits = {
    economy: [
      "Baggage: 20kg",
      "Meal: Included",
      "Change ticket: $10 fee",
      "Priority boarding: No",
      "Seat selection: Standard"
    ],
    business: [
      "Baggage: 40kg",
      "Meal: Gourmet meal",
      "Change ticket: Free",
      "Priority boarding: Yes",
      "Lounge access: Yes",
      "Seat selection: Premium"
    ],
    firstClass: [
      "Baggage: 60kg",
      "Meal: Premium gourmet meal",
      "Change ticket: Free",
      "Priority boarding: Yes with escort",
      "Lounge access: Premium lounge",
      "Bed: Convertible seat",
      "Personal assistant"
    ]
  };

  // Tính toán các ngày hiển thị (3 ngày trước, ngày hiện tại, 3 ngày sau)
  useEffect(() => {
    const selectedIndex = flightDates.findIndex(d => d.date === selectedDate);
    if (selectedIndex !== -1) {
      const startIndex = Math.max(0, selectedIndex - 3);
      const endIndex = Math.min(flightDates.length, selectedIndex + 4);
      setDisplayedDates(flightDates.slice(startIndex, endIndex));
    }
  }, [selectedDate]);

  // Xử lý chọn hạng vé
  const handleClassSelect = (flightId, className) => {
    // Nếu đã chọn cùng chuyến bay và cùng hạng vé, đóng panel
    if (selectedFlight === flightId && selectedClass === className) {
      setSelectedClass(null);
      setSelectedFlight(null);
    } else {
      setSelectedFlight(flightId);
      setSelectedClass(className);
    }
  };

  // Xử lý chọn vé
  const handleSelectTicket = (flightId, className) => {
    alert(`Selected flight ${flightId} with ${className} class!`);
    setSelectedClass(null);
    setSelectedFlight(null);
  };

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Navigation handler
  const handleNavigate = (page) => {
    setMobileMenuOpen(false);
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
        {/* Desktop Menu */}
        {!isMobile && (
          <div className="nav-items">
            <span className="link" onClick={() => handleNavigate("about")}>About</span>
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
              onMouseOver={e => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.color = '#666';
              }}
              onMouseOut={e => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#999';
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
                onMouseOver={e => {
                  e.target.style.backgroundColor = '#e0b100';
                  e.target.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#333';
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
                onMouseOver={e => {
                  e.target.style.backgroundColor = '#e0b100';
                  e.target.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#333';
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
                onMouseOver={e => {
                  e.target.style.backgroundColor = '#e0b100';
                  e.target.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#333';
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
        {/* Flight Summary */}
        <div className="flight-summary">
          <div className="flight-route">
            <span className="flight-title">HAN - ICN</span>
            <span className="flight-type">Round trip</span>
          </div>
          <div className="flight-date">Tue, July 8, 2025 - Sat, July 19, 2025</div>
          <div className="flight-passenger">1 Adult</div>
          <div className="flight-class">Economy</div>
        </div>
        
        {/* Outbound Flight Section */}
        <div className="flight-section">
          <h2 className="section-title">Outbound flight HAN Hanoi → ICN Seoul/Incheon</h2>
          
          {/* Ngày bay tập trung */}
          <div className="date-container-wrapper">
            <div className="dates-container">
              {displayedDates.map((day, index) => (
                <div 
                  key={index} 
                  className={`date-item ${selectedDate === day.date ? "active" : ""}`}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <div className="date">{day.date}</div>
                  <div className="price">{day.price}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chỉ báo ngày trung tâm */}
          <div className="center-indicator">
            <div className="indicator-line" />
            <div className="indicator-text">Selected Date</div>
            <div className="indicator-line" />
          </div>
        </div>
        
        {/* Sort by Recommended */}
        <div className="flight-section">
          <div className="sort-header">
            <h3>Sort by</h3>
            <div className="sort-dropdown">
              <button 
                className="sort-button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                {selectedSort}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>
              </button>
              {sortDropdownOpen && (
                <div className="dropdown-menu">
                  {sortOptions.map((option, index) => (
                    <div 
                      key={index} 
                      className={`dropdown-item ${selectedSort === option ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedSort(option);
                        setSortDropdownOpen(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Flight List */}
          <div className="flight-list">
            {flights.map((flight) => (
              <div 
                key={flight.id} 
                className={`flight-card ${selectedFlight === flight.id ? 'selected' : ''}`}
              >
                <div className="flight-header">
                  <div className="flight-code">{flight.code}</div>
                  <div className="flight-duration">{flight.duration}</div>
                </div>
                <div className="flight-info">
                  <div className="time">
                    <div className="departure">
                      <span className="time-value">{flight.departure}</span>
                      <span className="airport">Hanoi (HAN)</span>
                    </div>
                    <div className="arrow">→</div>
                    <div className="arrival">
                      <span className="time-value">{flight.arrival}</span>
                      <span className="airport">Incheon (ICN)</span>
                    </div>
                  </div>
                  <div className="flight-classes">
                    <div 
                      className={`class-option economy ${selectedFlight === flight.id && selectedClass === 'economy' ? 'active' : ''}`}
                      onClick={() => handleClassSelect(flight.id, 'economy')}
                    >
                      <span>Economy</span>
                      <span className="price">220.90</span>
                    </div>
                    <div 
                      className={`class-option business ${selectedFlight === flight.id && selectedClass === 'business' ? 'active' : ''}`}
                      onClick={() => handleClassSelect(flight.id, 'business')}
                    >
                      <span>Business</span>
                      <span className="price">440.90</span>
                    </div>
                    <div 
                      className={`class-option first-class ${selectedFlight === flight.id && selectedClass === 'firstClass' ? 'active' : ''}`}
                      onClick={() => handleClassSelect(flight.id, 'firstClass')}
                    >
                      <span>First Class</span>
                      <span className="price">880.90</span>
                    </div>
                  </div>
                </div>
                
                {/* Panel chi tiết hạng vé */}
                {selectedFlight === flight.id && selectedClass && (
                  <div className="class-detail-panel">
                    <div className="panel-header">
                      <h4>{selectedClass === 'economy' ? 'Economy' : selectedClass === 'business' ? 'Business' : 'First Class'} Class Benefits</h4>
                    </div>
                    <div className="benefits-list">
                      {classBenefits[selectedClass].map((benefit, index) => (
                        <div key={index} className="benefit-item">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#2e7d32" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <div className="panel-footer">
                      <button 
                        className="select-button"
                        onClick={() => handleSelectTicket(flight.id, selectedClass)}
                        onClickCapture={() => handleNavigate("passengers")}
                      >
                        Select {selectedClass === 'economy' ? 'Economy' : selectedClass === 'business' ? 'Business' : 'First Class'} Class
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Price Summary */}
          <div className="price-summary">
            <div className="price-option">
              <span className="class-label">Economy from</span>
              <span className="class-price">220.90</span>
            </div>
            <div className="price-option">
              <span className="class-label">Business from</span>
              <span className="class-price">440.90</span>
            </div>
            <div className="price-option">
              <span className="class-label">First Class from</span>
              <span className="class-price">880.90</span>
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
        
        /* Flight Section Styles */
        .flight-section {
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
          text-align: center;
        }
        
        /* Date Container Styles */
        .date-container-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 25px;
        }
        .dates-container {
          display: flex;
          gap: 16px;
          max-width: 100%;
          overflow-x: auto;
          padding: 10px 0;
          scrollbar-width: none; /* Firefox */
        }
        .dates-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
        }
        .date-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 90px;
          padding: 12px 10px;
          border-radius: 12px;
          background: #f8f8f8;
          border: 1px solid #eee;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .date-item:hover {
          background: #f0f0f0;
          transform: translateY(-2px);
        }
        .date-item.active {
          background: #e0b100;
          border-color: #d0a000;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(224, 177, 0, 0.3);
          z-index: 2;
        }
        .date-item.active .price {
          color: white;
          font-weight: 700;
        }
        .date {
          font-size: 16px;
          font-weight: 500;
          color: #444;
        }
        .date-item.active .date {
          color: white;
          font-weight: 600;
        }
        .price {
          font-size: 16px;
          font-weight: 600;
          color: #e0b100;
          margin-top: 6px;
        }
        
        /* Center Indicator */
        .center-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin: 10px 0 20px;
        }
        .indicator-line {
          height: 1px;
          background: #e0b100;
          flex: 1;
          max-width: 200px;
        }
        .indicator-text {
          color: #e0b100;
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
        }
        
        /* Sort Dropdown Styles */
        .sort-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          position: relative;
        }
        .sort-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #222;
        }
        .sort-dropdown {
          position: relative;
        }
        .sort-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f0f0f0;
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sort-button:hover {
          background: #e0e0e0;
        }
        .sort-button svg {
          transition: transform 0.3s;
        }
        .sort-dropdown.open .sort-button svg {
          transform: rotate(180deg);
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          width: 240px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          z-index: 10;
          margin-top: 8px;
          overflow: hidden;
        }
        .dropdown-item {
          padding: 12px 16px;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .dropdown-item:hover {
          background: #f5f5f5;
        }
        .dropdown-item.selected {
          background: #f0f7ff;
          color: #0066cc;
          font-weight: 500;
        }
        
        /* Flight List Styles */
        .flight-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .flight-card {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          background: white;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .flight-card.selected {
          border-color: #e0b100;
          box-shadow: 0 4px 16px rgba(224, 177, 0, 0.2);
          transform: translateY(-5px);
        }
        .flight-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }
        .flight-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f0f0f0;
        }
        .flight-code {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        .flight-duration {
          font-size: 14px;
          color: #666;
        }
        .flight-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .time {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .departure, .arrival {
          display: flex;
          flex-direction: column;
        }
        .time-value {
          font-size: 20px;
          font-weight: 600;
          color: #222;
        }
        .airport {
          font-size: 14px;
          color: #666;
          margin-top: 4px;
        }
        .arrow {
          font-size: 20px;
          color: #999;
        }
        .flight-classes {
          display: flex;
          gap: 15px;
        }
        .class-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 16px;
          border-radius: 8px;
          min-width: 110px;
          transition: all 0.2s;
          cursor: pointer;
          border: 2px solid transparent;
        }
        .class-option:hover {
          transform: scale(1.03);
        }
        .class-option.active {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .class-option.economy {
          background: rgba(46, 125, 50, 0.1);
          border: 1px solid rgba(46, 125, 50, 0.3);
        }
        .class-option.economy.active {
          background: rgba(46, 125, 50, 0.2);
          border: 2px solid #2e7d32;
        }
        .class-option.business {
          background: rgba(21, 101, 192, 0.1);
          border: 1px solid rgba(21, 101, 192, 0.3);
        }
        .class-option.business.active {
          background: rgba(21, 101, 192, 0.2);
          border: 2px solid #1565c0;
        }
        .class-option.first-class {
          background: rgba(106, 27, 154, 0.1);
          border: 1px solid rgba(106, 27, 154, 0.3);
        }
        .class-option.first-class.active {
          background: rgba(106, 27, 154, 0.2);
          border: 2px solid #6a1b9a;
        }
        .class-option span {
          font-size: 14px;
          font-weight: 500;
        }
        .class-option .price {
          font-size: 18px;
          font-weight: 700;
          margin-top: 4px;
        }
        .economy .price {
          color: #2e7d32;
        }
        .business .price {
          color: #1565c0;
        }
        .first-class .price {
          color: #6a1b9a;
        }
        
        /* Class Detail Panel */
        .class-detail-panel {
          margin-top: 20px;
          border-top: 1px solid #eee;
          padding-top: 20px;
          animation: slideDown 0.3s ease-out forwards;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .panel-header {
          margin-bottom: 15px;
        }
        .panel-header h4 {
          font-size: 18px;
          color: #333;
          margin: 0;
        }
        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .benefit-item svg {
          flex-shrink: 0;
          margin-top: 3px;
        }
        .benefit-item span {
          font-size: 15px;
          color: #444;
        }
        .panel-footer {
          display: flex;
          justify-content: flex-end;
        }
        .select-button {
          background: #e0b100;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 12px 30px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 8px rgba(224, 177, 0, 0.3);
        }
        .select-button:hover {
          background: #d0a000;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(224, 177, 0, 0.4);
        }
        
        /* Price Summary */
        .price-summary {
          display: flex;
          justify-content: space-around;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .price-option {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .class-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }
        .class-price {
          font-size: 20px;
          font-weight: 700;
          color: #e0b100;
        }
        
        /* Responsive styles */
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
          .flight-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .flight-classes {
          .flight-classes {
            flex-wrap: wrap;
            gap: 12px;
          }
          .price-summary {
            flex-wrap: wrap;
            gap: 20px;
          }
          .date-item {
            min-width: 80px;
          }
        }
        @media (max-width: 768px) {
          .center-indicator {
            flex-direction: column;
            gap: 8px;
          }
          .indicator-line {
            width: 100%;
            max-width: none;
          }
          .indicator-text {
            padding: 0 10px;
          }
          .flight-classes {
            flex-direction: column;
          }
          .class-option {
            width: 100%;
          }
        }
        @media (max-width: 600px) {
          .flight-bg {
            height: 180px;
          }
          .top-info-bar, .nav-bar {
            flex-direction: column;
            align-items: flex-start;
            padding: 8px;
            font-size: 13px;
          }
          .top-info-bar {
            flex-direction: row;
            flex-wrap: wrap;
          }
          .nav-bar {
            padding-top: 12px;
            padding-bottom: 12px;
          }
          .logo {
            font-size: 18px;
            margin-bottom: 8px;
          }
          .nav-items {
            gap: 10px;
            font-size: 14px;
            flex-wrap: wrap;
          }
          .flight-content {
            margin-top: 16px;
            padding: 4px;
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
          .date-item {
            min-width: 70px;
            padding: 8px;
          }
          .date, .price {
            font-size: 14px;
          }
          .time-value {
            font-size: 18px;
          }
          .class-option {
            min-width: 90px;
            padding: 8px 10px;
          }
          .class-option .price {
            font-size: 16px;
          }
          .center-indicator .indicator-text {
            font-size: 12px;
          }
          .select-button {
            width: 100%;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default FlightSelect;