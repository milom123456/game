const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// index.js ফাইলে এই অংশটুকু হুবহু পরিবর্তন করুন
const cors = require("cors");

app.use(cors({
  origin: "*", // সব ডোমেইন থেকে রিকোয়েস্ট গ্রহণ করবে
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // OPTIONS থাকা বাধ্যতামূলক
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true
}));

// ব্রাউজারের Preflight রিকোয়েস্টের জন্য এই লাইনটি যোগ করুন
app.options('*', cors());



/* ===== MySQL Connection Setup ===== */
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || "railway",
  process.env.MYSQLUSER || "root",
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST || "localhost",
    port: process.env.MYSQLPORT || 3306,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      connectTimeout: 60000 
    }
  }
);

// কানেকশন চেক
sequelize.authenticate()
  .then(() => console.log("✅ MySQL Connected Successfully"))
  .catch(err => console.error("❌ MySQL Connection Error:", err));

/* ===== User Model ===== */
const User = sequelize.define("User", {
  fullName: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  tracking_id: { type: DataTypes.STRING, defaultValue: () => `tr_${Date.now()}` },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 },
});

// ডাটাবেস সিঙ্ক
sequelize.sync({ alter: true })
  .then(() => console.log("✅ Database & Tables Synced"))
  .catch(err => console.error("❌ Database Sync Error:", err));

/* ===== Signup Route ===== */
app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      balance: 0
    });
    res.status(201).json({ success: true, message: "Signup successful!", user: newUser });
  } catch (err) {
    console.error("🔥 SIGNUP ERROR:", err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

/* ===== Login Route ===== */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "supersecret", { expiresIn: "24h" });
    res.json({ success: true, token, user: { name: user.fullName, balance: user.balance, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});