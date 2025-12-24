// src/main.ts
import { Catalog } from './components/models/catalog';
import { Basket } from './components/models/basket';
import { Order } from './components/models/order';
import { Api } from './components/base/Api';
import { ApiShop } from './components/ApiShop';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

// View компоненты
import { CatalogCard } from './components/view/CatalogCard';
import { PreviewCard } from './components/view/PreviewCard';
import { BasketCard } from './components/view/BasketCard';
import { Modal } from './components/view/Modal';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';

import './scss/styles.scss';

async function main() {
    // Создаем EventEmitter
    const events = new EventEmitter();
    
    // Создаем модели
    const catalog = new Catalog(events);
    const basket = new Basket(events);
    const order = new Order(events);
    
    // Создаем API
    const api = new Api(API_URL);
    const apiShop = new ApiShop(api);
    
    // Находим основные элементы DOM
    const galleryContainer = document.querySelector('.gallery');
    const headerContainer = document.querySelector('.header');
    const modalContainer = document.getElementById('modal-container');
    
    if (!galleryContainer || !headerContainer || !modalContainer) {
        throw new Error('Не найдены основные элементы DOM');
    }
    
    // Создаем View компоненты
    const gallery = new Gallery(galleryContainer as HTMLElement);
    const header = new Header(headerContainer as HTMLElement, events);
    const modal = new Modal(modalContainer as HTMLElement, events);
    
    // Получаем шаблоны
    const catalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
    const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
    const basketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
    const basketModalTemplate = document.getElementById('basket') as HTMLTemplateElement;
    const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
    const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    const successTemplate = document.getElementById('success') as HTMLTemplateElement;
    
    // 1. Загрузка товаров с сервера
    try {
        const response = await apiShop.getProductList();
        const products = response.items.map(product => ({
            ...product,
            image: product.image ? `${CDN_URL}/${product.image}` : './src/images/Subtract.svg'
        }));
        
        catalog.setItems(products);
        displayCatalogDirectly();
        
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        return;
    }
    
    // Функция отображения каталога
    function displayCatalogDirectly() {
        const products = catalog.getItems();
        if (products.length === 0) return;
        
        const cards = products.map(product => {
            const cardElement = cloneTemplate(catalogTemplate);
            const card = new CatalogCard(cardElement, events, product);
            return card.render();
        });
        
        gallery.items = cards;
    }
    
    // 2. Обработчик: Каталог изменился
    events.on('catalog:changed', () => {
        displayCatalogDirectly();
    });
    
    // 3. Обработчик: Выбор карточки для просмотра
    events.on('card:select', (data: { id: string }) => {
        const product = catalog.getProductById(data.id);
        if (product) {
            catalog.setPreview(product);
        }
    });
    
    // 4. Обработчик: Товар для просмотра изменился
    events.on('preview:changed', () => {
        const product = catalog.getPreview();
        if (product) {
            const previewElement = cloneTemplate(previewTemplate);
            const previewCard = new PreviewCard(previewElement, events, product);
            
            const inCart = basket.hasItem(product.id);
            previewCard.updateButton(inCart, product.price);
            
            modal.content = previewCard.render();
            modal.open();
        }
    });
    
    // 5. Обработчик: Добавление товара в корзину
    events.on('card:add', (data: { id: string }) => {
        const product = catalog.getProductById(data.id);
        if (product) {
            basket.addItem(product);
            modal.close();
        }
    });
    
    // 6. Обработчик: Удаление товара из корзины
    events.on('card:remove', (data: { id: string }) => {
        basket.removeItem(data.id);
        modal.close();
    });
    
    // 7. Обработчик: Корзина изменилась
    events.on('basket:changed', () => {
        const count = basket.getCount();
        header.counter = count;
    });
    
    // 8. Обработчик: Удаление товара из корзины (из BasketCard)
    events.on('basket:remove', (data: { id: string }) => {
        basket.removeItem(data.id);
    });
    
    // 9. Обработчик: Открытие корзины
    events.on('header:basket:open', () => {
        const basketElement = cloneTemplate(basketModalTemplate);
        const listElement = basketElement.querySelector('.basket__list');
        const totalElement = basketElement.querySelector('.basket__price');
        const orderButton = basketElement.querySelector('.basket__button');
        
        const items = basket.getItems();
        
        if (items.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.textContent = 'Корзина пуста';
            emptyItem.className = 'basket__empty';
            listElement?.appendChild(emptyItem);
            orderButton?.setAttribute('disabled', 'disabled');
        } else {
            items.forEach((product, index) => {
                const itemElement = cloneTemplate(basketTemplate);
                const basketCard = new BasketCard(itemElement, events, product, index + 1);
                listElement?.appendChild(basketCard.render());
            });
            
            if (totalElement) {
                totalElement.textContent = `${basket.getTotal()} синапсов`;
            }
            
            orderButton?.addEventListener('click', () => {
                modal.close();
                setTimeout(() => events.emit('basket:order'), 100);
            });
        }
        
        modal.content = basketElement;
        modal.open();
    });
    
    // 10. Обработчик: Оформление заказа из корзины
    events.on('basket:order', () => {
        const orderElement = cloneTemplate(orderTemplate);
        
        // Находим элементы формы заказа
        const form = orderElement as HTMLFormElement;
        const paymentButtons = orderElement.querySelectorAll('.button_alt');
        const addressInput = orderElement.querySelector('input[name="address"]') as HTMLInputElement;
        const submitButton = orderElement.querySelector('.order__button') as HTMLButtonElement;
        const errorContainer = orderElement.querySelector('.form__errors') as HTMLElement;
        
        if (!paymentButtons.length || !addressInput || !submitButton || !errorContainer) {
            throw new Error('Не найдены элементы формы заказа');
        }
        
        // Сбрасываем данные заказа
        order.clear();
        
        // Функция валидации формы заказа
        function validateOrderForm() {
            const orderData = order.getData();
            const errors = order.validate();
            
            // Отображаем ошибки
            if (Object.keys(errors).length > 0) {
                const errorMessages = Object.values(errors).join(', ');
                errorContainer.textContent = errorMessages;
                errorContainer.style.display = 'block';
            } else {
                errorContainer.style.display = 'none';
            }
            
            // Разрешаем кнопку если заполнены обязательные поля
            submitButton.disabled = !(orderData.payment && orderData.address);
            
            return orderData.payment && orderData.address;
        }
        
        // Обработчик выбора способа оплаты
        paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем активный класс у всех кнопок
                paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                // Добавляем активный класс выбранной кнопке
                button.classList.add('button_alt-active');
                
                const paymentType = button.getAttribute('name');
                let payment: 'card' | 'cash' | '' = '';
                if (paymentType === 'card' || paymentType === 'cash') {
                    payment = paymentType;
                }
                order.setData({ payment });
                
                validateOrderForm();
            });
        });
        
        // Обработчик ввода адреса
        addressInput.addEventListener('input', () => {
            order.setData({ address: addressInput.value });
            validateOrderForm();
        });
        
        // Обработчик отправки формы
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            if (validateOrderForm()) {
                modal.close();
                setTimeout(() => events.emit('order:submit'), 100);
            }
        });
        
        // Валидируем начальное состояние
        validateOrderForm();
        
        modal.content = orderElement;
        modal.open();
    });
    
    // 11. Обработчик: Отправка формы заказа (переход к контактам)
    events.on('order:submit', () => {
        const contactsElement = cloneTemplate(contactsTemplate);
        
        // Находим элементы формы контактов
        const form = contactsElement as HTMLFormElement;
        const emailInput = contactsElement.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneInput = contactsElement.querySelector('input[name="phone"]') as HTMLInputElement;
        const submitButton = contactsElement.querySelector('button[type="submit"]') as HTMLButtonElement;
        const errorContainer = contactsElement.querySelector('.form__errors') as HTMLElement;
        
        if (!emailInput || !phoneInput || !submitButton || !errorContainer) {
            throw new Error('Не найдены элементы формы контактов');
        }
        
        // Устанавливаем текущие значения из модели
        const orderData = order.getData();
        emailInput.value = orderData.email || '';
        phoneInput.value = orderData.phone || '';
        
        // Функция валидации формы контактов
        function validateContactsForm() {
            const orderData = order.getData();
            const errors = order.validate();
            
            // Отображаем ошибки (только email и phone)
            const contactErrors = [];
            if (errors.email) contactErrors.push(errors.email);
            if (errors.phone) contactErrors.push(errors.phone);
            
            if (contactErrors.length > 0) {
                errorContainer.textContent = contactErrors.join(', ');
                errorContainer.style.display = 'block';
            } else {
                errorContainer.style.display = 'none';
            }
            
            // Разрешаем кнопку если заполнены контакты
            submitButton.disabled = !(orderData.email && orderData.phone);
            
            return orderData.email && orderData.phone;
        }
        
        // Обработчик ввода email
        emailInput.addEventListener('input', () => {
            order.setData({ email: emailInput.value });
            validateContactsForm();
        });
        
        // Обработчик ввода телефона
        phoneInput.addEventListener('input', () => {
            order.setData({ phone: phoneInput.value });
            validateContactsForm();
        });
        
        // Валидируем начальное состояние
        validateContactsForm();
        
        // Обработчик отправки формы
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            if (validateContactsForm()) {
                try {
                    // Подготавливаем данные для заказа
                    const orderPayload = {
                        ...order.getData(),
                        total: basket.getTotal(),
                        items: basket.getItemIds()
                    };
                    
                    // Отправляем заказ на сервер
                    const result = await apiShop.createOrder(orderPayload);
                    
                    // Очищаем корзину и данные заказа
                    basket.clear();
                    order.clear();
                    
                    // Показываем успешное сообщение
                    const successElement = cloneTemplate(successTemplate);
                    const totalElement = successElement.querySelector('.order-success__description');
                    const closeButton = successElement.querySelector('.order-success__close');
                    
                    if (totalElement) {
                        totalElement.textContent = `Списано ${result.total} синапсов`;
                    }
                    
                    if (closeButton) {
                        closeButton.addEventListener('click', () => {
                            modal.close();
                        });
                    }
                    
                    modal.content = successElement;
                    
                } catch (error) {
                    console.error('Ошибка при оформлении заказа:', error);
                    alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
                }
            }
        });
        
        modal.content = contactsElement;
        modal.open();
    });
}

main();