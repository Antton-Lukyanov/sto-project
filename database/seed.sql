-- =====================================================
-- СТО ДИСПЕТЧЕР - ТЕСТОВЫЕ ДАННЫЕ (НЕМЕЦКИЕ АВТО)
-- =====================================================

-- ОЧИСТКА ТАБЛИЦ
TRUNCATE TABLE order_defects CASCADE;
TRUNCATE TABLE order_services CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE repair_orders CASCADE;
TRUNCATE TABLE cars CASCADE;
TRUNCATE TABLE employees CASCADE;
TRUNCATE TABLE clients CASCADE;
TRUNCATE TABLE services CASCADE;
TRUNCATE TABLE defects CASCADE;

-- СБРОС СЧЁТЧИКОВ
ALTER SEQUENCE clients_id_seq RESTART WITH 1;
ALTER SEQUENCE cars_id_seq RESTART WITH 1;
ALTER SEQUENCE employees_id_seq RESTART WITH 1;
ALTER SEQUENCE services_id_seq RESTART WITH 1;
ALTER SEQUENCE defects_id_seq RESTART WITH 1;
ALTER SEQUENCE repair_orders_id_seq RESTART WITH 1;
ALTER SEQUENCE invoices_id_seq RESTART WITH 1;

-- 1. КЛИЕНТЫ
INSERT INTO clients (passport_series, passport_number, full_name, birth_year) VALUES
('4510', '123456', 'Иванов Иван Иванович', 1985),
('4511', '234567', 'Петров Пётр Петрович', 1990),
('4512', '345678', 'Сидорова Анна Сергеевна', 1988),
('4513', '456789', 'Кузнецов Алексей Владимирович', 1995),
('4514', '567890', 'Смирнова Екатерина Дмитриевна', 1982);

-- 2. АВТОМОБИЛИ (НЕМЕЦКИЕ)
INSERT INTO cars (plate_number, vin_code, brand, model, year, color, client_id) VALUES
('a123aa50', 'WBA12345678901234', 'BMW', 'X5', 2022, 'Чёрный', 1),
('b456bb77', 'WDB23456789012345', 'Mercedes-Benz', 'E-Class', 2021, 'Серебристый', 1),
('c789cc97', 'WP0ZZZ34567890123', 'Porsche', 'Cayenne', 2023, 'Красный', 2),
('d012dd13', 'WAU45678901234567', 'Audi', 'Q7', 2020, 'Синий', 3),
('e345ee90', 'WWW56789012345678', 'Volkswagen', 'Touareg', 2019, 'Серый', 4),
('f678ff78', 'TMB67890123456789', 'Skoda', 'Kodiaq', 2022, 'Белый', 5),
('g901gg98', 'WBA78901234567890', 'BMW', 'X3', 2021, 'Зелёный', 5);

-- 3. РАБОТНИКИ (пароль: 123456, без разряда)
INSERT INTO employees (passport_series, passport_number, full_name, birth_year, position, login, password_hash, role) VALUES
('5000', '111111', 'Администратор Системы', 1980, 'Администратор', 'admin', '$2a$10$7nFDakin43JY0.UHRVoTuO5e7zS6vt1Se8V.hmezXcv0hPRnC8Zyy', 'admin'),
('5001', '222222', 'Иванов Иван Петрович', 1985, 'Механик', 'ivanov', '$2a$10$7nFDakin43JY0.UHRVoTuO5e7zS6vt1Se8V.hmezXcv0hPRnC8Zyy', 'worker'),
('5002', '333333', 'Петров Алексей Сергеевич', 1990, 'Электрик', 'alekseev', '$2a$10$7nFDakin43JY0.UHRVoTuO5e7zS6vt1Se8V.hmezXcv0hPRnC8Zyy', 'worker'),
('5003', '444444', 'Сидорова Дарья Дмитриевна', 1988, 'Диагност', 'dmitrieva', '$2a$10$7nFDakin43JY0.UHRVoTuO5e7zS6vt1Se8V.hmezXcv0hPRnC8Zyy', 'worker');

-- 4. УСЛУГИ (ПРАЙС-ЛИСТ)
INSERT INTO services (code, name, description, labor_hours, labor_rate, category) VALUES
('DIAG_01', 'Компьютерная диагностика', 'Считывание ошибок, проверка датчиков', 0.8, 2000, 'Диагностика'),
('ENG_01', 'Замена масла', 'Слив, замена фильтра, залив', 0.5, 1800, 'Двигатель'),
('SUS_01', 'Развал-схождение', 'Регулировка углов установки колес', 1.0, 2500, 'Подвеска'),
('ELC_01', 'Диагностика электроники', 'Проверка проводки и блоков', 1.5, 2500, 'Электрика');

-- 5. ДЕФЕКТЫ
INSERT INTO defects (code, description, category) VALUES
('DEF_001', 'Двигатель троит', 'Двигатель'),
('DEF_002', 'Стук в подвеске', 'Подвеска'),
('DEF_003', 'Ошибка по датчикам', 'Электрика');

-- 6. РЕМОНТЫ
INSERT INTO repair_orders (order_number, date, car_id, employee_id, client_notes, status, total_labor_cost, total_parts_cost, is_archived) VALUES
('ORD-2024-001', '2024-01-15', 1, 2, 'Машина троит', 'archived', 4000, 2500, TRUE),
('ORD-2024-002', '2024-02-10', 3, 2, 'Стук при повороте', 'archived', 3500, 1800, TRUE),
('ORD-2024-003', '2024-03-05', 5, 3, 'Не заводится', 'completed', 5000, 3000, FALSE),
('ORD-2024-004', '2024-04-20', 4, 1, 'Диагностика', 'completed', 6000, 0, FALSE),
('ORD-2024-005', '2024-05-12', 6, 2, 'Проверка', 'in_progress', 2000, 0, FALSE);

-- 7. СВЯЗИ
INSERT INTO order_services (order_id, service_id, quantity, unit_price) VALUES
(1, 1, 1, 2000), (1, 2, 1, 1800),
(2, 3, 1, 2500),
(3, 1, 1, 2000), (3, 4, 1, 2500);

INSERT INTO order_defects (order_id, defect_id, notes) VALUES
(1, 1, 'Замена катушки'), (2, 2, 'Замена стоек'), (3, 3, 'Замена проводки');

-- 8. СЧЕТА
INSERT INTO invoices (order_id, invoice_number, issued_date, payment_status) VALUES
(1, 'INV-001', '2024-01-20', 'paid'),
(2, 'INV-002', '2024-02-15', 'paid'),
(3, 'INV-003', '2024-03-10', 'pending');

-- 9. ПРОВЕРКА
SELECT 'clients' as table, COUNT(*) FROM clients
UNION ALL SELECT 'cars', COUNT(*) FROM cars
UNION ALL SELECT 'employees', COUNT(*) FROM employees;