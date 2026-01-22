const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

/* ===== Middleware (ORDER IMPORTANT) ===== */
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173"], // frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

/* ===== MySQL Connection ===== */
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || "railway",
  process.env.MYSQLUSER || "root",
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST || "localhost",
    port: process.env.MYSQLPORT || 3306,
    dialect: "mysql",
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log("✅ MySQL Connected"))
  .catch(err => console.error("❌ MySQL Error:", err));

/* ===== User Model ===== */
const User = sequelize.define("User", {
  fullName: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  balance: { type: DataTypes.FLOAT, defaultValue: 0 },
});

sequelize.sync();

/* ===== Signup ===== */
app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ fullName, email, password: hashed });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

/* ===== Login ===== */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1d" });

    res.json({ token, user: { name: user.fullName, balance: user.balance } });
  } catch {
    res.status(500).json({ message: "Login error" });
  }
});

/* ===== Start Server ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🚀 Server running"));
