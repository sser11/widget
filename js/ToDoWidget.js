import { UIComponent } from './UIComponent.js';

export class ToDoWidget extends UIComponent {
    constructor(config) {
        super({ ...config, title: config.title || 'Мои задачи' });
        this.tasks = this.loadTasks();
    }

    getIcon() {
        return 'fas fa-tasks';
    }

    render() {
        const { widget, content } = this.createWidgetStructure();
        
        content.innerHTML = `
            <div class="todo-input-group">
                <input type="text" id="todo-input-${this.id}" placeholder="Новая задача..." maxlength="100">
                <button id="todo-add-${this.id}" class="todo-add-btn">Добавить</button>
            </div>
            <ul id="todo-list-${this.id}" class="todo-list"></ul>
        `;
        
        this.element = widget;
        
        const addBtn = content.querySelector(`#todo-add-${this.id}`);
        const input = content.querySelector(`#todo-input-${this.id}`);
        
        const addHandler = () => this.addTask(input.value);
        addBtn.addEventListener('click', addHandler);
        
        const enterHandler = (e) => {
            if (e.key === 'Enter') {
                this.addTask(input.value);
            }
        };
        input.addEventListener('keypress', enterHandler);
        
        this.eventListeners.push({ element: addBtn, event: 'click', handler: addHandler });
        this.eventListeners.push({ element: input, event: 'keypress', handler: enterHandler });
        
        this.renderTasks();
        
        return widget;
    }
    
    addTask(text) {
        if (!text.trim()) {
            this.showMessage('Введите текст задачи', true);
            return;
        }
        
        const task = {
            id: Date.now(),
            text: text.trim(),
            completed: false
        };
        
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        
        const input = this.element.querySelector(`#todo-input-${this.id}`);
        if (input) input.value = '';
        
        this.showMessage('Задача добавлена');
    }
    
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.showMessage('Задача удалена');
    }
    
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }
    
    renderTasks() {
        const list = this.element?.querySelector(`#todo-list-${this.id}`);
        if (!list) return;
        
        if (this.tasks.length === 0) {
            list.innerHTML = '<div class="empty-state">✨ Нет задач. Добавьте первую!</div>';
            return;
        }
        
        list.innerHTML = this.tasks.map(task => `
            <li class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="todo-text">${this.escapeHtml(task.text)}</span>
                <button class="todo-delete">Удалить</button>
            </li>
        `).join('');
        
        // Добавляем слушатели для каждой задачи
        const items = list.querySelectorAll('.todo-item');
        items.forEach(item => {
            const checkbox = item.querySelector('.todo-checkbox');
            const deleteBtn = item.querySelector('.todo-delete');
            const taskId = parseInt(item.dataset.id);
            
            const checkboxHandler = () => this.toggleTask(taskId);
            const deleteHandler = () => this.deleteTask(taskId);
            
            checkbox.addEventListener('change', checkboxHandler);
            deleteBtn.addEventListener('click', deleteHandler);
            
            // Сохраняем для очистки
            this.eventListeners.push({ element: checkbox, event: 'change', handler: checkboxHandler });
            this.eventListeners.push({ element: deleteBtn, event: 'click', handler: deleteHandler });
        });
    }
    
    saveTasks() {
        localStorage.setItem(`todo_${this.id}`, JSON.stringify(this.tasks));
    }
    
    loadTasks() {
        const saved = localStorage.getItem(`todo_${this.id}`);
        return saved ? JSON.parse(saved) : [];
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    cleanup() {
        this.saveTasks();
    }
}
