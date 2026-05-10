-- =====================================================
-- СТО ДИСПЕТЧЕР - СХЕМА БАЗЫ ДАННЫХ
-- PostgreSQL
-- =====================================================

-- 1. КЛИЕНТЫ
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    passport_series VARCHAR(10) NOT NULL,
    passport_number VARCHAR(10) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    birth_year INTEGER CHECK (birth_year > 1900 AND birth_year <= EXTRACT(YEAR FROM CURRENT_DATE)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(passport_series, passport_number)
);

-- 2. АВТОМОБИЛИ
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    vin_code VARCHAR(17) UNIQUE NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER CHECK (year > 1900),
    color VARCHAR(50),
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. РАБОТНИКИ
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    passport_series VARCHAR(10) NOT NULL,
    passport_number VARCHAR(10) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    birth_year INTEGER,
    position VARCHAR(100) NOT NULL,
    rank INTEGER DEFAULT 1,
    login VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'worker' CHECK (role IN ('worker', 'admin')),
    hired_at TIMESTAMP DEFAULT CURRENT_DATE
);

-- 4. УСЛУГИ (ПРАЙС-ЛИСТ)
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    labor_hours DECIMAL(5,2) NOT NULL,
    labor_rate DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (labor_hours * labor_rate) STORED,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. ДЕФЕКТЫ (СПРАВОЧНИК НЕИСПРАВНОСТЕЙ)
CREATE TABLE IF NOT EXISTS defects (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100)
);

-- 6. ЗАКАЗЫ-НАРЯДЫ (РЕМОНТЫ)
CREATE TABLE IF NOT EXISTS repair_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    car_id INTEGER REFERENCES cars(id) ON DELETE SET NULL,
    employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
    client_notes TEXT,
    status VARCHAR(30) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'archived')),
    total_labor_cost DECIMAL(10,2) DEFAULT 0,
    total_parts_cost DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_labor_cost + total_parts_cost) STORED,
    completed_at TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. СВЯЗЬ: ЗАКАЗ-НАРЯД <-> УСЛУГИ
CREATE TABLE IF NOT EXISTS order_services (
    order_id INTEGER REFERENCES repair_orders(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2),
    total DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    PRIMARY KEY (order_id, service_id)
);

-- 8. СВЯЗЬ: ЗАКАЗ-НАРЯД <-> ДЕФЕКТЫ
CREATE TABLE IF NOT EXISTS order_defects (
    order_id INTEGER REFERENCES repair_orders(id) ON DELETE CASCADE,
    defect_id INTEGER REFERENCES defects(id),
    notes TEXT,
    PRIMARY KEY (order_id, defect_id)
);

-- 9. СЧЕТА
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    order_id INTEGER UNIQUE REFERENCES repair_orders(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue')),
    pdf_path VARCHAR(500)
);

-- 10. ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
CREATE INDEX IF NOT EXISTS idx_cars_client ON cars(client_id);
CREATE INDEX IF NOT EXISTS idx_cars_plate ON cars(plate_number);
CREATE INDEX IF NOT EXISTS idx_cars_vin ON cars(vin_code);
CREATE INDEX IF NOT EXISTS idx_orders_car ON repair_orders(car_id);
CREATE INDEX IF NOT EXISTS idx_orders_employee ON repair_orders(employee_id);
CREATE INDEX IF NOT EXISTS idx_orders_archived ON repair_orders(is_archived);
CREATE INDEX IF NOT EXISTS idx_orders_date ON repair_orders(date);