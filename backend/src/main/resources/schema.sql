-- =====================================================
-- Outpass Portal Database Schema
-- =====================================================
-- Database: outpass_portal
-- Description: College Outpass Management System with JWT Authentication
-- Author: Yuvi
-- Date: 2026-03-01
-- =====================================================

-- Drop database if exists (use with caution in production)
DROP DATABASE IF EXISTS outpass_portal;

-- Create database with UTF-8 encoding
CREATE DATABASE outpass_portal
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE outpass_portal;

-- =====================================================
-- TABLE: students
-- Description: Stores student information
-- =====================================================
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    roll_no VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    hostel VARCHAR(100) NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    parent_number VARCHAR(15) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT uk_student_email UNIQUE (email),
    CONSTRAINT uk_student_roll_no UNIQUE (roll_no),
    CONSTRAINT chk_student_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_student_contact CHECK (contact_number REGEXP '^[0-9]{10}$'),
    CONSTRAINT chk_student_parent CHECK (parent_number REGEXP '^[0-9]{10}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index for faster queries
CREATE INDEX idx_student_email ON students(email);
CREATE INDEX idx_student_roll_no ON students(roll_no);
CREATE INDEX idx_student_hostel ON students(hostel);

-- =====================================================
-- TABLE: wardens
-- Description: Stores warden (RC) information
-- =====================================================
CREATE TABLE wardens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    hostel VARCHAR(100),
    phone VARCHAR(15),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT uk_warden_email UNIQUE (email),
    CONSTRAINT chk_warden_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_warden_phone CHECK (phone IS NULL OR phone REGEXP '^[0-9]{10}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index for faster queries
CREATE INDEX idx_warden_email ON wardens(email);
CREATE INDEX idx_warden_hostel ON wardens(hostel);

-- =====================================================
-- TABLE: security_guards
-- Description: Stores security guard information
-- =====================================================
CREATE TABLE security_guards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    hostel VARCHAR(100),
    phone VARCHAR(15),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT uk_security_email UNIQUE (email),
    CONSTRAINT chk_security_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_security_phone CHECK (phone IS NULL OR phone REGEXP '^[0-9]{10}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index for faster queries
CREATE INDEX idx_security_email ON security_guards(email);
CREATE INDEX idx_security_hostel ON security_guards(hostel);

-- =====================================================
-- TABLE: outpasses
-- Description: Stores outpass requests and their details
-- =====================================================
CREATE TABLE outpasses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    roll_no VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    hostel VARCHAR(100) NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    date DATETIME NOT NULL,
    return_date DATETIME NOT NULL,
    num_of_days INT NOT NULL,
    visit_place VARCHAR(255) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    parent_number VARCHAR(15) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key
    CONSTRAINT fk_outpass_student FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- Constraints
    CONSTRAINT chk_outpass_dates CHECK (return_date > date),
    CONSTRAINT chk_outpass_days CHECK (num_of_days > 0 AND num_of_days <= 30),
    CONSTRAINT chk_outpass_contact CHECK (contact_number REGEXP '^[0-9]{10}$'),
    CONSTRAINT chk_outpass_parent CHECK (parent_number REGEXP '^[0-9]{10}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for faster queries
CREATE INDEX idx_outpass_student ON outpasses(student_id);
CREATE INDEX idx_outpass_status ON outpasses(status);
CREATE INDEX idx_outpass_date ON outpasses(date);
CREATE INDEX idx_outpass_created ON outpasses(created_at);
CREATE INDEX idx_outpass_hostel ON outpasses(hostel);

-- =====================================================
-- TABLE: refresh_tokens
-- Description: Stores refresh tokens for JWT authentication
-- =====================================================
CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(512) NOT NULL,
    user_id BIGINT NOT NULL,
    user_type ENUM('STUDENT', 'WARDEN', 'SECURITY_GUARD') NOT NULL,
    expiry_date TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT uk_refresh_token UNIQUE (token)
    -- Note: Expiry validation handled in application code
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for faster queries
CREATE INDEX idx_refresh_user ON refresh_tokens(user_id, user_type);
CREATE INDEX idx_refresh_expiry ON refresh_tokens(expiry_date);

-- =====================================================
-- TABLE: tokens
-- Description: Stores revoked JWT tokens (blacklist)
-- =====================================================
CREATE TABLE tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    jid VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT uk_token_jid UNIQUE (jid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for faster queries
CREATE INDEX idx_revoked_jid ON tokens(jid);
CREATE INDEX idx_revoked_expires ON tokens(expires_at);

-- =====================================================
-- TABLE: access_logs
-- Description: Stores API access logs for auditing
-- =====================================================
CREATE TABLE access_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'WARDEN', 'SECURITY_GUARD') NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Indexes for faster queries on frequently queried columns
    INDEX idx_access_username (username),
    INDEX idx_access_timestamp (timestamp),
    INDEX idx_access_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CLEANUP EVENT: Remove expired tokens
-- Description: Automatically removes expired refresh tokens and revoked JWT tokens
-- =====================================================
DELIMITER //

CREATE EVENT IF NOT EXISTS cleanup_expired_tokens
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    -- Delete expired refresh tokens
    DELETE FROM refresh_tokens WHERE expiry_date < NOW();

    -- Delete expired revoked tokens
    DELETE FROM tokens WHERE expires_at < NOW();
END//

DELIMITER ;

-- Enable event scheduler
SET GLOBAL event_scheduler = ON;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample warden
INSERT INTO wardens (name, email, password_hash, hostel, phone) VALUES
('Dr. Rajesh Kumar', 'rajesh.kumar@college.edu', '$2a$10$samplehashedpassword1234567890', 'Block A', '9876543210'),
('Dr. Priya Sharma', 'priya.sharma@college.edu', '$2a$10$samplehashedpassword1234567891', 'Block B', '9876543211');

-- Insert sample security guard
INSERT INTO security_guards (name, email, password_hash, hostel, phone) VALUES
('Ramesh Singh', 'ramesh.singh@college.edu', '$2a$10$samplehashedpassword1234567892', 'Block A', '9876543212'),
('Suresh Patil', 'suresh.patil@college.edu', '$2a$10$samplehashedpassword1234567893', 'Block B', '9876543213');

-- Insert sample students
INSERT INTO students (name, email, password_hash, roll_no, department, hostel, room_number, contact_number, parent_number) VALUES
('Amit Patel', 'amit.patel@student.college.edu', '$2a$10$samplehashedpassword1234567894', 'CS001', 'Computer Science', 'Block A', '101', '9876543214', '9876543215'),
('Sneha Reddy', 'sneha.reddy@student.college.edu', '$2a$10$samplehashedpassword1234567895', 'CS002', 'Computer Science', 'Block B', '201', '9876543216', '9876543217'),
('Vikram Desai', 'vikram.desai@student.college.edu', '$2a$10$samplehashedpassword1234567896', 'EC001', 'Electronics', 'Block A', '102', '9876543218', '9876543219');

-- =====================================================
-- VIEWS (Optional - for easier data access)
-- =====================================================

-- View for active outpasses
CREATE VIEW active_outpasses AS
SELECT
    o.id,
    o.name,
    o.roll_no,
    o.department,
    o.hostel,
    o.date,
    o.return_date,
    o.num_of_days,
    o.visit_place,
    o.status,
    s.email AS student_email,
    s.contact_number
FROM outpasses o
INNER JOIN students s ON o.student_id = s.id
WHERE o.status = 'APPROVED'
  AND o.return_date >= CURDATE();

-- View for pending approval outpasses
CREATE VIEW pending_outpasses AS
SELECT
    o.id,
    o.name,
    o.roll_no,
    o.department,
    o.hostel,
    o.date,
    o.return_date,
    o.visit_place,
    o.created_at,
    s.email AS student_email,
    s.contact_number,
    s.parent_number
FROM outpasses o
INNER JOIN students s ON o.student_id = s.id
WHERE o.status = 'PENDING'
ORDER BY o.created_at ASC;

-- View for outpass statistics by hostel
CREATE VIEW outpass_stats_by_hostel AS
SELECT
    hostel,
    COUNT(*) AS total_requests,
    SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) AS approved,
    SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pending,
    SUM(CASE WHEN status = 'DECLINED' THEN 1 ELSE 0 END) AS declined
FROM outpasses
GROUP BY hostel;

-- =====================================================
-- STORED PROCEDURES (Optional - for common operations)
-- =====================================================

-- Procedure to approve outpass
DELIMITER //

CREATE PROCEDURE approve_outpass(IN outpass_id BIGINT)
BEGIN
    UPDATE outpasses
    SET status = 'APPROVED', updated_at = CURRENT_TIMESTAMP
    WHERE id = outpass_id AND status = 'PENDING';
END//

-- Procedure to decline outpass
CREATE PROCEDURE decline_outpass(IN outpass_id BIGINT)
BEGIN
    UPDATE outpasses
    SET status = 'DECLINED', updated_at = CURRENT_TIMESTAMP
    WHERE id = outpass_id AND status = 'PENDING';
END//

-- Procedure to get student outpass history
CREATE PROCEDURE get_student_outpasses(IN student_id_param BIGINT)
BEGIN
    SELECT
        id, date, return_date, num_of_days,
        visit_place, status, created_at, updated_at
    FROM outpasses
    WHERE student_id = student_id_param
    ORDER BY created_at DESC;
END//

DELIMITER ;

-- =====================================================
-- DATABASE SCHEMA INFORMATION
-- =====================================================
SELECT 'Database schema created successfully!' AS Status;
SELECT COUNT(*) AS student_count FROM students;
SELECT COUNT(*) AS warden_count FROM wardens;
SELECT COUNT(*) AS security_guard_count FROM security_guards;
SELECT COUNT(*) AS outpass_count FROM outpasses;

-- Show all tables
SHOW TABLES;

