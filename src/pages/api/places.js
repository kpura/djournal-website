import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root', 
            password: '', 
            database: 'sorsogon_db'
        });

        const [rows] = await db.execute("SELECT * FROM sorsogon_places");
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database connection failed' });
    }
}
