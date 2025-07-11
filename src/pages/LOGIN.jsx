import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LOGIN = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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
    
    if (!formData.username.trim()) {
      newErrors.username = "Username or email is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle login logic here
      console.log('Login data:', formData);
      // Add your login logic here
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
    <div className="login-root">
      {/* Background Image - Full Screen */}
      <div className="login-bg" />
      
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

      {/* Mobile Menu Popup */}
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

      {/* Main Content - Login Form */}
      <div className="login-content">
        <div className="login-form-container">
          <div className="login-form">
            <h2>LOG IN</h2>

            <div onSubmit={handleLogin}>
              {/* Username/Email */}
              <div className="form-group">
                <input
                  type="text"
                  placeholder="USERNAME OR EMAIL"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={errors.username ? "error" : ""}
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>

              {/* Password */}
              <div className="form-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="PASSWORD"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </div>
                <span className="forgot-password" onClick={() => handleNavigate('forgot-password')}>
                  Forgot password?
                </span>
              </div>

              {/* Login Button */}
              <button type="submit" className="login-btn" onClick={handleLogin}>
                LOG IN
              </button>
            </div>

            <div className="signup-link">
              Don't have an account?{' '}
              <span onClick={() => handleNavigate('signup')}>Sign up here</span>
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
        .login-root {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        
        .login-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(270deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%), 
                     url('assets/images/hero_image.png') center/cover no-repeat;
          z-index: 0;
        }
        
        /* Top Info Bar */
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
        
        /* Navigation Bar */
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
        
        /* Mobile Menu Styles */
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
        
        /* Login Form Styles */
        .login-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
          min-height: calc(100vh - 120px);
        }
        
        .login-form-container {
          width: 100%;
          max-width: 1200px;
          padding: 0 24px;
          display: flex;
          justify-content: center;
        }
        
        .login-form {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
          padding: 40px;
          width: 100%;
          max-width: 500px;
        }
        
        .login-form h2 {
          color: #e0b100;
          font-size: 40px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 32px;
          letter-spacing: 1px;
        }
        
        .form-group {
          margin-bottom: 20px;
          position: relative;
        }
        
        .password-group {
          position: relative;
        }
        
        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: #666;
          padding: 0;
          z-index: 1;
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
        
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          font-size: 14px;
        }
        
        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #666;
        }
        
        .remember-me input {
          width: auto;
          margin: 0;
          padding: 0;
        }
        
        .forgot-password {
          color: #004cff;
          cursor: pointer;
          font-weight: 600;
          text-decoration: underline;
        }
        
        .login-btn {
          width: 100%;
          background: #e0b100;
          color: white;
          padding: 18px;
          border: none;
          border-radius: 12px;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 20px;
          transition: background-color 0.2s, transform 0.1s;
          letter-spacing: 0.5px;
        }
        
        .login-btn:hover {
          background: #d0a000;
          transform: translateY(-1px);
        }
        
        .signup-link {
          text-align: center;
          margin: 16px 0;
          color: #666;
          font-size: 14px;
        }
        
        .signup-link span {
          color: #004cff;
          cursor: pointer;
          font-weight: 600;
          text-decoration: underline;
        }
        
        .guest-option {
          text-align: center;
          margin-bottom: 24px;
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
          
          .login-form {
            padding: 32px;
          }
        }
        
        @media (max-width: 600px) {
          .login-form {
            padding: 24px 16px;
          }
          
          .login-form h2 {
            font-size: 32px;
          }
          
          input {
            padding: 16px 14px;
          }
          
          .login-btn {
            padding: 16px;
            font-size: 18px;
          }
          
          .form-options {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
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

export default LOGIN;