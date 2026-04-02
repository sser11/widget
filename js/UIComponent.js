// Базовый абстрактный класс для всех UI компонентов
export class UIComponent {
    constructor(config) {
        this.id = config.id || this.generateId();
        this.title = config.title || 'Виджет';
        this.element = null;
        this.isCollapsed = false;
        this.eventListeners = []; // Для отслеживания слушателей
    }

    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Создание базовой структуры виджета
    createWidgetStructure() {
        const widget = document.createElement('div');
        widget.className = 'widget';
        widget.dataset.id = this.id;

        const header = document.createElement('div');
        header.className = 'widget-header';
        header.innerHTML = `
            <h3><i class="${this.getIcon()}"></i> ${this.title}</h3>
            <div class="widget-controls">
                <i class="fas fa-minus minimize-btn"></i>
                <i class="fas fa-times close-btn"></i>
            </div>
        `;

        const content = document.createElement('div');
        content.className = 'widget-content';
        
        widget.appendChild(header);
        widget.appendChild(content);
        
        // Добавляем слушатели
        const minimizeBtn = header.querySelector('.minimize-btn');
        const closeBtn = header.querySelector('.close-btn');
        
        const minimizeHandler = () => this.toggleMinimize(content);
        const closeHandler = () => this.destroy();
        
        minimizeBtn.addEventListener('click', minimizeHandler);
        closeBtn.addEventListener('click', closeHandler);
        
        // Сохраняем для последующего удаления
        this.eventListeners.push({ element: minimizeBtn, event: 'click', handler: minimizeHandler });
        this.eventListeners.push({ element: closeBtn, event: 'click', handler: closeHandler });
        
        return { widget, content };
    }

    getIcon() {
        return 'fas fa-puzzle-piece';
    }

    toggleMinimize(contentElement) {
        this.isCollapsed = !this.isCollapsed;
        if (this.isCollapsed) {
            contentElement.classList.add('collapsed');
        } else {
            contentElement.classList.remove('collapsed');
        }
    }

    // Абстрактный метод render
    render() {
        throw new Error('Метод render должен быть реализован в дочернем классе');
    }

    // Удаление виджета и очистка слушателей
    destroy() {
        if (this.element && this.element.parentNode) {
            // Удаляем все сохраненные слушатели
            this.eventListeners.forEach(({ element, event, handler }) => {
                if (element && element.removeEventListener) {
                    element.removeEventListener(event, handler);
                }
            });
            
            // Очищаем внутренние слушатели
            this.cleanup();
            
            this.element.remove();
        }
        
        // Диспатчим событие удаления
        const event = new CustomEvent('widgetDestroyed', { detail: { id: this.id } });
        document.dispatchEvent(event);
    }

    // Метод для очистки специфичных слушателей (переопределяется в дочерних классах)
    cleanup() {
        // Переопределяется в дочерних классах
    }

    // Показать уведомление
    showMessage(message, isError = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = isError ? 'error' : 'success';
        msgDiv.textContent = message;
        msgDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${isError ? '#dc3545' : '#28a745'};
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 0.9rem;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(msgDiv);
        setTimeout(() => {
            if (msgDiv && msgDiv.remove) {
                msgDiv.remove();
            }
        }, 2000);
    }
}
