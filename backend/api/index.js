require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

/* ================= DATABASE CONNECTION ================= */
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT || 3306,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
    dialectOptions: { connectTimeout: 60000 }
  }
);

/* ================= MODELS ================= */

// ১. ইউজার মডেল (ব্যালেন্স সহ)
const User = sequelize.define("User", {
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  balance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  role: { type: DataTypes.STRING, defaultValue: "user" } // user or admin
});

// ২. রিওয়ার্ড মডেল (অফার কমপ্লিট রেকর্ড)
const Reward = sequelize.define("Reward", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  offerName: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "completed" }
});

// ৩. ক্যাশআউট/উইথড্র মডেল
const Withdrawal = sequelize.define("Withdrawal", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  method: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "pending" } // pending, approved, rejected
});

/* ================= DB INIT ================= */
let dbReady = false;
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Railway MySQL Connected");
    await sequelize.sync({ alter: true });
    console.log("✅ All Tables Synced");
    dbReady = true;
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  }
})();

// DB Guard Middleware
app.use((req, res, next) => {
  if (!dbReady) return res.status(503).json({ message: "Database not connected" });
  next();
});
/* ================= CPAGRIP POSTBACK ROUTE ================= */
app.get("/api/postback/cpagrip", async (req, res) => {
  try {
    const { tracking_id, payout, offer_id } = req.query;

    if (!tracking_id || !payout) {
      return res.status(400).send("Missing Data");
    }

    // ১. রিওয়ার্ড টেবিলে তথ্য সেভ করা
    await Reward.create({
      userId: tracking_id, 
      offerName: `CPAGrip Offer #${offer_id}`,
      amount: parseFloat(payout),
      status: "completed"
    });

    // ২. ইউজারের ব্যালেন্স আপডেট করা
    const user = await User.findByPk(tracking_id);
    if (user) {
      user.balance = parseFloat(user.balance || 0) + parseFloat(payout);
      await user.save();
      console.log(`✅ Balance Updated for User ${tracking_id}: +$${payout}`);
    }

    res.send("1"); // CPAGrip-কে সাকসেস মেসেজ
  } catch (err) {
    console.error("Postback Error:", err);
    res.status(500).send("0");
  }
});
/* ================= API ROUTES ================= */

// --- AUTH ---
app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hash });
    res.json({ message: "Success", user: { id: user.id, fullName, email } });
  } catch (err) { res.status(400).json({ message: "Email already exists" }); }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: "1d" });
    res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, balance: user.balance, role: user.role } });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// --- USER DATA ---
app.get("/api/user/me/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// --- OFFERWALL POSTBACK (Rewards) ---
app.get("/api/postback", async (req, res) => {
  const { userId, amount, offerName } = req.query;
  try {
    await Reward.create({ userId, amount, offerName });
    const user = await User.findByPk(userId);
    if (user) {
      user.balance = parseFloat(user.balance) + parseFloat(amount);
      await user.save();
    }
    res.send("1"); // Success for Offerwall
  } catch (err) { res.status(500).send("0"); }
});

// --- CASHOUT (Withdrawal) ---
app.post("/api/withdraw", async (req, res) => {
  const { userId, amount, method, address } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user || user.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

    user.balance -= amount;
    await user.save();
    await Withdrawal.create({ userId, amount, method, address });

    res.json({ message: "Withdrawal request submitted!" });
  } catch (err) { res.status(500).json({ message: "Error processing withdrawal" }); }
});

// --- ADMIN ANALYTICS ---
app.get("/api/admin/stats", async (req, res) => {
  const totalUsers = await User.count();
  const totalWithdrawn = await Withdrawal.sum('amount', { where: { status: 'approved' } }) || 0;
  const pendingCashouts = await Withdrawal.count({ where: { status: 'pending' } });
  const completedOffers = await Reward.count();
  
  res.json({ totalUsers, totalWithdrawn, pendingCashouts, completedOffers });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));