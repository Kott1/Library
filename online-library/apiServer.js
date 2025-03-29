import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

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
        res.status(201).json(data);
    } catch (error) {
        console.error('Error in gateway:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/login', async (req, res) => {
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
        res.status(201).json(data);
    } catch (error) {
        console.error('Error in gateway:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Gateway server running on port ${PORT}`);
});