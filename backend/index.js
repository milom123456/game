const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection (Use your own URI in .env)
const MONGO_URI = "mongodb://localhost:27017/cashflow"; 
mongoose.connect(MONGO_URI).then(() => console.log("MongoDB Connected"));

// User Model
const UserSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: { type: String },
    balance: { type: Number, default: 0 }
});
const User = mongoose.model('User', UserSchema);

// --- Auth Routes ---

// Sign Up
app.post('/api/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User Created Successfully" });
    } catch (err) {
        res.status(400).json({ error: "Email already exists" });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: '1h' });
    res.json({ token, user: { name: user.fullName, balance: user.balance } });
});

app.listen(5000, () => console.log("Server running on port 5000"));