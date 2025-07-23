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

// 👈 THÊM: API lấy danh sách sân bay
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
    console.log('📋 Sample:', result.rows.slice(0, 2));
    
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching airports:', error);
    res.status(500).json({ 
      error: 'Failed to fetch airports',
      message: error.message 
    });
  }
});

// 👈 THÊM: API tìm kiếm sân bay
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

// Existing flight search API (giữ nguyên code cũ)
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

    // Kiểm tra airports có tồn tại không
    const airportCheck = await pool.query(
      'SELECT code, city, name FROM airports WHERE code = $1 OR code = $2',
      [from, to]
    );
    console.log('✈️ Found airports:', airportCheck.rows);

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
    
    if (result.rows.length === 0) {
      const debugQuery = `
        SELECT f.flight_number, dep.code as dep, arr.code as arr, f.flight_date
        FROM flights f
        JOIN airports dep ON f.departure_airport_id = dep.id
        JOIN airports arr ON f.arrival_airport_id = arr.id
        WHERE (dep.code = $1 OR arr.code = $2)
        LIMIT 5
      `;
      const debugResult = await pool.query(debugQuery, [from, to]);
      console.log('🔍 Sample flights in database:', debugResult.rows);
    }
    
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
      'GET /api/search-flights - Search flights'
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
  console.log(`   GET  http://localhost:${PORT}/api/airports`);
  console.log(`   GET  http://localhost:${PORT}/api/airports/search?q=hanoi`);
  console.log(`   GET  http://localhost:${PORT}/api/search-flights`);
  
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