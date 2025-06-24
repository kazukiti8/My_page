// ToDoリスト管理
const todoList = document.getElementById('todo-list');
const newTodoInput = document.getElementById('new-todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const addTodoSubmit = document.getElementById('add-todo-submit');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

export function renderTodos() {
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'text-gray-500 text-sm italic';
        emptyMessage.textContent = 'No tasks yet. Add your first task!';
        todoList.appendChild(emptyMessage);
        return;
    }
    
    todos.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.className = 'flex items-center bg-white bg-opacity-70 hover:bg-opacity-90 rounded px-2 py-1';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'mr-2';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => {
            todo.completed = checkbox.checked;
            saveTodos();
            if (todo.completed) {
                todoText.classList.add('line-through', 'text-gray-500');
            } else {
                todoText.classList.remove('line-through', 'text-gray-500');
            }
        });
        
        const todoText = document.createElement('span');
        todoText.className = 'flex-1 text-sm';
        todoText.textContent = todo.text;
        if (todo.completed) {
            todoText.classList.add('line-through', 'text-gray-500');
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'text-red-500 hover:text-red-700 text-xs p-1 ml-2';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });
        
        todoItem.appendChild(checkbox);
        todoItem.appendChild(todoText);
        todoItem.appendChild(deleteBtn);
        todoList.appendChild(todoItem);
    });
}

export function setupTodoEvents() {
    addTodoBtn.addEventListener('click', () => {
        newTodoInput.focus();
    });
    
    addTodoSubmit.addEventListener('click', () => {
        addNewTodo();
    });
    
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewTodo();
        }
    });
}

function addNewTodo() {
    if (newTodoInput.value.trim()) {
        const todoText = newTodoInput.value.trim();
        todos.push({
            text: todoText,
            completed: false
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