import { Product } from '../../types';

export class Basket {
    private items: Product[] = [];

    // Добавить товар в корзину
    addItem(product: Product): void {
        // Проверяем, нет ли уже такого товара в корзине
        if (!this.hasItem(product.id)) {
            this.items.push(product);
        }
    }

    // Удалить товар из корзины
    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
    }

    // Получить количество товаров в корзине
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
    }

    // Получить массив ID товаров (для отправки на сервер)
    getItemIds(): string[] {
        return this.items.map(item => item.id);
    }
}