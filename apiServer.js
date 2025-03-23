const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const USER_SERVICE_URL = 'http://localhost:3001';


app.post('/users/register', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/users/register`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error in /users/register:', error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : 'Internal Server Error'
    });
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/users/login`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error in /users/login:', error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : 'Internal Server Error'
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway працює на порті ${PORT}`);
});