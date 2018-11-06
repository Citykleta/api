const {default: shiphold} = require('ship-hold');
const {db} = require('../src/conf').default;
const bcrypt = require('bcrypt');

const sh = shiphold(db);
const {query} = sh;

(async () => {
    try {
        // Test connection
        await query('SELECT now()');
        // Drop tables
        await query(`DROP TABLE IF EXISTS applications,bikes,business_owners, businesses, roles, tokens, users CASCADE;`);
        // Drop indexes
        // none
        // Drop types
        await query(`DROP TYPE IF EXISTS application_type CASCADE;`);
        // // none
        // // Create extensions
        await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
        // // none
        // // Create types
        await query(`CREATE TYPE application_type AS ENUM ('confidential', 'public');`);
        // // Create tables
        await query(`
        CREATE TABLE applications(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            type application_type,
            secret VARCHAR(128) NOT NULL,
            title VARCHAR(128) NOT NULL,
            created_at TIMESTAMP DEFAULT current_timestamp,
		    updated_at TIMESTAMP DEFAULT current_timestamp
        );
        
        CREATE TABLE roles(
            id serial PRIMARY KEY,
            title VARCHAR,
            permissions JSONB
        );
        
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            email VARCHAR,
            password_hash VARCHAR,
            created_at TIMESTAMP DEFAULT current_timestamp,
		    updated_at TIMESTAMP DEFAULT current_timestamp,
		    role_id INTEGER REFERENCES roles
        );
        
        CREATE TABLE businesses(
           id SERIAL PRIMARY KEY,
           name VARCHAR,
           created_at TIMESTAMP DEFAULT current_timestamp,
		   updated_at TIMESTAMP DEFAULT current_timestamp
        );
        
        CREATE TABLE business_owners(
            id SERIAL PRIMARY KEY,
            user_id integer REFERENCES users,
            business_id integer REFERENCES businesses,
            created_at TIMESTAMP DEFAULT current_timestamp,
		    updated_at TIMESTAMP DEFAULT current_timestamp,
            UNIQUE(user_id, business_id)
        );
        
        CREATE TABLE bikes(
            id SERIAL PRIMARY KEY,
            brand VARCHAR,
            fabrication_date TIMESTAMP,
            acquisition_date TIMESTAMP,
            price INTEGER,
            created_at TIMESTAMP DEFAULT current_timestamp,
		    updated_at TIMESTAMP DEFAULT current_timestamp,
		    business_id INTEGER REFERENCES businesses
        );
        
        CREATE TABLE tokens (
		    id SERIAL PRIMARY KEY,
		    value VARCHAR(256),
		    expiration_date TIMESTAMP DEFAULT current_timestamp + interval '14 days',
		    revoked BOOLEAN NOT NULL DEFAULT false,
		    updated_at TIMESTAMP DEFAULT current_timestamp,
		    created_at TIMESTAMP DEFAULT current_timestamp,
		    user_id INTEGER REFERENCES users,
		    application_id UUID REFERENCES applications
		);
        `);

        const [adminRole] = (await query(`INSERT INTO roles(id, title, permissions) VALUES (DEFAULT, 'admin','{"read":"all", "write":"all"}'), (DEFAULT, 'rider','{"read":"all", "write":"all"}'), (DEFAULT, 'business_owner','{"read":"all", "write":"all"}'),(DEFAULT, 'client_application','{"read":"all", "write":"all"}') RETURNING *;`)).rows;
        const password = bcrypt.hashSync('admin', 10);
        await query(`INSERT INTO users(id, email, role_id, password_hash) VALUES (DEFAULT, 'admin@citykleta.com', ${adminRole.id}, '${password}')`);
        await query(`INSERT INTO applications(id, type, secret, title) VALUES ('6a908152-60e8-489f-b2c6-bd757ca2165b','confidential'::application_type,'foo','admin panel application')`);

    } catch (e) {
        console.log(e);
        process.exit(1);
    } finally {
        sh.stop();
    }
})();
