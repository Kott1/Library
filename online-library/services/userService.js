import express from 'express';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const { Pool } = pg;
const app = express();
app.use(express.json());

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'library',
    password: 'library',
    port: 5432,
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const checkQuery = `
            SELECT * FROM users WHERE name = $1 AND email = $2 AND password = $3;
        `;
        const checkResult = await pool.query(checkQuery, [name, email, password]);
    
        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'User with this name, email, or password already exists' });
        }
        const createdAt = new Date();
        const id = uuidv4();

        const query = `
            INSERT INTO users (id, name, email, password, created_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [id, name, email, password, createdAt];

        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, " | ", password);
    try {
        const query = `SELECT * FROM users WHERE email = $1 AND password = $2;`;
        const result = await pool.query(query, [email, password]);
        console.log(result);
        if (result.rows.length == 0) {
            console.log(1);
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful', user: result.rows[0] });
    } catch (err) {
        console.error('Error executing login query', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`userService is running on port ${PORT}`);
});