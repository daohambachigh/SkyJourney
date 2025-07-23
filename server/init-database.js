const pool = require('./database');

const initDatabase = async () => {
  try {
    console.log('🚀 Initializing database...');

    // Drop existing tables
    await pool.query(`
      DROP TABLE IF EXISTS flight_prices CASCADE;
      DROP TABLE IF EXISTS flights CASCADE;
      DROP TABLE IF EXISTS aircrafts CASCADE;
      DROP TABLE IF EXISTS airports CASCADE;
    `);

    // Create tables
    await pool.query(`
      CREATE TABLE airports (
          id SERIAL PRIMARY KEY,
          code VARCHAR(3) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          city VARCHAR(100) NOT NULL,
          country VARCHAR(100) NOT NULL,
          region VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE aircrafts (
          id SERIAL PRIMARY KEY,
          model VARCHAR(100) NOT NULL,
          manufacturer VARCHAR(100) DEFAULT 'Unknown',
          width INTEGER NOT NULL,
          length INTEGER NOT NULL,
          seat_map JSONB DEFAULT '[]',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE flights (
          id SERIAL PRIMARY KEY,
          flight_number VARCHAR(50) NOT NULL,
          departure_airport_id INTEGER REFERENCES airports(id),
          arrival_airport_id INTEGER REFERENCES airports(id),
          departure_time TIME NOT NULL,
          arrival_time TIME NOT NULL,
          flight_date DATE NOT NULL,
          aircraft_id INTEGER REFERENCES aircrafts(id),
          status VARCHAR(20) DEFAULT 'scheduled',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE flight_prices (
          id SERIAL PRIMARY KEY,
          flight_id INTEGER REFERENCES flights(id),
          class_type VARCHAR(20) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          available_seats INTEGER NOT NULL
      );
    `);

    console.log('✅ Tables created successfully');

    // Insert airports - chỉ các thành phố được yêu cầu
    await pool.query(`
      INSERT INTO airports (code, name, city, country, region) VALUES
      
      -- VIETNAM
      ('SGN', 'Tan Son Nhat International Airport', 'Ho Chi Minh City', 'Vietnam', 'Vietnam'),
      ('HAN', 'Noi Bai International Airport', 'Hanoi', 'Vietnam', 'Vietnam'),
      ('HPH', 'Cat Bi International Airport', 'Hai Phong', 'Vietnam', 'Vietnam'),
      ('VII', 'Vinh Airport', 'Vinh', 'Vietnam', 'Vietnam'),
      ('HUI', 'Phu Bai International Airport', 'Hue', 'Vietnam', 'Vietnam'),
      ('DAD', 'Da Nang International Airport', 'Da Nang', 'Vietnam', 'Vietnam'),
      ('VCS', 'Con Dao Airport', 'Con Dao', 'Vietnam', 'Vietnam'),
      ('PQC', 'Phu Quoc International Airport', 'Phu Quoc', 'Vietnam', 'Vietnam'),
      
      -- SOUTHEAST ASIA
      ('BKK', 'Suvarnabhumi Airport', 'Bangkok', 'Thailand', 'Southeast Asia'),
      ('DMK', 'Don Mueang International Airport', 'Bangkok', 'Thailand', 'Southeast Asia'),
      ('DPS', 'Ngurah Rai International Airport', 'Bali', 'Indonesia', 'Southeast Asia'),
      ('CGK', 'Soekarno-Hatta International Airport', 'Jakarta', 'Indonesia', 'Southeast Asia'),
      ('SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore', 'Southeast Asia'),
      ('KUL', 'Kuala Lumpur International Airport', 'Kuala Lumpur', 'Malaysia', 'Southeast Asia'),
      ('VTE', 'Wattay International Airport', 'Vientiane', 'Laos', 'Southeast Asia'),
      
      -- CHINA & ASIA
      ('PEK', 'Beijing Capital International Airport', 'Beijing', 'China', 'Asia'),
      ('PKX', 'Beijing Daxing International Airport', 'Beijing', 'China', 'Asia'),
      ('CTU', 'Chengdu Shuangliu International Airport', 'Chengdu', 'China', 'Asia'),
      ('CAN', 'Guangzhou Baiyun International Airport', 'Guangzhou', 'China', 'Asia'),
      ('NNG', 'Nanning Wuxu Airport', 'Nanning', 'China', 'Asia'),
      ('WUH', 'Wuhan Tianhe International Airport', 'Wuhan', 'China', 'Asia'),
      ('KMG', 'Kunming Changshui International Airport', 'Kunming', 'China', 'Asia'),
      
      -- SOUTH KOREA
      ('ICN', 'Incheon International Airport', 'Seoul', 'South Korea', 'Asia'),
      ('TAE', 'Daegu International Airport', 'Daegu', 'South Korea', 'Asia'),
      ('PUS', 'Gimhae International Airport', 'Busan', 'South Korea', 'Asia'),
      
      -- JAPAN
      ('NRT', 'Narita International Airport', 'Tokyo', 'Japan', 'Asia'),
      ('HND', 'Haneda Airport', 'Tokyo', 'Japan', 'Asia'),
      ('KIX', 'Kansai International Airport', 'Osaka', 'Japan', 'Asia'),
      ('ITM', 'Osaka International Airport', 'Osaka', 'Japan', 'Asia'),
      
      -- INDIA
      ('BOM', 'Chhatrapati Shivaji International Airport', 'Mumbai', 'India', 'Asia'),
      
      -- TAIWAN
      ('TPE', 'Taiwan Taoyuan International Airport', 'Taipei', 'Taiwan', 'Asia'),
      ('TSA', 'Taipei Songshan Airport', 'Taipei', 'Taiwan', 'Asia'),
      
      -- USA
      ('LAX', 'Los Angeles International Airport', 'Los Angeles', 'United States', 'Other'),
      
      -- AUSTRALIA
      ('SYD', 'Sydney Kingsford Smith Airport', 'Sydney', 'Australia', 'Other'),
      ('MEL', 'Melbourne Airport', 'Melbourne', 'Australia', 'Other')
    `);

    console.log('✅ Airports inserted');

    // Insert aircrafts
    await pool.query(`
      INSERT INTO aircrafts (model, manufacturer, width, length, seat_map) VALUES
      ('Boeing 787-9', 'Boeing', 9, 32, '[]'),
      ('Airbus A350-900', 'Airbus', 9, 34, '[]'),
      ('Boeing 777-300ER', 'Boeing', 10, 40, '[]'),
      ('Airbus A321neo', 'Airbus', 6, 28, '[]'),
      ('Boeing 737-800', 'Boeing', 6, 26, '[]'),
      ('Airbus A320', 'Airbus', 6, 24, '[]'),
      ('Embraer E190', 'Embraer', 4, 20, '[]')
    `);

    console.log('✅ Aircrafts inserted');

    // Insert flights - tối ưu với các thành phố được chọn
    const today = new Date();
    const flightRoutes = [
      
      // === CHUYẾN BAY NỘI ĐỊA VIETNAM ===
      
      // HAN - SGN (tuyến chính)
      { from: 'HAN', to: 'SGN', dep: '06:00', arr: '08:15', flight: 'VJ101', aircraft: 4 },
      { from: 'HAN', to: 'SGN', dep: '08:30', arr: '10:45', flight: 'VJ103', aircraft: 5 },
      { from: 'HAN', to: 'SGN', dep: '11:00', arr: '13:15', flight: 'VJ105', aircraft: 4 },
      { from: 'HAN', to: 'SGN', dep: '14:20', arr: '16:35', flight: 'VJ107', aircraft: 5 },
      { from: 'HAN', to: 'SGN', dep: '17:45', arr: '20:00', flight: 'VJ109', aircraft: 4 },
      { from: 'HAN', to: 'SGN', dep: '21:30', arr: '23:45', flight: 'VJ111', aircraft: 5 },
      
      { from: 'SGN', to: 'HAN', dep: '06:15', arr: '08:30', flight: 'VJ102', aircraft: 4 },
      { from: 'SGN', to: 'HAN', dep: '09:45', arr: '12:00', flight: 'VJ104', aircraft: 5 },
      { from: 'SGN', to: 'HAN', dep: '12:30', arr: '14:45', flight: 'VJ106', aircraft: 4 },
      { from: 'SGN', to: 'HAN', dep: '15:50', arr: '18:05', flight: 'VJ108', aircraft: 5 },
      { from: 'SGN', to: 'HAN', dep: '19:15', arr: '21:30', flight: 'VJ110', aircraft: 4 },
      { from: 'SGN', to: 'HAN', dep: '22:00', arr: '00:15', flight: 'VJ112', aircraft: 5 },
      
      // HAN - DAD
      { from: 'HAN', to: 'DAD', dep: '07:15', arr: '09:00', flight: 'VJ201', aircraft: 6 },
      { from: 'HAN', to: 'DAD', dep: '13:45', arr: '15:30', flight: 'VJ203', aircraft: 6 },
      { from: 'HAN', to: 'DAD', dep: '18:20', arr: '20:05', flight: 'VJ205', aircraft: 6 },
      { from: 'DAD', to: 'HAN', dep: '10:30', arr: '12:15', flight: 'VJ202', aircraft: 6 },
      { from: 'DAD', to: 'HAN', dep: '16:15', arr: '18:00', flight: 'VJ204', aircraft: 6 },
      { from: 'DAD', to: 'HAN', dep: '21:00', arr: '22:45', flight: 'VJ206', aircraft: 6 },
      
      // HAN - HUI
      { from: 'HAN', to: 'HUI', dep: '08:00', arr: '09:30', flight: 'VJ221', aircraft: 7 },
      { from: 'HAN', to: 'HUI', dep: '15:30', arr: '17:00', flight: 'VJ223', aircraft: 7 },
      { from: 'HUI', to: 'HAN', dep: '10:15', arr: '11:45', flight: 'VJ222', aircraft: 7 },
      { from: 'HUI', to: 'HAN', dep: '17:45', arr: '19:15', flight: 'VJ224', aircraft: 7 },
      
      // HAN - VII (Vinh)
      { from: 'HAN', to: 'VII', dep: '09:00', arr: '10:15', flight: 'VJ241', aircraft: 7 },
      { from: 'HAN', to: 'VII', dep: '16:30', arr: '17:45', flight: 'VJ243', aircraft: 7 },
      { from: 'VII', to: 'HAN', dep: '11:00', arr: '12:15', flight: 'VJ242', aircraft: 7 },
      { from: 'VII', to: 'HAN', dep: '18:30', arr: '19:45', flight: 'VJ244', aircraft: 7 },
      
      // HAN - HPH (Hai Phong)
      { from: 'HAN', to: 'HPH', dep: '07:30', arr: '08:15', flight: 'VJ261', aircraft: 7 },
      { from: 'HAN', to: 'HPH', dep: '17:00', arr: '17:45', flight: 'VJ263', aircraft: 7 },
      { from: 'HPH', to: 'HAN', dep: '09:00', arr: '09:45', flight: 'VJ262', aircraft: 7 },
      { from: 'HPH', to: 'HAN', dep: '18:30', arr: '19:15', flight: 'VJ264', aircraft: 7 },
      
      // HAN - PQC
      { from: 'HAN', to: 'PQC', dep: '09:15', arr: '11:30', flight: 'VJ401', aircraft: 6 },
      { from: 'HAN', to: 'PQC', dep: '16:45', arr: '19:00', flight: 'VJ403', aircraft: 6 },
      { from: 'PQC', to: 'HAN', dep: '12:15', arr: '14:30', flight: 'VJ402', aircraft: 6 },
      { from: 'PQC', to: 'HAN', dep: '19:45', arr: '22:00', flight: 'VJ404', aircraft: 6 },
      
      // SGN - DAD
      { from: 'SGN', to: 'DAD', dep: '07:45', arr: '09:15', flight: 'VJ501', aircraft: 6 },
      { from: 'SGN', to: 'DAD', dep: '12:30', arr: '14:00', flight: 'VJ503', aircraft: 6 },
      { from: 'SGN', to: 'DAD', dep: '17:15', arr: '18:45', flight: 'VJ505', aircraft: 6 },
      { from: 'DAD', to: 'SGN', dep: '10:00', arr: '11:30', flight: 'VJ502', aircraft: 6 },
      { from: 'DAD', to: 'SGN', dep: '14:45', arr: '16:15', flight: 'VJ504', aircraft: 6 },
      { from: 'DAD', to: 'SGN', dep: '19:30', arr: '21:00', flight: 'VJ506', aircraft: 6 },
      
      // SGN - PQC
      { from: 'SGN', to: 'PQC', dep: '06:30', arr: '07:45', flight: 'VJ701', aircraft: 7 },
      { from: 'SGN', to: 'PQC', dep: '11:15', arr: '12:30', flight: 'VJ703', aircraft: 7 },
      { from: 'SGN', to: 'PQC', dep: '16:00', arr: '17:15', flight: 'VJ705', aircraft: 7 },
      { from: 'SGN', to: 'PQC', dep: '20:30', arr: '21:45', flight: 'VJ707', aircraft: 7 },
      { from: 'PQC', to: 'SGN', dep: '08:30', arr: '09:45', flight: 'VJ702', aircraft: 7 },
      { from: 'PQC', to: 'SGN', dep: '13:15', arr: '14:30', flight: 'VJ704', aircraft: 7 },
      { from: 'PQC', to: 'SGN', dep: '18:00', arr: '19:15', flight: 'VJ706', aircraft: 7 },
      { from: 'PQC', to: 'SGN', dep: '22:30', arr: '23:45', flight: 'VJ708', aircraft: 7 },
      
      // SGN - VCS (Con Dao)
      { from: 'SGN', to: 'VCS', dep: '08:00', arr: '09:00', flight: 'VJ751', aircraft: 7 },
      { from: 'SGN', to: 'VCS', dep: '15:30', arr: '16:30', flight: 'VJ753', aircraft: 7 },
      { from: 'VCS', to: 'SGN', dep: '09:45', arr: '10:45', flight: 'VJ752', aircraft: 7 },
      { from: 'VCS', to: 'SGN', dep: '17:15', arr: '18:15', flight: 'VJ754', aircraft: 7 },
      
      // === CHUYẾN BAY TỚI ĐÔNG NAM Á ===
      
      // Vietnam to Singapore
      { from: 'HAN', to: 'SIN', dep: '07:30', arr: '11:45', flight: 'SJ801', aircraft: 1 },
      { from: 'HAN', to: 'SIN', dep: '13:20', arr: '17:35', flight: 'SJ803', aircraft: 2 },
      { from: 'HAN', to: 'SIN', dep: '19:15', arr: '23:30', flight: 'SJ805', aircraft: 1 },
      { from: 'SIN', to: 'HAN', dep: '01:00', arr: '05:15', flight: 'SJ802', aircraft: 1 },
      { from: 'SIN', to: 'HAN', dep: '08:45', arr: '13:00', flight: 'SJ804', aircraft: 2 },
      { from: 'SIN', to: 'HAN', dep: '15:30', arr: '19:45', flight: 'SJ806', aircraft: 1 },
      
      { from: 'SGN', to: 'SIN', dep: '08:00', arr: '11:15', flight: 'SJ811', aircraft: 1 },
      { from: 'SGN', to: 'SIN', dep: '14:45', arr: '18:00', flight: 'SJ813', aircraft: 2 },
      { from: 'SGN', to: 'SIN', dep: '20:30', arr: '23:45', flight: 'SJ815', aircraft: 1 },
      { from: 'SIN', to: 'SGN', dep: '12:30', arr: '15:45', flight: 'SJ812', aircraft: 1 },
      { from: 'SIN', to: 'SGN', dep: '19:15', arr: '22:30', flight: 'SJ814', aircraft: 2 },
      { from: 'SIN', to: 'SGN', dep: '02:15', arr: '05:30', flight: 'SJ816', aircraft: 1 },
      
      // Vietnam to Thailand (Bangkok)
      { from: 'HAN', to: 'BKK', dep: '08:15', arr: '11:30', flight: 'SJ901', aircraft: 2 },
      { from: 'HAN', to: 'BKK', dep: '14:30', arr: '17:45', flight: 'SJ903', aircraft: 1 },
      { from: 'HAN', to: 'BKK', dep: '20:45', arr: '00:00', flight: 'SJ905', aircraft: 2 },
      { from: 'BKK', to: 'HAN', dep: '02:30', arr: '05:45', flight: 'SJ902', aircraft: 2 },
      { from: 'BKK', to: 'HAN', dep: '12:15', arr: '15:30', flight: 'SJ904', aircraft: 1 },
      { from: 'BKK', to: 'HAN', dep: '18:00', arr: '21:15', flight: 'SJ906', aircraft: 2 },
      
      { from: 'SGN', to: 'BKK', dep: '10:30', arr: '12:45', flight: 'SJ911', aircraft: 1 },
      { from: 'SGN', to: 'BKK', dep: '16:15', arr: '18:30', flight: 'SJ913', aircraft: 2 },
      { from: 'SGN', to: 'BKK', dep: '22:00', arr: '00:15', flight: 'SJ915', aircraft: 1 },
      { from: 'BKK', to: 'SGN', dep: '04:00', arr: '06:15', flight: 'SJ912', aircraft: 1 },
      { from: 'BKK', to: 'SGN', dep: '14:00', arr: '16:15', flight: 'SJ914', aircraft: 2 },
      { from: 'BKK', to: 'SGN', dep: '19:45', arr: '22:00', flight: 'SJ916', aircraft: 1 },
      
      // Vietnam to Malaysia (Kuala Lumpur)
      { from: 'HAN', to: 'KUL', dep: '09:45', arr: '14:00', flight: 'SJ701', aircraft: 2 },
      { from: 'HAN', to: 'KUL', dep: '15:45', arr: '20:00', flight: 'SJ703', aircraft: 1 },
      { from: 'KUL', to: 'HAN', dep: '21:30', arr: '01:45', flight: 'SJ702', aircraft: 2 },
      { from: 'KUL', to: 'HAN', dep: '06:15', arr: '10:30', flight: 'SJ704', aircraft: 1 },
      
      { from: 'SGN', to: 'KUL', dep: '11:20', arr: '14:35', flight: 'SJ711', aircraft: 1 },
      { from: 'SGN', to: 'KUL', dep: '17:30', arr: '20:45', flight: 'SJ713', aircraft: 2 },
      { from: 'KUL', to: 'SGN', dep: '07:00', arr: '10:15', flight: 'SJ712', aircraft: 1 },
      { from: 'KUL', to: 'SGN', dep: '22:00', arr: '01:15', flight: 'SJ714', aircraft: 2 },
      
      // Vietnam to Indonesia
      { from: 'SGN', to: 'CGK', dep: '12:15', arr: '16:30', flight: 'SJ721', aircraft: 2 },
      { from: 'SGN', to: 'CGK', dep: '18:45', arr: '23:00', flight: 'SJ723', aircraft: 1 },
      { from: 'CGK', to: 'SGN', dep: '08:30', arr: '11:45', flight: 'SJ722', aircraft: 2 },
      { from: 'CGK', to: 'SGN', dep: '00:15', arr: '04:30', flight: 'SJ724', aircraft: 1 },
      
      { from: 'SGN', to: 'DPS', dep: '13:30', arr: '18:45', flight: 'SJ731', aircraft: 1 },
      { from: 'SGN', to: 'DPS', dep: '19:30', arr: '00:45', flight: 'SJ733', aircraft: 2 },
      { from: 'DPS', to: 'SGN', dep: '20:00', arr: '23:15', flight: 'SJ732', aircraft: 1 },
      { from: 'DPS', to: 'SGN', dep: '02:00', arr: '05:15', flight: 'SJ734', aircraft: 2 },
      
      // Vietnam to Laos (Vientiane)
      { from: 'HAN', to: 'VTE', dep: '10:00', arr: '11:15', flight: 'SJ741', aircraft: 7 },
      { from: 'HAN', to: 'VTE', dep: '16:30', arr: '17:45', flight: 'SJ743', aircraft: 7 },
      { from: 'VTE', to: 'HAN', dep: '12:00', arr: '13:15', flight: 'SJ742', aircraft: 7 },
      { from: 'VTE', to: 'HAN', dep: '18:30', arr: '19:45', flight: 'SJ744', aircraft: 7 },
      
      // === CHUYẾN BAY TỚI CHÂU Á ===
      
      // Vietnam to South Korea
      { from: 'HAN', to: 'ICN', dep: '10:20', arr: '16:35', flight: 'AS101', aircraft: 1 },
      { from: 'HAN', to: 'ICN', dep: '16:20', arr: '22:35', flight: 'AS103', aircraft: 2 },
      { from: 'HAN', to: 'ICN', dep: '22:45', arr: '04:00', flight: 'AS105', aircraft: 1 },
      { from: 'ICN', to: 'HAN', dep: '06:15', arr: '09:30', flight: 'AS102', aircraft: 1 },
      { from: 'ICN', to: 'HAN', dep: '12:15', arr: '15:30', flight: 'AS104', aircraft: 2 },
      { from: 'ICN', to: 'HAN', dep: '18:00', arr: '21:15', flight: 'AS106', aircraft: 1 },
      
      { from: 'SGN', to: 'ICN', dep: '11:30', arr: '18:45', flight: 'AS201', aircraft: 2 },
      { from: 'SGN', to: 'ICN', dep: '17:30', arr: '00:45', flight: 'AS203', aircraft: 1 },
      { from: 'ICN', to: 'SGN', dep: '02:00', arr: '06:15', flight: 'AS202', aircraft: 2 },
      { from: 'ICN', to: 'SGN', dep: '20:30', arr: '00:45', flight: 'AS204', aircraft: 1 },
      
      { from: 'HAN', to: 'TAE', dep: '11:15', arr: '17:30', flight: 'AS111', aircraft: 2 },
      { from: 'TAE', to: 'HAN', dep: '19:00', arr: '22:15', flight: 'AS112', aircraft: 2 },
      
      { from: 'HAN', to: 'PUS', dep: '12:00', arr: '18:15', flight: 'AS121', aircraft: 2 },
      { from: 'PUS', to: 'HAN', dep: '19:45', arr: '23:00', flight: 'AS122', aircraft: 2 },
      
      // Vietnam to Japan
      { from: 'HAN', to: 'NRT', dep: '12:45', arr: '20:00', flight: 'AS301', aircraft: 3 },
      { from: 'HAN', to: 'NRT', dep: '18:45', arr: '02:00', flight: 'AS303', aircraft: 2 },
      { from: 'NRT', to: 'HAN', dep: '04:15', arr: '08:30', flight: 'AS302', aircraft: 3 },
      { from: 'NRT', to: 'HAN', dep: '10:30', arr: '14:45', flight: 'AS304', aircraft: 2 },
      
      { from: 'SGN', to: 'NRT', dep: '13:20', arr: '21:35', flight: 'AS311', aircraft: 2 },
      { from: 'SGN', to: 'NRT', dep: '19:15', arr: '03:30', flight: 'AS313', aircraft: 3 },
      { from: 'NRT', to: 'SGN', dep: '05:45', arr: '11:00', flight: 'AS312', aircraft: 2 },
      { from: 'NRT', to: 'SGN', dep: '11:20', arr: '16:35', flight: 'AS314', aircraft: 3 },
      
      { from: 'HAN', to: 'KIX', dep: '14:30', arr: '20:45', flight: 'AS321', aircraft: 2 },
      { from: 'KIX', to: 'HAN', dep: '22:15', arr: '01:30', flight: 'AS322', aircraft: 2 },
      
      { from: 'SGN', to: 'KIX', dep: '15:15', arr: '21:30', flight: 'AS331', aircraft: 2 },
      { from: 'KIX', to: 'SGN', dep: '23:00', arr: '02:15', flight: 'AS332', aircraft: 2 },
      
      // Vietnam to China
      { from: 'HAN', to: 'PEK', dep: '15:00', arr: '19:15', flight: 'AS401', aircraft: 2 },
      { from: 'HAN', to: 'PEK', dep: '21:00', arr: '01:15', flight: 'AS403', aircraft: 1 },
      { from: 'PEK', to: 'HAN', dep: '03:45', arr: '07:00', flight: 'AS402', aircraft: 2 },
      { from: 'PEK', to: 'HAN', dep: '09:30', arr: '12:45', flight: 'AS404', aircraft: 1 },
      
      { from: 'SGN', to: 'PEK', dep: '16:00', arr: '21:15', flight: 'AS411', aircraft: 2 },
      { from: 'PEK', to: 'SGN', dep: '23:45', arr: '04:00', flight: 'AS412', aircraft: 2 },
      
      { from: 'HAN', to: 'CTU', dep: '14:15', arr: '17:30', flight: 'AS421', aircraft: 2 },
      { from: 'CTU', to: 'HAN', dep: '19:00', arr: '22:15', flight: 'AS422', aircraft: 2 },
      
      { from: 'HAN', to: 'CAN', dep: '13:30', arr: '16:15', flight: 'AS431', aircraft: 1 },
      { from: 'CAN', to: 'HAN', dep: '17:45', arr: '20:30', flight: 'AS432', aircraft: 1 },
      
      { from: 'SGN', to: 'CAN', dep: '14:00', arr: '16:45', flight: 'AS441', aircraft: 1 },
      { from: 'CAN', to: 'SGN', dep: '18:15', arr: '21:00', flight: 'AS442', aircraft: 1 },
      
      { from: 'HAN', to: 'NNG', dep: '12:15', arr: '14:30', flight: 'AS451', aircraft: 2 },
      { from: 'NNG', to: 'HAN', dep: '15:15', arr: '17:30', flight: 'AS452', aircraft: 2 },
      
      { from: 'HAN', to: 'WUH', dep: '11:45', arr: '14:00', flight: 'AS461', aircraft: 2 },
      { from: 'WUH', to: 'HAN', dep: '15:30', arr: '17:45', flight: 'AS462', aircraft: 2 },
      
      { from: 'HAN', to: 'KMG', dep: '10:30', arr: '12:15', flight: 'AS471', aircraft: 2 },
      { from: 'KMG', to: 'HAN', dep: '13:45', arr: '15:30', flight: 'AS472', aircraft: 2 },
      
      // Vietnam to Taiwan
      { from: 'HAN', to: 'TPE', dep: '15:30', arr: '19:15', flight: 'AS501', aircraft: 1 },
      { from: 'TPE', to: 'HAN', dep: '20:45', arr: '23:30', flight: 'AS502', aircraft: 1 },
      
      { from: 'SGN', to: 'TPE', dep: '16:30', arr: '20:45', flight: 'AS511', aircraft: 2 },
      { from: 'TPE', to: 'SGN', dep: '22:15', arr: '01:30', flight: 'AS512', aircraft: 2 },
      
      // Vietnam to India
      { from: 'SGN', to: 'BOM', dep: '17:30', arr: '21:45', flight: 'AS601', aircraft: 3 },
      { from: 'BOM', to: 'SGN', dep: '23:15', arr: '06:30', flight: 'AS602', aircraft: 3 },
      
      // === CHUYẾN BAY TỚI CÁC KHU VỰC KHÁC ===
      
      // Vietnam to Australia
      { from: 'SGN', to: 'SYD', dep: '16:30', arr: '05:45', flight: 'OT101', aircraft: 3 },
      { from: 'SYD', to: 'SGN', dep: '07:15', arr: '14:30', flight: 'OT102', aircraft: 3 },
      
      { from: 'SGN', to: 'MEL', dep: '17:45', arr: '06:00', flight: 'OT201', aircraft: 3 },
      { from: 'MEL', to: 'SGN', dep: '08:30', arr: '15:45', flight: 'OT202', aircraft: 3 },
      
      { from: 'HAN', to: 'SYD', dep: '18:00', arr: '08:15', flight: 'OT301', aircraft: 3 },
      { from: 'SYD', to: 'HAN', dep: '10:00', arr: '17:15', flight: 'OT302', aircraft: 3 },
      
      // Vietnam to USA
      { from: 'SGN', to: 'LAX', dep: '21:30', arr: '18:45', flight: 'OT601', aircraft: 3 },
      { from: 'LAX', to: 'SGN', dep: '00:15', arr: '06:30', flight: 'OT602', aircraft: 3 },
      
      { from: 'HAN', to: 'LAX', dep: '22:15', arr: '19:30', flight: 'OT701', aircraft: 3 },
      { from: 'LAX', to: 'HAN', dep: '01:00', arr: '07:15', flight: 'OT702', aircraft: 3 }
    ];

    // Tạo flights cho 30 ngày tiếp theo
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const flightDate = new Date(today);
      flightDate.setDate(today.getDate() + dayOffset);
      const dateStr = flightDate.toISOString().split('T')[0];
      
      console.log(`📅 Creating flights for ${dateStr}... (${flightRoutes.length} routes)`);
      
      for (const route of flightRoutes) {
        try {
          // Lấy airport IDs
          const depAirport = await pool.query('SELECT id FROM airports WHERE code = $1', [route.from]);
          const arrAirport = await pool.query('SELECT id FROM airports WHERE code = $1', [route.to]);
          
          if (depAirport.rows.length === 0 || arrAirport.rows.length === 0) {
            console.log(`⚠️ Airport not found: ${route.from} or ${route.to}`);
            continue;
          }

          const depId = depAirport.rows[0].id;
          const arrId = arrAirport.rows[0].id;
          
          // Tạo unique flight number
          const flightNumber = `${route.flight}_${dateStr.replace(/-/g, '')}`;
          
          // Insert flight
          const flightResult = await pool.query(`
            INSERT INTO flights (flight_number, departure_airport_id, arrival_airport_id, departure_time, arrival_time, flight_date, aircraft_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
          `, [flightNumber, depId, arrId, route.dep, route.arr, dateStr, route.aircraft]);
          
          const flightId = flightResult.rows[0].id;
          
          // Insert prices với giá khác nhau theo khu vực
          let economyBase = 150;
          let businessBase = 400;
          let firstBase = 800;
          
          // Điều chỉnh giá theo khu vực
          const depAirportInfo = await pool.query('SELECT region FROM airports WHERE id = $1', [depId]);
          const arrAirportInfo = await pool.query('SELECT region FROM airports WHERE id = $1', [arrId]);
          
          const depRegion = depAirportInfo.rows[0]?.region;
          const arrRegion = arrAirportInfo.rows[0]?.region;
          
          // Nội địa Vietnam: giá thấp
          if (depRegion === 'Vietnam' && arrRegion === 'Vietnam') {
            economyBase = 60;
            businessBase = 150;
            firstBase = 300;
          }
          // Đông Nam Á: giá trung bình
          else if ((depRegion === 'Vietnam' && arrRegion === 'Southeast Asia') || 
                   (depRegion === 'Southeast Asia' && arrRegion === 'Vietnam')) {
            economyBase = 180;
            businessBase = 450;
            firstBase = 900;
          }
          // Châu Á: giá cao hơn
          else if ((depRegion === 'Vietnam' && arrRegion === 'Asia') || 
                   (depRegion === 'Asia' && arrRegion === 'Vietnam')) {
            economyBase = 350;
            businessBase = 700;
            firstBase = 1400;
          }
          // Khác (USA, Australia): giá cao nhất
          else if ((depRegion === 'Vietnam' && arrRegion === 'Other') || 
                   (depRegion === 'Other' && arrRegion === 'Vietnam')) {
            economyBase = 900;
            businessBase = 1800;
            firstBase = 3600;
          }
          
          await pool.query(`
            INSERT INTO flight_prices (flight_id, class_type, price, available_seats) VALUES
            ($1, 'economy', $2, $3),
            ($1, 'business', $4, $5),
            ($1, 'firstClass', $6, $7)
          `, [
            flightId,
            economyBase + Math.floor(Math.random() * 80), // Economy: base ± 80
            Math.floor(Math.random() * 100) + 80,  // Economy seats: 80-180
            businessBase + Math.floor(Math.random() * 150), // Business: base ± 150
            Math.floor(Math.random() * 30) + 15,   // Business seats: 15-45
            firstBase + Math.floor(Math.random() * 300), // First: base ± 300
            Math.floor(Math.random() * 10) + 4     // First seats: 4-14
          ]);
          
        } catch (error) {
          console.error(`❌ Error creating flight ${route.flight}:`, error.message);
        }
      }
    }

    // Verify data
    const counts = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM airports) as airports,
        (SELECT COUNT(*) FROM aircrafts) as aircrafts,
        (SELECT COUNT(*) FROM flights) as flights,
        (SELECT COUNT(*) FROM flight_prices) as prices
    `);
    
    console.log('✅ Database initialized successfully!');
    console.log('📊 Data summary:', counts.rows[0]);
    
    // Test routes by region
    const testRoutes = await pool.query(`
      SELECT 
        dep.region as dep_region,
        arr.region as arr_region,
        COUNT(*) as flight_count
      FROM flights f
      JOIN airports dep ON f.departure_airport_id = dep.id
      JOIN airports arr ON f.arrival_airport_id = arr.id
      WHERE f.flight_date = CURRENT_DATE
      GROUP BY dep.region, arr.region
      ORDER BY dep_region, arr_region
    `);
    
    console.log('🌍 Flight routes by region:');
    testRoutes.rows.forEach(row => {
      console.log(`   ${row.dep_region} → ${row.arr_region}: ${row.flight_count} flights`);
    });
    
    // Sample flights by cities
    const sampleFlights = await pool.query(`
      SELECT f.flight_number, dep.city as dep_city, arr.city as arr_city, f.departure_time, f.arrival_time
      FROM flights f
      JOIN airports dep ON f.departure_airport_id = dep.id
      JOIN airports arr ON f.arrival_airport_id = arr.id
      WHERE f.flight_date = CURRENT_DATE
      ORDER BY f.departure_time
      LIMIT 15
    `);
    
    console.log('🔍 Sample flights for today:');
    sampleFlights.rows.forEach(row => {
      console.log(`   ${row.flight_number}: ${row.dep_city} → ${row.arr_city} (${row.departure_time} - ${row.arrival_time})`);
    });
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('🎉 Database setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;