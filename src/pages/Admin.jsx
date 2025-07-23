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
        setSidebarOpen(false); // Close sidebar on mobile by default
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

  // Tickets state
  const [tickets, setTickets] = useState([
    { id: 1, flightNumber: "KET23", passenger: "Nguyen Van A", class: "Economy", price: 220.90, status: "Confirmed" },
    { id: 2, flightNumber: "KET24", passenger: "Tran Thi B", class: "Business", price: 450.90, status: "Confirmed" },
    { id: 3, flightNumber: "KET23", passenger: "Le Van C", class: "First Class", price: 880.90, status: "Pending" }
  ]);
  
  // Stats state
  const [stats, setStats] = useState({
    totalFlights: 24,
    activeAircrafts: 8,
    ticketsSold: 156,
    revenue: 45876.50
  });
  
  // Form states
  const [newFlight, setNewFlight] = useState({
    flightNumber: "",
    departure: "",
    arrival: "",
    departureTime: "",
    arrivalTime: "",
    date: "",
    aircraftModel: "",
    economyPrice: "",
    businessPrice: "",
    firstClassPrice: "",
    economySeats: "",
    businessSeats: "",
    firstClassSeats: ""
  });
  
  const [announcement, setAnnouncement] = useState({
    title: "",
    content: "",
    priority: "Normal"
  });
  
  const [editingFlight, setEditingFlight] = useState(null);

  // Aircraft form state
  const [newAircraft, setNewAircraft] = useState({
    model: "",
    width: "",
    length: ""
  });
  const [editingAircraft, setEditingAircraft] = useState(null);

  // API functions
  const fetchFlights = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/flights');
      if (!response.ok) throw new Error('Failed to fetch flights');
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching flights:', error);
      // Set default empty array if API fails
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAirports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/airports');
      if (!response.ok) throw new Error('Failed to fetch airports');
      const data = await response.json();
      setAirports(data);
    } catch (error) {
      console.error('Error fetching airports:', error);
      // Set default empty array if API fails
      setAirports([]);
    }
  };

  const fetchAircrafts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/aircrafts');
      if (!response.ok) throw new Error('Failed to fetch aircrafts');
      const data = await response.json();
      const formattedAircrafts = data.map(aircraft => ({
        ...aircraft,
        width: aircraft.width || 9,
        length: aircraft.length || 30,
        seatMap: aircraft.seat_map || []
      }));
      setAircrafts(formattedAircrafts);
    } catch (error) {
      console.error('Error fetching aircrafts:', error);
      // Set default empty array if API fails
      setAircrafts([]);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchFlights();
    fetchAirports();
    fetchAircrafts();
  }, []);

  // Handler functions
  const handleAddFlight = async () => {
    if (!editingFlight?.flightNumber || !editingFlight?.departure || !editingFlight?.arrival) {
      alert('Vui lòng điền đầy đủ thông tin chuyến bay');
      return;
    }

    try {
      setLoading(true);
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
          aircraftModel: editingFlight.aircraftModel
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add flight');
      }

      alert('Chuyến bay đã được thêm thành công!');
      setEditingFlight(null);
      fetchFlights();
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
      console.error('Error adding flight:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlight = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chuyến bay này?")) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/flights/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete flight');

      alert('Chuyến bay đã được xóa thành công!');
      fetchFlights();
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
      console.error('Error deleting flight:', error);
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

  const handleChangeDepartureTime = (id, newTime) => {
    const updatedFlights = flights.map(flight => {
      if (flight.id === id) {
        return {...flight, departureTime: newTime, status: "Schedule Changed"};
      }
      return flight;
    });
    
    setFlights(updatedFlights);
    alert(`Giờ khởi hành đã được cập nhật cho chuyến bay ${id}`);
  };

  // Thêm máy bay mới (cập nhật để sử dụng API)
  const handleAddAircraft = async () => {
    if (!newAircraft.model || !newAircraft.width || !newAircraft.length) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/aircrafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: newAircraft.model,
          manufacturer: 'Unknown', // Default value
          width: parseInt(newAircraft.width),
          length: parseInt(newAircraft.length),
          seat_map: Array(parseInt(newAircraft.length))
            .fill(0)
            .map(() => Array(parseInt(newAircraft.width)).fill("economy"))
        }),
      });

      if (!response.ok) throw new Error('Failed to add aircraft');

      alert('Máy bay đã được thêm thành công!');
      setNewAircraft({ model: "", width: "", length: "" });
      fetchAircrafts(); // Reload aircrafts
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
      console.error('Error adding aircraft:', error);
    }
  };

  // Xóa máy bay (cập nhật để sử dụng API)
  const handleDeleteAircraft = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa máy bay này?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/aircrafts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete aircraft');

      alert('Máy bay đã được xóa thành công!');
      fetchAircrafts(); // Reload aircrafts
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
      console.error('Error deleting aircraft:', error);
    }
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

  const handleSaveSeatMap = () => {
    setAircrafts(aircrafts.map(a =>
      a.id === selectedAircraftId ? { ...a, seatMap: seatMapEdit } : a
    ));
    setSelectedAircraftId(null);
    setSeatMapEdit(null);
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
        // Generate new seatMap with default "economy"
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
            className={`menu-item ${activeTab === "tickets" ? "active" : ""}`} 
            onClick={() => setActiveTab("tickets")}
          >
            <i className="icon">🎫</i> 
            <span>Ticket Management</span>
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

          <div 
            className={`menu-item ${activeTab === "aircrafts" ? "active" : ""}`} 
            onClick={() => setActiveTab("aircrafts")}
          >
            <i className="icon">🛩️</i> 
            <span>Aircraft Management</span>
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
              {activeTab === "tickets" && "Ticket Management"}
              {activeTab === "announcements" && "Announcements"}
              {activeTab === "stats" && "Statistics"}
              {activeTab === "aircrafts" && "Aircraft Management"}
            </h1>
          </div>
          <div className="admin-info">
            <span>Admin: Nguyen Van Quan Ly</span>
            <div className="admin-avatar">QL</div>
          </div>
        </div>
        
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
                <div className="stat-label">Máy bay hoạt động</div>
                <div className="stat-icon">🛩️</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{stats.ticketsSold}</div>
                <div className="stat-label">Vé đã bán</div>
                <div className="stat-icon">🎫</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{formatCurrency(stats.revenue)}</div>
                <div className="stat-label">Doanh thu</div>
                <div className="stat-icon">💰</div>
              </div>
            </div>
            
            <div className="recent-activities">
              <h2>Hoạt động gần đây</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">✈️</div>
                  <div className="activity-details">
                    <div className="activity-title">Đã thêm chuyến bay mới KET28</div>
                    <div className="activity-time">10 phút trước</div>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">📢</div>
                  <div className="activity-details">
                    <div className="activity-title">Đã đăng thông báo giảm giá mùa hè</div>
                    <div className="activity-time">5 giờ trước</div>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">🔄</div>
                  <div className="activity-details">
                    <div className="activity-title">Cập nhật giờ khởi hành chuyến bay KET23</div>
                    <div className="activity-time">1 ngày trước</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Flight Management Tab */}
        {activeTab === "flights" && (
          <div className="management-container">
            <div className="management-header">
              <h2>Quản lý Chuyến bay</h2>
              <button 
                className="add-btn"
                onClick={() => setEditingFlight({})}
                disabled={loading}
              >
                + Thêm chuyến bay
              </button>
            </div>

            {loading && <div className="loading">Đang tải...</div>}
            {error && <div className="error">Lỗi: {error}</div>}
            
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
                  {flights.map(flight => (
                    <tr key={flight.id}>
                      <td>{flight.flightNumber}</td>
                      <td>{flight.departure} → {flight.arrival}</td>
                      <td>{flight.aircraftModel}</td>
                      <td>{flight.departureTime}</td>
                      <td>{flight.date}</td>
                      <td>
                        <span className={`status-badge ${flight.status === "On Time" ? "active" : "warning"}`}>
                          {flight.status}
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
            </div>
          </div>
        )}
        
        {/* Ticket Management Tab */}
        {activeTab === "tickets" && (
          <div className="management-container">
            <div className="management-header">
              <h2>Quản lý Vé đặt</h2>
              <div className="filter-controls">
                <select>
                  <option>Tất cả chuyến bay</option>
                  {flights.map(flight => (
                    <option key={flight.id}>{flight.flightNumber}</option>
                  ))}
                </select>
                <select>
                  <option>Tất cả trạng thái</option>
                  <option>Đã xác nhận</option>
                  <option>Chờ thanh toán</option>
                  <option>Đã hủy</option>
                </select>
                <input type="date" placeholder="Từ ngày" />
                <input type="date" placeholder="Đến ngày" />
                <button className="filter-btn">Lọc</button>
              </div>
            </div>
            
            <div className="table-container">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>Mã vé</th>
                    <th>Chuyến bay</th>
                    <th>Hành khách</th>
                    <th>Hạng vé</th>
                    <th>Giá vé</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr key={ticket.id}>
                      <td>TK{ticket.id.toString().padStart(4, '0')}</td>
                      <td>{ticket.flightNumber}</td>
                      <td>{ticket.passenger}</td>
                      <td>{ticket.class}</td>
                      <td>{formatCurrency(ticket.price)}</td>
                      <td>
                        <span className={`status-badge ${ticket.status === "Confirmed" ? "active" : "pending"}`}>
                          {ticket.status === "Confirmed" ? "Đã xác nhận" : "Chờ thanh toán"}
                        </span>
                      </td>
                      <td>
                        <button className="view-btn">Xem chi tiết</button>
                        {ticket.status !== "Confirmed" && (
                          <button className="confirm-btn">Xác nhận</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="stats-summary">
              <div className="stat-item">
                <span className="stat-label">Tổng số vé:</span>
                <span className="stat-value">{tickets.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tổng doanh thu:</span>
                <span className="stat-value">{formatCurrency(tickets.reduce((sum, ticket) => sum + ticket.price, 0))}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Vé đã xác nhận:</span>
                <span className="stat-value">{tickets.filter(t => t.status === "Confirmed").length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Vé chờ xử lý:</span>
                <span className="stat-value">{tickets.filter(t => t.status !== "Confirmed").length}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="announcement-container">
            <h2>Đăng thông tin mới</h2>
            
            <div className="announcement-form">
              <div className="form-group">
                <label>Tiêu đề</label>
                <input 
                  type="text" 
                  value={announcement.title}
                  onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                  placeholder="Nhập tiêu đề thông báo"
                />
              </div>
              
              <div className="form-group">
                <label>Mức độ ưu tiên</label>
                <select 
                  value={announcement.priority}
                  onChange={(e) => setAnnouncement({...announcement, priority: e.target.value})}
                >
                  <option value="Normal">Bình thường</option>
                  <option value="High">Quan trọng</option>
                  <option value="Urgent">Khẩn cấp</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Nội dung</label>
                <textarea 
                  rows="6"
                  value={announcement.content}
                  onChange={(e) => setAnnouncement({...announcement, content: e.target.value})}
                  placeholder="Nhập nội dung thông báo..."
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button className="preview-btn">Xem trước</button>
                <button 
                  className="publish-btn"
                  onClick={handlePostAnnouncement}
                >
                  Đăng thông báo
                </button>
              </div>
            </div>
            
            <div className="announcement-history">
              <h3>Lịch sử thông báo</h3>
              <div className="history-list">
                <div className="history-item">
                  <div className="item-header">
                    <span className="item-title">Giảm giá 20% vé mùa hè</span>
                    <span className="item-priority normal">Bình thường</span>
                  </div>
                  <div className="item-content">
                    Chương trình khuyến mãi lớn nhất mùa hè, giảm 20% tất cả các chuyến bay đến Đà Nẵng, Nha Trang, Phú Quốc...
                  </div>
                  <div className="item-footer">
                    <span>Đăng ngày: 05/07/2025</span>
                    <div className="item-actions">
                      <button>Sửa</button>
                      <button>Xóa</button>
                    </div>
                  </div>
                </div>
                
                <div className="history-item">
                  <div className="item-header">
                    <span className="item-title">Thay đổi lịch bay tháng 7</span>
                    <span className="item-priority high">Quan trọng</span>
                  </div>
                  <div className="item-content">
                    Do ảnh hưởng của thời tiết, một số chuyến bay trong tháng 7 sẽ được điều chỉnh lịch trình...
                  </div>
                  <div className="item-footer">
                    <span>Đăng ngày: 01/07/2025</span>
                    <div className="item-actions">
                      <button>Sửa</button>
                      <button>Xóa</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Statistics Tab */}
        {activeTab === "stats" && (
          <div className="stats-container">
            <div className="stats-filters">
              <h2>Thống kê & Báo cáo</h2>
              <div className="filter-controls">
                <select>
                  <option>Tháng 7/2025</option>
                  <option>Tháng 6/2025</option>
                  <option>Tháng 5/2025</option>
                </select>
                <select>
                  <option>Tất cả tuyến bay</option>
                  <option>HAN - ICN</option>
                  <option>SGN - ICN</option>
                  <option>HAN - NRT</option>
                </select>
                <button className="export-btn">Xuất báo cáo</button>
              </div>
            </div>
            
            <div className="charts-container">
              <div className="chart-card">
                <h3>Doanh thu theo tháng (triệu VND)</h3>
                <div className="chart-placeholder">
                  <div className="bar-chart">
                    <div className="bar" style={{ height: '80%' }}><span>45.8</span></div>
                    <div className="bar" style={{ height: '65%' }}><span>37.2</span></div>
                    <div className="bar" style={{ height: '90%' }}><span>51.6</span></div>
                    <div className="bar" style={{ height: '75%' }}><span>42.9</span></div>
                    <div className="bar" style={{ height: '60%' }}><span>34.5</span></div>
                    <div className="bar" style={{ height: '95%' }}><span>54.3</span></div>
                  </div>
                  <div className="chart-labels">
                    <span>Tháng 1</span>
                    <span>Tháng 2</span>
                    <span>Tháng 3</span>
                    <span>Tháng 4</span>
                    <span>Tháng 5</span>
                    <span>Tháng 6</span>
                  </div>
                </div>
              </div>
              
              <div className="chart-card">
                <h3>Phân bố hạng vé</h3>
                <div className="chart-placeholder">
                  <div className="pie-chart">
                    <div className="slice economy" style={{ '--value': 65 }}></div>
                    <div className="slice business" style={{ '--value': 25 }}></div>
                    <div className="slice first-class" style={{ '--value': 10 }}></div>
                    <div className="chart-center"></div>
                  </div>
                  <div className="chart-legend">
                    <div><span className="legend-color economy"></span> Economy (65%)</div>
                    <div><span className="legend-color business"></span> Business (25%)</div>
                    <div><span className="legend-color first-class"></span> First Class (10%)</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="stats-table">
              <h3>Top 5 chuyến bay phổ biến</h3>
              <table>
                <thead>
                  <tr>
                    <th>Tuyến bay</th>
                    <th>Số vé bán</th>
                    <th>Doanh thu</th>
                    <th>Tỷ lệ lấp đầy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>HAN - ICN</td>
                    <td>85</td>
                    <td>{formatCurrency(25800)}</td>
                    <td>92%</td>
                  </tr>
                  <tr>
                    <td>SGN - ICN</td>
                    <td>72</td>
                    <td>{formatCurrency(21800)}</td>
                    <td>88%</td>
                  </tr>
                  <tr>
                    <td>HAN - NRT</td>
                    <td>68</td>
                    <td>{formatCurrency(19500)}</td>
                    <td>85%</td>
                  </tr>
                  <tr>
                    <td>HAN - SIN</td>
                    <td>54</td>
                    <td>{formatCurrency(16200)}</td>
                    <td>78%</td>
                  </tr>
                  <tr>
                    <td>DAD - ICN</td>
                    <td>42</td>
                    <td>{formatCurrency(12800)}</td>
                    <td>75%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Aircraft Management Tab */}
        {activeTab === "aircrafts" && (
          <div className="management-container">
            <div className="management-header">
              <h2>Aircraft Management</h2>
              <button className="add-btn" onClick={() => setEditingAircraft({})}>
                + Add Aircraft
              </button>
            </div>
            {/* Add/Edit Aircraft Form */}
            {editingAircraft ? (
              <div className="edit-form">
                <h3>{editingAircraft.id ? "Edit" : "Add"} Aircraft</h3>
                <div className="form-group">
                  <label>Model</label>
                  <input
                    type="text"
                    value={editingAircraft.model || ""}
                    onChange={e =>
                      setEditingAircraft({ ...editingAircraft, model: e.target.value })
                    }
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Width (seats per row)</label>
                    <input
                      type="number"
                      value={editingAircraft.width || ""}
                      onChange={e =>
                        setEditingAircraft({ ...editingAircraft, width: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Length (number of rows)</label>
                    <input
                      type="number"
                      value={editingAircraft.length || ""}
                      onChange={e =>
                        setEditingAircraft({ ...editingAircraft, length: e.target.value })
                      }
                    />
                  </div>
                </div>
                {/* Seat map editor với box chọn hạng ghế cho từng hàng */}
                {editingAircraft.width > 0 && editingAircraft.length > 0 && (
                  <div style={{ margin: "16px 0" }}>
                    <h4>Seat Map</h4>
                    <div style={{ marginBottom: 8 }}>
                      {editingAircraft.seatMap &&
                        editingAircraft.seatMap.map((row, rowIdx) => (
                          <div key={rowIdx} style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                            <span style={{ minWidth: 60, marginRight: 8 }}>Row {rowIdx + 1}</span>
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
                                    width: 30,
                                    height: 30,
                                    border: "1px solid #ccc",
                                    borderRadius: 4,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 11,
                                    background:
                                      seat === "firstClass"
                                        ? "#ffd700"
                                        : seat === "business"
                                        ? "#90caf9"
                                        : "#e0e0e0",
                                    color: "#333",
                                    cursor: "pointer"
                                  }}
                                  title={seat}
                                  onClick={() => {
                                    const updatedSeatMap = editingAircraft.seatMap.map((r, rIdx) =>
                                      r.map((s, cIdx) => {
                                        if (rIdx === rowIdx && cIdx === colIdx) {
                                          return s === "economy"
                                            ? "business"
                                            : s === "business"
                                            ? "firstClass"
                                            : "economy";
                                        }
                                        return s;
                                      })
                                    );
                                    setEditingAircraft({
                                      ...editingAircraft,
                                      seatMap: updatedSeatMap
                                    });
                                  }}
                                >
                                  {String.fromCharCode(65 + colIdx)}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
                      <span style={{ background: "#ffd700", padding: "2px 8px", borderRadius: 4, marginRight: 8 }}>First Class</span>
                      <span style={{ background: "#90caf9", padding: "2px 8px", borderRadius: 4, marginRight: 8 }}>Business</span>
                      <span style={{ background: "#e0e0e0", padding: "2px 8px", borderRadius: 4 }}>Economy</span>
                    </div>
                  </div>
                )}
                <div className="form-actions">
                  <button className="cancel-btn" onClick={() => setEditingAircraft(null)}>
                    Cancel
                  </button>
                  <button
                    className="save-btn"
                    onClick={() => {
                      if (editingAircraft.id) {
                        setAircrafts(aircrafts.map(a =>
                          a.id === editingAircraft.id ? editingAircraft : a
                        ));
                      } else {
                        setAircrafts([
                          ...aircrafts,
                          {
                            ...editingAircraft,
                            id: aircrafts.length + 1
                          }
                        ]);
                      }
                      setEditingAircraft(null);
                    }}
                  >
                    {editingAircraft.id ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
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