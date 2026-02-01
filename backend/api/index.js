require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());

// CORS Configuration
app.use(cors({ 
  origin: ["http://localhost:5173", "https://offerwell.vercel.app"], 
  credentials: true 
}));

// DATABASE CONNECTION (সংশোধিত এবং সিনট্যাক্স এরর মুক্ত)
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || "railway",
  process.env.MYSQLUSER || "root",
  process.env.MYSQLPASSWORD || "ytRWliruXJvFrAEPIvOAXkLeMVeNWKae",
  {
    host: process.env.MYSQLHOST || "crossover.proxy.rlwy.net",
    port: parseInt(process.env.MYSQLPORT) || 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000
    }
  }
);

sequelize.authenticate()
  .then(() => console.log("✅ MySQL Connected Successfully!"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// USER MODEL
const User = sequelize.define("User", {
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 }
});

sequelize.sync();

// CPAGRIP POSTBACK ROUTE
app.get("/api/postback/cpagrip", async (req, res) => {
  try {
    const { tracking_id, payout, ssword } = req.query;

    if (ssword !== "Ee345m@#") {
      return res.status(401).send("Unauthorized: Invalid Password");
    }

    const user = await User.findByPk(tracking_id);
    if (user) {
      user.balance += parseFloat(payout || 0);
      await user.save();
      console.log(`💰 Balance Updated: User ${user.fullName} earned $${payout}`);
      return res.send("success");
    }
    res.status(404).send("User not found");
  } catch (err) {
    console.error("Postback Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// AUTH ROUTES
app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({ fullName, email, password: hash });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: "Signup failed" }); }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "f4a9b3c6", { expiresIn: "1d" });
      return res.json({ token, user: { id: user.id, name: user.fullName, balance: user.balance } });
    }
    res.status(401).json({ message: "Invalid credentials" });
  } catch (err) { res.status(500).json({ message: "Login failed" }); }
});

app.get("/", (req, res) => res.send("🚀 Backend is Running and Active!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend server live on port ${PORT}`));