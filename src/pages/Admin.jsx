import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // API states
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stats state
  const [stats, setStats] = useState({
    totalFlights: 0,
    activeAircrafts: 0,
    ticketsSold: 0,
    revenue: 0
  });
  
  // Form states
  const [editingFlight, setEditingFlight] = useState(null);
  const [editingAircraft, setEditingAircraft] = useState(null);
  
  const [announcement, setAnnouncement] = useState({
    title: "",
    content: "",
    priority: "Normal"
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Hàm lấy region của sân bay
  const getAirportRegion = (code) => {
    const airport = airports.find(a => a.code === code);
    return airport?.region || "Unknown";
  };

  // Hàm lọc chuyến bay theo ngày
  const filterByDate = (flight) => {
    if (!selectedDate) return true;
    const flightDate = new Date(flight.date).toISOString().slice(0,10);
    return flightDate === selectedDate;
  };

  // Debug: Thêm console.log để kiểm tra dữ liệu
  console.log("All flights count:", flights.length);
  console.log("Sample flight dates:", flights.slice(0, 5).map(f => ({ 
    id: f.id, 
    flightNumber: f.flightNumber,
    date: f.date,
    departure: f.departure,
    arrival: f.arrival
  })));
  console.log("Selected date:", selectedDate);
  console.log("Selected region:", selectedRegion);

  // Chia chuyến bay theo khu vực và bộ lọc
  const filteredFlights = flights || []; // Ensure flights is always an array

  console.log("=== FILTER RESULTS ===");
  console.log("Total flights:", flights?.length || 0);
  console.log("Filtered flights:", filteredFlights.length);
  console.log("Selected date:", selectedDate);
  console.log("Selected region:", selectedRegion);

  // Thêm debug để hiểu dữ liệu
  if (flights && flights.length > 0) {
    console.log("First flight sample:", {
      id: flights[0].id,
      date: flights[0].date,
      departure: flights[0].departure,
      arrival: flights[0].arrival
    });
  }

  // 👈 CẬP NHẬT: Fetch functions với database thực
  const fetchFlightsByFilter = async (selectedDate = "", selectedRegion = "all") => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Admin: Fetching flights with filters:', { selectedDate, selectedRegion });
      
      const params = new URLSearchParams();
      if (selectedDate && selectedDate.trim() !== '') {
        params.append('date', selectedDate);
      }
      if (selectedRegion && selectedRegion !== 'all') {
        params.append('region', selectedRegion);
      }
      
      const url = `http://localhost:5000/api/admin/flights/by-date?${params.toString()}`;
      console.log('📡 Calling:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Admin: Flights fetched with filters:', data.length);
      setFlights(data);
    } catch (error) {
      setError(error.message);
      console.error('❌ Admin: Error fetching flights:', error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAirports = async () => {
    try {
      console.log('🔄 Admin: Fetching airports...');
      const response = await fetch('http://localhost:5000/api/airports');
      if (!response.ok) throw new Error('Failed to fetch airports');
      const data = await response.json();
      console.log('✅ Admin: Airports fetched:', data.length);
      setAirports(data);
    } catch (error) {
      console.error('❌ Admin: Error fetching airports:', error);
      setAirports([]);
    }
  };

  const fetchAircrafts = async () => {
    try {
      console.log('🔄 Admin: Fetching aircrafts...');
      const response = await fetch('http://localhost:5000/api/aircrafts');
      if (!response.ok) throw new Error('Failed to fetch aircrafts');
      
      const data = await response.json();
      console.log('✅ Admin: Aircrafts fetched:', data.length);
      
      const formattedAircrafts = data.map(aircraft => ({
        ...aircraft,
        width: aircraft.width || 9,
        length: aircraft.length || 30,
        seatMap: aircraft.seat_map || []
      }));
      setAircrafts(formattedAircrafts);
    } catch (error) {
      console.error('❌ Admin: Error fetching aircrafts:', error);
      setAircrafts([]);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('🔄 Admin: Fetching dashboard stats...');
      const response = await fetch('http://localhost:5000/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      console.log('✅ Admin: Stats fetched:', data);
      setStats(data);
    } catch (error) {
      console.error('❌ Admin: Error fetching stats:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAirports();
    fetchAircrafts();
    fetchStats();
    // Fetch flights khi vào dashboard hoặc flights tab
    if (activeTab === "dashboard" || activeTab === "flights") {
      fetchFlightsByFilter("", "all");
    }
  }, []);

  // 👈 CẬP NHẬT: Handler functions với database thực
  const handleAddFlight = async () => {
    if (!editingFlight?.flightNumber || !editingFlight?.departure || !editingFlight?.arrival) {
      alert('Vui lòng điền đầy đủ thông tin chuyến bay');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Admin: Adding flight:', editingFlight);
      
      const response = await fetch('http://localhost:5000/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightNumber: editingFlight.flightNumber,
          departure: editingFlight.departure,
          arrival: editingFlight.arrival,
          departureTime: editingFlight.departureTime,
          arrivalTime: editingFlight.arrivalTime,
          date: editingFlight.date,
          aircraftModel: editingFlight.aircraftModel || 'Boeing 737-800',
          economyPrice: editingFlight.economyPrice || 220.90,
          businessPrice: editingFlight.businessPrice || 450.90,
          firstClassPrice: editingFlight.firstClassPrice || 880.90,
          economySeats: editingFlight.economySeats || 100,
          businessSeats: editingFlight.businessSeats || 20,
          firstClassSeats: editingFlight.firstClassSeats || 8
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add flight');
      }

      const result = await response.json();
      console.log('✅ Admin: Flight added successfully:', result);
      
      alert('Chuyến bay đã được thêm thành công!');
      setEditingFlight(null);
      fetchFlightsByFilter(selectedDate, selectedRegion);
      fetchStats(); // Update stats
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
      console.error('❌ Admin: Error adding flight:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlight = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chuyến bay này?")) return;

    try {
      setLoading(true);
      console.log(`🔄 Admin: Deleting flight ${id}`);
      
      const response = await fetch(`http://localhost:5000/api/flights/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete flight');
      }

      const result = await response.json();
      console.log('✅ Admin: Flight deleted successfully:', result);
      
      alert('Chuyến bay đã được xóa thành công!');
      fetchFlightsByFilter(selectedDate, selectedRegion);
      fetchStats(); // Update stats
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
      console.error('❌ Admin: Error deleting flight:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAircraft = async () => {
    if (!editingAircraft.model || !editingAircraft.width || !editingAircraft.length) {
      alert('Vui lòng điền đầy đủ thông tin máy bay');
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔄 Admin: Adding aircraft:', editingAircraft);
      
      const response = await fetch('http://localhost:5000/api/aircrafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: editingAircraft.model,
          manufacturer: 'Unknown',
          width: parseInt(editingAircraft.width),
          length: parseInt(editingAircraft.length),
          seat_map: editingAircraft.seatMap || Array(parseInt(editingAircraft.length))
            .fill(0)
            .map(() => Array(parseInt(editingAircraft.width)).fill("economy"))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add aircraft');
      }

      const result = await response.json();
      console.log('✅ Admin: Aircraft added successfully:', result);
      
      alert('Máy bay đã được thêm thành công!');
      setEditingAircraft(null); // Reset form
      fetchAircrafts(); // Refresh list
      fetchStats(); // Update stats
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
      console.error('❌ Admin: Error adding aircraft:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAircraft = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa máy bay này?")) return;

    try {
      setLoading(true);
      console.log(`🔄 Admin: Deleting aircraft ${id}`);
      
      const response = await fetch(`http://localhost:5000/api/aircrafts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete aircraft');
      }

      const result = await response.json();
      console.log('✅ Admin: Aircraft deleted successfully:', result);
      
      alert('Máy bay đã được xóa thành công!');
      fetchAircrafts();
      fetchStats(); // Update stats
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
      console.error('❌ Admin: Error deleting aircraft:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnnouncement = () => {
    if (!announcement.title || !announcement.content) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung thông báo');
      return;
    }
    
    alert('Thông báo đã được đăng thành công!');
    setAnnouncement({
      title: "",
      content: "",
      priority: "Normal"
    });
  };

  // Chỉnh sửa sơ đồ ghế
  const [selectedAircraftId, setSelectedAircraftId] = useState(null);
  const [seatMapEdit, setSeatMapEdit] = useState(null);

  const handleEditSeatMap = (aircraft) => {
    setSelectedAircraftId(aircraft.id);
    setSeatMapEdit(
      aircraft.seatMap.length
        ? JSON.parse(JSON.stringify(aircraft.seatMap))
        : Array(aircraft.length)
            .fill(0)
            .map(() => Array(aircraft.width).fill("economy"))
    );
  };

  const handleSeatTypeChange = (rowIdx, colIdx, type) => {
    const updated = seatMapEdit.map((row, r) =>
      row.map((seat, c) => (r === rowIdx && c === colIdx ? type : seat))
    );
    setSeatMapEdit(updated);
  };

  const handleSaveSeatMap = async () => {
    try {
      setLoading(true);
      console.log(`🔄 Admin: Updating seat map for aircraft ${selectedAircraftId}`);
      
      const response = await fetch(`http://localhost:5000/api/aircrafts/${selectedAircraftId}/seatmap`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seat_map: seatMapEdit
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update seat map');
      }

      const result = await response.json();
      console.log('✅ Admin: Seat map updated successfully:', result);
      
      // Update local state
      setAircrafts(aircrafts.map(a =>
        a.id === selectedAircraftId ? { ...a, seatMap: seatMapEdit } : a
      ));
      
      setSelectedAircraftId(null);
      setSeatMapEdit(null);
      alert('Sơ đồ ghế đã được cập nhật thành công!');
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
      console.error('❌ Admin: Error updating seat map:', error);
    } finally {
      setLoading(false);
    }
  };

  // Định dạng tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount * 1000);
  };

  // Update seatMap when width/length changes in aircraft edit form
  React.useEffect(() => {
    if (
      editingAircraft &&
      (editingAircraft.width || editingAircraft.length)
    ) {
      const width = parseInt(editingAircraft.width) || 0;
      const length = parseInt(editingAircraft.length) || 0;
      if (width > 0 && length > 0) {
        setEditingAircraft(prev => ({
          ...prev,
          seatMap: Array(length)
            .fill(0)
            .map((_, rowIdx) =>
              Array(width)
                .fill(0)
                .map((_, colIdx) =>
                  prev.seatMap &&
                  prev.seatMap[rowIdx] &&
                  prev.seatMap[rowIdx][colIdx]
                    ? prev.seatMap[rowIdx][colIdx]
                    : "economy"
                )
            )
        }));
      }
    }
  }, [editingAircraft?.width, editingAircraft?.length]);

  // Thêm chức năng chọn hạng ghế theo hàng trong seat map editor
  const handleSetRowClass = (rowIdx, seatType) => {
    if (!editingAircraft || !editingAircraft.seatMap) return;
    const updatedSeatMap = editingAircraft.seatMap.map((row, idx) =>
      idx === rowIdx ? row.map(() => seatType) : row
    );
    setEditingAircraft({
      ...editingAircraft,
      seatMap: updatedSeatMap
    });
  };

  // 👈 THÊM: useEffect để tự động fetch khi filter thay đổi
  useEffect(() => {
    if (activeTab === "flights") {
      fetchFlightsByFilter(selectedDate, selectedRegion);
    }
  }, [selectedDate, selectedRegion, activeTab]);

  // 👈 THÊM: Handler functions cho filters
  const handleDateChange = (newDate) => {
    console.log('📅 Date changed to:', newDate);
    setSelectedDate(newDate);
  };

  const handleRegionChange = (newRegion) => {
    console.log('🌍 Region changed to:', newRegion);
    setSelectedRegion(newRegion);
  };

  const handleResetFilters = () => {
    console.log('🔄 Resetting filters');
    setSelectedDate("");
    setSelectedRegion("all");
  };

  // 👈 CẬP NHẬT: Thay thế fetchFlights cũ
  const fetchFlights = async () => {
    await fetchFlightsByFilter(selectedDate, selectedRegion);
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar Navigation */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-logo" onClick={() => navigate("/")}>
          <span className="logo-text">
            <span className="logo-sky">SkyJourney</span>
            <span className="logo-admin">Admin</span>
          </span>
          <button 
            className="sidebar-close"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(false);
            }}
          >
            ✕
          </button>
        </div>
        
        <div className="admin-menu">
          <div 
            className={`menu-item ${activeTab === "dashboard" ? "active" : ""}`} 
            onClick={() => setActiveTab("dashboard")}
          >
            <i className="icon">📊</i> 
            <span>Dashboard</span>
          </div>
          
          <div 
            className={`menu-item ${activeTab === "flights" ? "active" : ""}`} 
            onClick={() => setActiveTab("flights")}
          >
            <i className="icon">✈️</i> 
            <span>Flight Management</span>
          </div>
          
          <div 
            className={`menu-item ${activeTab === "aircrafts" ? "active" : ""}`} 
            onClick={() => setActiveTab("aircrafts")}
          >
            <i className="icon">🛩️</i> 
            <span>Aircraft Management</span>
          </div>
          
          <div 
            className={`menu-item ${activeTab === "announcements" ? "active" : ""}`} 
            onClick={() => setActiveTab("announcements")}
          >
            <i className="icon">📢</i> 
            <span>Announcements</span>
          </div>
          
          <div 
            className={`menu-item ${activeTab === "stats" ? "active" : ""}`} 
            onClick={() => setActiveTab("stats")}
          >
            <i className="icon">📈</i> 
            <span>Statistics</span>
          </div>
        </div>
        
        <div className="admin-footer">
          <button className="logout-btn" onClick={() => navigate("/")}>
            <i className="icon">🚪</i> 
            <span>Log out</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="admin-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1>
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "flights" && "Flight Management"}
              {activeTab === "aircrafts" && "Aircraft Management"}
              {activeTab === "announcements" && "Announcements"}
              {activeTab === "stats" && "Statistics"}
            </h1>
          </div>
          <div className="admin-info">
            <span>Admin: Nguyen Van Quan Ly</span>
            <div className="admin-avatar">QL</div>
          </div>
        </div>
        
        {/* Loading/Error States */}
        {loading && <div className="loading">⏳ Đang xử lý...</div>}
        {error && <div className="error">❌ Lỗi: {error}</div>}
        
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="dashboard-container">
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-value">{stats.totalFlights}</div>
                <div className="stat-label">Chuyến bay</div>
                <div className="stat-icon">✈️</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{stats.activeAircrafts}</div>
                <div className="stat-label">Máy bay</div>
                <div className="stat-icon">🛩️</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{stats.ticketsSold}</div>
                <div className="stat-label">Vé có thể bán</div>
                <div className="stat-icon">🎫</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{formatCurrency(stats.revenue / 1000)}</div>
                <div className="stat-label">Tiềm năng doanh thu</div>
                <div className="stat-icon">💰</div>
              </div>
            </div>
            
            <div className="recent-activities">
              <h2>Hoạt động hệ thống</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">✈️</div>
                  <div className="activity-details">
                    <div className="activity-title">Hệ thống có {flights.length} chuyến bay được quản lý</div>
                    <div className="activity-time">Cập nhật liên tục</div>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">🛩️</div>
                  <div className="activity-details">
                    <div className="activity-title">Quản lý {aircrafts.length} loại máy bay</div>
                    <div className="activity-time">Đồng bộ từ database</div>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">🌐</div>
                  <div className="activity-details">
                    <div className="activity-title">Kết nối {airports.length} sân bay toàn cầu</div>
                    <div className="activity-time">Dữ liệu thời gian thực</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Flight Management Tab */}
        {activeTab === "flights" && (
          <div className="management-container">
            {loading ? (
              <div className="loading">⏳ Đang tải dữ liệu chuyến bay...</div>
            ) : (
              <>
                <div className="management-header">
                  <h2>Quản lý Chuyến bay</h2>
                  <div style={{display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center"}}>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => handleDateChange(e.target.value)}
                      style={{padding: "8px", borderRadius: 6, border: "1px solid #ccc"}}
                      placeholder="Chọn ngày"
                      disabled={loading}
                    />
                    <select
                      value={selectedRegion}
                      onChange={e => handleRegionChange(e.target.value)}
                      style={{padding: "8px", borderRadius: 6, border: "1px solid #ccc"}}
                      disabled={loading}
                    >
                      <option value="all">Tất cả khu vực</option>
                      <option value="vietnam">Nội địa Việt Nam</option>
                      <option value="sea">Đông Nam Á</option>
                      <option value="asia">Châu Á</option>
                      <option value="other">Khu vực khác</option>
                    </select>
                    <button 
                      className="edit-btn"
                      onClick={handleResetFilters}
                      style={{padding: "8px 12px", whiteSpace: "nowrap"}}
                      disabled={loading}
                    >
                      {loading ? "⏳" : "🔄"} Reset
                    </button>
                    <button 
                      className="add-btn"
                      onClick={() => setEditingFlight({
                        flightNumber: "",
                        departure: "",
                        arrival: "",
                        departureTime: "",
                        arrivalTime: "",
                        date: "",
                        aircraftModel: "",
                        economyPrice: "220.90",
                        businessPrice: "450.90",
                        firstClassPrice: "880.90",
                        economySeats: "100",
                        businessSeats: "20",
                        firstClassSeats: "8"
                      })}
                      disabled={loading}
                    >
                      + Thêm chuyến bay
                    </button>
                    
                    {!loading && (
                      <span style={{color: "#666", fontSize: "14px", marginLeft: "auto"}}>
                        {filteredFlights.length} chuyến bay
                      </span>
                    )}
                  </div>
                </div>

                {/* Add Flight Form */}
                {editingFlight && (
                  <div className="edit-form">
                    <h3>Thêm chuyến bay mới</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Số hiệu chuyến bay *</label>
                        <input
                          type="text"
                          value={editingFlight.flightNumber}
                          onChange={e => setEditingFlight({...editingFlight, flightNumber: e.target.value})}
                          placeholder="VJ101"
                        />
                      </div>
                      <div className="form-group">
                        <label>Ngày bay *</label>
                        <input
                          type="date"
                          value={editingFlight.date}
                          onChange={e => setEditingFlight({...editingFlight, date: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Sân bay đi *</label>
                        <select
                          value={editingFlight.departure}
                          onChange={e => setEditingFlight({...editingFlight, departure: e.target.value})}
                        >
                          <option value="">Chọn sân bay đi</option>
                          {airports.map(airport => (
                            <option key={airport.id} value={airport.code}>
                              {airport.code} - {airport.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Sân bay đến *</label>
                        <select
                          value={editingFlight.arrival}
                          onChange={e => setEditingFlight({...editingFlight, arrival: e.target.value})}
                        >
                          <option value="">Chọn sân bay đến</option>
                          {airports.map(airport => (
                            <option key={airport.id} value={airport.code}>
                              {airport.code} - {airport.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Giờ khởi hành *</label>
                        <input
                          type="time"
                          value={editingFlight.departureTime}
                          onChange={e => setEditingFlight({...editingFlight, departureTime: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Giờ đến *</label>
                        <input
                          type="time"
                          value={editingFlight.arrivalTime}
                          onChange={e => setEditingFlight({...editingFlight, arrivalTime: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Máy bay</label>
                      <select
                        value={editingFlight.aircraftModel}
                        onChange={e => setEditingFlight({...editingFlight, aircraftModel: e.target.value})}
                      >
                        <option value="">Chọn máy bay</option>
                        {aircrafts.map(aircraft => (
                          <option key={aircraft.id} value={aircraft.model}>
                            {aircraft.model}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-actions">
                      <button className="cancel-btn" onClick={() => setEditingFlight(null)}>
                        Hủy
                      </button>
                      <button
                        className="save-btn"
                        onClick={handleAddFlight}
                        disabled={loading}
                      >
                        Thêm chuyến bay
                      </button>
                    </div>
                  </div>
                )}

                {/* Flight Table */}
                <div className="table-container">
                  <table className="management-table">
                    <thead>
                      <tr>
                        <th>Số hiệu</th>
                        <th>Tuyến bay</th>
                        <th>Máy bay</th>
                        <th>Giờ bay</th>
                        <th>Ngày</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFlights.map(flight => (
                        <tr key={flight.id}>
                          <td>{flight.flightNumber}</td>
                          <td>{flight.departure} → {flight.arrival}</td>
                          <td>{flight.aircraftModel}</td>
                          <td>{flight.departureTime}</td>
                          <td>{new Date(flight.date).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <span className={`status-badge ${flight.status === "On Time" ? "active" : "warning"}`}>
                              {flight.status || "On Time"}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteFlight(flight.id)}
                              disabled={loading}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredFlights.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                      Không có chuyến bay nào. Hãy thêm chuyến bay mới hoặc thử lại sau.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Aircraft Management Tab */}
        {activeTab === "aircrafts" && (
          <div className="management-container">
            <div className="management-header">
              <h2>Quản lý Máy bay</h2>
              <button 
                className="add-btn" 
                onClick={() => setEditingAircraft({
                  model: "",
                  width: "",
                  length: ""
                })}
                disabled={loading}
              >
                + Thêm máy bay
              </button>
            </div>
            
            {/* Add/Edit Aircraft Form */}
            {editingAircraft && (
              <div className="edit-form">
                <h3>{editingAircraft.id ? "Chỉnh sửa" : "Thêm"} máy bay</h3>
                <div className="form-group">
                  <label>Model máy bay *</label>
                  <input
                    type="text"
                    value={editingAircraft.model || ""}
                    onChange={e =>
                      setEditingAircraft({ ...editingAircraft, model: e.target.value })
                    }
                    placeholder="Boeing 737-800"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Số ghế mỗi hàng *</label>
                    <input
                      type="number"
                      min="3"
                      max="12"
                      value={editingAircraft.width || ""}
                      onChange={e =>
                        setEditingAircraft({ ...editingAircraft, width: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Số hàng ghế *</label>
                    <input
                      type="number"
                      min="10"
                      max="60"
                      value={editingAircraft.length || ""}
                      onChange={e =>
                        setEditingAircraft({ ...editingAircraft, length: e.target.value })
                      }
                    />
                  </div>
                </div>
                
                {/* Seat map preview */}
                {editingAircraft.width > 0 && editingAircraft.length > 0 && (
                  <div style={{ margin: "16px 0" }}>
                    <h4>Sơ đồ ghế</h4>
                    <div style={{ marginBottom: 8 }}>
                      {editingAircraft.seatMap &&
                        editingAircraft.seatMap.slice(0, 5).map((row, rowIdx) => (
                          <div key={rowIdx} style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                            <span style={{ minWidth: 60, marginRight: 8, fontSize: 12 }}>Hàng {rowIdx + 1}</span>
                            <select
                              style={{
                                minWidth: 120,
                                padding: "4px 8px",
                                border: "1px solid #ddd",
                                borderRadius: 4,
                                fontSize: 13,
                                marginRight: 12
                              }}
                              value={row[0] || "economy"}
                              onChange={e => handleSetRowClass(rowIdx, e.target.value)}
                            >
                              <option value="economy">Economy</option>
                              <option value="business">Business</option>
                              <option value="firstClass">First Class</option>
                            </select>
                            <div style={{ display: "flex", gap: 2 }}>
                              {row.map((seat, colIdx) => (
                                <div
                                  key={colIdx}
                                  style={{
                                    width: 24,
                                    height: 24,
                                    border: "1px solid #ccc",
                                    borderRadius: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 10,
                                    background:
                                      seat === "firstClass"
                                        ? "#ffd700"
                                        : seat === "business"
                                        ? "#90caf9"
                                        : "#e0e0e0",
                                    color: "#333"
                                  }}
                                  title={seat}
                                >
                                  {String.fromCharCode(65 + colIdx)}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                
                <div className="form-actions">
                  <button className="cancel-btn" onClick={() => setEditingAircraft(null)}>
                    Hủy
                  </button>
                  <button
                    className="save-btn"
                    onClick={() => {
                      if (editingAircraft.id) {
                        // Edit existing aircraft - chưa implement
                        alert('Chức năng chỉnh sửa máy bay chưa được triển khai');
                      } else {
                        // Add new aircraft
                        handleAddAircraft();
                      }
                    }}
                    disabled={loading}
                  >
                    {editingAircraft.id ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </div>
            )}
            
            <div className="table-container">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Width</th>
                    <th>Length</th>
                    <th>Seat Map</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {aircrafts.map(aircraft => (
                    <tr key={aircraft.id}>
                      <td>{aircraft.model}</td>
                      <td>{aircraft.width}</td>
                      <td>{aircraft.length}</td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => handleEditSeatMap(aircraft)}
                        >
                          Edit Seat Map
                        </button>
                      </td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => setEditingAircraft(aircraft)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteAircraft(aircraft.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Seat Map Editor */}
            {seatMapEdit && (
              <div className="edit-form">
                <h3>Edit Seat Map</h3>
                <div style={{ overflowX: "auto", marginBottom: 16 }}>
                  <table style={{ borderCollapse: "collapse" }}>
                    <tbody>
                      {seatMapEdit.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {row.map((seat, colIdx) => (
                            <td key={colIdx} style={{ padding: 2 }}>
                              <select
                                value={seat}
                                onChange={e =>
                                  handleSeatTypeChange(rowIdx, colIdx, e.target.value)
                                }
                                style={{
                                  background:
                                    seat === "firstClass"
                                      ? "#ffd700"
                                      : seat === "business"
                                      ? "#90caf9"
                                      : "#e0e0e0",
                                  border: "1px solid #bbb",
                                  borderRadius: 4,
                                  padding: "2px 6px",
                                  fontSize: 13,
                                  minWidth: 80
                                }}
                              >
                                <option value="economy">Economy</option>
                                <option value="business">Business</option>
                                <option value="firstClass">First Class</option>
                              </select>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="form-actions">
                  <button className="cancel-btn" onClick={() => { setSeatMapEdit(null); setSelectedAircraftId(null); }}>
                    Cancel
                  </button>
                  <button className="save-btn" onClick={handleSaveSeatMap}>
                    Save Seat Map
                  </button>
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
                  <span style={{ background: "#ffd700", padding: "2px 8px", borderRadius: 4, marginRight: 8 }}>First Class</span>
                  <span style={{ background: "#90caf9", padding: "2px 8px", borderRadius: 4, marginRight: 8 }}>Business</span>
                  <span style={{ background: "#e0e0e0", padding: "2px 8px", borderRadius: 4 }}>Economy</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
      
      <style jsx>{`
  .admin-dashboard {
    display: flex;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background-color: #f5f7fa;
  }

  .admin-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 280px;
    background: #1a237e;
    color: white;
    padding: 0;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    z-index: 1000;
    overflow: hidden;
  }

  .admin-sidebar:not(.open) {
    width: 80px;
  }

  .admin-logo {
    padding: 20px;
    border-bottom: 1px solid #3949ab;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 60px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
    transition: all 0.3s ease;
  }

  .logo-sky {
    font-size: 16px;
    font-weight: 700;
    color: #ffd600;
    letter-spacing: 0.5px;
  }

  .logo-admin {
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    opacity: 0.8;
    margin-top: 2px;
  }

  /* Desktop: Khi sidebar thu nhỏ, logo căn giữa và chia 2 dòng */
  .admin-sidebar:not(.open) .admin-logo {
    padding: 15px 10px;
    justify-content: center;
  }

  .admin-sidebar:not(.open) .logo-text {
    align-items: center;
    text-align: center;
  }

  .admin-sidebar:not(.open) .logo-sky {
    font-size: 11px;
    letter-spacing: 0.3px;
  }

  .admin-sidebar:not(.open) .logo-admin {
    font-size: 9px;
    margin-top: 1px;
  }

  /* Mobile: Nút X */
  .sidebar-close {
    display: none;
    background: none;
    border: none;
    color: #ffd600;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    align-items: center;
    justify-content: center;
  }

  .admin-menu {
    flex: 1;
    padding: 20px 0;
  }

  .menu-item {
    padding: 15px 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
    border-left: 4px solid transparent;
    white-space: nowrap;
    overflow: hidden;
  }

  .menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .menu-item.active {
    background: rgba(255, 255, 255, 0.15);
    border-left: 4px solid #ffd600;
  }

  .menu-item .icon {
    margin-right: 12px;
    font-size: 18px;
    min-width: 18px;
    text-align: center;
  }

  .menu-item span {
    opacity: 1;
    transition: opacity 0.3s ease;
    overflow: hidden;
  }

  /* Desktop: Ẩn text menu khi sidebar đóng */
  .admin-sidebar:not(.open) .menu-item {
    padding: 15px 10px;
    justify-content: center;
  }

  .admin-sidebar:not(.open) .menu-item span {
    opacity: 0;
    width: 0;
    margin: 0;
  }

  .admin-sidebar:not(.open) .menu-item .icon {
    margin-right: 0;
  }

  .admin-footer {
    padding: 20px;
    border-top: 1px solid #3949ab;
  }

  .logout-btn {
    background: #ffd600;
    color: #1a237e;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    overflow: hidden;
    white-space: nowrap;
  }

  .logout-btn .icon {
    margin-right: 8px;
    transition: margin 0.3s ease;
  }

  .logout-btn span {
    transition: opacity 0.3s ease;
  }

  /* Desktop: Thu nhỏ logout button */
  .admin-sidebar:not(.open) .logout-btn {
    padding: 10px 5px;
  }

  .admin-sidebar:not(.open) .logout-btn .icon {
    margin-right: 0;
  }

  .admin-sidebar:not(.open) .logout-btn span {
    opacity: 0;
    width: 0;
  }

  .main-content {
    flex: 1;
    margin-left: 280px;
    transition: margin-left 0.3s ease;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .admin-sidebar:not(.open) + .main-content {
    margin-left: 80px;
  }

  .admin-header {
    background: white;
    padding: 20px 30px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .sidebar-toggle {
    background: #1a237e;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
  }

  .admin-header h1 {
    font-size: 24px;
    color: #1a237e;
    margin: 0;
  }

  .admin-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #666;
  }

  .admin-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #1a237e;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  /* Sidebar overlay for mobile */
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: none;
  }

  /* Dashboard Content */
  .dashboard-container,
  .management-container,
  .announcement-container,
  .stats-container {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
  }

  .stat-card {
    background: white;
    border-radius: 10px;
    padding: 25px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    position: relative;
    overflow: hidden;
    border: 1px solid #f0f0f0;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #1a237e;
    margin-bottom: 8px;
    line-height: 1;
  }

  .stat-label {
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  .stat-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 30px;
    opacity: 0.2;
  }

  .recent-activities {
    background: white;
    border-radius: 10px;
    padding: 25px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border: 1px solid #f0f0f0;
  }

  .recent-activities h2 {
    margin: 0 0 20px 0;
    font-size: 20px;
    color: #1a237e;
  }

  .activity-list {
    display: flex;
    flex-direction: column;
  }

  .activity-item {
    display: flex;
    align-items: flex-start;
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .activity-item:last-child {
    border-bottom: none;
  }

  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e8eaf6;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    font-size: 18px;
    flex-shrink: 0;
  }

  .activity-details {
    flex: 1;
  }

  .activity-title {
    font-weight: 500;
    margin-bottom: 5px;
    color: #333;
  }

  .activity-time {
    font-size: 13px;
    color: #888;
  }

  /* Management Styles */
  .management-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
  }

  .management-header h2 {
    margin: 0;
    font-size: 24px;
    color: #1a237e;
  }

  .add-btn {
    background: #1a237e;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 14px;
    transition: background 0.2s;
  }

  .add-btn:hover {
    background: #303f9f;
  }

  .add-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .table-container {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border: 1px solid #f0f0f0;
  }

  .management-table {
    width: 100%;
    border-collapse: collapse;
  }

  .management-table th {
    background: #f8f9fa;
    padding: 15px 20px;
    text-align: left;
    font-weight: 600;
    color: #1a237e;
    border-bottom: 2px solid #e9ecef;
    font-size: 14px;
  }

  .management-table td {
    padding: 15px 20px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
  }

  .management-table tr:hover {
    background: #f8f9fa;
  }

  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-badge.active {
    background: #e8f5e8;
    color: #2e7d32;
  }

  .status-badge.warning {
    background: #fff8e1;
    color: #f57f17;
  }

  .status-badge.pending {
    background: #e3f2fd;
    color: #1565c0;
  }

  .delete-btn,
  .edit-btn,
  .view-btn,
  .confirm-btn {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    margin-right: 8px;
    border: none;
    transition: all 0.2s;
  }

  .delete-btn {
    background: #ffebee;
    color: #c62828;
  }

  .delete-btn:hover {
    background: #ffcdd2;
  }

  .edit-btn {
    background: #e3f2fd;
    color: #1565c0;
  }

  .view-btn {
    background: #e8f5e8;
    color: #2e7d32;
  }

  .confirm-btn {
    background: #fff8e1;
    color: #f57f17;
  }

  .loading {
    text-align: center;
    padding: 40px 20px;
    color: #666;
    font-style: italic;
    background: white;
    border-radius: 10px;
    margin: 20px 0;
  }

  .error {
    background: #ffebee;
    color: #c62828;
    padding: 15px 20px;
    border-radius: 8px;
    margin: 20px 0;
    border: 1px solid #ffcdd2;
    font-weight: 500;
  }

  /* Form Styles */
  .edit-form {
    background: white;
    padding: 25px;
    border-radius: 10px;
    margin-bottom: 25px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border: 1px solid #f0f0f0;
  }

  .edit-form h3 {
    margin: 0 0 20px 0;
    font-size: 20px;
    color: #1a237e;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #1a237e;
  }

  .form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .form-row .form-group {
    flex: 1;
    margin-bottom: 0;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
  }

  .cancel-btn {
    background: #f8f9fa;
    color: #495057;
    border: 2px solid #e9ecef;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cancel-btn:hover {
    background: #e9ecef;
  }

  .save-btn {
    background: #1a237e;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .save-btn:hover {
    background: #303f9f;
  }

  .save-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Responsive - Tablet */
  @media (max-width: 1024px) {
    .stats-cards {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .dashboard-container,
    .management-container,
    .announcement-container,
    .stats-container {
      padding: 20px;
    }

    .admin-header {
      padding: 15px 20px;
    }

    .admin-header h1 {
      font-size: 20px;
    }
  }

  /* Responsive - Mobile */
  @media (max-width: 768px) {
    .admin-sidebar {
      transform: translateX(-100%);
      width: 280px !important; /* Force full width on mobile */
    }

    .admin-sidebar.open {
      transform: translateX(0);
    }

    /* Show X button on mobile */
    .admin-sidebar .sidebar-close {
      display: flex;
    }

    /* Show overlay on mobile when sidebar is open */
    .sidebar-overlay {
      display: block;
    }

    .main-content {
      margin-left: 0 !important; /* Remove margin on mobile */
    }

    .stats-cards {
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .form-row {
      flex-direction: column;
      gap: 0;
    }

    .management-header {
      flex-direction: column;
      align-items: stretch;
      gap: 15px;
    }

    .table-container {
      overflow-x: auto;
    }

    .management-table {
      min-width: 600px;
    }

    .admin-info span {
      display: none; /* Hide admin text on mobile */
    }

    .header-left {
      gap: 10px;
    }

    .admin-header h1 {
      font-size: 18px;
    }
  }

  /* Responsive - Small Mobile */
  @media (max-width: 480px) {
    .stats-cards {
      grid-template-columns: 1fr;
    }

    .dashboard-container,
    .management-container,
    .announcement-container,
    .stats-container {
      padding: 15px;
    }

    .admin-header {
      padding: 12px 15px;
    }

    .stat-card {
      padding: 20px;
    }

    .stat-value {
      font-size: 24px;
    }

    .activity-item {
      padding: 12px 0;
    }

    .activity-icon {
      width: 35px;
      height: 35px;
      font-size: 16px;
    }

    .form-actions {
      flex-direction: column;
      gap: 8px;
    }

    .form-actions button {
      width: 100%;
    }
  }
`}</style>
    </div>
  );
};

export default AdminDashboard;