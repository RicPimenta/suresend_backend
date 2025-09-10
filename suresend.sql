-- Create the Person table
CREATE TABLE Person (
    person_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    dob DATE,
    country_of_residence VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    secret_pin VARCHAR(10) NOT NULL,
    cell VARCHAR(20),
    address TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(255) NOT NULL
);
 --  Full name , DOB , Country of resident , email , secrete pin