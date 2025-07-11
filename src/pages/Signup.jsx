import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SIGNUP = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSignUp = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle signup logic here
      console.log('Sign up data:', formData);
      // Add your signup logic here
    }
  };

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
    <div className="signup-root">
      {/* Background Image - Full Screen */}
      <div className="signup-bg" />
      
      {/* Top Info Bar - Updated to match FlightSelect */}
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

      {/* Navigation Bar - Updated to match FlightSelect */}
      <nav className="nav-bar" style={isMobile ? { display: "flex", alignItems: "center", justifyContent: "space-between" } : {}}>
        <div className="logo" onClick={() => handleNavigate("home")}>SkyJourney</div>
        
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
          >
            <span style={{ fontSize: "28px", fontWeight: "bold", lineHeight: 1 }}>☰</span>
          </button>
        )}
      </nav>

      {/* Mobile Menu Popup - Updated to match FlightSelect */}
      {mobileMenuOpen && isMobile && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="mobile-menu-popup"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="mobile-menu-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
            <h3>MENU</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                className="mobile-menu-item highlight"
                onClick={() => handleNavigate('about')}
              >
                About
              </div>
              <div
                className="mobile-menu-item"
                onClick={() => handleNavigate('explore')}
              >
                Explore
              </div>
              <div
                className="mobile-menu-item"
                onClick={() => handleNavigate('bookings')}
              >
                Bookings
              </div>
              <div
                className="mobile-menu-item"
                onClick={() => handleNavigate('contact')}
              >
                Contact Us
              </div>
              <div style={{ borderTop: '1px solid #eee', marginTop: 10, paddingTop: 10 }}>
                <div
                  className="mobile-menu-item highlight"
                  onClick={() => handleNavigate('login')}
                >
                  Log In
                </div>
                <button
                  className="mobile-menu-signup-btn"
                  onClick={() => handleNavigate('signup')}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Sign Up Form */}
      <div className="signup-content">
        <div className="signup-form-container">
          <div className="signup-form">
            <h2>SIGN UP</h2>

            <div onSubmit={handleSignUp}>
              {/* First Name and Last Name Row */}
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="FIRST NAME"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? "error" : ""}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="LAST NAME"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? "error" : ""}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <input
                  type="email"
                  placeholder="EMAIL"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <input
                  type="tel"
                  placeholder="PHONE NUMBER"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              {/* Username */}
              <div className="form-group">
                <input
                  type="text"
                  placeholder="USERNAME"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={errors.username ? "error" : ""}
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>

              {/* Password */}
              <div className="form-group">
                <input
                  type="password"
                  placeholder="PASSWORD"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? "error" : ""}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <input
                  type="password"
                  placeholder="CONFIRM PASSWORD"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? "error" : ""}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {/* Sign Up Button */}
              <button type="submit" className="signup-btn">
                CREATE ACCOUNT
              </button>
            </div>

            <div className="login-link">
              Already have an account?{' '}
              <span onClick={() => handleNavigate('login')}>Sign in here</span>
            </div>

            <div className="guest-option">
              <button onClick={() => handleNavigate('passengers')}>
                Continue without an account
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f5f7fa;
          color: #333;
        }
        .signup-root {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        
        .signup-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(270deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%), 
                     url('assets/images/hero_image.png') center/cover no-repeat;
          z-index: 0;
        }
        
        /* Top Info Bar - Matches FlightSelect */
        .top-info-bar {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 48px;   
          background: transparent;
          color: white;
          font-size: 15px;
        }
        
        .info-left span {
          color: #ffffff;
          font-size: 14px;
        }
        
        .info-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .link {
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .link:hover {
          color: #e0b100;
        }
        
        .btn-outline {
          border: 1px solid #e0b100;
          background: transparent;
          color: #e0b100;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
          margin-left: 8px;
          transition: all 0.2s;
          font-weight: 600;
        }
        
        .btn-outline:hover {
          background: #e0b100;
          color: #fff;
        }
        
        /* Navigation Bar - Matches FlightSelect */
        .nav-bar {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 48px;
          background: transparent;
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
        
        /* Mobile Menu Styles - Matches FlightSelect */
        .mobile-menu-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          font-size: 28px;
          color: #e0b100;
          display: flex;
          align-items: center;
          justify: center;
        }
        
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .mobile-menu-popup {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          padding: 32px 24px;
          min-width: 280px;
          max-width: 90vw;
          text-align: center;
          position: relative;
          animation: slideIn 0.3s ease-out;
        }
        
        .mobile-menu-close {
          position: absolute;
          top: 12px;
          right: 16px;
          background: none;
          border: none;
          font-size: 28px;
          color: #999;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .mobile-menu-close:hover {
          background-color: #f5f5f5;
          color: #666;
        }
        
        .mobile-menu-item {
          display: block;
          color: #333;
          font-size: 18px;
          font-weight: 600;
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 8px;
          transition: background-color 0.2s, color 0.2s;
          cursor: pointer;
        }
        
        .mobile-menu-item:hover {
          background-color: #e0b100;
          color: #fff;
        }
        
        .mobile-menu-item.highlight {
          color: #e0b100;
          background-color: #f0f0f0;
        }
        
        .mobile-menu-signup-btn {
          margin-top: 12px;
          width: 80%;
          background: #e0b100;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .mobile-menu-signup-btn:hover {
          background: #d0a000;
        }
        
        /* Signup Form Styles */
        .signup-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
          min-height: calc(100vh - 120px);
        }
        
        .signup-form-container {
          width: 100%;
          max-width: 1200px;
          padding: 0 24px;
          display: flex;
          justify-content: center;
        }
        
        .signup-form {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          padding: 40px;
          width: 100%;
          max-width: 600px;
        }
        
        .signup-form h2 {
          color: #e0b100;
          font-size: 40px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 32px;
          letter-spacing: 1px;
        }
        
        .form-row {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .form-group {
          flex: 1;
          margin-bottom: 16px;
        }
        
        input {
          width: 100%;
          padding: 18px 16px;
          background: #fff;
          border: 2px solid #ddd;
          border-radius: 12px;
          font-size: 16px;
          color: #333;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
          font-weight: 500;
        }
        
        input:focus {
          border-color: #e0b100;
        }
        
        input.error {
          border-color: #ff4444;
        }
        
        .error-message {
          color: #ff4444;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }
        
        .signup-btn {
          width: 100%;
          background: #e0b100;
          color: white;
          padding: 18px;
          border: none;
          border-radius: 12px;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 16px;
          transition: background-color 0.2s, transform 0.1s;
          letter-spacing: 0.5px;
        }
        
        .signup-btn:hover {
          background: #d0a000;
          transform: translateY(-1px);
        }
        
        .login-link {
          text-align: center;
          margin: 16px 0;
          color: #666;
          font-size: 14px;
        }
        
        .login-link span {
          color: #004cff;
          cursor: pointer;
          font-weight: 600;
          text-decoration: underline;
        }
        
        .guest-option {
          text-align: center;
        }
        
        .guest-option button {
          background: #767676;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
          font-weight: 500;
        }
        
        .guest-option button:hover {
          background: #666;
        }
        
        /* Responsive styles */
        @media (max-width: 900px) {
          .top-info-bar, .nav-bar {
            padding: 12px 16px;
          }
          
          .nav-items {
            gap: 18px;
          }
          
          .signup-form {
            padding: 32px;
          }
          
          .form-row {
            flex-direction: column;
            gap: 0;
          }
        }
        
        @media (max-width: 600px) {
          .signup-form {
            padding: 24px 16px;
          }
          
          .signup-form h2 {
            font-size: 32px;
          }
          
          input {
            padding: 16px 14px;
          }
          
          .signup-btn {
            padding: 16px;
            font-size: 18px;
          }
        }
        
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
  );
};

export default SIGNUP;