import pool from './database/db.js';

const connectdb = (async () => {
    try{
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        console.log('Database connected successfully. Solution: ', rows[0].result);
    }catch(err){
        console.error('Database connection failed: ', err.message);
    }
})();
