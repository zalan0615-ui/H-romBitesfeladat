const { useState } = React;

// Minta szavak a véletlenszerű task generáláshoz
const sampleTitles = [
    "Kávéfőzés és pihenés",
    "React felület csinosítása",
    "Dokumentáció átnézése",
    "Bevásárlólista összeállítása",
    "Projekt átbeszélése",
    "Edzés a teremben"
];

function App() {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Első meglévő feladat', status: 'TODO' },
        { id: 2, title: 'Egy már kész feladat', status: 'DONE' }
    ]);
    const [title, setTitle] = useState('');
    const [filter, setFilter] = useState('MIND');

    // Új feladat hozzáadása kézzel
    const handleCreate = () => {
        if (!title.trim()) {
            alert('A cím nem lehet üres!');
            return;
        }
        setTasks([...tasks, { id: Date.now(), title: title.trim(), status: 'TODO' }]);
        setTitle('');
    };

    // Véletlenszerű feladat generálása
    const handleAddRandom = () => {
        const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
        const randomId = Math.floor(Math.random() * 100);
        setTasks([
            ...tasks, 
            { 
                id: Date.now(), 
                title: `${randomTitle} (#${randomId})`, 
                status: Math.random() > 0.5 ? 'TODO' : 'DONE' 
            }
        ]);
    };

    // Státusz váltása (TODO <-> DONE)
    const toggleStatus = (id) => {
        setTasks(tasks.map(t => 
            t.id === id ? { ...t, status: t.status === 'TODO' ? 'DONE' : 'TODO' } : t
        ));
    };

    // Törlés
    const handleDelete = (id) => {
        if (window.confirm('Biztosan törlöd ezt a feladatot?')) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    const filteredTasks = tasks.filter(t => filter === 'MIND' || t.status === filter);

    const styles = {
        container: { maxWidth: '500px', margin: '40px auto', backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontFamily: 'system-ui, sans-serif' },
        header: { textAlign: 'center', color: '#1e293b', marginBottom: '20px' },
        inputRow: { display: 'flex', gap: '8px', marginBottom: '10px' },
        input: { flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '15px' },
        btnPrimary: { padding: '10px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
        btnRandom: { width: '100%', padding: '10px', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' },
        filterRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' },
        select: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' },
        list: { listStyle: 'none', padding: 0, margin: 0 },
        item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', marginBottom: '8px', borderRadius: '8px', backgroundColor: '#f8fafc', borderLeft: '4px solid #2563eb' },
        itemDone: { borderLeftColor: '#10b981', opacity: 0.6 },
        titleText: { fontSize: '15px', color: '#334155' },
        actions: { display: 'flex', gap: '6px' },
        btnToggle: { padding: '6px 10px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
        btnDelete: { padding: '6px 10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Task Manager</h2>
            
            <div style={styles.inputRow}>
                <input 
                    style={styles.input} 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Új feladat címe..." 
                />
                <button style={styles.btnPrimary} onClick={handleCreate}>Hozzáadás</button>
            </div>

            <button style={styles.btnRandom} onClick={handleAddRandom}>🎲 Véletlenszerű task generálása</button>

            <div style={styles.filterRow}>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Szűrés:</span>
                <select style={styles.select} value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="MIND">Összes ({tasks.length})</option>
                    <option value="TODO">Függőben (TODO)</option>
                    <option value="DONE">Kész (DONE)</option>
                </select>
            </div>

            <ul style={styles.list}>
                {filteredTasks.map(t => (
                    <li key={t.id} style={{ ...styles.item, ...(t.status === 'DONE' ? styles.itemDone : {}) }}>
                        <span style={{ ...styles.titleText, textDecoration: t.status === 'DONE' ? 'line-through' : 'none' }}>
                            {t.title}
                        </span>
                        <div style={styles.actions}>
                            <button style={styles.btnToggle} onClick={() => toggleStatus(t.id)}>
                                {t.status === 'TODO' ? '✔ Kész' : '↩ Vissza'}
                            </button>
                            <button style={styles.btnDelete} onClick={() => handleDelete(t.id)}>Törlés</button>
                        </div>
                    </li>
                ))}
                {filteredTasks.length === 0 && (
                    <li style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>Nincs megjeleníthető feladat.</li>
                )}
            </ul>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);