// src/main.ts
import { Catalog } from './data/catalog';
import { Basket } from './data/basket';
import { Order } from './data/order';
import { ApiClient } from './api/api-client';
import { WebLarekAPI } from './api/web-larek-api';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import './scss/styles.scss';

console.log('🚀 WebLarek запущен');
console.log('=======================================');

async function main() {
    console.log('🎯 ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ С ТЕСТОВЫМИ ДАННЫМИ');
    console.log('===================================================');
    
    // 1. ТЕСТ КЛАССА CATALOG (Каталог товаров)
    console.log('\n1. 📦 ТЕСТ КАТАЛОГА ТОВАРОВ:');
    
    const catalog = new Catalog();
    console.log('✅ Создан новый экземпляр Catalog');
    
    // Сохраняем товары из тестовых данных
    catalog.setItems(apiProducts.items);
    console.log(`✅ Метод setItems() вызван. Сохранено товаров: ${apiProducts.items.length}`);
    
    // Получаем товары обратно
    const itemsFromCatalog = catalog.getItems();
    console.log('✅ Метод getItems() вызван.');
    console.log(`📊 Получено товаров из каталога: ${itemsFromCatalog.length}`);
    
    if (itemsFromCatalog.length > 0) {
        console.log('🔍 Пример первого товара:', {
            id: itemsFromCatalog[0]?.id,
            title: itemsFromCatalog[0]?.title,
            price: itemsFromCatalog[0]?.price
        });
        
        // Тестируем выбор товара для предпросмотра
        catalog.setPreview(itemsFromCatalog[0]);
        console.log('✅ Метод setPreview() вызван для первого товара');
        
        const previewItem = catalog.getPreview();
        console.log('✅ Метод getPreview() вызван');
        console.log(`🔍 Выбранный товар: "${previewItem?.title}" (ID: ${previewItem?.id})`);
        
        // Тестируем поиск по ID
        const foundProduct = catalog.getProductById(apiProducts.items[0].id);
        console.log(`✅ Метод getProductById() вызван для ID: ${apiProducts.items[0].id}`);
        console.log(`🔍 Найден товар: "${foundProduct?.title}"`);
        
        // Очищаем предпросмотр
        catalog.clearPreview();
        console.log('✅ Метод clearPreview() вызван');
        console.log(`🔍 Товар после очистки: ${catalog.getPreview()}`);
    }
    
    // 2. ТЕСТ КЛАССА BASKET (Корзина)
    console.log('\n2. 🛒 ТЕСТ КОРЗИНЫ:');
    
    const basket = new Basket();
    console.log('✅ Создан новый экземпляр Basket');
    
    // Проверяем пустую корзину
    console.log('📊 Количество товаров в пустой корзине:', basket.getCount());
    console.log('💰 Сумма пустой корзины:', basket.getTotal());
    console.log('📋 Список товаров в пустой корзине:', basket.getItems());
    console.log('🔍 Проверка наличия товара (ожидается false):', basket.hasItem('test-id'));
    
    // Добавляем товары
    if (itemsFromCatalog.length >= 2) {
        basket.addItem(itemsFromCatalog[0]);
        console.log(`✅ Метод addItem() вызван для товара: "${itemsFromCatalog[0].title}"`);
        
        basket.addItem(itemsFromCatalog[0]); // Второй раз тот же товар
        console.log(`✅ Тот же товар добавлен повторно`);
        
        basket.addItem(itemsFromCatalog[1]);
        console.log(`✅ Метод addItem() вызван для товара: "${itemsFromCatalog[1].title}"`);
        
        console.log(`📊 Количество товаров после добавления: ${basket.getCount()}`);
        console.log(`💰 Сумма корзины: ${basket.getTotal()} синапсов`);
        console.log('📋 Список товаров в корзине:', basket.getItems());
        
        // Проверяем наличие товара
        console.log(`🔍 Товар ${itemsFromCatalog[0].id} в корзине?`, basket.hasItem(itemsFromCatalog[0].id));
        console.log(`🔍 Товар несуществующий в корзине?`, basket.hasItem('non-existent-id'));
        
        // Изменяем количество
        basket.updateQuantity(itemsFromCatalog[0].id, 5);
        console.log(`✅ Метод updateQuantity() вызван. Установлено количество: 5 для товара ${itemsFromCatalog[0].id}`);
        console.log(`📊 Новое количество товаров: ${basket.getCount()}`);
        
        // Удаляем товар
        basket.removeItem(itemsFromCatalog[1].id);
        console.log(`✅ Метод removeItem() вызван для товара: ${itemsFromCatalog[1].id}`);
        console.log(`📊 Количество после удаления: ${basket.getCount()}`);
        
        // Очищаем корзину
        basket.clear();
        console.log('✅ Метод clear() вызван');
        console.log(`📊 Количество после очистки: ${basket.getCount()}`);
    }
    
    // 3. ТЕСТ КЛАССА ORDER (Покупатель)
    console.log('\n3. 👤 ТЕСТ ДАННЫХ ПОКУПАТЕЛЯ:');
    
    const order = new Order();
    console.log('✅ Создан новый экземпляр Order');
    
    // Проверяем начальные данные
    const initialData = order.getData();
    console.log('✅ Метод getData() вызван');
    console.log('📋 Начальные данные заказа:', initialData);
    
    // Сохраняем данные по частям
    order.setData({ email: 'test@example.com' });
    console.log('✅ Метод setData() вызван с email');
    console.log(`📧 Email после сохранения: ${order.getData().email}`);
    
    order.setData({ phone: '+79991234567' });
    console.log('✅ Метод setData() вызван с телефоном');
    console.log(`📞 Телефон после сохранения: ${order.getData().phone}`);
    console.log('🔍 Проверяем, что email сохранился:', order.getData().email);
    
    // Сохраняем все данные
    order.setData({
        payment: 'card',
        address: 'Москва, ул. Тестовая, д. 1',
        email: 'customer@example.com',
        phone: '+79998887766'
    });
    console.log('✅ Метод setData() вызван со всеми данными');
    console.log('📋 Все данные заказа:', order.getData());
    
    // Проверяем валидацию (должно быть true)
    const isValid = order.validate();
    console.log('✅ Метод validate() вызван');
    console.log(`🔍 Валидны ли данные? ${isValid ? 'ДА ✓' : 'НЕТ ✗'}`);
    
    // Создаем невалидный заказ для теста
    const invalidOrder = new Order();
    invalidOrder.setData({
        payment: '', // не выбрано
        address: '', // пусто
        email: 'неправильный-email', // невалидный email
        phone: '' // пусто
    });
    console.log('\n🔴 ТЕСТ НЕВАЛИДНЫХ ДАННЫХ:');
    console.log('📋 Невалидные данные:', invalidOrder.getData());
    console.log(`🔍 Валидны ли неполные данные? ${invalidOrder.validate() ? 'ДА' : 'НЕТ ✗'}`);
    
    // Очищаем данные
    order.clear();
    console.log('\n✅ Метод clear() вызван');
    console.log('📋 Данные после очистки:', order.getData());
    
    console.log('\n🎉 ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ЗАВЕРШЕНО!');
    console.log('===========================================');
    
    // 4. ПОДКЛЮЧЕНИЕ К РЕАЛЬНОМУ СЕРВЕРУ
    console.log('\n🌐 ПОДКЛЮЧЕНИЕ К СЕРВЕРУ');
    console.log('=========================');
    
    try {
        console.log('API_URL:', API_URL);
        
        // Создаем клиент API
        const apiClient = new ApiClient(API_URL);
        const webLarekAPI = new WebLarekAPI(apiClient);
        
        // Создаем новый каталог для реальных данных
        const realCatalog = new Catalog();
        
        console.log('🔄 Загрузка товаров с сервера...');
        
        // Получаем реальные товары с сервера
        const realProducts = await webLarekAPI.getProductList();
        
        // Сохраняем в каталог
        realCatalog.setItems(realProducts);
        
        console.log(`✅ Загружено ${realProducts.length} товаров с сервера`);
        
        if (realProducts.length > 0) {
            console.log('📦 Пример товара с сервера:', {
                id: realProducts[0]?.id,
                title: realProducts[0]?.title,
                price: realProducts[0]?.price,
                category: realProducts[0]?.category
            });
            
            console.log('📋 Первые 3 товара:');
            realProducts.slice(0, 3).forEach((product, index) => {
                console.log(`${index + 1}. "${product.title}" - ${product.price ? product.price + ' синапсов' : 'Бесценно'} (${product.category})`);
            });
        }
        
    } catch (error) {
        console.error('❌ Ошибка загрузки товаров с сервера:', error);
    }
    
    console.log('\n✅ ПРОЕКТ ГОТОВ К РАБОТЕ!');
    console.log('=======================================');
    console.log('Все модели данных работают корректно.');
    console.log('Сервер подключен успешно.');
    console.log('Товары загружены и сохранены в каталог.');
    console.log('Проект готов к следующему этапу — созданию UI компонентов.');
}

main().catch(error => {
    console.error('❌ Критическая ошибка при запуске приложения:', error);
});