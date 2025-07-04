// ToDoリスト管理
const todoList = document.getElementById('todo-list');
const newTodoInput = document.getElementById('new-todo-input');
const addTodoSubmit = document.getElementById('add-todo-submit');

// 優先度の設定
const PRIORITIES = {
    high: { name: '高', color: 'text-red-600', bgColor: 'bg-red-100', icon: 'fas fa-exclamation-triangle' },
    medium: { name: '中', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: 'fas fa-minus' },
    low: { name: '低', color: 'text-green-600', bgColor: 'bg-green-100', icon: 'fas fa-arrow-down' }
};

let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 優先度でソート
function sortTodosByPriority() {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    todos.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium'];
    });
}

export function renderTodos() {
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'text-gray-500 text-sm italic';
        emptyMessage.textContent = 'No tasks yet. Add your first task!';
        todoList.appendChild(emptyMessage);
        return;
    }
    
    // 優先度でソート
    sortTodosByPriority();
    
    todos.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.className = 'flex items-center bg-white bg-opacity-70 hover:bg-opacity-90 rounded px-3 py-2 mb-2 transition-all duration-200';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'mr-3';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => {
            todo.completed = checkbox.checked;
            saveTodos();
            renderTodos();
        });
        
        // 優先度アイコン
        const priority = todo.priority || 'medium';
        const priorityInfo = PRIORITIES[priority];
        const priorityIcon = document.createElement('i');
        priorityIcon.className = `${priorityInfo.icon} ${priorityInfo.color} mr-2 text-sm`;
        priorityIcon.title = `優先度: ${priorityInfo.name}`;
        
        const todoText = document.createElement('span');
        todoText.className = 'flex-1 text-sm';
        todoText.textContent = todo.text;
        if (todo.completed) {
            todoText.classList.add('line-through', 'text-gray-500');
        }
        
        // 優先度変更ボタン
        const priorityBtn = document.createElement('button');
        priorityBtn.className = 'text-gray-500 hover:text-gray-700 text-xs p-1 mr-1';
        priorityBtn.innerHTML = '<i class="fas fa-flag"></i>';
        priorityBtn.title = '優先度を変更';
        priorityBtn.addEventListener('click', () => {
            changeTodoPriority(index);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'text-red-500 hover:text-red-700 text-xs p-1';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'タスクを削除';
        deleteBtn.addEventListener('click', () => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
            
            if (window.showToast) {
                window.showToast.success('タスクを削除しました');
            }
        });
        
        todoItem.appendChild(checkbox);
        todoItem.appendChild(priorityIcon);
        todoItem.appendChild(todoText);
        todoItem.appendChild(priorityBtn);
        todoItem.appendChild(deleteBtn);
        todoList.appendChild(todoItem);
    });
}

// 優先度変更モーダルを表示
function changeTodoPriority(todoIndex) {
    const modal = document.getElementById('priority-modal');
    if (!modal) return;
    
    const priorityList = modal.querySelector('#priority-list');
    priorityList.innerHTML = '';
    
    Object.entries(PRIORITIES).forEach(([key, priority]) => {
        const priorityItem = document.createElement('div');
        priorityItem.className = 'flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors';
        priorityItem.innerHTML = `
            <i class="${priority.icon} ${priority.color} text-xl mr-3"></i>
            <span class="flex-1 font-medium text-gray-800">優先度: ${priority.name}</span>
        `;
        priorityItem.addEventListener('click', () => {
            todos[todoIndex].priority = key;
            saveTodos();
            renderTodos();
            hidePriorityModal();
            
            if (window.showToast) {
                window.showToast.success(`優先度を「${priority.name}」に変更しました`);
            }
        });
        priorityList.appendChild(priorityItem);
    });
    
    modal.classList.remove('hidden');
}

// 優先度変更モーダルを非表示
function hidePriorityModal() {
    const modal = document.getElementById('priority-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

export function setupTodoEvents() {
    addTodoSubmit.addEventListener('click', () => {
        addNewTodo();
    });
    
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewTodo();
        }
    });
    
    // モーダル外クリックで閉じる
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('priority-modal');
        if (modal && !modal.contains(e.target)) {
            hidePriorityModal();
        }
    });
    
    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hidePriorityModal();
        }
    });
}

function addNewTodo() {
    if (newTodoInput.value.trim()) {
        const todoText = newTodoInput.value.trim();
        todos.push({
            text: todoText,
            completed: false,
            priority: 'medium', // デフォルトは中優先度
            createdAt: new Date().toISOString()
        });
        newTodoInput.value = '';
        saveTodos();
        renderTodos();
        
        // 保存完了メッセージを表示
        if (window.showToast) {
            window.showToast.success(`タスク「${todoText}」を追加しました`);
        }
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
} 