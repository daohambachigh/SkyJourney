const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// === EXISTING ENDPOINTS ===

// API lấy danh sách sân bay
app.get('/api/airports', async (req, res) => {
  try {
    console.log('📡 API /api/airports called');
    
    const result = await pool.query(`
      SELECT 
        id,
        code,
        name,
        city,
        country,
        region
      FROM airports 
      ORDER BY 
        CASE region
          WHEN 'Vietnam' THEN 1
          WHEN 'Southeast Asia' THEN 2
          WHEN 'Asia' THEN 3
          WHEN 'Europe' THEN 4
          WHEN 'Other' THEN 5
          ELSE 6
        END,
        city ASC
    `);
    
    console.log(`✅ Returning ${result.rows.length} airports`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching airports:', error);
    res.status(500).json({ 
      error: 'Failed to fetch airports',
      message: error.message 
    });
  }
});

// API tìm kiếm sân bay
app.get('/api/airports/search', async (req, res) => {
  try {
    const { q } = req.query;
    console.log('🔍 Search airports with query:', q);
    
    if (!q || q.length < 1) {
      return res.json([]);
    }
    
    const searchTerm = `%${q.toLowerCase()}%`;
    
    const result = await pool.query(`
      SELECT 
        id,
        code,
        name,
        city,
        country,
        region
      FROM airports 
      WHERE 
        LOWER(name) LIKE $1 OR
        LOWER(code) LIKE $1 OR
        LOWER(city) LIKE $1 OR
        LOWER(country) LIKE $1
      ORDER BY 
        CASE region
          WHEN 'Vietnam' THEN 1
          WHEN 'Southeast Asia' THEN 2
          WHEN 'Asia' THEN 3
          WHEN 'Europe' THEN 4
          WHEN 'Other' THEN 5
          ELSE 6
        END,
        city ASC
      LIMIT 50
    `, [searchTerm]);
    
    console.log(`🔍 Search "${q}" found ${result.rows.length} airports`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error searching airports:', error);
    res.status(500).json({ 
      error: 'Failed to search airports',
      message: error.message 
    });
  }
});

// API tìm kiếm chuyến bay (existing)
app.get('/api/search-flights', async (req, res) => {
  try {
    const { from, to, date, tripType, passengers } = req.query;
    
    console.log('🔍 API received search request:', {
      from, to, date, tripType, passengers
    });
    
    if (!from || !to || !date) {
      console.log('❌ Missing parameters');
      return res.status(400).json({ error: 'Missing required parameters: from, to, date' });
    }

    const query = `
      SELECT 
        f.id,
        f.flight_number,
        f.departure_time,
        f.arrival_time,
        f.flight_date,
        f.status,
        dep.code as departure_code,
        dep.name as departure_airport,
        dep.city as departure_city,
        arr.code as arrival_code,
        arr.name as arrival_airport,
        arr.city as arrival_city,
        ac.model as aircraft_model,
        ep.price as economy_price,
        ep.available_seats as economy_seats,
        bp.price as business_price,
        bp.available_seats as business_seats,
        fp.price as first_class_price,
        fp.available_seats as first_class_seats
      FROM flights f
      JOIN airports dep ON f.departure_airport_id = dep.id
      JOIN airports arr ON f.arrival_airport_id = arr.id
      JOIN aircrafts ac ON f.aircraft_id = ac.id
      LEFT JOIN flight_prices ep ON f.id = ep.flight_id AND ep.class_type = 'economy'
      LEFT JOIN flight_prices bp ON f.id = bp.flight_id AND bp.class_type = 'business'
      LEFT JOIN flight_prices fp ON f.id = fp.flight_id AND fp.class_type = 'firstClass'
      WHERE dep.code = $1 
        AND arr.code = $2 
        AND f.flight_date = $3
        AND f.status = 'scheduled'
      ORDER BY f.departure_time
    `;

    console.log('📅 Executing query with params:', [from, to, date]);
    const result = await pool.query(query, [from, to, date]);
    console.log(`✅ Query returned ${result.rows.length} flights`);
    
    const formattedFlights = result.rows.map(row => ({
      id: row.id,
      flightNumber: row.flight_number,
      departureTime: row.departure_time.substring(0, 5),
      arrivalTime: row.arrival_time.substring(0, 5),
      date: row.flight_date,
      status: row.status,
      aircraftModel: row.aircraft_model,
      departure: {
        code: row.departure_code,
        airport: row.departure_airport,
        city: row.departure_city
      },
      arrival: {
        code: row.arrival_code,
        airport: row.arrival_airport,
        city: row.arrival_city
      },
      prices: {
        economy: parseFloat(row.economy_price || 220.90),
        business: parseFloat(row.business_price || 450.90),
        firstClass: parseFloat(row.first_class_price || 880.90)
      },
      availableSeats: {
        economy: row.economy_seats || 100,
        business: row.business_seats || 20,
        firstClass: row.first_class_seats || 8
      }
    }));
    
    console.log('📦 Sending response with', formattedFlights.length, 'flights');
    res.json(formattedFlights);
  } catch (error) {
    console.error('❌ Error searching flights:', error);
    res.status(500).json({ error: error.message });
  }
});

// === NEW ADMIN ENDPOINTS ===

// 👈 ADMIN: Get all flights for management
app.get('/api/flights', async (req, res) => {
  try {
    console.log('📡 Admin: Fetching all flights');
    
    const result = await pool.query(`
      SELECT 
        f.id,
        f.flight_number,
        f.departure_time,
        f.arrival_time,
        f.flight_date,
        f.status,
        dep.code as departure_code,
        dep.name as departure_airport,
        dep.city as departure_city,
        arr.code as arrival_code,
        arr.name as arrival_airport,
        arr.city as arrival_city,
        ac.model as aircraft_model,
        ac.manufacturer as aircraft_manufacturer
      FROM flights f
      JOIN airports dep ON f.departure_airport_id = dep.id
      JOIN airports arr ON f.arrival_airport_id = arr.id
      JOIN aircrafts ac ON f.aircraft_id = ac.id
      ORDER BY f.flight_date DESC, f.departure_time ASC
      LIMIT 100
    `);
    
    const formattedFlights = result.rows.map(row => ({
      id: row.id,
      flightNumber: row.flight_number,
      departure: row.departure_code,
      arrival: row.arrival_code,
      departureCity: row.departure_city,
      arrivalCity: row.arrival_city,
      departureTime: row.departure_time.substring(0, 5),
      arrivalTime: row.arrival_time.substring(0, 5),
      date: row.flight_date,
      status: row.status === 'scheduled' ? 'On Time' : row.status,
      aircraftModel: row.aircraft_model
    }));
    
    console.log(`✅ Admin: Returning ${formattedFlights.length} flights`);
    res.json(formattedFlights);
  } catch (error) {
    console.error('❌ Admin: Error fetching flights:', error);
    res.status(500).json({ 
      error: 'Failed to fetch flights',
      message: error.message 
    });
  }
});

// 👈 ADMIN: Add new flight
app.post('/api/flights', async (req, res) => {
  try {
    const { 
      flightNumber, 
      departure, 
      arrival, 
      departureTime, 
      arrivalTime, 
      date, 
      aircraftModel,
      economyPrice = 220.90,
      businessPrice = 450.90,
      firstClassPrice = 880.90,
      economySeats = 100,
      businessSeats = 20,
      firstClassSeats = 8
    } = req.body;
    
    console.log('📡 Admin: Adding new flight:', req.body);

    // Validate required fields
    if (!flightNumber || !departure || !arrival || !departureTime || !arrivalTime || !date) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['flightNumber', 'departure', 'arrival', 'departureTime', 'arrivalTime', 'date']
      });
    }

    // Get airport IDs
    const depAirport = await pool.query('SELECT id FROM airports WHERE code = $1', [departure]);
    const arrAirport = await pool.query('SELECT id FROM airports WHERE code = $1', [arrival]);
    
    if (depAirport.rows.length === 0) {
      return res.status(400).json({ error: `Departure airport ${departure} not found` });
    }
    if (arrAirport.rows.length === 0) {
      return res.status(400).json({ error: `Arrival airport ${arrival} not found` });
    }

    // Get aircraft ID (find by model or use default)
    let aircraftResult = await pool.query('SELECT id FROM aircrafts WHERE model = $1', [aircraftModel]);
    if (aircraftResult.rows.length === 0) {
      // Use first available aircraft as default
      aircraftResult = await pool.query('SELECT id FROM aircrafts ORDER BY id LIMIT 1');
      if (aircraftResult.rows.length === 0) {
        return res.status(400).json({ error: 'No aircraft available' });
      }
    }

    const depId = depAirport.rows[0].id;
    const arrId = arrAirport.rows[0].id;
    const aircraftId = aircraftResult.rows[0].id;

    // Insert flight
    const flightResult = await pool.query(`
      INSERT INTO flights (flight_number, departure_airport_id, arrival_airport_id, departure_time, arrival_time, flight_date, aircraft_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'scheduled')
      RETURNING id
    `, [flightNumber, depId, arrId, departureTime, arrivalTime, date, aircraftId]);
    
    const flightId = flightResult.rows[0].id;

    // Insert flight prices
    await pool.query(`
      INSERT INTO flight_prices (flight_id, class_type, price, available_seats) VALUES
      ($1, 'economy', $2, $3),
      ($1, 'business', $4, $5),
      ($1, 'firstClass', $6, $7)
    `, [
      flightId,
      parseFloat(economyPrice),
      parseInt(economySeats),
      parseFloat(businessPrice),
      parseInt(businessSeats),
      parseFloat(firstClassPrice),
      parseInt(firstClassSeats)
    ]);

    console.log(`✅ Admin: Flight ${flightNumber} added successfully with ID ${flightId}`);
    res.json({ 
      message: 'Flight added successfully',
      flightId: flightId,
      flightNumber: flightNumber
    });
  } catch (error) {
    console.error('❌ Admin: Error adding flight:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Flight number already exists' });
    } else {
      res.status(500).json({ 
        error: 'Failed to add flight',
        message: error.message 
      });
    }
  }
});

// 👈 ADMIN: Delete flight
app.delete('/api/flights/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📡 Admin: Deleting flight ${id}`);

    // Delete flight prices first (due to foreign key constraint)
    await pool.query('DELETE FROM flight_prices WHERE flight_id = $1', [id]);
    
    // Delete flight
    const result = await pool.query('DELETE FROM flights WHERE id = $1 RETURNING flight_number', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    console.log(`✅ Admin: Flight ${result.rows[0].flight_number} deleted successfully`);
    res.json({ 
      message: 'Flight deleted successfully',
      flightNumber: result.rows[0].flight_number
    });
  } catch (error) {
    console.error('❌ Admin: Error deleting flight:', error);
    res.status(500).json({ 
      error: 'Failed to delete flight',
      message: error.message 
    });
  }
});

// 👈 ADMIN: Get all aircrafts
app.get('/api/aircrafts', async (req, res) => {
  try {
    console.log('📡 Admin: Fetching all aircrafts');
    
    const result = await pool.query(`
      SELECT 
        id,
        model,
        manufacturer,
        width,
        length,
        seat_map,
        created_at
      FROM aircrafts 
      ORDER BY id ASC
    `);
    
    console.log(`✅ Admin: Returning ${result.rows.length} aircrafts`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Admin: Error fetching aircrafts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch aircrafts',
      message: error.message 
    });
  }
});

// 👈 ADMIN: Add new aircraft
app.post('/api/aircrafts', async (req, res) => {
  try {
    const { model, manufacturer = 'Unknown', width, length, seat_map } = req.body;
    
    console.log('📡 Admin: Adding new aircraft:', req.body);

    // Validate required fields
    if (!model || !width || !length) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['model', 'width', 'length']
      });
    }

    // Generate default seat map if not provided
    const defaultSeatMap = seat_map || Array(parseInt(length))
      .fill(0)
      .map(() => Array(parseInt(width)).fill("economy"));

    const result = await pool.query(`
      INSERT INTO aircrafts (model, manufacturer, width, length, seat_map)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, model
    `, [model, manufacturer, parseInt(width), parseInt(length), JSON.stringify(defaultSeatMap)]);
    
    console.log(`✅ Admin: Aircraft ${model} added successfully with ID ${result.rows[0].id}`);
    res.json({ 
      message: 'Aircraft added successfully',
      aircraftId: result.rows[0].id,
      model: result.rows[0].model
    });
  } catch (error) {
    console.error('❌ Admin: Error adding aircraft:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Aircraft model already exists' });
    } else {
      res.status(500).json({ 
        error: 'Failed to add aircraft',
        message: error.message 
      });
    }
  }
});

// 👈 ADMIN: Delete aircraft
app.delete('/api/aircrafts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📡 Admin: Deleting aircraft ${id}`);

    // Check if aircraft is being used by any flights
    const flightCheck = await pool.query('SELECT COUNT(*) as count FROM flights WHERE aircraft_id = $1', [id]);
    if (parseInt(flightCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete aircraft that is being used by flights',
        flightsCount: flightCheck.rows[0].count
      });
    }

    const result = await pool.query('DELETE FROM aircrafts WHERE id = $1 RETURNING model', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aircraft not found' });
    }

    console.log(`✅ Admin: Aircraft ${result.rows[0].model} deleted successfully`);
    res.json({ 
      message: 'Aircraft deleted successfully',
      model: result.rows[0].model
    });
  } catch (error) {
    console.error('❌ Admin: Error deleting aircraft:', error);
    res.status(500).json({ 
      error: 'Failed to delete aircraft',
      message: error.message 
    });
  }
});

// 👈 ADMIN: Update aircraft seat map
app.put('/api/aircrafts/:id/seatmap', async (req, res) => {
  try {
    const { id } = req.params;
    const { seat_map } = req.body;
    
    console.log(`📡 Admin: Updating seat map for aircraft ${id}`);

    if (!seat_map) {
      return res.status(400).json({ error: 'seat_map is required' });
    }

    const result = await pool.query(`
      UPDATE aircrafts 
      SET seat_map = $1 
      WHERE id = $2 
      RETURNING model
    `, [JSON.stringify(seat_map), id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aircraft not found' });
    }

    console.log(`✅ Admin: Seat map updated for aircraft ${result.rows[0].model}`);
    res.json({ 
      message: 'Seat map updated successfully',
      model: result.rows[0].model
    });
  } catch (error) {
    console.error('❌ Admin: Error updating seat map:', error);
    res.status(500).json({ 
      error: 'Failed to update seat map',
      message: error.message 
    });
  }
});

// 👈 ADMIN: Get dashboard stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    console.log('📡 Admin: Fetching dashboard stats');
    
    // Get counts
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM flights WHERE flight_date >= CURRENT_DATE) as total_flights,
        (SELECT COUNT(*) FROM aircrafts) as active_aircrafts,
        (SELECT COUNT(*) FROM flight_prices) as tickets_sold,
        (SELECT COALESCE(SUM(price * (100 - available_seats)), 0) FROM flight_prices) as revenue
    `);
    
    const result = stats.rows[0];
    
    console.log('✅ Admin: Dashboard stats fetched');
    res.json({
      totalFlights: parseInt(result.total_flights) || 0,
      activeAircrafts: parseInt(result.active_aircrafts) || 0,
      ticketsSold: parseInt(result.tickets_sold) || 0,
      revenue: parseFloat(result.revenue) || 0
    });
  } catch (error) {
    console.error('❌ Admin: Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stats',
      message: error.message 
    });
  }
});

// 👈 THÊM: API lấy chuyến bay theo ngày cho admin
app.get('/api/admin/flights/by-date', async (req, res) => {
  try {
    const { date, region } = req.query;
    console.log('📡 Admin: Fetching flights by date:', { date, region });
    
    let query = `
      SELECT 
        f.id,
        f.flight_number as "flightNumber",
        f.departure_time as "departureTime",
        f.arrival_time as "arrivalTime",
        f.flight_date as "date",
        f.status,
        dep.code as departure,
        dep.name as departure_airport,
        dep.city as departure_city,
        dep.region as departure_region,
        arr.code as arrival,
        arr.name as arrival_airport,
        arr.city as arrival_city,
        arr.region as arrival_region,
        ac.model as "aircraftModel",
        ac.manufacturer as aircraft_manufacturer
      FROM flights f
      JOIN airports dep ON f.departure_airport_id = dep.id
      JOIN airports arr ON f.arrival_airport_id = arr.id
      LEFT JOIN aircrafts ac ON f.aircraft_id = ac.id
    `;
    
    const params = [];
    const conditions = [];
    
    // Lọc theo ngày nếu có
    if (date && date.trim() !== '') {
      conditions.push(`f.flight_date = $${params.length + 1}`);
      params.push(date);
    }
    
    // Lọc theo khu vực nếu có
    if (region && region !== 'all') {
      switch (region) {
        case 'vietnam':
          conditions.push(`dep.region = 'Vietnam' AND arr.region = 'Vietnam'`);
          break;
        case 'sea':
          conditions.push(`(
            (dep.region = 'Vietnam' AND arr.region = 'Southeast Asia') OR
            (dep.region = 'Southeast Asia' AND arr.region = 'Vietnam')
          )`);
          break;
        case 'asia':
          conditions.push(`(
            (dep.region = 'Vietnam' AND arr.region = 'Asia') OR
            (dep.region = 'Asia' AND arr.region = 'Vietnam')
          )`);
          break;
        case 'other':
          conditions.push(`(
            (dep.region = 'Vietnam' AND arr.region = 'Other') OR
            (dep.region = 'Other' AND arr.region = 'Vietnam')
          )`);
          break;
      }
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY f.flight_date, f.departure_time';
    
    console.log('🔍 Query:', query);
    console.log('📋 Params:', params);
    
    const result = await pool.query(query, params);
    
    console.log(`✅ Found ${result.rows.length} flights`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching flights by date:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'success',
      message: 'Database connected successfully',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'SkyJourney Flight Booking API',
    version: '1.0.0',
    endpoints: [
      'GET /api/test - Test database connection',
      'GET /api/airports - Get all airports',
      'GET /api/airports/search - Search airports',
      'GET /api/search-flights - Search flights',
      '=== ADMIN ENDPOINTS ===',
      'GET /api/flights - Get all flights (Admin)',
      'POST /api/flights - Add new flight (Admin)',
      'DELETE /api/flights/:id - Delete flight (Admin)',
      'GET /api/aircrafts - Get all aircrafts (Admin)',
      'POST /api/aircrafts - Add new aircraft (Admin)',
      'DELETE /api/aircrafts/:id - Delete aircraft (Admin)',
      'PUT /api/aircrafts/:id/seatmap - Update seat map (Admin)',
      'GET /api/admin/stats - Get dashboard stats (Admin)'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available:`);
  console.log(`   === USER ENDPOINTS ===`);
  console.log(`   GET  http://localhost:${PORT}/api/airports`);
  console.log(`   GET  http://localhost:${PORT}/api/airports/search?q=hanoi`);
  console.log(`   GET  http://localhost:${PORT}/api/search-flights`);
  console.log(`   === ADMIN ENDPOINTS ===`);
  console.log(`   GET  http://localhost:${PORT}/api/flights`);
  console.log(`   POST http://localhost:${PORT}/api/flights`);
  console.log(`   GET  http://localhost:${PORT}/api/aircrafts`);
  console.log(`   POST http://localhost:${PORT}/api/aircrafts`);
  console.log(`   GET  http://localhost:${PORT}/api/admin/stats`);
  
  // Test database connection on startup
  pool.query('SELECT COUNT(*) FROM airports')
    .then(result => console.log(`✅ Database connected - ${result.rows[0].count} airports available`))
    .catch((err) => console.error('❌ Database connection failed:', err.message));
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  pool.end(() => {
    console.log('💾 Database connections closed');
    process.exit(0);
  });
});

module.exports = app;