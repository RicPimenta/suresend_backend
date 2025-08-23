-- Create the Person table
CREATE TABLE Person (
    person_id SERIAL PRIMARY KEY,       -- Auto-incrementing unique ID
    name VARCHAR(255) NOT NULL,         -- Person's full name
    email VARCHAR(255) UNIQUE NOT NULL, -- Email must be unique
    cell VARCHAR(20),                   -- Phone number
    address TEXT,                       -- Full address
    verified BOOLEAN DEFAULT FALSE,     -- Verification status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    password VARCHAR(255) NOT NULL;
);
