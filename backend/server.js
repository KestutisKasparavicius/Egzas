import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = 3010;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'xd',
	database: 'mydb',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

// Test database connection
pool
	.getConnection()
	.then((conn) => {
		console.log('✓ Database connected successfully');
		conn.release();
	})
	.catch((err) => {
		console.error('✗ Database connection failed:', err.message);
	});

// =============== USERS ENDPOINTS ===============

// GET all users
app.get('/api/users', async (req, res) => {
	try {
		const connection = await pool.getConnection();
		const [users] = await connection.query('SELECT * FROM users');
		connection.release();
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// GET user by ID
app.get('/api/users/:id', async (req, res) => {
	try {
		const connection = await pool.getConnection();
		const [user] = await connection.query('SELECT * FROM users WHERE id = ?', [
			req.params.id,
		]);
		connection.release();
		if (user.length === 0) {
			return res.status(404).json({ error: 'User not found' });
		}
		res.json(user[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// CREATE new user
app.post('/api/users', async (req, res) => {
	const { name, privilege, password } = req.body;
	if (!name || !privilege) {
		return res.status(400).json({ error: 'Name and privilege are required' });
	}
	try {
		const connection = await pool.getConnection();
		const [result] = await connection.query(
			'INSERT INTO users (name, privilege, password) VALUES (?, ?, ?)',
			[name, privilege, password || null]
		);
		connection.release();
		res.status(201).json({ id: result.insertId, name, privilege, password });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// UPDATE user
app.put('/api/users/:id', async (req, res) => {
	const { name, privilege, password } = req.body;
	try {
		const connection = await pool.getConnection();
		await connection.query(
			'UPDATE users SET name = ?, privilege = ?, password = ? WHERE id = ?',
			[name, privilege, password, req.params.id]
		);
		connection.release();
		res.json({ message: 'User updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
	try {
		const connection = await pool.getConnection();
		await connection.query('DELETE FROM users WHERE id = ?', [req.params.id]);
		connection.release();
		res.json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// =============== CITY ENDPOINTS ===============

// GET all cities
app.get('/api/cities', async (req, res) => {
	try {
		const connection = await pool.getConnection();
		const [cities] = await connection.query('SELECT * FROM city');
		connection.release();
		res.json(cities);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// GET city by ID
app.get('/api/cities/:id', async (req, res) => {
	try {
		const connection = await pool.getConnection();
		const [city] = await connection.query('SELECT * FROM city WHERE id = ?', [
			req.params.id,
		]);
		connection.release();
		if (city.length === 0) {
			return res.status(404).json({ error: 'City not found' });
		}
		res.json(city[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// CREATE new city
app.post('/api/cities', async (req, res) => {
	const { id, city } = req.body;
	if (!id || !city) {
		return res.status(400).json({ error: 'ID and city name are required' });
	}
	try {
		const connection = await pool.getConnection();
		await connection.query('INSERT INTO city (id, city) VALUES (?, ?)', [
			id,
			city,
		]);
		connection.release();
		res.status(201).json({ id, city });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// =============== POSTS ENDPOINTS ===============

// GET all posts
app.get('/api/posts', async (req, res) => {
	try {
		const connection = await pool.getConnection();
		const [posts] = await connection.query(
			'SELECT * FROM posts ORDER BY created_at DESC'
		);
		connection.release();
		res.json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// GET post by ID
app.get('/api/posts/:id', async (req, res) => {
	try {
		const connection = await pool.getConnection();
		const [post] = await connection.query('SELECT * FROM posts WHERE id = ?', [
			req.params.id,
		]);
		connection.release();
		if (post.length === 0) {
			return res.status(404).json({ error: 'Post not found' });
		}
		res.json(post[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// GET posts by user ID
app.get('/api/users/:userId/posts', async (req, res) => {
	try {
		const connection = await pool.getConnection();
		const [posts] = await connection.query(
			'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC',
			[req.params.userId]
		);
		connection.release();
		res.json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// CREATE new post
app.post('/api/posts', async (req, res) => {
	const { title, body, user_id } = req.body;
	if (!title || !body || !user_id) {
		return res
			.status(400)
			.json({ error: 'Title, body, and user_id are required' });
	}
	try {
		const connection = await pool.getConnection();
		const [result] = await connection.query(
			'INSERT INTO posts (title, body, user_id) VALUES (?, ?, ?)',
			[title, body, user_id]
		);
		connection.release();
		res.status(201).json({
			id: result.insertId,
			title,
			body,
			user_id,
			created_at: new Date(),
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// UPDATE post
app.put('/api/posts/:id', async (req, res) => {
	const { title, body } = req.body;
	try {
		const connection = await pool.getConnection();
		await connection.query(
			'UPDATE posts SET title = ?, body = ? WHERE id = ?',
			[title, body, req.params.id]
		);
		connection.release();
		res.json({ message: 'Post updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// DELETE post
app.delete('/api/posts/:id', async (req, res) => {
	try {
		const connection = await pool.getConnection();
		await connection.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
		connection.release();
		res.json({ message: 'Post deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// =============== EVENTS ENDPOINTS ===============

// GET all events
app.get('/api/events', async (req, res) => {
	try {
		const connection = await pool.getConnection();
		const [events] = await connection.query('SELECT * FROM event');
		connection.release();
		res.json(events);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// GET event by ID
app.get('/api/events/:id', async (req, res) => {
	try {
		const connection = await pool.getConnection();
		const [event] = await connection.query('SELECT * FROM event WHERE id = ?', [
			req.params.id,
		]);
		connection.release();
		if (event.length === 0) {
			return res.status(404).json({ error: 'Event not found' });
		}
		res.json(event[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// CREATE new event
app.post('/api/events', async (req, res) => {
	const { id, event_name, description, date, city_id, rating_id } = req.body;
	if (!id || !event_name || !description || !date || !city_id) {
		return res
			.status(400)
			.json({ error: 'All fields except rating_id are required' });
	}
	try {
		const connection = await pool.getConnection();
		await connection.query(
			'INSERT INTO event (id, event_name, description, date, city_id, rating_id) VALUES (?, ?, ?, ?, ?, ?)',
			[id, event_name, description, date, city_id, rating_id || null]
		);
		connection.release();
		res
			.status(201)
			.json({ id, event_name, description, date, city_id, rating_id });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// UPDATE event
app.put('/api/events/:id', async (req, res) => {
	const { event_name, description, date, city_id, rating_id } = req.body;
	try {
		const connection = await pool.getConnection();
		await connection.query(
			'UPDATE event SET event_name = ?, description = ?, date = ?, city_id = ?, rating_id = ? WHERE id = ?',
			[event_name, description, date, city_id, rating_id, req.params.id]
		);
		connection.release();
		res.json({ message: 'Event updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// DELETE event
app.delete('/api/events/:id', async (req, res) => {
	try {
		const connection = await pool.getConnection();
		await connection.query('DELETE FROM event WHERE id = ?', [req.params.id]);
		connection.release();
		res.json({ message: 'Event deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Health check
app.get('/api/health', (req, res) => {
	res.json({ status: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
	console.log(
		'📚 API endpoints available at /api/users, /api/cities, /api/posts'
	);
});
