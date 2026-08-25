const mysql = require('mysql2');

// 1. Adatbázis kapcsolat konfigurálása
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // XAMPP alapértelmezett felhasználó
    password: '',      // XAMPP alapértelmezett jelszó (üres)
    database: 'csapatomcucataskmanagaer' // A pontos adatbázisnév a phpMyAdminból
});

// 2. Csatlakozás a MySQL-hez
connection.connect((err) => {
    if (err) {
        console.error('Hiba a csatlakozáskor: ', err.message);
        return;
    }
    console.log('Sikeresen csatlakozva a MySQL adatbázishoz!');

    // 3. Egy tárolt eljárás meghívása tesztelés céljából
    // A CALL paranccsal hajtjuk végre az eljárásokat
    const testQuery = 'CALL sp_get_all_tasks()';

    connection.query(testQuery, (error, results) => {
        if (error) {
            console.error('Hiba az eljárás futtatásakor: ', error.message);
        } else {
            console.log('Az eljárás sikeresen lefutott!');
            console.log('Visszakapott adatok: ', results[0]);
        }

        // 4. A kapcsolat lezárása
        // Ezt MINDIG a lekérdezés (query) belsejében kell megtenni, 
        // miután az adatok már megérkeztek!
        connection.end((err) => {
            if (err) {
                console.error('Hiba a kapcsolat lezárásakor:', err.message);
            } else {
                console.log('Adatbázis kapcsolat sikeresen lezárva.');
            }
        });
    });
});