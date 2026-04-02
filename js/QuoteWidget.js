import { UIComponent } from './UIComponent.js';

export class QuoteWidget extends UIComponent {
    constructor(config) {
        super({ ...config, title: config.title || 'Цитата дня' });
        this.quotes = [
            { text: "Путешествие в тысячу миль начинается с одного шага.", author: "Лао-Цзы" },
            { text: "Не количество знаний важно, а качество их. Можно знать многое, не зная самого нужного.", author: "Л.Н. Толстой" },
            { text: "Единственный способ делать великую работу — любить то, что ты делаешь.", author: "Стив Джобс" },
            { text: "Будущее зависит от того, что вы делаете сегодня.", author: "Махатма Ганди" },
            { text: "Успех — это способность идти от неудачи к неудаче, не теряя энтузиазма.", author: "Уинстон Черчилль" },
            { text: "Не ждите. Время никогда не будет идеальным.", author: "Наполеон Хилл" },
            { text: "Ваше время ограничено, не тратьте его, живя чужой жизнью.", author: "Стив Джобс" }
        ];
        this.currentQuote = this.quotes[0];
    }

    getIcon() {
        return 'fas fa-quote-right';
    }

    render() {
        const { widget, content } = this.createWidgetStructure();
        
        content.innerHTML = `
            <div class="quote-content">
                <div class="quote-text">"${this.currentQuote.text}"</div>
                <div class="quote-author">— ${this.currentQuote.author}</div>
                <button id="refresh-${this.id}" class="quote-refresh">
                    <i class="fas fa-sync-alt"></i> Новая цитата
                </button>
            </div>
        `;
        
        this.element = widget;
        
        const refreshBtn = content.querySelector(`#refresh-${this.id}`);
        const refreshHandler = () => this.refreshQuote();
        refreshBtn.addEventListener('click', refreshHandler);
        this.eventListeners.push({ element: refreshBtn, event: 'click', handler: refreshHandler });
        
        return widget;
    }
    
    refreshQuote() {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        this.currentQuote = this.quotes[randomIndex];
        
        const content = this.element.querySelector('.widget-content');
        if (content) {
            const quoteText = content.querySelector('.quote-text');
            const quoteAuthor = content.querySelector('.quote-author');
            
            quoteText.innerHTML = `"${this.currentQuote.text}"`;
            quoteAuthor.innerHTML = `— ${this.currentQuote.author}`;
            
            // Добавляем анимацию
            quoteText.style.animation = 'fadeIn 0.3s ease';
            setTimeout(() => {
                quoteText.style.animation = '';
            }, 300);
        }
        
        this.showMessage('Цитата обновлена');
    }
}