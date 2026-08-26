// Beimportáljuk a függvényeket a Backend.js-ből
const db = require('./Backend.js');

async function runTests() {
    try {
        console.log('--- TESZTELÉS INDÍTÁSA ---\n');

        // 1. Összes felhasználó lekérése teszt
        console.log('Lekérdezzük az összes felhasználót...');
        const users = await db.getAllUsers();
        console.log('Eredmény:', users, '\n');

        // 2. Új task létrehozása teszt
        // Figyelem: feltételezzük, hogy az 1-es ID-jú user már létezik
        console.log('Létrehozunk egy új feladatot az 1-es usernek...');
        await db.createTask('Új feladat teszt.js-ből', 'Működik a moduláris kód', 'TODO', '2026-10-01', 1);
        console.log('Sikeres létrehozás!\n');

        console.log('--- MINDEN TESZT LEFUTOTT ---');

    } catch (error) {
        console.error('Hiba történt a teszt során:', error.message);
    } finally {
        // A teszt végén manuálisan kilépünk a folyamatból, hogy ne ragadjon be a terminál
        process.exit(); 
    }
}

// Teszt futtatása
runTests();