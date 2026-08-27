const API_URL = 'http://localhost:3000/api'; // Az Express backend címe

let currentUser = null; 
let tasks = [];

window.onload = () => {
    const savedUser = localStorage.getItem('taskManagerUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showApp();
        loadTasks();
    } else {
        showLogin();
    }
};

// --- BEJELENTKEZÉS ÉS KIJELENTKEZÉS ---

async function login() {
    const usernameInput = document.getElementById('username-input').value.trim();
    if (!usernameInput) {
        alert('Kérlek, adj meg egy felhasználónevet!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        
        let user = users.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());

        // Ha még nem létezik a user az adatbázisban, létrehozzuk
        if (!user) {
            const createRes = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: usernameInput,
                    email: `${usernameInput}@example.com`,
                    password: 'defaultPassword'
                })
            });
            const newUserRes = await createRes.json();
            user = { id: newUserRes.insertId || newUserRes.id, username: usernameInput };
        }

        currentUser = user;
        localStorage.setItem('taskManagerUser', JSON.stringify(currentUser));
        showApp();
        loadTasks();
    } catch (error) {
        console.error('Hiba a bejelentkezésnél:', error);
        alert('Nem sikerült csatlakozni az adatbázis backendhez!');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('taskManagerUser');
    showLogin();
}

function showLogin() {
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('app-section').classList.add('hidden');
    document.getElementById('username-input').value = '';
}

function showApp() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    document.getElementById('greeting').innerText = `Szia, ${currentUser.username}!`;
}

// --- FELADATOK KEZELÉSE ADATBÁZISSAL ---

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        const allTasks = await response.json();
        
        // Szűrés a bejelentkezett felhasználó feladataira (megengedőbb típuskezeléssel)
        tasks = allTasks.filter(t => t.user_id == currentUser.id);
        renderTasks();
    } catch (error) {
        console.error('Hiba a feladatok betöltésekor:', error);
    }
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<li style="justify-content: center; color: #888;">Nincs még elmentett feladatod.</li>';
        return;
    }

    tasks.forEach((task) => {
        const li = document.createElement('li');

        const infoDiv = document.createElement('div');
        infoDiv.className = 'task-info';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'task-title';
        titleSpan.innerText = task.title;

        const metaSpan = document.createElement('span');
        metaSpan.className = 'task-meta';
        
        const formattedDate = task.due_date ? new Date(task.due_date).toLocaleDateString('hu-HU') : 'Nincs határidő';
        
        let statusText = task.status;
        if (task.status === 'TODO') statusText = 'Elvégzendő';
        if (task.status === 'IN_PROGRESS') statusText = 'Folyamatban';
        if (task.status === 'DONE') statusText = 'Kész';

        metaSpan.innerHTML = `<strong>[${statusText}]</strong> ${task.description || ''} <br><small>Határidő: ${formattedDate}</small>`;

        infoDiv.appendChild(titleSpan);
        infoDiv.appendChild(metaSpan);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';

        const editBtn = document.createElement('button');
        editBtn.innerText = 'Módosít';
        editBtn.className = 'edit';
        editBtn.onclick = () => openEditModal(task);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Töröl';
        deleteBtn.className = 'danger';
        deleteBtn.onclick = () => deleteTask(task.id);

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(infoDiv);
        li.appendChild(actionsDiv);

        taskList.appendChild(li);
    });
}

async function addTask() {
    const titleInput = document.getElementById('new-task-title');
    const descInput = document.getElementById('new-task-desc');
    const dateInput = document.getElementById('new-task-date');
    const statusSelect = document.getElementById('new-task-status');

    const title = titleInput.value.trim();
    if (!title) {
        alert('A feladat címe kötelező!');
        return;
    }

    try {
        await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                description: descInput.value.trim(),
                status: statusSelect.value,
                dueDate: dateInput.value || null,
                userId: currentUser.id
            })
        });

        titleInput.value = '';
        descInput.value = '';
        dateInput.value = '';
        loadTasks();
    } catch (error) {
        console.error('Hiba a hozzáadáskor:', error);
    }
}

// --- MÓDOSÍTÁS MODAL FUNKCIÓK ---

function openEditModal(task) {
    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-title').value = task.title || '';
    document.getElementById('edit-task-desc').value = task.description || '';
    document.getElementById('edit-task-date').value = task.due_date ? task.due_date.split('T')[0] : '';
    document.getElementById('edit-task-status').value = task.status || 'TODO';
    
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

async function saveTaskEdit() {
    const id = document.getElementById('edit-task-id').value;
    const title = document.getElementById('edit-task-title').value.trim();
    const description = document.getElementById('edit-task-desc').value.trim();
    const dueDate = document.getElementById('edit-task-date').value || null;
    const status = document.getElementById('edit-task-status').value;

    if (!title) {
        alert('A feladat címe nem lehet üres!');
        return;
    }

    try {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                description: description,
                status: status,
                dueDate: dueDate
            })
        });

        closeEditModal();
        loadTasks();
    } catch (error) {
        console.error('Hiba a módosításkor:', error);
    }
}

async function deleteTask(id) {
    if (!confirm('Biztosan törlöd ezt a feladatot az adatbázisból?')) return;

    try {
        await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
        loadTasks();
    } catch (error) {
        console.error('Hiba a törléskor:', error);
    }
}