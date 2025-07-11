import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AddonServices = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // State cho addon services
  const [departureAddons, setDepartureAddons] = useState({
    selectedSeat: null,
    baggagePlan: "20kg",
    selectedMeals: []
  });
  const [returnAddons, setReturnAddons] = useState({
    selectedSeat: null,
    baggagePlan: "20kg",
    selectedMeals: []
  });

  // Xác định tab mặc định dựa vào location.state.tab (nếu có)
  const [currentTab, setCurrentTab] = useState(
    location.state && location.state.tab === "return" ? "return" : "departure"
  );

  // Giả sử bạn có biến isRoundTrip xác định loại chuyến bay (true nếu khứ hồi, false nếu 1 chiều)
  // Có thể lấy từ props, context, hoặc location.state. Ở đây ví dụ mặc định là true.
  const isRoundTrip = true;

  // Mock seat map data
  const seatRows = [
    { row: "A", seats: ["A1", "A2", "A3", "A4", "A5", "A6"] },
    { row: "B", seats: ["B1", "B2", "B3", "B4", "B5", "B6"] },
    { row: "C", seats: ["C1", "C2", "C3", "C4", "C5", "C6"] },
    { row: "D", seats: ["D1", "D2", "D3", "D4", "D5", "D6"] },
  ];

  // Mock meal options
  const mealOptions = [
    { id: "veg", name: "Vegetarian Meal", price: 15 },
    { id: "nonveg", name: "Non-Vegetarian Meal", price: 20 },
    { id: "special", name: "Special Meal", price: 25 },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavigate = (page) => {
    setMobileMenuOpen(false);
    // Navigation handler
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
      case "payment":
        navigate("/promotionandpayment");
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

  const handleMealSelect = (mealId, flightType) => {
    if (flightType === 'departure') {
      if (departureAddons.selectedMeals.includes(mealId)) {
        setDepartureAddons({
          ...departureAddons,
          selectedMeals: departureAddons.selectedMeals.filter(id => id !== mealId)
        });
      } else {
        setDepartureAddons({
          ...departureAddons,
          selectedMeals: [...departureAddons.selectedMeals, mealId]
        });
      }
    } else {
      if (returnAddons.selectedMeals.includes(mealId)) {
        setReturnAddons({
          ...returnAddons,
          selectedMeals: returnAddons.selectedMeals.filter(id => id !== mealId)
        });
      } else {
        setReturnAddons({
          ...returnAddons,
          selectedMeals: [...returnAddons.selectedMeals, mealId]
        });
      }
    }
  };

  const calculateAddonsForFlight = (addons) => {
    let total = 0;
    
    // Seat selection cost
    if (addons.selectedSeat) total += 30;
    
    // Baggage cost
    if (addons.baggagePlan === "30kg") total += 50;
    else if (addons.baggagePlan === "40kg") total += 80;
    
    // Meal costs
    addons.selectedMeals.forEach(mealId => {
      const meal = mealOptions.find(m => m.id === mealId);
      if (meal) total += meal.price;
    });
    
    return total;
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
            <span className="flight-type">{isRoundTrip ? "Round trip" : "One way"}</span>
          </div>
          <div className="flight-date">Tue, July 8, 2025 - Sat, July 19, 2025</div>
          <div className="flight-passenger">1 Adult</div>
          <div className="flight-class">Economy</div>
        </div>
        
        <div className="main-content-container">
          <div className="flight-section">
            <h2 className="section-title">Add-on Services</h2>
            
            {/* Tabs cho khứ hồi, ẩn nếu 1 chiều */}
            {isRoundTrip && (
              <div className="addon-tabs">
                <button 
                  className={`tab ${currentTab === 'departure' ? 'active' : ''}`}
                  onClick={() => setCurrentTab('departure')}
                >
                  Departure Flight (HAN → ICN)
                </button>
                <button 
                  className={`tab ${currentTab === 'return' ? 'active' : ''}`}
                  onClick={() => setCurrentTab('return')}
                >
                  Return Flight (ICN → HAN)
                </button>
              </div>
            )}
            
            {/* Nội dung add-ons theo tab hiện tại */}
            {currentTab === 'departure' ? (
              <>
                {/* Seat Selection cho departure */}
                <div className="addon-section">
                  <h3 className="addon-title">Choose your favourite seat (Departure)</h3>
                  <p className="addon-description">Select a seat for extra comfort during your flight</p>
                  
                  <div className="seat-map">
                    <div className="cockpit-indicator">Cockpit</div>
                    
                    {seatRows.map((row) => (
                      <div key={row.row} className="seat-row">
                        <div className="row-label">{row.row}</div>
                        <div className="seats-container">
                          {row.seats.map((seat) => (
                            <div
                              key={seat}
                              className={`seat ${departureAddons.selectedSeat === seat ? "selected" : ""}`}
                              onClick={() => setDepartureAddons({...departureAddons, selectedSeat: seat})}
                            >
                              {seat}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="exit-indicator">Exit</div>
                  </div>
                  
                  <div className="seat-legend">
                    <div className="legend-item">
                      <div className="seat available"></div>
                      <span>Available</span>
                    </div>
                    <div className="legend-item">
                      <div className="seat selected"></div>
                      <span>Selected</span>
                    </div>
                    <div className="legend-item">
                      <div className="seat occupied"></div>
                      <span>Occupied</span>
                    </div>
                  </div>
                </div>
                
                {/* Baggage Selection cho departure */}
                <div className="addon-section">
                  <h3 className="addon-title">Choose your baggage plan (Departure)</h3>
                  <p className="addon-description">Select the baggage allowance for your flight</p>
                  
                  <div className="baggage-options">
                    <div 
                      className={`baggage-option ${departureAddons.baggagePlan === "20kg" ? "selected" : ""}`}
                      onClick={() => setDepartureAddons({...departureAddons, baggagePlan: "20kg"})}
                    >
                      <div className="option-header">
                        <h4>Standard</h4>
                        <span className="price">Free</span>
                      </div>
                      <p>20kg checked baggage</p>
                    </div>
                    
                    <div 
                      className={`baggage-option ${departureAddons.baggagePlan === "30kg" ? "selected" : ""}`}
                      onClick={() => setDepartureAddons({...departureAddons, baggagePlan: "30kg"})}
                    >
                      <div className="option-header">
                        <h4>Plus</h4>
                        <span className="price">+$50</span>
                      </div>
                      <p>30kg checked baggage</p>
                    </div>
                    
                    <div 
                      className={`baggage-option ${departureAddons.baggagePlan === "40kg" ? "selected" : ""}`}
                      onClick={() => setDepartureAddons({...departureAddons, baggagePlan: "40kg"})}
                    >
                      <div className="option-header">
                        <h4>Premium</h4>
                        <span className="price">+$80</span>
                      </div>
                      <p>40kg checked baggage</p>
                    </div>
                  </div>
                </div>
                
                {/* Meal Selection cho departure */}
                <div className="addon-section">
                  <h3 className="addon-title">Choose a meal (Departure)</h3>
                  <p className="addon-description">Pre-order your in-flight meal</p>
                  
                  <div className="meal-options">
                    {mealOptions.map(meal => (
                      <div 
                        key={meal.id}
                        className={`meal-option ${departureAddons.selectedMeals.includes(meal.id) ? "selected" : ""}`}
                        onClick={() => handleMealSelect(meal.id, 'departure')}
                      >
                        <div className="meal-info">
                          <h4>{meal.name}</h4>
                          <p>Freshly prepared in-flight meal</p>
                        </div>
                        <div className="meal-price">
                          +${meal.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Seat Selection cho return */}
                <div className="addon-section">
                  <h3 className="addon-title">Choose your favourite seat (Return)</h3>
                  <p className="addon-description">Select a seat for extra comfort during your flight</p>
                  
                  <div className="seat-map">
                    <div className="cockpit-indicator">Cockpit</div>
                    
                    {seatRows.map((row) => (
                      <div key={row.row} className="seat-row">
                        <div className="row-label">{row.row}</div>
                        <div className="seats-container">
                          {row.seats.map((seat) => (
                            <div
                              key={seat}
                              className={`seat ${returnAddons.selectedSeat === seat ? "selected" : ""}`}
                              onClick={() => setReturnAddons({...returnAddons, selectedSeat: seat})}
                            >
                              {seat}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="exit-indicator">Exit</div>
                  </div>
                  
                  <div className="seat-legend">
                    <div className="legend-item">
                      <div className="seat available"></div>
                      <span>Available</span>
                    </div>
                    <div className="legend-item">
                      <div className="seat selected"></div>
                      <span>Selected</span>
                    </div>
                    <div className="legend-item">
                      <div className="seat occupied"></div>
                      <span>Occupied</span>
                    </div>
                  </div>
                </div>
                
                {/* Baggage Selection cho return */}
                <div className="addon-section">
                  <h3 className="addon-title">Choose your baggage plan (Return)</h3>
                  <p className="addon-description">Select the baggage allowance for your flight</p>
                  
                  <div className="baggage-options">
                    <div 
                      className={`baggage-option ${returnAddons.baggagePlan === "20kg" ? "selected" : ""}`}
                      onClick={() => setReturnAddons({...returnAddons, baggagePlan: "20kg"})}
                    >
                      <div className="option-header">
                        <h4>Standard</h4>
                        <span className="price">Free</span>
                      </div>
                      <p>20kg checked baggage</p>
                    </div>
                    
                    <div 
                      className={`baggage-option ${returnAddons.baggagePlan === "30kg" ? "selected" : ""}`}
                      onClick={() => setReturnAddons({...returnAddons, baggagePlan: "30kg"})}
                    >
                      <div className="option-header">
                        <h4>Plus</h4>
                        <span className="price">+$50</span>
                      </div>
                      <p>30kg checked baggage</p>
                    </div>
                    
                    <div 
                      className={`baggage-option ${returnAddons.baggagePlan === "40kg" ? "selected" : ""}`}
                      onClick={() => setReturnAddons({...returnAddons, baggagePlan: "40kg"})}
                    >
                      <div className="option-header">
                        <h4>Premium</h4>
                        <span className="price">+$80</span>
                      </div>
                      <p>40kg checked baggage</p>
                    </div>
                  </div>
                </div>
                
                {/* Meal Selection cho return */}
                <div className="addon-section">
                  <h3 className="addon-title">Choose a meal (Return)</h3>
                  <p className="addon-description">Pre-order your in-flight meal</p>
                  
                  <div className="meal-options">
                    {mealOptions.map(meal => (
                      <div 
                        key={meal.id}
                        className={`meal-option ${returnAddons.selectedMeals.includes(meal.id) ? "selected" : ""}`}
                        onClick={() => handleMealSelect(meal.id, 'return')}
                      >
                        <div className="meal-info">
                          <h4>{meal.name}</h4>
                          <p>Freshly prepared in-flight meal</p>
                        </div>
                        <div className="meal-price">
                          +${meal.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            <div className="form-row" style={{ justifyContent: "flex-end", gap: 16, marginTop: 32 }}>
              {/* Nút Back: nếu khứ hồi và đang ở tab return thì về tab departure, nếu 1 chiều thì về trang passengers */}
              {isRoundTrip && currentTab === 'return' ? (
                <button type="button" className="btn-outline" onClick={() => setCurrentTab('departure')}>
                  Back to Departure Flight
                </button>
              ) : (
                <button type="button" className="btn-outline" onClick={() => navigate("/passengers")}>
                  Back
                </button>
              )}
              
              {/* Nút Continue: nếu khứ hồi và đang ở tab departure thì sang tab return, nếu đang ở tab return hoặc 1 chiều thì sang payment */}
              {isRoundTrip && currentTab === 'departure' ? (
                <button type="button" className="btn-primary" onClick={() => setCurrentTab('return')}>
                  Continue to Return Flight
                </button>
              ) : (
                <button type="button" className="btn-primary" onClick={() => navigate("/promotionandpayment", { state: { isRoundTrip } })}>
                  Continue to Payment
                </button>
              )}
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
                  <span>{calculateAddonsForFlight(departureAddons)}.00 USD</span>
                </div>
              </div>
              
              {/* Addons Summary cho Departure Flight */}
              <div className="addons-summary">
                <div className="summary-header">Your add-ons for this flight</div>
                
                {departureAddons.selectedSeat && (
                  <div className="addon-item">
                    <span>Seat Selection</span>
                    <span>+30.00 USD</span>
                  </div>
                )}
                
                {departureAddons.baggagePlan !== "20kg" && (
                  <div className="addon-item">
                    <span>Baggage ({departureAddons.baggagePlan})</span>
                    <span>{departureAddons.baggagePlan === "30kg" ? "+50.00" : "+80.00"} USD</span>
                  </div>
                )}
                
                {departureAddons.selectedMeals.map(mealId => {
                  const meal = mealOptions.find(m => m.id === mealId);
                  return (
                    <div key={mealId} className="addon-item">
                      <span>{meal.name}</span>
                      <span>+{meal.price}.00 USD</span>
                    </div>
                  );
                })}
                
                {!departureAddons.selectedSeat && departureAddons.baggagePlan === "20kg" && departureAddons.selectedMeals.length === 0 && (
                  <div className="no-addons">No add-ons selected</div>
                )}
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
                  <span>{calculateAddonsForFlight(returnAddons)}.00 USD</span>
                </div>
              </div>
              
              {/* Addons Summary cho Return Flight */}
              <div className="addons-summary">
                <div className="summary-header">Your add-ons for this flight</div>
                
                {returnAddons.selectedSeat && (
                  <div className="addon-item">
                    <span>Seat Selection</span>
                    <span>+30.00 USD</span>
                  </div>
                )}
                
                {returnAddons.baggagePlan !== "20kg" && (
                  <div className="addon-item">
                    <span>Baggage ({returnAddons.baggagePlan})</span>
                    <span>{returnAddons.baggagePlan === "30kg" ? "+50.00" : "+80.00"} USD</span>
                  </div>
                )}
                
                {returnAddons.selectedMeals.map(mealId => {
                  const meal = mealOptions.find(m => m.id === mealId);
                  return (
                    <div key={mealId} className="addon-item">
                      <span>{meal.name}</span>
                      <span>+{meal.price}.00 USD</span>
                    </div>
                  );
                })}
                
                {!returnAddons.selectedSeat && returnAddons.baggagePlan === "20kg" && returnAddons.selectedMeals.length === 0 && (
                  <div className="no-addons">No add-ons selected</div>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="total-section">
              <div className="total-row">
                <span className="total-label">Total</span>
                <span className="total-amount">441.80 USD</span>
              </div>
              <div className="addons-total-row">
                <span>Add-ons total</span>
                <span>+{calculateAddonsForFlight(departureAddons) + calculateAddonsForFlight(returnAddons)}.00 USD</span>
              </div>
              <div className="grand-total-row">
                <span>Grand Total</span>
                <span>{441.80 + calculateAddonsForFlight(departureAddons) + calculateAddonsForFlight(returnAddons)}.00 USD</span>
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
        
        /* New styles for addon services */
        .addon-section {
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 1px solid #eee;
        }
        .addon-title {
          font-size: 18px;
          font-weight: 600;
          color: #222;
          margin-bottom: 8px;
        }
        .addon-description {
          color: #666;
          margin-bottom: 20px;
          font-size: 15px;
        }
        
        /* Seat selection styles */
        .seat-map {
          background: #f9f9f9;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          position: relative;
        }
        .cockpit-indicator, .exit-indicator {
          text-align: center;
          color: #888;
          font-size: 14px;
          margin: 10px 0;
          font-weight: 500;
        }
        .seat-row {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        .row-label {
          width: 30px;
          font-weight: 600;
          color: #555;
        }
        .seats-container {
          display: flex;
          gap: 10px;
        }
        .seat {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e0f0ff;
          border: 1px solid #b8daff;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          color: #333;
          transition: all 0.2s;
        }
        .seat:hover {
          background: #cfe7ff;
        }
        .seat.selected {
          background: #e0b100;
          color: white;
          border-color: #c09600;
        }
        .seat.occupied {
          background: #f1f1f1;
          color: #aaa;
          cursor: not-allowed;
        }
        .seat-legend {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 15px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
        }
        
        /* Baggage options styles */
        .baggage-options {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .baggage-option {
          flex: 1;
          min-width: 150px;
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .baggage-option:hover {
          border-color: #e0b100;
          background: #fffaf0;
        }
        .baggage-option.selected {
          border-color: #e0b100;
          background: #fffaf0;
          box-shadow: 0 0 0 2px rgba(224, 177, 0, 0.3);
        }
        .option-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .option-header h4 {
          margin: 0;
          font-size: 16px;
          color: #222;
        }
        .price {
          font-weight: 600;
          color: #e0b100;
        }
        
        /* Meal options styles */
        .meal-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .meal-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .meal-option:hover {
          border-color: #e0b100;
          background: #fffaf0;
        }
        .meal-option.selected {
          border-color: #e0b100;
          background: #fffaf0;
          box-shadow: 0 0 0 2px rgba(224, 177, 0, 0.3);
        }
        .meal-info {
          flex: 1;
        }
        .meal-info h4 {
          margin: 0 0 6px 0;
          font-size: 16px;
          color: #222;
        }
        .meal-info p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        .meal-price {
          font-weight: 600;
          color: #e0b100;
          min-width: 70px;
          text-align: right;
        }
        
        /* Addons summary styles */
        .addons-summary {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          padding: 20px;
          margin-bottom: 16px;
        }
        .summary-header {
          font-weight: 600;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
          color: #222;
        }
        .addon-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 15px;
          color: #444;
        }
        .no-addons {
          text-align: center;
          color: #888;
          padding: 15px 0;
          font-style: italic;
        }
        
        /* Updated total section */
        .addons-total-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 15px;
          color: #444;
          border-bottom: 1px solid #eee;
        }
        .grand-total-row {
          display: flex;
          justify-content: space-between;
          padding: 15px 0 5px;
          font-size: 17px;
          font-weight: 600;
          color: #222;
        }
        
        /* Flight detail card styles */
        .flight-detail-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          padding: 20px;
          margin-bottom: 20px;
        }
        .flight-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .flight-label {
          font-weight: 600;
          color: #444;
        }
        .flight-price {
          font-weight: 700;
          color: #222;
          font-size: 18px;
        }
        .flight-info {
          margin-bottom: 15px;
        }
        .route-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
        }
        .airport-code {
          font-weight: 600;
        }
        .arrow {
          color: #888;
        }
        .flight-time {
          color: #666;
          font-size: 14px;
        }
        .price-breakdown {
          margin-top: 15px;
          border-top: 1px solid #eee;
          padding-top: 15px;
        }
        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          color: #555;
        }
        
        /* Tabs styles */
        .addon-tabs {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .tab {
          padding: 12px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          color: #666;
          position: relative;
        }
        .tab.active {
          color: #e0b100;
          font-weight: 600;
        }
        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: #e0b100;
        }
        
        /* Responsive styles */
        @media (max-width: 1100px) {
          .main-content-container {
            flex-direction: column;
            gap: 24px;
          }
          .pricing-sidebar {
            width: 100%;
            min-width: auto;
          }
          .baggage-options {
            flex-direction: column;
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
          .seats-container {
            gap: 5px;
          }
          .seat {
            width: 30px;
            height: 30px;
            font-size: 12px;
          }
          .tab {
            padding: 8px 12px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default AddonServices;