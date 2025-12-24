# Проектная работа "Веб-ларек"

## Описание проекта
Интернет-магазин «Web-Larёk» для товаров веб-разработчиков с возможностью просмотра товаров, добавления в корзину и оформления заказов.

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
Приложение построено по паттерну Model-View-Presenter с использованием событийной коммуникации:

Model (Модели данных)
Назначение: Хранение и управление данными приложения.

Класс Catalog
Управляет каталогом товаров.

typescript
class Catalog {
  constructor(events: EventEmitter) {}
  setItems(items: Product[]): void
  getProductById(id: string): Product | undefined
  setPreview(product: Product): void
  getPreview(): Product | null
  clearPreview(): void
}
Класс Basket
Управляет корзиной покупок.

typescript
class Basket {
  constructor(events: EventEmitter) {}
  addItem(product: Product): void
  removeItem(id: string): void
  getItems(): Product[]
  getCount(): number
  getTotal(): number
  clear(): void
}
Класс Order
Управляет данными покупателя.

typescript
class Order {
  constructor(events: EventEmitter) {}
  setData(data: Partial<OrderForm>): void
  getData(): OrderForm
  validate(): Record<string, string>
  isValid(): boolean
  clear(): void
}
View (Компоненты представления)
Назначение: Отображение данных и обработка пользовательских действий.

Базовые компоненты
Component - базовый класс для всех компонентов

Modal - универсальное модальное окно

Header - шапка сайта с корзиной

Gallery - контейнер для каталога товаров

Компоненты карточек
CatalogCard - карточка товара в каталоге

PreviewCard - детальный просмотр товара

BasketCard - товар в корзине

Типы данных
typescript
interface Product {
  id: string
  title: string
  description: string
  image: string
  category: string
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
Presenter (Презентер)
Расположение: src/main.ts
Назначение: Координация взаимодействия между Model и View через обработку событий.

Основные функции презентера:
Инициализация всех моделей и компонентов

Загрузка товаров с сервера

Обработка пользовательских действий (клики, ввод данных)

Обновление представления при изменении данных

Отправка заказов на сервер

Ключевые обработчики событий:
card:select - выбор товара для просмотра

card:add/card:remove - управление корзиной

header:basket:open - открытие корзины

basket:order - начало оформления заказа

order:submit - отправка формы заказа

preview:changed - обновление детального просмотра

basket:changed - обновление состояния корзины

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
Все компоненты общаются через EventEmitter:

События от View → Презентер:

card:select, card:add, card:remove

header:basket:open, basket:remove

modal:close

События от Model → Презентер → View:

catalog:changed → обновление каталога

preview:changed → открытие предпросмотра

basket:changed → обновление корзины

order:changed → обновление данных заказа

Валидация данных
Форма заказа: проверка выбора оплаты и адреса

Форма контактов: проверка email и телефона

Реализована в классе Order с показом ошибок пользователю

Ключевые особенности реализации
Чистая архитектура - строгое разделение Model, View, Presenter

Событийное программирование - слабая связность компонентов

TypeScript - строгая типизация всего приложения

Переиспользуемые компоненты - единая база для всех карточек

Адаптивный дизайн - поддержка мобильных устройств

Обработка ошибок - валидация форм и запросов к серверу

Основной рабочий процесс
Пользователь просматривает каталог товаров

Выбирает товар для детального просмотра

Добавляет товары в корзину

Открывает корзину для просмотра выбранного

Заполняет форму доставки и контактов

Отправляет заказ на сервер

Получает подтверждение об успешном заказе

Технические детали
Сборка: Vite с Hot Module Replacement

Стили: SCSS с БЭМ-методологией

Валидация: кастомная реализация в классе Order

API: RESTful с базовой авторизацией

Состояние: хранится в моделях, обновляется через события