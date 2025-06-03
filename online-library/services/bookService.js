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

app.post('/books', async (req, res) => {
    const {
        title,
        author,
        genre,
        description,
        publication_year,
        file_url
    } = req.body;

    try {
        const checkQuery = `
            SELECT * FROM books WHERE title = $1 AND author = $2 AND description = $3
        `;
        const checkResult = await pool.query(checkQuery, [title, author, description]);
        if (checkResult.rows.length > 0) {
          return res.status(400).json({ error: 'Such book already exists' });
        }

        const id = uuidv4();
        const createdAt = new Date();

        const query = `
            INSERT INTO books
                (id, title, author, genre, description, publication_year, file_url, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const values = [
            id,
            title,
            author,
            genre,
            description,
            publication_year,
            file_url,
            createdAt
        ];
        console.log(values);
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating book:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/books', async (req, res) => {
    const { genre, year } = req.query;

    let baseQuery = 'SELECT * FROM books';
    const conditions = [];
    const values = [];

    if (genre) {
        conditions.push(`genre = $${values.length + 1}`);
        values.push(genre);
    }

    if (year) {
        conditions.push(`publication_year = $${values.length + 1}`);
        values.push(year);
    }

    if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
    }

    baseQuery += ' ORDER BY created_at DESC';

    try {
        const result = await pool.query(baseQuery, values);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching books with filters:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/genres', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT genre FROM books ORDER BY genre ASC');
        const genres = result.rows.map(row => row.genre);
        res.json(genres);
    } catch (err) {
        console.error('Error fetching genres:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/books/:id', async (req, res) => {
    const { id } = req.params;
    console.log("for reading " + id)
    const query = 'SELECT * FROM books WHERE id = $1;';
    try {
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching book', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, genre, description, publication_year, file_url } = req.body;

    const fields = [];
    const params = [];

    if (title !== undefined) {
        params.push(title);
        fields.push(`title = $${params.length}`);
    }
    if (author !== undefined) {
        params.push(author);
        fields.push(`author = $${params.length}`);
    }
    if (genre !== undefined) {
        params.push(genre);
        fields.push(`genre = $${params.length}`);
    }
    if (description !== undefined) {
        params.push(description);
        fields.push(`description = $${params.length}`);
    }
    if (publication_year !== undefined) {
        params.push(Number(publication_year));
        fields.push(`publication_year = $${params.length}`);
    }
    if (file_url !== undefined) {
        params.push(file_url);
        fields.push(`file_url = $${params.length}`);
    }

    if (!fields.length) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const updateQuery = `
        UPDATE books SET ${fields.join(', ')}
        WHERE id = $${params.length}
        RETURNING *;
    `;

    try {
        const result = await pool.query(updateQuery, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating book', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    const deleteQuery = 'DELETE FROM books WHERE id = $1 RETURNING *;';
    try {
        const result = await pool.query(deleteQuery, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error deleting book', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`bookService is running on port ${PORT}`);
});