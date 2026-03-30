const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Adjust host for frontend
    credentials: true
}));

// Augmented payload capacity for high-fidelity data transfers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (centralized in routes/indexRoute.js)
app.use('/api', require('./routes/indexRoute'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
