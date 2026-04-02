import { UIComponent } from './UIComponent.js';

export class EbayWidget extends UIComponent {
    constructor(config) {
        super({ ...config, title: config.title || 'Поиск на eBay' });
        this.products = [];
        this.searchQuery = '';
    }

    getIcon() {
        return 'fab fa-ebay';
    }

    async render() {
        const { widget, content } = this.createWidgetStructure();
        
        content.innerHTML = `
            <div class="ebay-search">
                <input type="text" id="search-input-${this.id}" placeholder="Поиск товаров..." value="${this.searchQuery}">
                <button id="search-btn-${this.id}" class="ebay-search-btn">Найти</button>
            </div>
            <div id="ebay-results-${this.id}" class="ebay-results">
                <div class="empty-state">Введите запрос для поиска товаров</div>
            </div>
        `;
        
        this.element = widget;
        
        const searchBtn = content.querySelector(`#search-btn-${this.id}`);
        const searchInput = content.querySelector(`#search-input-${this.id}`);
        
        const searchHandler = () => this.searchProducts(searchInput.value);
        searchBtn.addEventListener('click', searchHandler);
        
        // Поиск по Enter
        const enterHandler = (e) => {
            if (e.key === 'Enter') {
                this.searchProducts(searchInput.value);
            }
        };
        searchInput.addEventListener('keypress', enterHandler);
        
        this.eventListeners.push({ element: searchBtn, event: 'click', handler: searchHandler });
        this.eventListeners.push({ element: searchInput, event: 'keypress', handler: enterHandler });
        
        return widget;
    }
    
    async searchProducts(query) {
        if (!query.trim()) {
            this.showMessage('Введите поисковый запрос', true);
            return;
        }
        
        const resultsDiv = this.element.querySelector(`#ebay-results-${this.id}`);
        resultsDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Поиск товаров...</div>';
        
        try {
            await this.delay(700);
            
            // Генерируем демо-данные для товаров eBay
            const products = this.generateMockProducts(query);
            
            if (products.length === 0) {
                resultsDiv.innerHTML = '<div class="empty-state">Товары не найдены</div>';
                return;
            }
            
            resultsDiv.innerHTML = products.map(product => `
                <div class="ebay-item">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="ebay-item-info">
                        <div class="ebay-item-title">${product.title}</div>
                        <div class="ebay-item-price">${product.price} ${product.currency}</div>
                        <div style="font-size: 0.75rem; color: #999;">⭐ ${product.rating} (${product.reviews} отзывов)</div>
                    </div>
                </div>
            `).join('');
            
            this.showMessage(`Найдено ${products.length} товаров`);
        } catch (error) {
            resultsDiv.innerHTML = '<div class="error">Ошибка при поиске товаров</div>';
            this.showMessage('Ошибка поиска', true);
        }
    }
    
    generateMockProducts(query) {
        const categories = ['Electronics', 'Clothing', 'Home', 'Toys', 'Books'];
        const currencies = ['USD', 'EUR', 'GBP'];
        const images = [
            'https://picsum.photos/id/0/60/60',
            'https://picsum.photos/id/1/60/60',
            'https://picsum.photos/id/2/60/60',
            'https://picsum.photos/id/3/60/60',
            'https://picsum.photos/id/4/60/60'
        ];
        
        return Array.from({ length: 4 }, (_, i) => ({
            title: `${query} ${categories[Math.floor(Math.random() * categories.length)]} ${i + 1}`,
            price: (Math.random() * 200 + 10).toFixed(2),
            currency: currencies[Math.floor(Math.random() * currencies.length)],
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviews: Math.floor(Math.random() * 1000),
            image: images[Math.floor(Math.random() * images.length)]
        }));
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}