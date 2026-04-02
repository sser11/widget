import { FlightWidget } from './FlightWidget.js';
import { EbayWidget } from './EbayWidget.js';
import { ToDoWidget } from './ToDoWidget.js';
import { QuoteWidget } from './QuoteWidget.js';

export class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.widgets = new Map(); // id -> widget instance
        this.widgetTypes = {
            flight: FlightWidget,
            ebay: EbayWidget,
            todo: ToDoWidget,
            quote: QuoteWidget
        };
        
        // Слушаем события удаления виджетов
        document.addEventListener('widgetDestroyed', (e) => {
            this.removeWidget(e.detail.id);
        });
    }
    
    addWidget(widgetType, config = {}) {
        const WidgetClass = this.widgetTypes[widgetType];
        if (!WidgetClass) {
            console.error(`Unknown widget type: ${widgetType}`);
            return null;
        }
        
        const widget = new WidgetClass(config);
        const element = widget.render();
        
        this.container.appendChild(element);
        this.widgets.set(widget.id, widget);
        
        // Анимация добавления
        element.style.animation = 'fadeIn 0.4s ease-out';
        
        return widget;
    }
    
    removeWidget(widgetId) {
        const widget = this.widgets.get(widgetId);
        if (widget) {
            this.widgets.delete(widgetId);
            // Виджет сам удаляет себя из DOM через метод destroy
        }
    }
    
    getWidgetsCount() {
        return this.widgets.size;
    }
    
    getAllWidgets() {
        return Array.from(this.widgets.values());
    }
    
    clearAllWidgets() {
        this.widgets.forEach(widget => {
            widget.destroy();
        });
        this.widgets.clear();
    }
}