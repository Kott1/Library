import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

const JWT_KEY = 'jwt_key';

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
}

// User

app.get('/user', authenticateToken, (req, res) => {
    const { email, isAdmin } = req.user;
    res.json({ email, isAdmin });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });
    res.json({ message: 'Logged out successfully' });
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password
            }),
        });

        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);

        const userPayload = {
            user_id: data.id,
            email: email,
            isAdmin: email === 'admin@gmail.com' && password === 'admin'
        };
        const token = jwt.sign(userPayload, JWT_KEY, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000, // 1 година
        });
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error in gateway:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            }),
        });

        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
            const userPayload = {
            user_id: data.id,
            email: email,
            isAdmin: email === 'admin@gmail.com' && password === 'admin'
        };
        const token = jwt.sign(userPayload, JWT_KEY, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000, // 1 година
        });
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error in gateway:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Books requests

app.post('/books', authenticateToken, async (req, res) => {
    try {
        const response = await fetch('http://localhost:3003/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Gateway error (POST /books):', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
app.get('/books', authenticateToken, async (req, res) => {
    const params = new URLSearchParams(req.query).toString();
    const url = `http://localhost:3003/books${params ? `?${params}` : ''}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Gateway error (GET /books):', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/genres', authenticateToken, async (req, res) => {
    try {
        const response = await fetch('http://localhost:3003/genres');
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Gateway error (GET /genres):', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/books/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    console.log("for reading " + id)
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!id) {
        return res.status(400).json({ error: 'Ented book id.' });
    }
    
    if (!uuidV4Regex.test(id)) {
        return res.status(400).json({ error: 'Invalid ID format. Expected UUID v4.' })
    }

    try {
        const response = await fetch(`http://localhost:3003/books/${id}`);
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error(`Gateway error (GET /books/${id}):`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/books/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`http://localhost:3003/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error(`Gateway error (PUT /books/${id}):`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
app.delete('/books/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`http://localhost:3003/books/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error(`Gateway error (DELETE /books/${id}):`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Reading Progress

app.get('/reading-progress', authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    const { bookId } = req.query;
    console.log("progress " + user_id + " " + bookId)
    const params = new URLSearchParams({ book_id: bookId, user_id }).toString();
    const url = `http://localhost:3004/reading-progress?${params}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Gateway error (GET /reading-progress):', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/reading-progress', authenticateToken, async (req, res) => {
    const { user_id } = req.user;

    try {
        const response = await fetch('http://localhost:3004/reading-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...req.body, user_id }),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Gateway error (POST /reading-progress):', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/reading-progress/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.user;

    try {
        const response = await fetch(`http://localhost:3004/reading-progress/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...req.body, user_id }),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error(`Gateway error (PUT /reading-progress/${id}):`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/reading-progress/user', authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' })
    try {
        const response = await fetch(`http://localhost:3004/reading-progress/${user_id}`)
        const data = await response.json()
        res.json(data)
    } catch (err) {
        console.error('Failed to fetch reading history:', err)
        res.status(500).json({ error: 'Failed to fetch reading history' })
    }
})

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Gateway server running on port ${PORT}`);
});