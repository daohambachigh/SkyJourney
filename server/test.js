const pool = require('./database');

async function testConnection() {
  try {
    console.log('🔍 Attempting to connect to database...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    console.log('Database:', process.env.DB_NAME);
    console.log('User:', process.env.DB_USER);
    
    // Test basic connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully!');
    console.log('Current time:', result.rows[0].now);
    
    // Test airports table
    const airports = await pool.query('SELECT COUNT(*) as count FROM airports');
    console.log('✅ Airports count:', airports.rows[0].count);
    
    // List all airports
    const airportList = await pool.query('SELECT code, city FROM airports LIMIT 3');
    console.log('✅ Sample airports:', airportList.rows);
    
    // Test aircrafts table
    const aircrafts = await pool.query('SELECT COUNT(*) as count FROM aircrafts');
    console.log('✅ Aircraft count:', aircrafts.rows[0].count);
    
    console.log('🎉 All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection error:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === '42P01') {
      console.error('💡 Solution: Table does not exist. Please create tables first!');
    }
    
    process.exit(1);
  }
}

testConnection();