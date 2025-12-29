# Проектная работа "Веб-ларек"

## Описание проекта
Интернет-магазин «Web-Larёk» для товаров веб-разработчиков с возможностью просмотра товаров, добавления в корзину и оформления заказов. Приложение реализовано по архитектуре MVP с использованием TypeScript и событийной системы.

**Стек технологий**: TypeScript, SCSS, Vite, HTML

## Структура проекта
src/
├── components/ # Компоненты приложения
│ ├── base/ # Базовые классы (Component, Api, EventEmitter)
│ ├── models/ # Модели данных (Catalog, Basket, Order)
│ ├── view/ # Компоненты представления
│ └── ApiShop.ts # API магазина
├── scss/ # Стили
├── utils/ # Утилиты и константы
├── types/ # TypeScript типы
└── main.ts # Точка входа (Презентер)

text

## Установка и запуск
```bash
npm install      # Установка зависимостей
npm run dev      # Запуск в режиме разработки
npm run build    # Сборка для продакшена
Архитектура MVP
Приложение построено по паттерну Model-View-Presenter с использованием событийной коммуникации через EventEmitter.

Model (Модели данных)
Назначение: Хранение и управление данными приложения. Модели сами инициируют события при изменении состояния.

Класс Catalog
Управляет каталогом товаров.

typescript
class Catalog {
  constructor(events: EventEmitter) {}
  setItems(items: Product[]): void        // Вызывает catalog:changed
  getItems(): Product[]
  getProductById(id: string): Product | undefined
  setPreview(product: Product): void      // Вызывает preview:changed
  getPreview(): Product | null
  clearPreview(): void                    // Вызывает preview:changed
}
Класс Basket
Управляет корзиной покупок.

typescript
class Basket {
  constructor(events: EventEmitter) {}
  addItem(product: Product): void         // Вызывает basket:changed
  removeItem(id: string): void            // Вызывает basket:changed
  getItems(): Product[]
  getCount(): number
  getTotal(): number
  hasItem(id: string): boolean
  getItemIds(): string[]
  clear(): void                           // Вызывает basket:changed
}
Класс Order
Управляет данными покупателя.

typescript
class Order {
  constructor(events: EventEmitter) {}
  setData(data: Partial<OrderForm>): void // Вызывает order:form:update или order:contacts:update
  getData(): OrderForm
  validate(): Record<string, string>
  isValid(): boolean
  clear(): void                           // Вызывает order:form:update и order:contacts:update
}
View (Компоненты представления)
Назначение: Отображение данных и обработка пользовательских действий. View не хранят состояние и не имеют методов очистки или геттеров.

Базовые компоненты
Component - абстрактный базовый класс для всех компонентов

Modal - универсальное модальное окно (состояние определяется CSS-классом)

Header - шапка сайта с корзиной и счетчиком товаров

Gallery - контейнер для каталога товаров

BasketView - отображение корзины покупок (принимает готовые элементы BasketCard)

OrderFormView - форма заказа (способ оплаты и адрес) с активными кнопками оплаты

ContactsFormView - форма контактов (email и телефон) с блокировкой отправки при невалидных данных

SuccessView - сообщение об успешном заказе

Компоненты карточек
Card - абстрактный базовый класс для карточек (без геттеров, только сеттеры)

CatalogCard - карточка товара в каталоге

PreviewCard - детальный просмотр товара в модальном окне (создается один раз)

BasketCard - товар в корзине с кнопкой удаления (отдельный компонент, не наследуется от Card)

Presenter (Презентер)
Расположение: src/main.ts

Назначение: Координация взаимодействия между Model и View через обработку событий. Презентер только реагирует на события, не инициирует их.

Основные функции презентера:

Инициализация всех моделей и компонентов один раз при загрузке

Загрузка товаров с сервера через ApiShop

Подписка на события от View и Model

Обновление представления при изменении данных в моделях

Создание готовых элементов для View (BasketCard для корзины)

Логика добавления/удаления товаров из корзины

Отправка заказов на сервер

Ключевые обработчики событий:

card:select - выбор товара для просмотра

preview:action - действие с товаром в предпросмотре (добавить/удалить из корзины)

basket:remove - удаление товара из корзины (из BasketCard)

header:basket:open - открытие корзины

basket:order - начало оформления заказа

order:payment:changed - изменение способа оплаты

order:address:changed - изменение адреса доставки

order:email:changed - изменение email

order:phone:changed - изменение телефона

order:submit - отправка формы заказа

contacts:submit - отправка формы контактов

success:close - закрытие окна успешного заказа

catalog:changed - обновление каталога

preview:changed - обновление детального просмотра

basket:changed - обновление состояния корзины

order:form:update - обновление валидации формы заказа

order:contacts:update - обновление валидации формы контактов

Типы данных
typescript
interface Product {
    id: string
    title: string
    description: string
    image: string
    category: 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое'
    price: number | null
}

interface OrderForm {
    payment: 'card' | 'cash' | ''
    address: string
    email: string
    phone: string
}

interface OrderRequest extends OrderForm {
    total: number
    items: string[]
}

// Тип для карточек каталога и предпросмотра
interface ICard {
    id: string
    title: string
    image: string
    category: ProductCategory
    price: number | null
    description?: string
    buttonText?: string
    buttonDisabled?: boolean
}

// Отдельный тип для элементов корзины
interface IBasketItem {
    id: string
    title: string
    price: number | null
    index: number
}
Коммуникация с сервером
Класс ApiShop
typescript
class ApiShop {
  constructor(api: Api) {}
  getProductList(): Promise<ProductListResponse>
  createOrder(orderData: OrderRequest): Promise<{ id: string, total: number }>
}
Эндпоинты
GET /product/ - получение списка товаров

POST /order/ - создание нового заказа

Событийная система
Все компоненты общаются через EventEmitter, реализующий паттерн "Наблюдатель".

События от View → Presenter:
card:select - выбор карточки товара для просмотра

preview:action - действие с товаром в предпросмотре

basket:remove - удаление товара из корзины

header:basket:open - открытие корзины

basket:order - оформление заказа

order:payment:changed - изменение способа оплаты

order:address:changed - изменение адреса

order:email:changed - изменение email

order:phone:changed - изменение телефона

order:submit - отправка формы заказа

contacts:submit - отправка формы контактов

success:close - закрытие окна успеха

modal:close - закрытие модального окна

События от Model → Presenter → View:
catalog:changed → обновление каталога товаров

preview:changed → открытие предпросмотра товара

basket:changed → обновление состояния корзины и счетчика

order:form:update → обновление валидации формы заказа

order:contacts:update → обновление валидации формы контактов

Валидация данных
Реализована в классе Order:

Форма заказа: проверка выбора способа оплаты и ввода адреса доставки

Форма контактов: проверка формата email и наличия телефона

Отображение ошибок: ошибки показываются под формой, кнопка отправки блокируется при невалидных данных

Active кнопки оплаты: визуальная подсветка выбранного способа оплаты через CSS-класс

Ключевые особенности реализации
Архитектурные решения:
Чистая архитектура MVP - строгое разделение Model, View, Presenter

Модели управляют событиями - модели сами вызывают события при изменении состояния

View без состояния и геттеров - представления не хранят данные, только отображают их

Presenter как координатор - только реагирует на события, создает готовые элементы для View

Одноразовое создание View - экземпляры View компонентов создаются при инициализации (особенно PreviewCard)

Готовые элементы для корзины - BasketView принимает готовые HTMLElement элементы, созданные в презентере

Логика в презентере - решение о добавлении/удалении товара принимается в презентере, не в View

Технические детали:
Событийное программирование - слабая связность компонентов через EventEmitter

TypeScript - строгая типизация всего приложения

Переиспользуемые компоненты - единая база Component для всех компонентов

Изоляция DOM-манипуляций - все работы с DOM через методы View компонентов

Адаптивный дизайн - поддержка мобильных устройств

Обработка ошибок - валидация форм и обработка ошибок запросов к серверу

CSS-классы для состояния - состояние модального окна и кнопок оплаты определяется через CSS

Основной рабочий процесс
Пользователь загружает страницу → загружаются товары с сервера, Catalog вызывает catalog:changed

Пользователь просматривает каталог → Gallery отображает CatalogCard, CatalogCard отправляет card:select

Пользователь кликает на товар → Catalog вызывает preview:changed, открывается PreviewCard

Пользователь добавляет товар в корзину → PreviewCard отправляет preview:action, презентер решает добавить товар, Basket вызывает basket:changed

Пользователь открывает корзину → презентер создает BasketCard элементы и передает в BasketView

Пользователь оформляет заказ → открывается OrderFormView с активными кнопками оплаты

Пользователь заполняет контакты → открывается ContactsFormView с блокировкой невалидной отправки

Пользователь подтверждает заказ → данные отправляются на сервер

Пользователь видит подтверждение → SuccessView показывает результат

Технические детали
Сборка: Vite с Hot Module Replacement для разработки

Стили: SCSS с БЭМ-методологией именования классов

Валидация: кастомная реализация в классе Order с регулярными выражениями

API: RESTful API с базовой авторизацией

Состояние: хранится в моделях, обновляется через события

Шаблоны: HTML templates для динамического создания элементов

Утилиты: отдельный модуль для работы с DOM и вспомогательных функций

Принципы разработки
Один класс - одна ответственность - каждый класс решает конкретную задачу

Композиция вместо наследования - ApiShop использует Api через композицию

Неизменяемость данных - модели возвращают копии данных

Защищенные поля - внутреннее состояние скрыто от внешнего доступа

События вместо прямых вызовов - компоненты общаются через события

View зависят от Model - представления отражают состояние моделей

View без геттеров - представления не имеют методов получения состояния

Presenter не инициирует события - только реагирует на события моделей и представлений

CSS для состояния UI - состояние интерфейса определяется CSS-классами

Отсутствие магических значений - все константы вынесены в отдельные файлы