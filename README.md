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
Назначение: Хранение и управление данными приложения.

Класс Catalog
Управляет каталогом товаров.

typescript
class Catalog {
  constructor(events: EventEmitter) {}
  setItems(items: Product[]): void
  getItems(): Product[]
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
  hasItem(id: string): boolean
  getItemIds(): string[]
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
Component - абстрактный базовый класс для всех компонентов

Modal - универсальное модальное окно

Header - шапка сайта с корзиной

Gallery - контейнер для каталога товаров

BasketView - отображение корзины покупок

OrderFormView - форма заказа (способ оплаты и адрес)

ContactsFormView - форма контактов (email и телефон)

SuccessView - сообщение об успешном заказе

Компоненты карточек
Card - абстрактный базовый класс для карточек

CatalogCard - карточка товара в каталоге

PreviewCard - детальный просмотр товара в модальном окне

BasketCard - товар в корзине с кнопкой удаления

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
Presenter (Презентер)
Расположение: src/main.ts
Назначение: Координация взаимодействия между Model и View через обработку событий.

Основные функции презентера:
Инициализация всех моделей и компонентов (один раз при загрузке)

Загрузка товаров с сервера через ApiShop

Подписка на события от View и Model

Обновление представления при изменении данных в моделях

Обновление моделей при действиях пользователя в View

Валидация форм и отправка заказов на сервер

Ключевые обработчики событий:
card:select - выбор товара для просмотра

card:add - добавление товара в корзину

card:remove - удаление товара из корзины (из предпросмотра)

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

order:changed - обновление данных заказа

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

События от View → Презентер:
card:select - выбор карточки товара

card:add - добавление товара в корзину

card:remove - удаление товара из корзины

basket:remove - удаление товара из корзины (специальное для BasketCard)

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

События от Model → Презентер → View:
catalog:changed → обновление каталога товаров

preview:changed → открытие предпросмотра товара

basket:changed → обновление состояния корзины и счетчика

order:changed → обновление данных заказа

Валидация данных
Реализована в классе Order:

Форма заказа: проверка выбора способа оплаты и ввода адреса доставки

Форма контактов: проверка формата email и наличия телефона

Отображение ошибок: ошибки показываются под формой с подсветкой невалидных полей

Ключевые особенности реализации
Чистая архитектура MVP - строгое разделение Model, View, Presenter

Событийное программирование - слабая связность компонентов через EventEmitter

TypeScript - строгая типизация всего приложения

Переиспользуемые компоненты - единая база Card для всех типов карточек

Создание View один раз - экземпляры View компонентов создаются при инициализации

Изоляция DOM-манипуляций - все работы с DOM через методы View компонентов

Адаптивный дизайн - поддержка мобильных устройств

Обработка ошибок - валидация форм и обработка ошибок запросов к серверу

Основной рабочий процесс
Пользователь загружает страницу → загружаются товары с сервера

Пользователь просматривает каталог товаров → Gallery отображает CatalogCard

Пользователь кликает на товар → открывается PreviewCard в модальном окне

Пользователь добавляет товар в корзину → Basket сохраняет товар

Пользователь открывает корзину → BasketView отображает список товаров

Пользователь оформляет заказ → открывается OrderFormView

Пользователь заполняет контакты → открывается ContactsFormView

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

Отсутствие магических значений - все константы вынесены в отдельные файлы