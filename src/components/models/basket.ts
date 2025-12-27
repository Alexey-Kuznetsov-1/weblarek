import { Product } from '../../types';
import { BaseModel } from './BaseModel';
import { EventEmitter } from '../base/Events';

export class Basket extends BaseModel {
    private items: Product[] = [];

    constructor(events: EventEmitter) {
        super(events);
    }

    // Добавить товар в корзину
    addItem(product: Product): void {
        // Проверяем, нет ли уже такого товара в корзине
        if (!this.hasItem(product.id)) {
            this.items.push(product);
            this.events.emit('basket:changed'); // ✅ Событие вызывается здесь
        }
    }

    // Удалить товар из корзины
    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
        this.events.emit('basket:changed'); // ✅ Событие вызывается здесь
    }

    // Получить количество товаров в корзины
    getCount(): number {
        return this.items.length;
    }

    // Получить все товары в корзине
    getItems(): Product[] {
        return this.items;
    }

    // Получить общую сумму корзины
    getTotal(): number {
        return this.items.reduce((total, item) => {
            const price = item.price || 0;
            return total + price;
        }, 0);
    }

    // Проверить наличие товара в корзине
    hasItem(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }

    // Очистить корзину
    clear(): void {
        this.items = [];
        this.events.emit('basket:changed'); // ✅ Событие вызывается здесь
    }

    // Получить массив ID товаров (для отправки на сервер)
    getItemIds(): string[] {
        return this.items.map(item => item.id);
    }
}