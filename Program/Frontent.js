// Globális változók
let currentUser = null;
let tasks = [];

// Amikor betölt az oldal, ellenőrizzük, hogy be van-e lépve valaki
window.onload = () => {
    const savedUser = localStorage.getItem('taskManagerUser');
    if (savedUser) {
        currentUser = savedUser;
        loadTasks();
        showApp();
    } else {
        showLogin();
    }
};

// --- BEJELENTKEZÉS ÉS KIJELENTKEZÉS ---

function login() {
    const usernameInput = document.getElementById('username-input').value.trim();
    if (usernameInput) {
        currentUser = usernameInput;
        localStorage.setItem('taskManagerUser', currentUser); // Felhasználó mentése
        loadTasks();
        showApp();
    } else {
        alert('Kérlek, adj meg egy felhasználónevet!');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('taskManagerUser'); // Felhasználó törlése a tárhelyről
    showLogin();
}

// --- FELÜLET VÁLTÁSA ---

function showLogin() {
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('app-section').classList.add('hidden');
    document.getElementById('username-input').value = '';
}

function showApp() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    document.getElementById('greeting').innerText = `Szia, ${currentUser}!`;
    renderTasks();
}

// --- FELADATOK KEZELÉSE ---

// Feladatok betöltése a helyi tárhelyből (felhasználóspecifikus)
function loadTasks() {
    const savedTasks = localStorage.getItem(`tasks_${currentUser}`);
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
}

// Feladatok mentése a helyi tárhelyre
function saveTasks() {
    localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
}

// Feladatok megjelenítése a képernyőn
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Lista ürítése újra-rajzolás előtt

    tasks.forEach((task, index) => {
        const li = document.createElement('li');

        // Feladat szövege
        const taskText = document.createElement('span');
        taskText.innerText = task;

        // Gombok (Szerkesztés és Törlés) tárolója
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';

        // Szerkesztés gomb
        const editBtn = document.createElement('button');
        editBtn.innerText = 'Módosít';
        editBtn.className = 'edit';
        editBtn.onclick = () => editTask(index);

        // Törlés gomb
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Töröl';
        deleteBtn.className = 'danger';
        deleteBtn.onclick = () => deleteTask(index);

        // Elemek összerakása
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        li.appendChild(taskText);
        li.appendChild(actionsDiv);
        
        taskList.appendChild(li);
    });
}

// Új feladat hozzáadása
function addTask() {
    const input = document.getElementById('new-task-input');
    const newTask = input.value.trim();
    
    if (newTask) {
        tasks.push(newTask); // Hozzáadás a tömbhöz
        saveTasks();         // Mentés
        input.value = '';    // Mező kiürítése
        renderTasks();       // Lista frissítése
    } else {
        alert('A feladat nem lehet üres!');
    }
}

// Feladat módosítása
function editTask(index) {
    // Egy egyszerű felugró ablakot (prompt) használunk a módosításra
    const updatedTask = prompt('Módosítsd a feladatot:', tasks[index]);
    
    // Ellenőrizzük, hogy nem nyomott-e Mégsem-et, és nem üres-e az új szöveg
    if (updatedTask !== null && updatedTask.trim() !== '') {
        tasks[index] = updatedTask.trim();
        saveTasks();
        renderTasks();
    }
}

// Feladat törlése
function deleteTask(index) {
    if (confirm('Biztosan törölni szeretnéd ezt a feladatot?')) {
        tasks.splice(index, 1); // Elem eltávolítása a tömbből
        saveTasks();
        renderTasks();
    }
}