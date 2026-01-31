require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "please-change-this-secret";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// MySQL pool
const pool = mysql.createPool({
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASS || "",
	database: process.env.DB_NAME || "portfolio_db",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

// Simple JWT auth middleware
async function authMiddleware(req, res, next) {
	try {
		const auth = req.headers.authorization || "";
		const m = auth.match(/^Bearer\s+(.+)$/i);
		if (!m) return res.status(401).json({ message: "Missing token" });
		const token = m[1];
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = { id: decoded.userId };
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" });
	}
}

const router = express.Router();

// Register (now accepts username, email, password)
router.post("/auth/register", async (req, res) => {
	const { username, email, password } = req.body || {};
	console.log(`[auth/register] attempt username=${username} email=${email}`);
	if (!username || !email || !password) {
		return res.status(400).json({ message: "username, email and password are required" });
	}

	// Basic email format validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		console.log(`[auth/register] invalid email format email=${email}`);
		return res.status(400).json({ message: "email 格式不正确" });
	}

	try {
		const password_hash = await bcrypt.hash(password, 10);
		const [result] = await pool.execute(
			"INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
			[username, email, password_hash]
		);
		const userId = result.insertId;
		console.log(`[auth/register] created userId=${userId} username=${username} email=${email}`);
		const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
		return res.status(201).json({ message: "registered", token, username });
	} catch (err) {
		console.error(err);
		if (err && err.code === "ER_DUP_ENTRY") {
			console.log(`[auth/register] duplicate entry username=${username} email=${email}`);
			return res.status(409).json({ message: "用户名或邮箱已存在" });
		}
		return res.status(500).json({ message: "server error" });
	}
});

// Login
router.post("/auth/login", async (req, res) => {
	const { username, password } = req.body || {};
	console.log(`[auth/login] attempt username=${username}`);
	if (!username || !password) {
		return res.status(400).json({ message: "username and password are required" });
	}
	try {
		// Support login by username OR email
		const [rows] = await pool.execute(
			"SELECT id, username AS stored_username, password_hash FROM users WHERE username = ? OR email = ? LIMIT 1",
			[username, username]
		);
		const user = rows[0];
		if (!user) {
			console.log(`[auth/login] missing user username=${username}`);
			return res.status(401).json({ message: "无效的用户名或密码" });
		}
		const match = await bcrypt.compare(password, user.password_hash);
		if (!match) {
			console.log(`[auth/login] invalid password username=${username}`);
			return res.status(401).json({ message: "无效的用户名或密码" });
		}
		const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
		const returnedUsername = user.stored_username || username;
		console.log(`[auth/login] success userId=${user.id} username=${returnedUsername}`);
		return res.json({ token, username: returnedUsername });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "server error" });
	}
});

// Get user config (requires auth)
router.get("/config", authMiddleware, async (req, res) => {
	try {
		const userId = req.user.id;
		console.log(`[config][GET] userId=${userId}`);
		const [rows] = await pool.execute("SELECT config_data, updated_at FROM user_configs WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1", [userId]);
		if (!rows || rows.length === 0) return res.json({ config: null });
		const row = rows[0];
		return res.json({ config: row.config_data });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "server error" });
	}
});

// Upsert user config (requires auth)
router.post("/config", authMiddleware, async (req, res) => {
	try {
		const userId = req.user.id;
		console.log(`[config][POST] userId=${userId}`);
		const config = req.body?.config ?? null;
		if (config === null) return res.status(400).json({ message: "config is required" });

		// Try update first
		const [existing] = await pool.execute("SELECT id FROM user_configs WHERE user_id = ? LIMIT 1", [userId]);
		if (existing && existing.length > 0) {
			await pool.execute("UPDATE user_configs SET config_data = ? , updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", [JSON.stringify(config), userId]);
		} else {
			await pool.execute("INSERT INTO user_configs (user_id, config_data) VALUES (?, ?)", [userId, JSON.stringify(config)]);
		}
		return res.json({ message: "saved" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "server error" });
	}
});

app.use("/api", router);

app.listen(PORT, () => {
	console.log(`Backend listening on port ${PORT}`);
});
