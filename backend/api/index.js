require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

/* ================= CORS ================= */
app.use(cors({ origin: true, credentials: true }));

/* ================= DATABASE ================= */
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    port: Number(process.env.MYSQLPORT) || 3306,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    logging: false,
    pool: { max: 5, min: 0, acquire: 60000, idle: 10000 }
  }
);

/* ================= MODELS ================= */
const User = sequelize.define("User", {
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
});

/* ================= DB INIT ================= */
let dbReady = false;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Railway MySQL Connected");
    await sequelize.sync({ alter: true });
    console.log("✅ Tables Synced");
    dbReady = true;
  } catch (err) {
    console.error("❌ DB Error FULL:", err);
  }
})();

/* ================= ROUTES ================= */
app.post("/api/signup", async (req, res) => {
  if (!dbReady) return res.status(503).json({ message: "DB not ready" });

  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hash });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Signup successful", token, user: { id: user.id, fullName, email } });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
