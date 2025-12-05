# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

##### Данные
В приложении используются следующие интерфейсы данных:

Интерфейс Product (Товар)
typescript
interface Product {
    id: string;
    title: string;
    description: string;
    image: string;
    category: 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';
    price: number | null;
}
Интерфейс OrderForm (Данные покупателя)
typescript
type PaymentMethod = 'card' | 'cash' | '';

interface OrderForm {
    payment: PaymentMethod;
    address: string;
    email: string;
    phone: string;
}
Типы для коммуникации с сервером
typescript
// Ответ от сервера на запрос списка товаров
interface ProductListResponse {
    total: number;
    items: Product[];
}

// Данные для отправки заказа на сервер (расширяет OrderForm)
interface OrderRequest extends OrderForm {
    total: number;      // Общая сумма заказа
    items: string[];    // Массив ID товаров
}

// Ответ от сервера на создание заказа
interface OrderResponse {
    id: string;         // ID созданного заказа
    total: number;      // Подтвержденная сумма заказа
}
##### Модели данных
Класс Catalog (Каталог товаров)
Назначение: Отвечает за хранение и управление списком товаров, доступных для покупки.

Конструктор:

typescript
constructor()
Конструктор не принимает параметров, инициализирует пустой массив товаров.

Поля класса:

private items: Product[] - массив всех товаров каталога

private selectedItem: Product | null - товар, выбранный для подробного отображения

Методы класса:

setItems(items: Product[]): void
Описание: Сохраняет массив товаров, полученный в параметрах
Параметр: items: Product[] - массив объектов типа Product
Возвращает: void

getItems(): Product[]
Описание: Возвращает массив всех товаров из каталога
Возвращает: Product[] - массив объектов типа Product

setPreview(item: Product): void
Описание: Сохраняет товар для подробного отображения
Параметр: item: Product - объект типа Product
Возвращает: void

getPreview(): Product | null
Описание: Возвращает товар, выбранный для подробного отображения
Возвращает: Product | null - объект типа Product или null

getProductById(id: string): Product | undefined
Описание: Находит товар по его идентификатору
Параметр: id: string - строковый идентификатор товара
Возвращает: Product | undefined - объект типа Product или undefined если не найден

clearPreview(): void
Описание: Очищает выбранный товар
Возвращает: void

Класс Basket (Корзина)
Назначение: Отвечает за хранение и управление товарами, выбранными пользователем для покупки. Каждый товар может быть добавлен только в одном экземпляре.

Конструктор:

typescript
constructor()
Конструктор не принимает параметров, инициализирует пустую корзину.

Поля класса:

private items: Product[] - массив товаров в корзине

Методы класса:

addItem(product: Product): void
Описание: Добавляет товар в корзину. Если товар уже есть в корзине, не добавляет его повторно.
Параметр: product: Product - объект типа Product
Возвращает: void

removeItem(productId: string): void
Описание: Удаляет товар из корзины по его идентификатору
Параметр: productId: string - строковый идентификатор товара
Возвращает: void

getCount(): number
Описание: Возвращает количество уникальных товаров в корзине
Возвращает: number - количество товаров (длина массива)

getItems(): Product[]
Описание: Возвращает массив товаров, которые находятся в корзине
Возвращает: Product[] - массив объектов типа Product

getTotal(): number
Описание: Рассчитывает общую стоимость всех товаров в корзине
Возвращает: number - сумма в синапсах

hasItem(productId: string): boolean
Описание: Проверяет наличие товара в корзине по его идентификатору
Параметр: productId: string - строковый идентификатор товара
Возвращает: boolean - true если товар есть в корзине

getItemIds(): string[]
Описание: Возвращает массив ID товаров для отправки на сервер при оформлении заказа
Возвращает: string[] - массив идентификаторов товаров

clear(): void
Описание: Очищает корзину (удаляет все товары)
Возвращает: void

Класс Order (Покупатель)
Назначение: Отвечает за хранение и валидацию данных покупателя при оформлении заказа.

Конструктор:

typescript
constructor()
Конструктор не принимает параметров, инициализирует пустые поля данных покупателя.

Поля класса:

private data: OrderForm - объект с данными покупателя

Методы класса:

setData(data: Partial<OrderForm>): void
Описание: Сохраняет данные покупателя. Позволяет сохранить только часть полей, не удаляя другие.
Параметр: data: Partial<OrderForm> - объект с частичными данными типа OrderForm
Возвращает: void

getData(): OrderForm
Описание: Возвращает все данные покупателя
Возвращает: OrderForm - объект с данными покупателя

validate(): Record<string, string>
Описание: Проверяет валидность полей покупателя и возвращает объект с ошибками.
Возвращает: Record<string, string> - объект, где ключи - названия полей, значения - тексты ошибок. Если поле валидно, его нет в объекте.

isValid(): boolean
Описание: Проверяет, есть ли ошибки валидации
Возвращает: boolean - true если ошибок нет (все поля валидны)

clear(): void
Описание: Очищает все данные покупателя
Возвращает: void

private isValidEmail(email: string): boolean
Описание: Проверяет валидность email с помощью регулярного выражения
Параметр: email: string - email для проверки
Возвращает: boolean - true если email валиден

Слой коммуникации
Для работы с сервером используются функции из src/utils/api.ts:

Функция getProductList()

typescript
async function getProductList(): Promise<ProductListResponse>
Описание: Получает список товаров с сервера API
Возвращает: Promise<ProductListResponse> - промис с данными от сервера
Эндпоинт: GET /product/

Функция createOrder()

typescript
async function createOrder(orderData: OrderRequest): Promise<{ id: string; total: number }>
Описание: Отправляет данные заказа на сервер
Параметры: orderData: OrderRequest - объект с данными заказа
Возвращает: Promise<{ id: string; total: number }> - промис с ответом сервера
Эндпоинт: POST /order/

Точка входа (main.ts)
Файл src/main.ts является точкой входа приложения и выполняет следующие функции:

Инициализирует экземпляры всех моделей данных

Тестирует работу методов моделей с тестовыми данными

Выполняет запрос к серверу для получения реальных данных о товарах

Передает полученные данные в модели

Обеспечивает связь между API и моделями данных

Примеры использования
Получение товаров с сервера и сохранение в каталог:

typescript
import { getProductList } from './utils/api';
import { Catalog } from './components/models/catalog';

const catalog = new Catalog();
const response = await getProductList();
catalog.setItems(response.items);
Работа с корзиной:

typescript
import { Basket } from './components/models/basket';
import { Catalog } from './components/models/catalog';

const catalog = new Catalog();
const basket = new Basket();

// Загружаем товары в каталог
const product = catalog.getItems()[0];
basket.addItem(product); // Добавить товар (добавится)
basket.addItem(product); // Попытка добавить тот же товар (не добавится)
const count = basket.getCount(); // Получить количество товаров (1)
const total = basket.getTotal(); // Получить сумму
const items = basket.getItems(); // Получить все товары
const itemIds = basket.getItemIds(); // Получить ID товаров для заказа
Валидация заказа:

typescript
import { Order } from './components/models/order';

const order = new Order();
order.setData({
    email: 'test@example.com',
    phone: '+79991234567',
    address: 'Москва, ул. Тестовая, д. 1',
    payment: 'card'
});

const errors = order.validate(); // Получить объект ошибок (пустой объект если нет ошибок)
const isValid = order.isValid(); // Проверить валидность (true)
Создание заказа:

typescript
import { createOrder } from './utils/api';
import { Basket } from './components/models/basket';
import { Order } from './components/models/order';

const basket = new Basket();
const order = new Order();

// ... добавление товаров в корзину и заполнение данных покупателя

if (order.isValid() && basket.getCount() > 0) {
    const orderData = {
        ...order.getData(),
        total: basket.getTotal(),
        items: basket.getItemIds()
    };
    
    const result = await createOrder(orderData);
    console.log(`Заказ создан: ID ${result.id}, сумма ${result.total}`);
}

##### Класс ApiShop
*Назначение*: Класс для выполнения конкретных запросов к серверу API магазина. Использует базовый класс Api для выполнения HTTP-запросов.

*Конструктор*:
```typescript
constructor(api: Api)
Принимает экземпляр базового класса Api.

Методы класса:

getProductList(): Promise<ProductListResponse>
Описание: Получает список товаров с сервера
Возвращает: Promise<ProductListResponse> - промис с данными от сервера

createOrder(orderData: OrderRequest): Promise<{ id: string; total: number }>
Описание: Отправляет данные заказа на сервер
Параметр: orderData: OrderRequest - данные заказа
Возвращает: Promise<{ id: string; total: number }> - ответ сервера

Пример использования:

typescript
import { Api } from './components/base/Api';
import { ApiShop } from './components/ApiShop';
import { Catalog } from './components/models/catalog';

const baseApi = new Api('https://api.example.com');
const apiShop = new ApiShop(baseApi);
const catalog = new Catalog();

const response = await apiShop.getProductList();
catalog.setItems(response.items);

##### Заключение
Проект реализует многослойную архитектуру с четким разделением ответственности. Модели данных независимы от представления и слоя коммуникации, что обеспечивает гибкость и масштабируемость приложения. Все компоненты протестированы и готовы к интеграции с UI слоем.