import express from 'express';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

const { Pool } = pg;
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'library',
    password: 'library',
    port: 5432,
});

app.post('/reading-progress', async (req, res) => {
    const { user_id, book_id, current_page, percentage_read } = req.body;

    if (!user_id || !book_id || current_page === undefined || percentage_read === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    const updated_at = new Date();

    try {
        const checkQuery = `SELECT * FROM reading_progress WHERE user_id = $1 AND book_id = $2`;
        const checkResult = await pool.query(checkQuery, [user_id, book_id]);

        if (checkResult.rows.length > 0) {
        return res.status(400).json({ error: 'Progress already exists for this user and book' });
        }

        const insertQuery = `
        INSERT INTO reading_progress (id, user_id, book_id, current_page, percentage_read, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `;
        const values = [id, user_id, book_id, current_page, percentage_read, updated_at];
        const result = await pool.query(insertQuery, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating reading progress:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/reading-progress/:id', async (req, res) => {
    const { id } = req.params;
    const { current_page, percentage_read } = req.body;
    const updated_at = new Date();

    const fields = [];
    const values = [];

    if (current_page !== undefined) {
        values.push(current_page);
        fields.push(`current_page = $${values.length}`);
    }
    if (percentage_read !== undefined) {
        values.push(percentage_read);
        fields.push(`percentage_read = $${values.length}`);
    }

    values.push(updated_at);
    fields.push(`updated_at = $${values.length}`);

    if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const updateQuery = `
        UPDATE reading_progress SET ${fields.join(', ')}
        WHERE id = $${values.length}
        RETURNING *;
    `;

    try {
        const result = await pool.query(updateQuery, values);
        if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Reading progress not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating reading progress:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/reading-progress', async (req, res) => {
    const { user_id, book_id } = req.query;

    if (!user_id || !book_id) {
        return res.status(400).json({ error: 'Missing user_id or book_id query parameters' });
    }
    console.log("progress id " + user_id + " " + book_id);
    try {
        const query = `
        SELECT * FROM reading_progress WHERE user_id = $1 AND book_id = $2;
        `;
        const result = await pool.query(query, [user_id, book_id]);
        if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Reading progress not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching reading progress:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/reading-progress/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT book_id, current_page, percentage_read 
             FROM reading_progress 
             WHERE user_id = $1`,
            [user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reading progress not found' });
        }

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching reading progress by userId:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = 3004;
app.listen(PORT, () => {
    console.log(`readingService is running on port ${PORT}`);
});