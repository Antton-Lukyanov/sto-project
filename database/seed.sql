-- =====================================================
-- СТО ДИСПЕТЧЕР - ПОЛНЫЙ РАБОЧИЙ СКРИПТ
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

-- =====================================================
-- 1. КЛИЕНТЫ
-- =====================================================
INSERT INTO clients (passport_series, passport_number, full_name, birth_year) VALUES
('4510', '123456', 'Филатов Андрей Прохорович', 1985),
('4511', '234567', 'Лукьянов Евгений Дмитриевич', 1990),
('4512', '345678', 'Степанов Алексей Александрович', 1988),
('4513', '456789', 'Петрова Светлана Алексеевна', 1995),
('4514', '567890', 'Строганова Елизавета Станиславовна', 1982),
('4515', '678901', 'Борисов Владислав Витальевич', 1992);

-- =====================================================
-- 2. АВТОМОБИЛИ
-- =====================================================
INSERT INTO cars (plate_number, vin_code, brand, model, year, color, client_id) VALUES
('а123аа50', 'WBA12345678901234', 'BMW', 'X5', 2022, 'Чёрный', 1),
('в456вв77', 'WDB23456789012345', 'Mercedes-Benz', 'E-Class', 2021, 'Серебристый', 1),
('е789ее97', 'WP0ZZZ34567890123', 'Porsche', 'Cayenne', 2023, 'Красный', 2),
('к012кк13', 'WAU45678901234567', 'Audi', 'Q7', 2020, 'Синий', 3),
('м345мм90', 'WWW56789012345678', 'Volkswagen', 'Touareg', 2019, 'Серый', 4),
('н678нн78', 'TMB67890123456789', 'Skoda', 'Kodiaq', 2022, 'Белый', 4),
('о901оо98', 'WBA78901234567890', 'BMW', 'X3', 2021, 'Зелёный', 5),
('р123рр13', 'WDD12345678901234', 'Mercedes-Benz', 'GLE', 2022, 'Чёрный', 6),
('с456сс77', 'VAG12345678901234', 'Audi', 'A6', 2020, 'Серебристый', 6);

-- =====================================================
-- 3. РАБОТНИКИ
-- =====================================================
INSERT INTO employees (passport_series, passport_number, full_name, birth_year, position, login, password_hash, role) VALUES
('5000', '111111', 'Администратор Системы', 1980, 'Администратор', 'admin', '$2a$10$7nFDakin43JY0.UHRVoTuO5e7zS6vt1Se8V.hmezXcv0hPRnC8Zyy', 'admin'),
('5001', '222222', 'Иванов Иван Иванович', 1985, 'Ведущий механик', 'ivanov', '$2a$10$7nFDakin43JY0.UHRVoTuO5e7zS6vt1Se8V.hmezXcv0hPRnC8Zyy', 'worker'),
('5002', '333333', 'Петров Пётр Петрович', 1990, 'Электрик', 'petrov', '$2a$10$7nFDakin43JY0.UHRVoTuO5e7zS6vt1Se8V.hmezXcv0hPRnC8Zyy', 'worker'),
('5003', '444444', 'Александрова Александра Александровна', 1988, 'Диагност', 'aleksandrova', '$2a$10$7nFDakin43JY0.UHRVoTuO5e7zS6vt1Se8V.hmezXcv0hPRnC8Zyy', 'worker');

-- =====================================================
-- 4. УСЛУГИ (ПРАЙС-ЛИСТ)
-- =====================================================
INSERT INTO services (code, name, description, labor_hours, labor_rate, category) VALUES
('DIAG_01', 'Компьютерная диагностика', 'Считывание ошибок, проверка датчиков', 0.8, 2000, 'Диагностика'),
('ENG_01', 'Замена масла', 'Слив, замена фильтра, залив', 0.5, 1800, 'Двигатель'),
('SUS_01', 'Развал-схождение', 'Регулировка углов установки колес', 1.0, 2500, 'Подвеска'),
('ELC_01', 'Диагностика электроники', 'Проверка проводки и блоков', 1.5, 2500, 'Электрика');

-- =====================================================
-- 5. ДЕФЕКТЫ (С ID 1-6)
-- =====================================================
INSERT INTO defects (id, code, description, category) VALUES
(1, 'DEF_001', 'Двигатель троит', 'Двигатель'),
(2, 'DEF_002', 'Стук в подвеске', 'Подвеска'),
(3, 'DEF_003', 'Неисправность генератора', 'Электрика'),
(4, 'DEF_004', 'Течь масла', 'Двигатель'),
(5, 'DEF_005', 'Не работает кондиционер', 'Кондиционер'),
(6, 'DEF_006', 'Проблемы с АКПП', 'Трансмиссия');

-- СБРОС СЧЁТЧИКА ПОСЛЕ РУЧНОЙ ВСТАВКИ ID
ALTER SEQUENCE defects_id_seq RESTART WITH 7;

-- =====================================================
-- 6. РЕМОНТЫ (С employee_id)
-- =====================================================
INSERT INTO repair_orders (order_number, date, car_id, employee_id, client_notes, status, total_labor_cost, total_parts_cost, is_archived) VALUES
('ORD-2024-001', '2024-01-15', 1, 2, 'Двигатель троит', 'archived', 4000, 2500, TRUE),
('ORD-2024-002', '2024-02-10', 3, 3, 'Стук при повороте', 'archived', 3500, 1800, TRUE),
('ORD-2024-003', '2024-03-05', 5, 2, 'Течь масла', 'completed', 5000, 3000, FALSE),
('ORD-2024-004', '2024-04-20', 4, 4, 'Комплексная диагностика', 'completed', 6000, 0, FALSE),
('ORD-2024-005', '2024-05-12', 6, 3, 'Проблема с генератором', 'in_progress', 2500, 1200, FALSE),
('ORD-2024-006', '2024-05-15', 8, 2, 'Неисправность АКПП', 'in_progress', 8000, 5000, FALSE);

-- =====================================================
-- 7. СВЯЗИ ЗАКАЗОВ И УСЛУГ
-- =====================================================
INSERT INTO order_services (order_id, service_id, quantity, unit_price) VALUES
(1, 1, 1, 2000),
(1, 2, 1, 1800),
(2, 3, 1, 2500),
(3, 2, 1, 1800),
(4, 1, 1, 2000),
(5, 4, 1, 2500),
(6, 4, 1, 2500);

-- =====================================================
-- 8. СВЯЗИ ЗАКАЗОВ И ДЕФЕКТОВ (defect_id 1,2,3,4,6 существуют)
-- =====================================================
INSERT INTO order_defects (order_id, defect_id, notes) VALUES
(1, 1, 'Замена катушки зажигания'),
(2, 2, 'Замена стоек стабилизатора'),
(3, 4, 'Замена прокладки клапанной крышки'),
(4, 1, 'Замена свечей'),
(5, 3, 'Замена генератора'),
(6, 6, 'Ремонт АКПП');

-- =====================================================
-- 9. СЧЕТА
-- =====================================================
INSERT INTO invoices (order_id, invoice_number, issued_date, payment_status) VALUES
(1, 'INV-2024-001', '2024-01-20', 'paid'),
(2, 'INV-2024-002', '2024-02-15', 'paid'),
(3, 'INV-2024-003', '2024-03-10', 'paid'),
(4, 'INV-2024-004', '2024-04-25', 'pending'),
(5, 'INV-2024-005', '2024-05-16', 'pending'),
(6, 'INV-2024-006', '2024-05-16', 'pending');

-- =====================================================
-- 10. ПРОВЕРКА
-- =====================================================
SELECT 'clients' as table_name, COUNT(*) FROM clients
UNION ALL SELECT 'cars', COUNT(*) FROM cars
UNION ALL SELECT 'employees', COUNT(*) FROM employees
UNION ALL SELECT 'repair_orders', COUNT(*) FROM repair_orders
UNION ALL SELECT 'defects', COUNT(*) FROM defects;