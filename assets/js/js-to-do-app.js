// ===== DOM-Elemente =====
const todoInput = document.getElementById("todoInput");
const todoPriority = document.getElementById("todoPriority");
const todoSearch = document.getElementById("todoSearch");
const searchClear = document.getElementById("searchClear");
const addTodoBtn = document.getElementById("addTodo");
const todoList = document.getElementById("todoList");
const todoStats = document.getElementById("todoStats");
const resetBtn = document.getElementById("resetTodos");
const filterAll = document.getElementById("filterAll");
const filterOpen = document.getElementById("filterOpen");
const filterDone = document.getElementById("filterDone");
// ===== NEUE DOM-Elemente =====
const filterPriority = document.getElementById("filterPriority");
const tagFilterContainer = document.getElementById("tagFilterContainer");

// ===== State =====
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "open"; // "all", "open", "done" - GEÄNDERT: Standard ist jetzt "open"
let searchQuery = "";
// ===== NEUER State =====
let currentPriorityFilter = "all"; // "all", "high", "medium", "low"
let currentTagFilter = null; // null oder Tag-String (z.B. "arbeit")

// ===== Prioritäts-Sortierung =====
const priorityOrder = { high: 1, medium: 2, low: 3 };
const priorityLabels = { high: "Dringend", medium: "Wichtig", low: "Normal" };

// ===== Drag & Drop State =====
let draggedItem = null;
let draggedTodoId = null;

// ===== Tags aus Text extrahieren =====
function extractTags(text) {
    const tagRegex = /#(\w+)/g;
    const tags = [];
    let match;
    while ((match = tagRegex.exec(text)) !== null) {
        tags.push(match[1].toLowerCase());
    }
    return [...new Set(tags)]; // Duplikate entfernen
}

// ===== Text ohne Tags (für Anzeige) =====
function getTextWithoutTags(text) {
    return text.replace(/#\w+/g, "").trim().replace(/\s+/g, " ");
}

// ===== Alle verwendeten Tags sammeln =====
function getAllTags() {
    const allTags = new Set();
    todos.forEach(todo => {
        const tags = extractTags(todo.text);
        tags.forEach(tag => allTags.add(tag));
    });
    return [...allTags].sort();
}

// ===== Tag-Filter-Buttons rendern =====
function renderTagFilters() {
    if (!tagFilterContainer) return;
    
    tagFilterContainer.innerHTML = "";
    const allTags = getAllTags();
    
    if (allTags.length === 0) {
        tagFilterContainer.style.display = "none";
        return;
    }
    
    tagFilterContainer.style.display = "flex";
    
    // "Alle Tags" Button
    const allBtn = document.createElement("button");
    allBtn.className = "tag-filter-btn" + (currentTagFilter === null ? " active" : "");
    allBtn.textContent = "Alle";
    allBtn.onclick = () => {
        currentTagFilter = null;
        renderTagFilters();
        renderTodos();
    };
    tagFilterContainer.appendChild(allBtn);
    
    // Button für jeden Tag
    allTags.forEach(tag => {
        const btn = document.createElement("button");
        btn.className = "tag-filter-btn" + (currentTagFilter === tag ? " active" : "");
        btn.textContent = "#" + tag;
        btn.onclick = () => {
            currentTagFilter = tag;
            renderTagFilters();
            renderTodos();
        };
        tagFilterContainer.appendChild(btn);
    });
}

// ===== Aufgaben rendern =====
function renderTodos() {
    todoList.innerHTML = "";

    // Filtern nach Status
    let filteredTodos = todos.filter(todo => {
        if (currentFilter === "done") return todo.done;
        if (currentFilter === "open") return !todo.done;
        return true; // "all"
    });

    // ===== NEU: Filtern nach Priorität =====
    if (currentPriorityFilter !== "all") {
        filteredTodos = filteredTodos.filter(todo => 
            todo.priority === currentPriorityFilter
        );
    }

    // ===== NEU: Filtern nach Tag =====
    if (currentTagFilter) {
        filteredTodos = filteredTodos.filter(todo => {
            const tags = extractTags(todo.text);
            return tags.includes(currentTagFilter);
        });
    }

    // Filtern nach Suchbegriff
    if (searchQuery) {
        filteredTodos = filteredTodos.filter(todo =>
            todo.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Sortieren: Erst nach Priorität, dann nach manueller Reihenfolge (sortOrder)
    filteredTodos.sort((a, b) => {
        const prioA = priorityOrder[a.priority] || 2;
        const prioB = priorityOrder[b.priority] || 2;
        if (prioA !== prioB) return prioA - prioB;
        // Innerhalb gleicher Priorität: nach sortOrder sortieren
        const orderA = a.sortOrder !== undefined ? a.sortOrder : Infinity;
        const orderB = b.sortOrder !== undefined ? b.sortOrder : Infinity;
        return orderA - orderB;
    });

    // Leere Liste anzeigen
    if (filteredTodos.length === 0) {
        const emptyMsg = document.createElement("li");
        emptyMsg.className = "no-results";
        if (searchQuery) {
            emptyMsg.textContent = `Keine Aufgaben gefunden für "${searchQuery}"`;
        } else if (currentTagFilter) {
            emptyMsg.textContent = `Keine Aufgaben mit #${currentTagFilter}`;
        } else {
            emptyMsg.textContent = currentFilter === "all"
                ? "Keine Aufgaben vorhanden."
                : `Keine ${currentFilter === "done" ? "erledigten" : "offenen"} Aufgaben.`;
        }
        todoList.appendChild(emptyMsg);
        updateStats();
        renderTagFilters();
        return;
    }

    // Aufgaben durchgehen (mit Original-Index für Aktionen)
    filteredTodos.forEach(todo => {
        const originalIndex = todos.indexOf(todo);

        const li = document.createElement("li");
        li.className = `priority-${todo.priority || "medium"}`;
        
        // ===== NEU: Drag & Drop Attribute =====
        li.draggable = true;
        li.dataset.todoId = todo.id; // ID wird durch Migration garantiert
        li.dataset.priority = todo.priority || "medium";

        // Content-Bereich (Text + Meta-Infos)
        const content = document.createElement("div");
        content.className = "todo-content";

        // Aufgabentext (ohne Tags)
        const span = document.createElement("span");
        span.className = "todo-text" + (todo.done ? " done" : "");
        
        const displayText = getTextWithoutTags(todo.text);

        // Suchbegriff hervorheben (sicher!)
        if (searchQuery && displayText.toLowerCase().includes(searchQuery.toLowerCase())) {
            const regex = new RegExp(`(${escapeRegex(searchQuery)})`, "gi");
            const parts = displayText.split(regex);
            parts.forEach(part => {
                if (part.toLowerCase() === searchQuery.toLowerCase()) {
                    const mark = document.createElement("mark");
                    mark.className = "search-highlight";
                    mark.textContent = part;
                    span.appendChild(mark);
                } else {
                    span.appendChild(document.createTextNode(part));
                }
            });
        } else {
            span.textContent = displayText;
        }

        span.onclick = () => toggleDone(originalIndex);
        content.appendChild(span);

        // ===== NEU: Tags als Badges anzeigen =====
        const tags = extractTags(todo.text);
        if (tags.length > 0) {
            const tagsContainer = document.createElement("div");
            tagsContainer.className = "todo-tags";
            tags.forEach(tag => {
                const tagBadge = document.createElement("span");
                tagBadge.className = "todo-tag-badge" + (currentTagFilter === tag ? " active" : "");
                tagBadge.textContent = "#" + tag;
                tagBadge.onclick = (e) => {
                    e.stopPropagation();
                    currentTagFilter = currentTagFilter === tag ? null : tag;
                    renderTagFilters();
                    renderTodos();
                };
                tagsContainer.appendChild(tagBadge);
            });
            content.appendChild(tagsContainer);
        }

        // Meta-Infos (Datum + Priorität)
        const meta = document.createElement("div");
        meta.className = "todo-meta";

        if (todo.createdAt) {
            const dateSpan = document.createElement("span");
            dateSpan.textContent = "Erstellt: " + todo.createdAt;
            meta.appendChild(dateSpan);
        }

        // Prioritäts-Badge
        const prioBadge = document.createElement("span");
        prioBadge.className = `todo-priority-badge ${todo.priority || "medium"}`;
        prioBadge.textContent = priorityLabels[todo.priority] || "Wichtig";
        meta.appendChild(prioBadge);

        content.appendChild(meta);
        li.appendChild(content);

        // Aktions-Buttons
        const actions = document.createElement("div");
        actions.className = "todo-actions";

        // ===== NEU: Drag-Handle =====
        const dragHandle = document.createElement("span");
        dragHandle.className = "todo-drag-handle";
        dragHandle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="15" viewBox="0 0 12 15" fill="currentColor" aria-hidden="true">
            <circle cx="2.5" cy="2" r="1.5"/>
            <circle cx="9.5" cy="2" r="1.5"/>
            <circle cx="2.5" cy="7.5" r="1.5"/>
            <circle cx="9.5" cy="7.5" r="1.5"/>
            <circle cx="2.5" cy="13" r="1.5"/>
            <circle cx="9.5" cy="13" r="1.5"/>
        </svg>`;
        dragHandle.title = "Ziehen zum Sortieren";
        actions.appendChild(dragHandle);

        // Bearbeiten-Button
        const editBtn = document.createElement("button");
        editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="var(--text-primary)" aria-hidden="true"><path d="M9.32,2.814c-.046-.045-.119-.045-.165,0L1.52,10.449c-.076.076-.076.2,0,.276l2.824,2.824c.076.076.2.076.276,0l7.635-7.635c.045-.046.045-.119,0-.165l-2.935-2.936Z" />
      <path d="M14.83,2.184l-1.945-1.945c-.319-.319-.836-.319-1.155,0l-1.671,1.671c-.115.114-.115.3,0,.415l2.686,2.686c.115.115.3.115.415,0l1.67-1.67c.319-.319.319-.836,0-1.155Z" />
      <path d="M1.023,11.39c-.102-.102-.276-.062-.323.075L.007,14.694c-.049.228.154.43.382.38l3.216-.705c.137-.047.177-.221.075-.323l-2.657-2.657Z" /> </svg>`;
        // editBtn.textContent = "✏️";
        editBtn.title = "Bearbeiten";
        editBtn.onclick = () => editTodo(originalIndex);
        actions.appendChild(editBtn);

        // Löschen-Button
        const delBtn = document.createElement("button");
        delBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="var(--color-error)" aria-hidden="true"><path d="M14.516,12.177c.646.646.646,1.693,0,2.338h0c-.646.646-1.693.646-2.339,0l-4.342-4.342c-.185-.185-.484-.185-.669,0l-4.342,4.342c-.646-.646-1.693.646-2.338,0h0c-.646-.646-.646-1.693,0-2.339l4.343-4.342c.185-.185.185-.484,0-.669L.484,2.823c-.646-.646-.646-1.693,0-2.338h0c.646-.646,1.693-.646,2.338,0l4.342,4.342c.185.185.484.185.669,0L12.177.484c.646-.646,1.693-.646,2.339,0h0c.646.646.646,1.693,0,2.338l-4.342,4.343c-.185.185-.185.484,0,.669l4.342,4.342Z"/></svg>`;
        // delBtn.textContent = "❌";
        delBtn.title = "Löschen";
        delBtn.onclick = () => deleteTodo(originalIndex);
        actions.appendChild(delBtn);

        li.appendChild(actions);
        
        // ===== NEU: Drag & Drop Event Listeners =====
        li.addEventListener("dragstart", handleDragStart);
        li.addEventListener("dragend", handleDragEnd);
        li.addEventListener("dragover", handleDragOver);
        li.addEventListener("drop", handleDrop);
        li.addEventListener("dragenter", handleDragEnter);
        li.addEventListener("dragleave", handleDragLeave);
        
        todoList.appendChild(li);
    });

    // Statistik und Tag-Filter aktualisieren
    updateStats();
    renderTagFilters();
}

// ===== Drag & Drop Handlers =====
function handleDragStart(e) {
    draggedItem = this;
    draggedTodoId = this.dataset.todoId;
    this.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", draggedTodoId);
}

function handleDragEnd(e) {
    this.classList.remove("dragging");
    // Alle drag-over Klassen entfernen
    document.querySelectorAll(".drag-over").forEach(el => {
        el.classList.remove("drag-over");
    });
    draggedItem = null;
    draggedTodoId = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}

function handleDragEnter(e) {
    e.preventDefault();
    // Nur markieren wenn gleiche Priorität
    if (this !== draggedItem && this.dataset.priority === draggedItem?.dataset.priority) {
        this.classList.add("drag-over");
    }
}

function handleDragLeave(e) {
    this.classList.remove("drag-over");
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove("drag-over");
    
    if (!draggedItem || this === draggedItem) return;
    
    // Nur innerhalb gleicher Priorität verschieben
    if (this.dataset.priority !== draggedItem.dataset.priority) {
        return;
    }
    
    const draggedId = parseInt(draggedTodoId);
    const targetId = parseInt(this.dataset.todoId);
    
    // Finde die Todos über ihre ID (nicht Index!)
    const draggedTodo = todos.find(t => t.id === draggedId);
    const targetTodo = todos.find(t => t.id === targetId);
    
    if (!draggedTodo || !targetTodo) return;
    
    // Alle Todos der gleichen Priorität holen (sortiert nach aktuellem sortOrder)
    const samePrioTodos = todos
        .filter(t => t.priority === draggedTodo.priority)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    
    // Aktuelle Positionen in dieser Gruppe ermitteln
    const draggedPos = samePrioTodos.findIndex(t => t.id === draggedId);
    const targetPos = samePrioTodos.findIndex(t => t.id === targetId);
    
    if (draggedPos === -1 || targetPos === -1) return;
    
    // Element aus der Liste entfernen und an neuer Position einfügen
    samePrioTodos.splice(draggedPos, 1);
    samePrioTodos.splice(targetPos, 0, draggedTodo);
    
    // Neue sortOrder für alle Todos dieser Priorität vergeben
    samePrioTodos.forEach((todo, idx) => {
        todo.sortOrder = idx;
    });
    
    saveTodos();
}

// ===== Regex-Zeichen escapen (für sichere Suche) =====
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ===== Statistik aktualisieren =====
function updateStats() {
    const total = todos.length;
    const done = todos.filter(t => t.done).length;
    const open = total - done;
    const highPrio = todos.filter(t => t.priority === "high" && !t.done).length;

    if (total === 0) {
        todoStats.textContent = "Füge deine erste Aufgabe hinzu!";
    } else {
        let statsText = `${done} von ${total} erledigt (${open} offen)`;
        if (highPrio > 0) {
            statsText += ` • ${highPrio} dringend`;
        }
        todoStats.textContent = statsText;
    }
}

// ===== Neue Aufgabe hinzufügen =====
function addNewTodo() {
    const text = todoInput.value.trim();
    if (text === "") return;

    // Höchste sortOrder für diese Priorität finden
    const priority = todoPriority.value;
    const samePrioTodos = todos.filter(t => t.priority === priority);
    const maxSortOrder = samePrioTodos.reduce((max, t) => 
        Math.max(max, t.sortOrder !== undefined ? t.sortOrder : -1), -1);

    todos.push({
        id: Date.now(), // Eindeutige ID für Drag & Drop
        text: text,
        done: false,
        priority: priority,
        createdAt: new Date().toLocaleDateString("de-DE"),
        sortOrder: maxSortOrder + 1
    });

    todoInput.value = "";
    todoPriority.value = "low"; // Zurücksetzen auf Standard
    saveTodos();
}

// ===== Aufgabe als erledigt markieren =====
function toggleDone(index) {
    todos[index].done = !todos[index].done;
    saveTodos();
}

// ===== Aufgabe bearbeiten (Modal) =====
function editTodo(index) {
    const todo = todos[index];

    // Modal erstellen
    const overlay = document.createElement("div");
    overlay.className = "todo-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "todo-modal";

    modal.innerHTML = `
        <h4>Aufgabe bearbeiten</h4>
        <div class="todo-modal-field">
            <label for="editText">Aufgabe:</label>
            <input type="text" id="editText" value="">
        </div>
        <div class="todo-modal-field">
            <label for="editPriority">Priorität:</label>
            <select id="editPriority">
                <option value="low">🟢 Normal</option>
                <option value="medium">🟡 Wichtig</option>
                <option value="high">🔴 Dringend</option>
            </select>
        </div>
        <p class="todo-modal-hint">Tipp: Füge Tags mit # hinzu, z.B. #arbeit #privat</p>
        <div class="todo-modal-buttons">
            <button type="button" class="todo-modal-cancel">Abbrechen</button>
            <button type="button" class="todo-modal-save">Speichern</button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Werte setzen (sicher via DOM, nicht innerHTML!)
    const editText = modal.querySelector("#editText");
    const editPriority = modal.querySelector("#editPriority");
    editText.value = todo.text;
    editPriority.value = todo.priority || "medium";

    // Fokus auf Textfeld
    editText.focus();
    editText.select();

    // Event Handlers
    const closeModal = () => {
        document.body.removeChild(overlay);
    };

    const saveChanges = () => {
        const newText = editText.value.trim();
        if (newText !== "") {
            const oldPriority = todos[index].priority;
            todos[index].text = newText;
            todos[index].priority = editPriority.value;
            
            // Wenn Priorität geändert, sortOrder neu berechnen
            if (oldPriority !== editPriority.value) {
                const samePrioTodos = todos.filter(t => t.priority === editPriority.value);
                const maxSortOrder = samePrioTodos.reduce((max, t) => 
                    Math.max(max, t.sortOrder !== undefined ? t.sortOrder : -1), -1);
                todos[index].sortOrder = maxSortOrder + 1;
            }
            
            saveTodos();
        }
        closeModal();
    };

    modal.querySelector(".todo-modal-cancel").onclick = closeModal;
    modal.querySelector(".todo-modal-save").onclick = saveChanges;

    // Enter zum Speichern, Escape zum Schließen
    editText.addEventListener("keydown", e => {
        if (e.key === "Enter") saveChanges();
        if (e.key === "Escape") closeModal();
    });

    // Klick auf Overlay schließt Modal
    overlay.addEventListener("click", e => {
        if (e.target === overlay) closeModal();
    });
}

// ===== Aufgabe löschen =====
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
}

// ===== Alle Aufgaben löschen =====
function clearAllTodos() {
    if (confirm("Wirklich alle Aufgaben löschen?")) {
        localStorage.removeItem("todos");
        todos = [];
        currentTagFilter = null;
        renderTodos();
    }
}

// ===== Filter setzen =====
function setFilter(filter) {
    currentFilter = filter;

    // Button-Styles aktualisieren
    filterAll.classList.toggle("active", filter === "all");
    filterOpen.classList.toggle("active", filter === "open");
    filterDone.classList.toggle("active", filter === "done");

    renderTodos();
}

// ===== NEU: Prioritäts-Filter setzen =====
function setPriorityFilter(priority) {
    currentPriorityFilter = priority;
    renderTodos();
}

// ===== Speichern =====
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
}

// ===== Event Listeners =====
addTodoBtn.addEventListener("click", addNewTodo);
todoInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addNewTodo();
});
resetBtn.addEventListener("click", clearAllTodos);
filterAll.addEventListener("click", () => setFilter("all"));
filterOpen.addEventListener("click", () => setFilter("open"));
filterDone.addEventListener("click", () => setFilter("done"));

// ===== NEU: Prioritäts-Filter Event Listener =====
if (filterPriority) {
    filterPriority.addEventListener("change", e => {
        setPriorityFilter(e.target.value);
    });
}

// Suche mit Debounce (wartet 300ms nach Tippen)
let searchTimeout;
todoSearch.addEventListener("input", e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchQuery = e.target.value.trim();
        renderTodos();
    }, 300);

    // X-Button ein-/ausblenden
    searchClear.classList.toggle("visible", e.target.value.length > 0);
});

// Suche leeren
searchClear.addEventListener("click", () => {
    todoSearch.value = "";
    searchQuery = "";
    searchClear.classList.remove("visible");
    renderTodos();
    todoSearch.focus();
});

// ===== Migration: Bestehende Todos um ID und sortOrder erweitern =====
function migrateTodos() {
    let needsSave = false;
    todos.forEach((todo, index) => {
        if (!todo.id) {
            todo.id = Date.now() + index;
            needsSave = true;
        }
        if (todo.sortOrder === undefined) {
            todo.sortOrder = index;
            needsSave = true;
        }
    });
    if (needsSave) {
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

// ===== Initialisierung =====
migrateTodos();
renderTodos();