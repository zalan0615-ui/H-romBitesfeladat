const express = require('express');
const cors = require('cors');
const db = require('./Backend.js');

const app = express();
app.use(cors());
app.use(express.json());

// --- USERS ENDPOINTS ---

// Összes user lekérése
app.get('/api/users', async (req, res) => {
    try {
        const users = await db.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Új user létrehozása
app.post('/api/users', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const result = await db.createUser(username, email, password);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- TASKS ENDPOINTS ---

// Összes task lekérése
app.get('/api/tasks', async (req, res) => {
    try {
        // Feltételezzük, hogy van sp_get_all_tasks eljárás az adatbázisban
        const [result] = await db.getAllUsers(); // Vagy a megfelelő eljárásod
        // Az alábbi hívás lekéri a taskokat a pool segítségével
        const mysql = require('mysql2/promise');
        const pool = mysql.createPool({
            host: 'localhost', user: 'root', password: '', database: 'csapatomcucataskmanagaer'
        });
        const [tasks] = await pool.query('CALL sp_get_all_tasks()');
        res.json(tasks[0] || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Új task létrehozása
app.post('/api/tasks', async (req, res) => {
    const { title, description, status, dueDate, userId } = req.body;
    try {
        const result = await db.createTask(title, description, status, dueDate, userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Task módosítása
app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;
    try {
        const result = await db.updateTask(id, title, description, status, dueDate);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Task törlése
app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.deleteTask(id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Szerver indítása a 3000-es porton
app.listen(3000, () => {
    console.log('A szerver fut a http://localhost:3000 címen!');
});