import { UIComponent } from './UIComponent.js';

export class FlightWidget extends UIComponent {
    constructor(config) {
        super({ ...config, title: config.title || 'Поиск авиабилетов' });
        this.flights = [];
        this.from = 'JFK';
        this.to = 'LAX';
    }

    getIcon() {
        return 'fas fa-plane';
    }

    async render() {
        const { widget, content } = this.createWidgetStructure();
        
        content.innerHTML = `
            <div class="flight-search">
                <div class="flight-input-group">
                    <input type="text" id="from-${this.id}" placeholder="Откуда (код аэропорта)" value="${this.from}">
                    <input type="text" id="to-${this.id}" placeholder="Куда (код аэропорта)" value="${this.to}">
                    <button id="search-${this.id}" class="flight-search-btn">Найти билеты</button>
                </div>
                <div id="results-${this.id}" class="flight-results">
                    <div class="loading"><i class="fas fa-spinner fa-spin"></i> Введите пункты для поиска</div>
                </div>
            </div>
        `;
        
        this.element = widget;
        
        // Добавляем слушатели
        const searchBtn = content.querySelector(`#search-${this.id}`);
        const fromInput = content.querySelector(`#from-${this.id}`);
        const toInput = content.querySelector(`#to-${this.id}`);
        
        const searchHandler = () => this.searchFlights(fromInput.value, toInput.value);
        searchBtn.addEventListener('click', searchHandler);
        this.eventListeners.push({ element: searchBtn, event: 'click', handler: searchHandler });
        
        return widget;
    }
    
    async searchFlights(from, to) {
        const resultsDiv = this.element.querySelector(`#results-${this.id}`);
        resultsDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Поиск билетов...</div>';
        
        try {
            // Имитация API запроса (в реальном проекте здесь был бы запрос к Skyscanner API)
            await this.delay(800);
            
            // Генерируем демо-данные для авиабилетов
            const flights = this.generateMockFlights(from, to);
            
            if (flights.length === 0) {
                resultsDiv.innerHTML = '<div class="empty-state">Билеты не найдены</div>';
                return;
            }
            
            resultsDiv.innerHTML = flights.map(flight => `
                <div class="flight-card">
                    <div class="flight-price">${flight.price} ${flight.currency}</div>
                    <div class="flight-airline">${flight.airline} • ${flight.departure} → ${flight.arrival}</div>
                    <div style="font-size: 0.8rem; color: #666;">${flight.duration}</div>
                </div>
            `).join('');
            
            this.showMessage(`Найдено ${flights.length} билетов`);
        } catch (error) {
            resultsDiv.innerHTML = '<div class="error">Ошибка при поиске билетов</div>';
            this.showMessage('Ошибка поиска', true);
        }
    }
    
    generateMockFlights(from, to) {
        const airlines = ['Аэрофлот', 'Emirates', 'Turkish Airlines', 'Lufthansa', 'British Airways'];
        const currencies = ['USD', 'EUR', 'RUB'];
        
        return Array.from({ length: 5 }, (_, i) => ({
            airline: airlines[Math.floor(Math.random() * airlines.length)],
            price: Math.floor(Math.random() * 500) + 100,
            currency: currencies[Math.floor(Math.random() * currencies.length)],
            departure: `${Math.floor(Math.random() * 23)}:${Math.floor(Math.random() * 60)}`,
            arrival: `${Math.floor(Math.random() * 23)}:${Math.floor(Math.random() * 60)}`,
            duration: `${Math.floor(Math.random() * 8) + 2}ч ${Math.floor(Math.random() * 60)}м`
        }));
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}