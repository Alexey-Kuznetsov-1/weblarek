import { Product } from '../models/product';
import { getProductList } from '../utils/api';

export class Catalog {
    private items: Product[] = [];          // Массив товаров
    private selectedItem: Product | null = null;  // Выбранная карточка

    // Сохранить массив товаров
    setItems(items: Product[]): void {
        this.items = items;
        console.log(`Каталог: сохранено ${items.length} товаров`);
    }

    // Получить массив товаров
    getItems(): Product[] {
        return this.items;
    }

    // Сохранить выбранную карточку
    setPreview(item: Product): void {
        this.selectedItem = item;
        console.log(`Выбран товар: ${item.title}`);
    }

    // Получить выбранную карточку
    getPreview(): Product | null {
        return this.selectedItem;
    }

    // Загрузить товары с сервера
    async loadProducts(): Promise<void> {
        try {
            const response = await getProductList();
            this.setItems(response.items);
            console.log(`✅ Загружено ${response.items.length} товаров`);
        } catch (error) {
            console.error('❌ Ошибка загрузки товаров:', error);
        }
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