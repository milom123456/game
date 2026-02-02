require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://offerwell.vercel.app",
    "https://kalon.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* ================= DATABASE ================= */
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    port: Number(process.env.MYSQLPORT),
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 10000,
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  }
);

/* ================= CONNECT ================= */
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Railway MySQL Connected");

    await sequelize.sync();
    console.log("✅ Models Synced");
  } catch (err) {
    console.error("❌ DB ERROR:", err.message);
    process.exit(1);
  }
})();

/* ================= MODEL ================= */
const User = sequelize.define("User", {
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 }
});

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("🚀 Backend is Running (Railway DB Connected)");
});

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({ fullName, email, password: hash });
    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.fullName, balance: user.balance }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CPAGRIP Postback
app.get("/api/postback/cpagrip", async (req, res) => {
  const { tracking_id, payout, ssword } = req.query;

  if (ssword !== process.env.POSTBACK_SECRET) {
    return res.status(401).send("Unauthorized");
  }

  const user = await User.findByPk(tracking_id);
  if (!user) return res.status(404).send("User not found");

  user.balance += Number(payout || 0);
  await user.save();

  res.send("success");
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
