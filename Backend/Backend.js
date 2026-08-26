const mysql = require('mysql2/promise');

// Adatbázis kapcsolat létrehozása (Pool használata profi környezetben)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'csapatomcucataskmanagaer'
});

// ==========================================
// FELHASZNÁLÓK (USERS) ELJÁRÁSAI
// ==========================================

async function createUser(username, email, password) {
    const [result] = await pool.query('CALL sp_create_user(?, ?, ?)', [username, email, password]);
    return result;
}

async function getAllUsers() {
    const [result] = await pool.query('CALL sp_get_all_users()');
    return result[0]; // A result[0] tartalmazza a tényleges adatokat
}

async function getUserById(id) {
    const [result] = await pool.query('CALL sp_get_user_by_id(?)', [id]);
    return result[0];
}

// ==========================================
// FELADATOK (TASKS) ELJÁRÁSAI
// ==========================================

async function createTask(title, description, status, dueDate, userId) {
    const [result] = await pool.query('CALL sp_create_task(?, ?, ?, ?, ?)', [title, description, status, dueDate, userId]);
    return result;
}

async function getTaskById(id) {
    const [result] = await pool.query('CALL sp_get_task_by_id(?)', [id]);
    return result[0];
}

async function updateTask(id, title, description, status, dueDate) {
    const [result] = await pool.query('CALL sp_update_task(?, ?, ?, ?, ?)', [id, title, description, status, dueDate]);
    return result;
}

async function deleteTask(id) {
    const [result] = await pool.query('CALL sp_delete_task(?)', [id]);
    return result;
}

// ==========================================
// ÚJ ELJÁRÁSOK HELYE
// Ide tudsz majd beszúrni új függvényeket, ha a jövőben szükséged lesz rá!
// Például: async function myNewProcedure() { ... }
// ==========================================


// Itt "exportáljuk" a függvényeket, hogy más fájlok (pl. a frontendnek szánt API) látni tudja őket
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
};