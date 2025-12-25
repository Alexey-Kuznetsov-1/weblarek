// src/main.ts
import { Catalog } from './components/models/catalog';
import { Basket } from './components/models/basket';
import { Order } from './components/models/order';
import { Api } from './components/base/Api';
import { ApiShop } from './components/ApiShop';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';

// View компоненты
import { CatalogCard } from './components/view/CatalogCard';
import { PreviewCard } from './components/view/PreviewCard';
import { BasketView } from './components/view/Basket';
import { OrderFormView } from './components/view/OrderForm';
import { ContactsFormView } from './components/view/ContactsForm';
import { SuccessView } from './components/view/Success';
import { Modal } from './components/view/Modal';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';

import './scss/styles.scss';

async function main() {
    // Инициализация EventEmitter
    const events = new EventEmitter();
    
    // Инициализация моделей
    const catalog = new Catalog(events);
    const basket = new Basket(events);
    const order = new Order(events);
    
    // Инициализация API
    const api = new Api(API_URL);
    const apiShop = new ApiShop(api);
    
    // Инициализация View компонентов (один раз!)
    const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
    const header = new Header(ensureElement<HTMLElement>('.header'), events);
    const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
    
    // Получаем шаблоны
    const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
    const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
    const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
    const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
    const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
    const successTemplate = ensureElement<HTMLTemplateElement>('#success');
    
    // Создаем View компоненты из шаблонов
    const basketView = new BasketView(cloneTemplate<HTMLElement>(basketTemplate), events);
    const orderFormView = new OrderFormView(cloneTemplate<HTMLElement>(orderTemplate), events);
    const contactsFormView = new ContactsFormView(cloneTemplate<HTMLElement>(contactsTemplate), events);
    const successView = new SuccessView(cloneTemplate<HTMLElement>(successTemplate), events);
    
    // Загрузка товаров с сервера
    try {
        const response = await apiShop.getProductList();
        const products = response.items.map(product => ({
            ...product,
            image: product.image ? `${CDN_URL}/${product.image}` : './src/images/Subtract.svg'
        }));
        
        catalog.setItems(products);
        
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        return;
    }
    
    // Обработчик: Каталог изменился
    events.on('catalog:changed', () => {
        const products = catalog.getItems();
        const cards = products.map(product => {
            const cardElement = cloneTemplate<HTMLElement>(catalogTemplate);
            const card = new CatalogCard(cardElement, events);
            return card.render({ ...product });
        });
        
        gallery.items = cards;
    });
    
    // Обработчик: Выбор карточки для просмотра
    events.on('card:select', (data: { id: string }) => {
        const product = catalog.getProductById(data.id);
        if (product) {
            catalog.setPreview(product);
        }
    });
    
    // Обработчик: Товар для просмотра изменился
    events.on('preview:changed', () => {
        const product = catalog.getPreview();
        if (product) {
            const inCart = basket.hasItem(product.id);
            
            const previewElement = cloneTemplate<HTMLElement>(previewTemplate);
            const previewCard = new PreviewCard(previewElement, events);
            
            previewCard.render({ 
                ...product,
                buttonText: inCart ? 'Удалить из корзины' : 'Купить'
            });
            
            previewCard.updateButton(inCart, product.price);
            
            modal.content = previewElement;
            modal.open();
        }
    });
    
    // Обработчик: Добавление товара в корзину
    events.on('card:add', (data: { id: string }) => {
        const product = catalog.getProductById(data.id);
        if (product) {
            basket.addItem(product);
            modal.close();
        }
    });
    
    // Обработчик: Удаление товара из корзины
    events.on('card:remove', (data: { id: string }) => {
        basket.removeItem(data.id);
        modal.close();
    });
    
    // Обработчик: Удаление товара из корзины (из BasketCard)
    events.on('basket:remove', (data: { id: string }) => {
        basket.removeItem(data.id);
        
        // Обновляем содержимое корзины
        const items = basket.getItems();
        basketView.render({
            items,
            total: basket.getTotal(),
            valid: items.length > 0
        });
        
        // Если корзина пуста, закрываем
        if (items.length === 0) {
            modal.close();
        }
    });
    
    // Обработчик: Корзина изменилась
    events.on('basket:changed', () => {
        const count = basket.getCount();
        header.counter = count;
    });
    
    // Обработчик: Открытие корзины
    events.on('header:basket:open', () => {
        const items = basket.getItems();
        basketView.render({
            items,
            total: basket.getTotal(),
            valid: items.length > 0
        });
        modal.content = basketView.render();
        modal.open();
    });
    
    // Обработчики изменения данных заказа
    events.on('order:payment:changed', (data: { payment: 'card' | 'cash' }) => {
        order.setData({ payment: data.payment });
        validateOrderForm();
    });
    
    events.on('order:address:changed', (data: { address: string }) => {
        order.setData({ address: data.address });
        validateOrderForm();
    });
    
    events.on('order:email:changed', (data: { email: string }) => {
        order.setData({ email: data.email });
        validateContactsForm();
    });
    
    events.on('order:phone:changed', (data: { phone: string }) => {
        order.setData({ phone: data.phone });
        validateContactsForm();
    });
    
    // Валидация формы заказа
    function validateOrderForm(): boolean {
        const errors = order.validate();
        const orderData = order.getData();
        
        const errorMessages: string[] = [];
        if (errors.payment) errorMessages.push(errors.payment);
        if (errors.address) errorMessages.push(errors.address);
        
        const isValid = !!(orderData.payment && orderData.address);
        orderFormView.valid = isValid;
        orderFormView.errors = errorMessages;
        
        return isValid;
    }
    
    // Валидация формы контактов
    function validateContactsForm(): boolean {
        const errors = order.validate();
        const orderData = order.getData();
        
        const errorMessages: string[] = [];
        if (errors.email) errorMessages.push(errors.email);
        if (errors.phone) errorMessages.push(errors.phone);
        
        const isValid = !!(orderData.email && orderData.phone);
        contactsFormView.valid = isValid;
        contactsFormView.errors = errorMessages;
        
        return isValid;
    }
    
    // Обработчик: Оформление заказа из корзины
    events.on('basket:order', () => {
        order.clear();
        orderFormView.clear();
        orderFormView.render({ 
            payment: '', 
            address: '', 
            valid: false, 
            errors: [] 
        });
        modal.content = orderFormView.render();
        modal.open();
    });
    
    // Обработчик: Отправка формы заказа
    events.on('order:submit', () => {
        if (validateOrderForm()) {
            const orderData = order.getData();
            contactsFormView.render({
                email: orderData.email || '',
                phone: orderData.phone || '',
                valid: false,
                errors: []
            });
            modal.content = contactsFormView.render();
        }
    });
    
    // Обработчик: Отправка формы контактов
    events.on('contacts:submit', async () => {
        if (validateContactsForm()) {
            try {
                const orderData = {
                    ...order.getData(),
                    total: basket.getTotal(),
                    items: basket.getItemIds()
                };
                
                const result = await apiShop.createOrder(orderData);
                
                successView.render({ total: result.total });
                modal.content = successView.render();
                
                basket.clear();
                order.clear();
                
            } catch (error) {
                console.error('Ошибка при оформлении заказа:', error);
                alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
            }
        }
    });
    
    // Обработчик: Закрытие успешного окна
    events.on('success:close', () => {
        modal.close();
    });
    
    // Инициируем первичную отрисовку каталога
    events.emit('catalog:changed');
}

main();