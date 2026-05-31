-- AI Hotel Management System - Database Init

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'staff',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    position VARCHAR(100),
    salary FLOAT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendances (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id),
    date TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'present'
);

CREATE TABLE IF NOT EXISTS leaves (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    room_type VARCHAR(50),
    price_per_night FLOAT,
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    guest_email VARCHAR(100),
    guest_phone VARCHAR(20),
    room_id INT REFERENCES rooms(id),
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    total_amount FLOAT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    quantity INT DEFAULT 0,
    unit VARCHAR(20),
    low_stock_threshold INT DEFAULT 10,
    supplier VARCHAR(100),
    unit_price FLOAT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE,
    booking_id INT REFERENCES bookings(id),
    guest_name VARCHAR(100),
    amount FLOAT,
    tax FLOAT DEFAULT 0,
    total FLOAT,
    status VARCHAR(20) DEFAULT 'unpaid',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    amount FLOAT,
    category VARCHAR(50),
    date TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- Seed: default admin user (password: admin123)
INSERT INTO users (name, email, hashed_password, role)
VALUES ('Admin', 'admin@hotel.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2i', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed: sample rooms
INSERT INTO rooms (room_number, room_type, price_per_night) VALUES
('101', 'single', 80.00), ('102', 'double', 120.00), ('201', 'suite', 250.00)
ON CONFLICT (room_number) DO NOTHING;
