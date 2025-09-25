import { Pool } from 'pg';
import { env } from './env.js';
import { logger } from '../logger/logger.js';

// Create a new PostgreSQL connection pool using env config
export const pool = new Pool({ connectionString: env.dbUrl });

// Simple health check query to test DB connection
export async function dbHealth() {
    const res = await pool.query('SELECT 1 as ok');
    return res.rows[0]?.ok === 1; // returns true if DB responds
}

// Handle unexpected DB connection errors
pool.on('error', (err) => {
    logger.error('PG Pool error', { err: err.message });
});
