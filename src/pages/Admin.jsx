import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Danh sách máy bay cố định
  const aircraftModels = [
    { id: 1, model: "Boeing 787-9", capacity: 300 },
    { id: 2, model: "Airbus A350-900", capacity: 325 },
    { id: 3, model: "Boeing 777-300ER", capacity: 350 }
  ];

  // Dữ liệu mẫu chuyến bay với thông tin giá vé và số ghế các hạng
  const [flights, setFlights] = useState([
    { 
      id: 1, 
      flightNumber: "KET23", 
      departure: "HAN", 
      arrival: "ICN", 
      departureTime: "12:20", 
      arrivalTime: "18:25", 
      date: "2025-07-08", 
      aircraftModel: "Boeing 787-9",
      prices: {
        economy: 220.90,
        business: 450.90,
        firstClass: 880.90
      },
      seats: {
        economy: 200,
        business: 80,
        firstClass: 20
      },
      status: "On Time" 
    },
    { 
      id: 2, 
      flightNumber: "KET24", 
      departure: "HAN", 
      arrival: "ICN", 
      departureTime: "08:45", 
      arrivalTime: "14:30", 
      date: "2025-07-08", 
      aircraftModel: "Airbus A350-900",
      prices: {
        economy: 240.90,
        business: 490.90,
        firstClass: 950.90
      },
      seats: {
        economy: 225,
        business: 85,
        firstClass: 15
      },
      status: "On Time" 
    }
  ]);
  
  const [tickets, setTickets] = useState([
    { id: 1, flightNumber: "KET23", passenger: "Nguyen Van A", class: "Economy", price: 220.90, status: "Confirmed" },
    { id: 2, flightNumber: "KET24", passenger: "Tran Thi B", class: "Business", price: 450.90, status: "Confirmed" },
    { id: 3, flightNumber: "KET23", passenger: "Le Van C", class: "First Class", price: 880.90, status: "Pending" }
  ]);
  
  const [stats, setStats] = useState({
    totalFlights: 24,
    activeAircrafts: 8,
    ticketsSold: 156,
    revenue: 45876.50
  });
  
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

  // Aircraft management state
  const [aircrafts, setAircrafts] = useState([
    { id: 1, model: "Boeing 787-9", width: 9, length: 30, seatMap: [] },
    { id: 2, model: "Airbus A350-900", width: 9, length: 32, seatMap: [] },
    { id: 3, model: "Boeing 777-300ER", width: 10, length: 34, seatMap: [] }
  ]);
  const [newAircraft, setNewAircraft] = useState({
    model: "",
    width: "",
    length: ""
  });
  const [editingAircraft, setEditingAircraft] = useState(null);

  // Xử lý thêm chuyến bay mới
  const handleAddFlight = () => {
    if (!newFlight.flightNumber || !newFlight.departure || !newFlight.arrival) return;
    
    const flight = {
      id: flights.length + 1,
      flightNumber: newFlight.flightNumber,
      departure: newFlight.departure,
      arrival: newFlight.arrival,
      departureTime: newFlight.departureTime,
      arrivalTime: newFlight.arrivalTime,
      date: newFlight.date,
      aircraftModel: newFlight.aircraftModel,
      prices: {
        economy: parseFloat(newFlight.economyPrice),
        business: parseFloat(newFlight.businessPrice),
        firstClass: parseFloat(newFlight.firstClassPrice)
      },
      seats: {
        economy: parseInt(newFlight.economySeats),
        business: parseInt(newFlight.businessSeats),
        firstClass: parseInt(newFlight.firstClassSeats)
      },
      status: "On Time"
    };
    
    setFlights([...flights, flight]);
    setStats({...stats, totalFlights: stats.totalFlights + 1});
    setNewFlight({
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
  };

  // Xử lý cập nhật chuyến bay
  const handleUpdateFlight = () => {
    if (!editingFlight) return;
    
    const updatedFlights = flights.map(flight => 
      flight.id === editingFlight.id ? editingFlight : flight
    );
    
    setFlights(updatedFlights);
    setEditingFlight(null);
  };

  // Xử lý đăng thông báo
  const handlePostAnnouncement = () => {
    if (!announcement.title || !announcement.content) return;
    
    alert(`Thông báo đã được đăng: ${announcement.title}`);
    setAnnouncement({
      title: "",
      content: "",
      priority: "Normal"
    });
  };

  // Xử lý xóa chuyến bay
  const handleDeleteFlight = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chuyến bay này?")) {
      const updatedFlights = flights.filter(flight => flight.id !== id);
      setFlights(updatedFlights);
      setStats({...stats, totalFlights: stats.totalFlights - 1});
    }
  };

  // Xử lý thay đổi giờ khởi hành
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

  // Thêm máy bay mới
  const handleAddAircraft = () => {
    if (!newAircraft.model || !newAircraft.width || !newAircraft.length) return;
    setAircrafts([
      ...aircrafts,
      {
        id: aircrafts.length + 1,
        model: newAircraft.model,
        width: parseInt(newAircraft.width),
        length: parseInt(newAircraft.length),
        seatMap: Array(parseInt(newAircraft.length))
          .fill(0)
          .map(() => Array(parseInt(newAircraft.width)).fill("economy"))
      }
    ]);
    setNewAircraft({ model: "", width: "", length: "" });
  };

  // Xóa máy bay
  const handleDeleteAircraft = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa máy bay này?")) {
      setAircrafts(aircrafts.filter(a => a.id !== id));
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
          SkyJourney Admin
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
      <div className="admin-content">
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
              >
                + Thêm chuyến bay
              </button>
            </div>
            
            {editingFlight ? (
              <div className="edit-form">
                <h3>{editingFlight.id ? "Chỉnh sửa" : "Thêm mới"} chuyến bay</h3>
                
                <div className="form-group">
                  <label>Số hiệu chuyến bay</label>
                  <input 
                    type="text" 
                    value={editingFlight.flightNumber || ""}
                    onChange={(e) => setEditingFlight({...editingFlight, flightNumber: e.target.value})}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Điểm đi</label>
                    <input 
                      type="text" 
                      value={editingFlight.departure || ""}
                      onChange={(e) => setEditingFlight({...editingFlight, departure: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Điểm đến</label>
                    <input 
                      type="text" 
                      value={editingFlight.arrival || ""}
                      onChange={(e) => setEditingFlight({...editingFlight, arrival: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Giờ khởi hành</label>
                    <input 
                      type="time" 
                      value={editingFlight.departureTime || ""}
                      onChange={(e) => setEditingFlight({...editingFlight, departureTime: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Giờ đến</label>
                    <input 
                      type="time" 
                      value={editingFlight.arrivalTime || ""}
                      onChange={(e) => setEditingFlight({...editingFlight, arrivalTime: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày bay</label>
                    <input 
                      type="date" 
                      value={editingFlight.date || ""}
                      onChange={(e) => setEditingFlight({...editingFlight, date: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Máy bay</label>
                    <select
                      value={editingFlight.aircraftModel || ""}
                      onChange={(e) => setEditingFlight({...editingFlight, aircraftModel: e.target.value})}
                    >
                      <option value="">Chọn máy bay</option>
                      {aircraftModels.map(aircraft => (
                        <option key={aircraft.id} value={aircraft.model}>
                          {aircraft.model} ({aircraft.capacity} ghế)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <h4>Giá vé và Số ghế</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Economy - Giá (VND)</label>
                    <input 
                      type="number" 
                      value={editingFlight.prices?.economy || ""}
                      onChange={(e) => setEditingFlight({
                        ...editingFlight,
                        prices: {...editingFlight.prices, economy: e.target.value}
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Số ghế</label>
                    <input 
                      type="number" 
                      value={editingFlight.seats?.economy || ""}
                      onChange={(e) => setEditingFlight({
                        ...editingFlight,
                        seats: {...editingFlight.seats, economy: e.target.value}
                      })}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Business - Giá (VND)</label>
                    <input 
                      type="number" 
                      value={editingFlight.prices?.business || ""}
                      onChange={(e) => setEditingFlight({
                        ...editingFlight,
                        prices: {...editingFlight.prices, business: e.target.value}
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Số ghế</label>
                    <input 
                      type="number" 
                      value={editingFlight.seats?.business || ""}
                      onChange={(e) => setEditingFlight({
                        ...editingFlight,
                        seats: {...editingFlight.seats, business: e.target.value}
                      })}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>First Class - Giá (VND)</label>
                    <input 
                      type="number" 
                      value={editingFlight.prices?.firstClass || ""}
                      onChange={(e) => setEditingFlight({
                        ...editingFlight,
                        prices: {...editingFlight.prices, firstClass: e.target.value}
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Số ghế</label>
                    <input 
                      type="number" 
                      value={editingFlight.seats?.firstClass || ""}
                      onChange={(e) => setEditingFlight({
                        ...editingFlight,
                        seats: {...editingFlight.seats, firstClass: e.target.value}
                      })}
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setEditingFlight(null)}
                  >
                    Hủy
                  </button>
                  <button 
                    className="save-btn"
                    onClick={editingFlight.id ? handleUpdateFlight : handleAddFlight}
                  >
                    {editingFlight.id ? "Cập nhật" : "Thêm mới"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="table-container">
                  <table className="management-table">
                    <thead>
                      <tr>
                        <th>Số hiệu</th>
                        <th>Tuyến bay</th>
                        <th>Máy bay</th>
                        <th>Giờ bay</th>
                        <th>Ngày</th>
                        <th>Giá vé (Economy)</th>
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
                          <td>
                            <input 
                              type="time" 
                              value={flight.departureTime}
                              onChange={(e) => handleChangeDepartureTime(flight.id, e.target.value)}
                              className="time-input"
                            />
                          </td>
                          <td>{flight.date}</td>
                          <td>{formatCurrency(flight.prices?.economy)}</td>
                          <td>
                            <span className={`status-badge ${flight.status === "On Time" ? "active" : "warning"}`}>
                              {flight.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="edit-btn"
                              onClick={() => setEditingFlight(flight)}
                            >
                              Sửa
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteFlight(flight.id)}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
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
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <style jsx>{`
  .admin-dashboard {
    display: flex;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background-color: #f5f7fa;
    position: relative;
  }

  .admin-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 220px; /* Mặc định mở rộng */
    background: #1a237e;
    color: white;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;
    z-index: 1000;
    overflow: hidden;
  }
  .admin-sidebar:not(.open) {
    width: 80px;
  }
  .admin-sidebar.open {
    width: 220px;
  }
  .admin-logo {
    font-size: 18px;
    font-weight: 700;
    padding: 0 20px 20px;
    border-bottom: 1px solid #3949ab;
    margin-bottom: 20px;
    cursor: pointer;
    color: #ffd600;
    white-space: nowrap;
    opacity: 1;
    transition: opacity 0.3s ease;
  }
  .admin-sidebar:not(.open) .admin-logo {
    opacity: 0;
  }
  .admin-menu {
    flex: 1;
  }

  .menu-item {
    padding: 15px 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
    border-left: 4px solid transparent;
    white-space: nowrap;
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
  }

  .menu-item span {
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .admin-sidebar:not(.open) .menu-item span {
    opacity: 0;
  }

  .admin-footer {
    padding: 20px;
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
    white-space: nowrap;
  }

  .logout-btn .icon {
    margin-right: 8px;
  }

  .logout-btn span {
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .admin-sidebar:not(.open) .logout-btn span {
    opacity: 0;
  }

  .admin-content {
    flex: 1;
    padding: 20px;
    margin-left: 220px;
    transition: margin-left 0.3s ease;
    overflow-y: auto;
  }
  .admin-sidebar:not(.open) ~ .admin-content {
    margin-left: 80px;
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e0e0e0;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .sidebar-toggle {
    display: block;
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

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: none;
  }

  /* Responsive Styles */
  @media (max-width: 768px) {
    .admin-sidebar {
      width: 0;
      transform: translateX(-100%);
    }
    
    .admin-sidebar.open {
      width: 250px;
      transform: translateX(0);
    }
    
    .admin-content {
      margin-left: 0;
    }
    
    .sidebar-toggle {
      display: block;
    }
    
    .sidebar-overlay {
      display: block;
    }
    
    .stats-cards {
      grid-template-columns: 1fr;
    }
    
    .form-row {
      flex-direction: column;
      gap: 0;
    }
    
    .filter-controls {
      flex-wrap: wrap;
    }
  }

  /* Dashboard Styles */
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    position: relative;
    overflow: hidden;
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #1a237e;
    margin-bottom: 5px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #666;
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
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  .recent-activities h2 {
    margin-top: 0;
    font-size: 20px;
    color: #1a237e;
  }
  
  .activity-item {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
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
  }
  
  .activity-title {
    font-weight: 500;
    margin-bottom: 5px;
  }
  
  .activity-time {
    font-size: 13px;
    color: #888;
  }
  
  /* Management Styles */
  .management-container, .announcement-container, .stats-container {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  .management-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .add-btn {
    background: #1a237e;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  
  .edit-form {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #555;
  }
  
  .form-group input, 
  .form-group select, 
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 15px;
    box-sizing: border-box;
  }
  
  .form-row {
    display: flex;
    gap: 15px;
  }
  
  .form-row .form-group {
    flex: 1;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .cancel-btn {
    background: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .save-btn {
    background: #1a237e;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .management-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
  }
  
  .management-table th {
    background: #e8eaf6;
    padding: 12px 15px;
    text-align: left;
    font-weight: 600;
    color: #1a237e;
    border-bottom: 2px solid #c5cae9;
  }
  
  .management-table td {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
  }
  
  .management-table tr:hover {
    background: #f9f9f9;
  }
  
  .status-badge {
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 13px;
    font-weight: 500;
  }
  
  .status-badge.active {
    background: #e8f5e9;
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
  
  .edit-btn, .delete-btn, .view-btn, .confirm-btn {
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    margin-right: 5px;
  }
  
  .edit-btn {
    background: #e3f2fd;
    color: #1565c0;
    border: 1px solid #bbdefb;
  }
  
  .delete-btn {
    background: #ffebee;
    color: #c62828;
    border: 1px solid #ffcdd2;
  }
  
  .view-btn {
    background: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #c8e6c9;
  }
  
  .confirm-btn {
    background: #fff8e1;
    color: #f57f17;
    border: 1px solid #ffecb3;
  }
  
  .time-input {
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .filter-controls {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .filter-controls select, 
  .filter-controls input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .filter-btn, .export-btn {
    background: #1a237e;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .stats-summary {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-label {
    font-size: 14px;
    color: #666;
  }
  
  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #1a237e;
  }
  
  /* Announcement Styles */
  .announcement-form {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 30px;
  }
  
  .publish-btn {
    background: #1a237e;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .preview-btn {
    background: #e0e0e0;
    color: #333;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
    margin-right: 10px;
  }
  
  .history-item {
    background: white;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  }
  
  .item-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .item-title {
    font-weight: 600;
  }
  
  .item-priority {
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .item-priority.normal {
    background: #e3f2fd;
    color: #1565c0;
  }
  
  .item-priority.high {
    background: #fff8e1;
    color: #f57f17;
  }
  
  .item-content {
    color: #555;
    margin-bottom: 10px;
  }
  
  .item-footer {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #888;
  }
  
  .item-actions button {
    background: none;
    border: none;
    color: #1a237e;
    cursor: pointer;
    margin-left: 10px;
  }
  
  /* Stats Styles */
  .charts-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .chart-card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  .chart-placeholder {
    height: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .bar-chart {
    display: flex;
    align-items: flex-end;
    height: 180px;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .bar {
    width: 40px;
    background: #1a237e;
    position: relative;
    border-radius: 4px 4px 0 0;
  }
  
  .bar span {
    position: absolute;
    bottom: -25px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 12px;
  }
  
  .pie-chart {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    position: relative;
    background: conic-gradient(
      #2e7d32 0deg 65%, 
      #1565c0 65deg 90%, 
      #6a1b9a 90deg 100%
    );
  }
  
  .chart-center {
    position: absolute;
    width: 90px;
    height: 90px;
    background: white;
    border-radius: 50%;
    top: 45px;
    left: 45px;
  }
  
  .chart-legend {
    margin-top: 20px;
  }
  
  .chart-legend div {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    margin-right: 8px;
  }
  
  .legend-color.economy {
    background: #2e7d32;
  }
  
  .legend-color.business {
    background: #1565c0;
  }
  
  .legend-color.first-class {
    background: #6a1b9a;
  }
  
  .stats-table {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  .stats-table h3 {
    margin-top: 0;
    color: #1a237e;
  }
  
  .stats-table table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .stats-table th {
    background: #e8eaf6;
    padding: 12px 15px;
    text-align: left;
    font-weight: 600;
    color: #1a237e;
    border-bottom: 2px solid #c5cae9;
  }
  
  .stats-table td {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
  }
  
  .stats-table tr:hover {
    background: #f9f9f9;
  }
`}</style>
    </div>
  );
};

export default AdminDashboard;