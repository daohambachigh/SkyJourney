import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigate = (page) => {
    setMobileMenuOpen(false);
    
    switch(page) {
      case 'Landingpage':
        navigate('/');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'signup':
        navigate('/signup');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'explore':
        navigate('/explore');
        break;
      case 'bookings':
        navigate('/bookings');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'book-flight':
        navigate('/');
        break;
      default:
        break;
    }
  };

  return (
    <div className="about-container">
      {/* Flight Background */}
      <div className="flight-bg" />

      {/* Top Info Bar - Hidden on mobile */}
      {!isMobile && (
        <div className="top-info-bar">
          <div className="contact-info">
            <span>+84 395908838</span>
            <span>bookingflight@gmail.com</span>
          </div>
          <div className="auth-links">
            <span 
              className="login-link"
              onClick={() => handleNavigate('login')}
            >
              Log In
            </span>
            <button 
              className="signup-button"
              onClick={() => handleNavigate('signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className={`nav-bar ${isMobile ? 'mobile' : ''}`}>
        <div 
          className="logo"
          onClick={() => handleNavigate('Landingpage')}
        >
          SkyJourney
        </div>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="nav-links">
            <span
              className="nav-link active"
              onClick={() => handleNavigate('about')}
            >
              About
            </span>
            <span
              className="nav-link"
              onClick={() => handleNavigate('explore')}
            >
              Explore
            </span>
            <span
              className="nav-link"
              onClick={() => handleNavigate('bookings')}
            >
              Bookings
            </span>
            <span
              className="nav-link"
              onClick={() => handleNavigate('contact')}
            >
              Contact Us
            </span>
          </div>
        )}
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
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
            className="mobile-menu-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="close-menu-button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
            
            <h3 className="mobile-menu-title">
              MENU
            </h3>
            
            <div className="mobile-menu-links">
              <div
                className="mobile-menu-link active"
                onClick={() => handleNavigate('about')}
              >
                About
              </div>
              <div
                className="mobile-menu-link"
                onClick={() => handleNavigate('explore')}
              >
                Explore
              </div>
              <div
                className="mobile-menu-link"
                onClick={() => handleNavigate('bookings')}
              >
                Bookings
              </div>
              <div
                className="mobile-menu-link"
                onClick={() => handleNavigate('contact')}
              >
                Contact Us
              </div>
              <div className="mobile-menu-auth">
                <div
                  className="mobile-login-link"
                  onClick={() => handleNavigate('login')}
                >
                  Log In
                </div>
                <button
                  className="mobile-signup-button"
                  onClick={() => handleNavigate('signup')}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - About Section */}
      <div className="main-content">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">
            ABOUT US
          </h1>
          <p className="hero-subtitle">
            Discover the world with confidence through our premium flight booking experience
          </p>
        </div>

        {/* Content Sections */}
        <div className="about-grid">
          {/* Our Story */}
          <div className="about-card">
            <h2 className="card-title">
              Our Story
            </h2>
            <p className="card-text">
              Founded with a passion for travel and technology, we've been connecting travelers to their dream destinations for over a decade. Our platform combines cutting-edge technology with personalized service to make flight booking simple, secure, and enjoyable.
            </p>
          </div>

          {/* Our Mission */}
          <div className="about-card">
            <h2 className="card-title">
              Our Mission
            </h2>
            <p className="card-text">
              To democratize travel by providing transparent, competitive pricing and exceptional customer service. We believe everyone deserves to explore the world without breaking the bank or dealing with complicated booking processes.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon">
              ✈️
            </div>
            <h3 className="feature-title">
              Best Prices
            </h3>
            <p className="feature-text">
              Compare prices across multiple airlines to find the best deals for your journey
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon">
              🛡️
            </div>
            <h3 className="feature-title">
              Secure Booking
            </h3>
            <p className="feature-text">
              Your personal and payment information is protected with industry-leading security
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon">
              🎧
            </div>
            <h3 className="feature-title">
              24/7 Support
            </h3>
            <p className="feature-text">
              Our customer support team is available around the clock to assist you
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <h2 className="cta-title">
            Ready to Start Your Journey?
          </h2>
          <p className="cta-text">
            Join millions of travelers who trust us with their flight bookings
          </p>
          <button 
            className="cta-button"
            onClick={() => handleNavigate('book-flight')}
          >
            Book Your Flight Now
          </button>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .about-container {
          min-height: 100vh;
          background: #f5f7fa;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .flight-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 420px;
          background: linear-gradient(270deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%), url("assets/images/hero_image.png") center/cover no-repeat;
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
          font-size: 16px;
        }
        
        .contact-info {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        
        .contact-info span {
          color: #666;
          font-size: 14px;
        }
        
        .auth-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        
        .login-link {
          color: #e0b100;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
          font-size: 15px;
        }
        
        .login-link:hover {
          color: #d0a000;
        }
        
        .signup-button {
          border: 1px solid #e0b100;
          background: transparent;
          color: #666;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .signup-button:hover {
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
        
        .nav-bar.mobile {
          padding: 16px;
        }
        
        .logo {
          color: #e0b100;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .logo:hover {
          color: #d0a000;
        }
        
        .nav-links {
          display: flex;
          gap: 32px;
        }
        
        .nav-link {
          color: #333;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .nav-link.active {
          color: #e0b100;
        }
        
        .nav-link:hover {
          color: #e0b100;
        }
        
        .mobile-menu-button {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          font-size: 28px;
          color: #e0b100;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          transition: color 0.2s;
        }
        
        .mobile-menu-button:hover {
          color: #d0a000;
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
        
        .mobile-menu-content {
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
        
        .close-menu-button {
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
        
        .close-menu-button:hover {
          background-color: #f5f5f5;
          color: #666;
        }
        
        .mobile-menu-title {
          color: #e0b100;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 24px 0;
          letter-spacing: 0.5px;
        }
        
        .mobile-menu-links {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .mobile-menu-link {
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
        
        .mobile-menu-link.active {
          color: #e0b100;
          background-color: #f0f0f0;
        }
        
        .mobile-menu-link:hover {
          background-color: #e0b100;
          color: #fff;
        }
        
        .mobile-menu-auth {
          border-top: 1px solid #eee;
          margin-top: 10px;
          padding-top: 10px;
        }
        
        .mobile-login-link {
          color: #e0b100;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          padding: 12px 16px;
          display: block;
          cursor: pointer;
        }
        
        .mobile-signup-button {
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
          transition: all 0.2s;
        }
        
        .mobile-signup-button:hover {
          background: #d0a000;
          box-shadow: 0 6px 12px rgba(224, 177, 0, 0.4);
        }
        
        .main-content {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 64px 96px;
          max-width: 1200px;
          margin: 40px auto 80px auto;
          width: 100%;
        }
        
        .hero-section {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .hero-title {
          color: #e0b100;
          font-size: 48px;
          font-weight: 700;
          margin: 0 0 20px 0;
          letter-spacing: 1px;
        }
        
        .hero-subtitle {
          color: #fff;
          font-size: 20px;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin-bottom: 60px;
        }
        
        .about-card {
          background: rgba(255,255,255,0.95);
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        
        .card-title {
          color: #e0b100;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }
        
        .card-text {
          color: #333;
          font-size: 16px;
          line-height: 1.7;
          margin: 0;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-bottom: 60px;
        }
        
        .feature-card {
          background: rgba(255,255,255,0.95);
          padding: 28px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        
        .feature-icon {
          width: 60px;
          height: 60px;
          background: #e0b100;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
          font-size: 28px;
        }
        
        .feature-title {
          color: #333;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }
        
        .feature-text {
          color: #666;
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
        }
        
        .cta-section {
          background: #e0b100;
          padding: 48px;
          border-radius: 20px;
          text-align: center;
          color: #fff;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
        }
        
        .cta-title {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }
        
        .cta-text {
          font-size: 18px;
          line-height: 1.6;
          margin: 0 0 24px 0;
          opacity: 0.9;
        }
        
        .cta-button {
          background: #fff;
          color: #e0b100;
          padding: 16px 40px;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
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
        
        /* Mobile styles */
        @media (max-width: 768px) {
          .top-info-bar {
            display: none;
          }
          
          .nav-bar {
            padding: 16px;
          }
          
          .logo {
            font-size: 22px;
          }
          
          .main-content {
            padding: 20px 16px;
          }
          
          .hero-section {
            margin-bottom: 40px;
          }
          
          .hero-title {
            font-size: 32px;
          }
          
          .hero-subtitle {
            font-size: 16px;
          }
          
          .about-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            margin-bottom: 40px;
          }
          
          .about-card {
            padding: 24px;
          }
          
          .card-title {
            font-size: 24px;
          }
          
          .card-text {
            font-size: 14px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            margin-bottom: 40px;
          }
          
          .feature-card {
            padding: 24px;
          }
          
          .feature-title {
            font-size: 18px;
          }
          
          .feature-text {
            font-size: 14px;
          }
          
          .cta-section {
            padding: 32px 24px;
          }
          
          .cta-title {
            font-size: 24px;
          }
          
          .cta-text {
            font-size: 16px;
          }
          
          .cta-button {
            padding: 14px 32px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default About;