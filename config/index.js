// Port
process.env.PORT = process.env.PORT || 3000;

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Expiration token
process.env.EXP_TOKEN = '72h';

// SEED Authentication
process.env.SEED = process.env.SEED || 'ultra-secret';

// Database
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/hospital';
} else { urlDB = process.env.MONGO_URI }

process.env.URLDB = urlDB;

