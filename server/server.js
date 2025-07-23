// Thêm vào sau các API hiện có:

// 👈 API thêm chuyến bay
app.post('/api/flights', async (req, res) => {
  try {
    const {
      flightNumber,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      date,
      aircraftModel
    } = req.body;

    console.log('📥 Adding flight:', req.body);

    // Lấy ID sân bay từ code
    const depAirport = await pool.query('SELECT id FROM airports WHERE code = $1', [departure]);
    const arrAirport = await pool.query('SELECT id FROM airports WHERE code = $1', [arrival]);
    
    if (depAirport.rows.length === 0 || arrAirport.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid airport code' });
    }

    // Lấy ID aircraft từ model
    let aircraftId = null;
    if (aircraftModel) {
      const aircraft = await pool.query('SELECT id FROM aircrafts WHERE model = $1', [aircraftModel]);
      if (aircraft.rows.length > 0) {
        aircraftId = aircraft.rows[0].id;
      }
    }

    // Thêm chuyến bay vào database
    const result = await pool.query(
      `INSERT INTO flights (
        flight_number, departure_airport_id, arrival_airport_id, 
        departure_time, arrival_time, flight_date, aircraft_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        flightNumber,
        depAirport.rows[0].id,
        arrAirport.rows[0].id,
        departureTime,
        arrivalTime,
        date,
        aircraftId,
        'On Time'
      ]
    );

    console.log('✅ Flight added to database:', result.rows[0]);
    res.json({ success: true, flight: result.rows[0] });
  } catch (error) {
    console.error('❌ Error adding flight:', error);
    res.status(500).json({ error: error.message });
  }
});

// 👈 API xóa chuyến bay
app.delete('/api/flights/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting flight:', id);

    const result = await pool.query('DELETE FROM flights WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    console.log('✅ Flight deleted from database:', result.rows[0]);
    res.json({ success: true, flight: result.rows[0] });
  } catch (error) {
    console.error('❌ Error deleting flight:', error);
    res.status(500).json({ error: error.message });
  }
});

// 👈 API thêm máy bay
app.post('/api/aircrafts', async (req, res) => {
  try {
    const { model, manufacturer, width, length, seat_map } = req.body;
    console.log('📥 Adding aircraft:', req.body);

    const result = await pool.query(
      `INSERT INTO aircrafts (model, manufacturer, width, length, seat_map) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [model, manufacturer || 'Unknown', width, length, JSON.stringify(seat_map)]
    );

    console.log('✅ Aircraft added to database:', result.rows[0]);
    res.json({ success: true, aircraft: result.rows[0] });
  } catch (error) {
    console.error('❌ Error adding aircraft:', error);
    res.status(500).json({ error: error.message });
  }
});

// 👈 API xóa máy bay
app.delete('/api/aircrafts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting aircraft:', id);

    // Kiểm tra xem máy bay có đang được sử dụng không
    const flightCheck = await pool.query('SELECT COUNT(*) FROM flights WHERE aircraft_id = $1', [id]);
    if (parseInt(flightCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete aircraft that is being used by flights' 
      });
    }

    const result = await pool.query('DELETE FROM aircrafts WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aircraft not found' });
    }

    console.log('✅ Aircraft deleted from database:', result.rows[0]);
    res.json({ success: true, aircraft: result.rows[0] });
  } catch (error) {
    console.error('❌ Error deleting aircraft:', error);
    res.status(500).json({ error: error.message });
  }
});

// 👈 API cập nhật seat map
app.put('/api/aircrafts/:id/seatmap', async (req, res) => {
  try {
    const { id } = req.params;
    const { seat_map } = req.body;
    console.log('🔄 Updating seat map for aircraft:', id);

    const result = await pool.query(
      'UPDATE aircrafts SET seat_map = $1 WHERE id = $2 RETURNING *',
      [JSON.stringify(seat_map), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aircraft not found' });
    }

    console.log('✅ Seat map updated in database');
    res.json({ success: true, aircraft: result.rows[0] });
  } catch (error) {
    console.error('❌ Error updating seat map:', error);
    res.status(500).json({ error: error.message });
  }
});