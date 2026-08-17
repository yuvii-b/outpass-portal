-- =====================================================
-- Outpass Portal - Managed MySQL Schema (Render / Aiven / Railway / Clever Cloud)
-- =====================================================
-- Run this ONCE against your managed MySQL database, e.g.:
--   mysql -h <host> -P <port> -u <user> -p<pass> --ssl-mode=REQUIRED <db_name> < schema-managed.sql
--
-- Differences from src/main/resources/schema.sql (the local/self-hosted version):
--   * No DROP/CREATE DATABASE or USE  -> a managed provider gives you ONE database and
--     no privilege to create/drop databases. Create the DB in the provider console first.
--   * No `SET GLOBAL event_scheduler` / EVENT -> requires SUPER privilege, denied on managed DBs.
--     Expired-token cleanup is handled in application code, so the event is not needed.
--   * No stored procedures / views -> the app uses Spring Data JPA and never calls them.
-- The app runs with spring.jpa.hibernate.ddl-auto=validate, so these tables must exist
-- and match the JPA entities before the backend will start.
-- =====================================================

-- =====================================================
-- TABLE: students
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

    CONSTRAINT uk_student_email UNIQUE (email),
    CONSTRAINT uk_student_roll_no UNIQUE (roll_no),
    CONSTRAINT chk_student_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_student_contact CHECK (contact_number REGEXP '^[0-9]{10}$'),
    CONSTRAINT chk_student_parent CHECK (parent_number REGEXP '^[0-9]{10}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_student_email ON students(email);
CREATE INDEX idx_student_roll_no ON students(roll_no);
CREATE INDEX idx_student_hostel ON students(hostel);

-- =====================================================
-- TABLE: wardens
-- =====================================================
CREATE TABLE wardens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    hostel VARCHAR(100),
    phone VARCHAR(15),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_warden_email UNIQUE (email),
    CONSTRAINT chk_warden_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_warden_phone CHECK (phone IS NULL OR phone REGEXP '^[0-9]{10}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_warden_email ON wardens(email);
CREATE INDEX idx_warden_hostel ON wardens(hostel);

-- =====================================================
-- TABLE: security_guards
-- =====================================================
CREATE TABLE security_guards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    hostel VARCHAR(100),
    phone VARCHAR(15),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_security_email UNIQUE (email),
    CONSTRAINT chk_security_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_security_phone CHECK (phone IS NULL OR phone REGEXP '^[0-9]{10}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_security_email ON security_guards(email);
CREATE INDEX idx_security_hostel ON security_guards(hostel);

-- =====================================================
-- TABLE: outpasses
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
    status ENUM('PENDING', 'APPROVED', 'DECLINED', 'DEPARTED', 'COMPLETED', 'OVERDUE') NOT NULL DEFAULT 'PENDING',
    actual_departure_time DATETIME NULL,
    actual_return_time DATETIME NULL,
    departure_verified_by BIGINT NULL,
    return_verified_by BIGINT NULL,
    is_late_return BOOLEAN DEFAULT FALSE,
    decline_reason VARCHAR(500) NULL,
    warden_comments VARCHAR(500) NULL,
    processed_by BIGINT NULL,
    processed_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_outpass_student FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_outpass_dates CHECK (return_date > date),
    CONSTRAINT chk_outpass_days CHECK (num_of_days > 0 AND num_of_days <= 30),
    CONSTRAINT chk_outpass_contact CHECK (contact_number REGEXP '^[0-9]{10}$'),
    CONSTRAINT chk_outpass_parent CHECK (parent_number REGEXP '^[0-9]{10}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_outpass_student ON outpasses(student_id);
CREATE INDEX idx_outpass_status ON outpasses(status);
CREATE INDEX idx_outpass_date ON outpasses(date);
CREATE INDEX idx_outpass_created ON outpasses(created_at);
CREATE INDEX idx_outpass_hostel ON outpasses(hostel);

-- =====================================================
-- TABLE: refresh_tokens
-- =====================================================
CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(512) NOT NULL,
    user_id BIGINT NOT NULL,
    user_type ENUM('STUDENT', 'WARDEN', 'SECURITY_GUARD') NOT NULL,
    expiry_date TIMESTAMP NOT NULL,

    CONSTRAINT uk_refresh_token UNIQUE (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_refresh_user ON refresh_tokens(user_id, user_type);
CREATE INDEX idx_refresh_expiry ON refresh_tokens(expiry_date);

-- =====================================================
-- TABLE: tokens (revoked JWT blacklist)
-- =====================================================
CREATE TABLE tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    jid VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,

    CONSTRAINT uk_token_jid UNIQUE (jid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_revoked_jid ON tokens(jid);
CREATE INDEX idx_revoked_expires ON tokens(expires_at);

-- =====================================================
-- TABLE: access_logs
-- =====================================================
CREATE TABLE access_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'WARDEN', 'SECURITY_GUARD') NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_access_username (username),
    INDEX idx_access_timestamp (timestamp),
    INDEX idx_access_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAMPLE DATA (optional - remove for a clean production DB)
-- Passwords are bcrypt hashes of the original seed credentials.
-- =====================================================
INSERT INTO wardens (name, email, password_hash, hostel, phone) VALUES
('Ram', 'ram@mit.edu', '$2a$10$9Vw3Fdy7DyCXmAW7XG4dAO2lVc4Vayng/Xow2nAlMP4HTpzn/x9bW', 'NRI', '9876543210'),
('Rajesh', 'rajesh@mit.edu', '$2a$10$u039FG6i7pE.nEjJtiI3O.dGZy2KhT18q0VOfdfnb7Oon.Ob9OMtu', 'Marutham', '9876543211');

INSERT INTO security_guards (name, email, password_hash, hostel, phone) VALUES
('muthu', 'muthu@mit.edu', '$2a$10$xhYbBcJFal8ildwL4OvvYOynu9RW/G7PunB9JiRmYagIM5s.x50G6', 'NRI', '9876543212'),
('somu', 'somu@mit.edu', '$2a$10$Rq8cGIg4XvhQBVw/3Ui2z.afZJvr6LchIzACM2sOwCHHMDIkuKQP6', 'Marutham', '9876543213');

INSERT INTO students (name, email, password_hash, roll_no, department, hostel, room_number, contact_number, parent_number) VALUES
('Yuvi', 'yuvi@mit.edu', '$2a$10$H3Ag5JR2uJDmBLCLY1NOSeLsHKcNvMmBNQlYPMsZbSqBMGojXWhnK', '2024503541', 'CT', 'NRI', '101', '9876543214', '9876543215'),
('Aravinth', 'arvi@mit.edu', '$2a$10$oE5clQ8xgcRrCzvcUabJoeupjQiNHr7MBR.n2ZQD0F0uJABDoJAa.', '2024503001', 'CT', 'Marutham', '201', '9876543216', '9876543217');
