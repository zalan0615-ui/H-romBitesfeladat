const express = require('express');
const cors = require('cors');
const db = require('./Backend.js'); // A te fájlod!

const app = express();
app.use(cors());
app.use(express.json());

// Új feladat létrehozása
app.post('/api/tasks', async (req, res) => {
    try {
        // Alapértelmezetten az 1-es usert használjuk
        await db.createTask(req.body.title, req.body.description, req.body.status, req.body.dueDate, 1);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Feladat törlése
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await db.deleteTask(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Szerver fut a 3000-es porton'));