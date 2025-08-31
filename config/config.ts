import assert from 'assert';
import dotenv from 'dotenv';

dotenv.config();

const { NODE_ENV, JWT_SECRET_KEY, PORT, DATABASE_URL, CORS_ORIGINS, TIMEZONE } = process.env;

assert(NODE_ENV, 'NODE_ENV is required');
assert(JWT_SECRET_KEY, 'JWT_SECRET_KEY is required');
assert(PORT, 'PORT is required');
assert(DATABASE_URL, 'DATABASE_URL is required');
assert(CORS_ORIGINS, 'CORS_ORIGINS is required');
assert(TIMEZONE, 'TIMEZONE is required');


const corsOrigins = NODE_ENV?.toLowerCase() === 'local' ? '*' : CORS_ORIGINS?.split(',').map(origin => origin.trim()) ?? '*';

export default {
    SERVER: {
        NODE_ENV,
        JWT_SECRET_KEY,
        PORT,
        DATABASE_URL,
        CORS_ORIGINS: corsOrigins,
        TIMEZONE
    }
};