import { Catalog } from './catalog';
import { Basket } from './basket';
import { Order } from './order';

export class AppState {
    catalog: Catalog;
    basket: Basket;
    order: Order;

    constructor() {
        this.catalog = new Catalog();
        this.basket = new Basket();
        this.order = new Order();
    }

    // Инициализация (загрузка товаров)
    async init(): Promise<void> {
        console.log('Инициализация AppState...');
        await this.catalog.loadProducts();
    }
}

// Экспортируем глобальный экземпляр
export const appState = new AppState();