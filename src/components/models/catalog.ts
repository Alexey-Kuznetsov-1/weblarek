import { Product } from '../../types';

export class Catalog {
    private items: Product[] = [];
    private selectedItem: Product | null = null;

    // Сохранить массив товаров
    setItems(items: Product[]): void {
        this.items = items;
    }

    // Получить массив товаров
    getItems(): Product[] {
        return this.items;
    }

    // Сохранить выбранную карточку
    setPreview(item: Product): void {
        this.selectedItem = item;
    }

    // Получить выбранную карточку
    getPreview(): Product | null {
        return this.selectedItem;
    }

    // Найти товар по ID
    getProductById(id: string): Product | undefined {
        return this.items.find(item => item.id === id);
    }

    // Очистить выбранный товар
    clearPreview(): void {
        this.selectedItem = null;
    }
}