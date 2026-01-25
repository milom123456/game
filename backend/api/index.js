require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",          // local dev
  "https://offerwell.vercel.app"    // production frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / server-to-server
    if (allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ================= DATABASE =================
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT),
    dialect: "mysql",
    logging: false
  }
);

sequelize.authenticate()
  .then(() => console.log("✅ MySQL Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// ================= MODELS =================
const User = sequelize.define("User", {
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 }
});

sequelize.sync();

// ================= MIDDLEWARE =================
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// ================= ROUTES =================

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "সব ফিল্ড প্রয়োজন" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "ইমেইল আগে থেকেই আছে" });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ fullName, email, password: hash });

    res.json({ success: true, message: "Signup সফল" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User পাওয়া যায়নি" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "পাসওয়ার্ড ভুল" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: { id: user.id, name: user.fullName, balance: user.balance }
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Profile
app.get("/api/me", auth, async (req, res) => {
  const user = await User.findByPk(req.userId, { attributes: { exclude: ["password"] } });
  res.json(user);
});

// Add balance (demo)
app.post("/api/add-balance", auth, async (req, res) => {
  const { amount } = req.body;
  const user = await User.findByPk(req.userId);
  user.balance += Number(amount || 0);
  await user.save();
  res.json({ balance: user.balance });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
