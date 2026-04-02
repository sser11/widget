import { Dashboard } from './js/Dashboard.js';

// Инициализация дашборда
const dashboard = new Dashboard('widgetsGrid');

// Добавляем обработчики кнопок
document.getElementById('addFlightBtn').addEventListener('click', () => {
    dashboard.addWidget('flight', { title: 'Поиск авиабилетов' });
});

document.getElementById('addEbayBtn').addEventListener('click', () => {
    dashboard.addWidget('ebay', { title: 'Поиск на eBay' });
});

document.getElementById('addTodoBtn').addEventListener('click', () => {
    dashboard.addWidget('todo', { title: 'Мои задачи' });
});

document.getElementById('addQuoteBtn').addEventListener('click', () => {
    dashboard.addWidget('quote', { title: 'Вдохновение дня' });
});

// Добавляем начальные виджеты для демонстрации
setTimeout(() => {
    dashboard.addWidget('flight', { title: 'Авиабилеты' });
    dashboard.addWidget('todo', { title: 'Список дел' });
}, 100);

// Сохраняем дашборд в глобальную область для отладки (опционально)
window.dashboard = dashboard;

console.log('Дашборд инициализирован. Добавляйте виджеты!');