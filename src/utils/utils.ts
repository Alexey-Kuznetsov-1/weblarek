// Проверка, является ли строка CSS селектором
export function isSelector(x: any): x is string {
    return (typeof x === "string") && x.length > 1;
}

// Проверка на пустое значение
export function isEmpty(value: any): boolean {
    return value === null || value === undefined;
}

// Тип для коллекции селекторов
export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

// Получение всех элементов по селектору
export function ensureAllElements<T extends HTMLElement>(
    selectorElement: SelectorCollection<T>, 
    context: HTMLElement = document as unknown as HTMLElement
): T[] {
    if (isSelector(selectorElement)) {
        return Array.from(context.querySelectorAll(selectorElement)) as T[];
    }
    if (selectorElement instanceof NodeList) {
        return Array.from(selectorElement) as T[];
    }
    if (Array.isArray(selectorElement)) {
        return selectorElement;
    }
    throw new Error(`Unknown selector element`);
}

// Тип для единичного селектора
export type SelectorElement<T> = T | string;

// Получение элемента по селектору (гарантирует наличие элемента)
export function ensureElement<T extends HTMLElement>(
    selectorElement: SelectorElement<T>, 
    context?: HTMLElement
): T {
    if (isSelector(selectorElement)) {
        const elements = ensureAllElements<T>(selectorElement, context);
        if (elements.length > 1) {
            console.warn(`selector ${selectorElement} return more then one element`);
        }
        if (elements.length === 0) {
            throw new Error(`selector ${selectorElement} return nothing`);
        }
        return elements[0] as T;
    }
    if (selectorElement instanceof HTMLElement) {
        return selectorElement as T;
    }
    throw new Error('Unknown selector element');
}

// Клонирование шаблона
export function cloneTemplate<T extends HTMLElement>(query: string | HTMLTemplateElement): T {
    const template = ensureElement(query) as HTMLTemplateElement;
    if (!template.content.firstElementChild) {
        throw new Error(`Template ${query} has no content`);
    }
    return template.content.firstElementChild.cloneNode(true) as T;
}

// Генератор CSS классов по БЭМ
export function bem(block: string, element?: string, modifier?: string): { name: string, class: string } {
    let name = block;
    if (element) name += `__${element}`;
    if (modifier) name += `_${modifier}`;
    return {
        name,
        class: `.${name}`
    };
}

// Установка dataset атрибутов
export function setElementData<T extends Record<string, unknown> | object>(el: HTMLElement, data: T) {
    for (const key in data) {
        el.dataset[key] = String(data[key]);
    }
}

// Получение типизированных данных из dataset
export function getElementData<T extends Record<string, unknown>>(el: HTMLElement, scheme: Record<string, Function>): T {
    const data: Partial<T> = {};
    for (const key in el.dataset) {
        data[key as keyof T] = scheme[key](el.dataset[key]);
    }
    return data as T;
}

// Проверка на простой объект
export function isPlainObject(obj: unknown): obj is object {
    const prototype = Object.getPrototypeOf(obj);
    return prototype === Object.getPrototypeOf({}) || prototype === null;
}

// Проверка на булево значение
export function isBoolean(v: unknown): v is boolean {
    return typeof v === 'boolean';
}

// Создание элемента с свойствами
export function createElement<T extends HTMLElement>(
    tagName: keyof HTMLElementTagNameMap,
    props?: Partial<Record<keyof T, string | boolean | object>>,
    children?: HTMLElement | HTMLElement[]
): T {
    const element = document.createElement(tagName) as T;
    if (props) {
        for (const key in props) {
            const value = props[key];
            if (isPlainObject(value) && key === 'dataset') {
                setElementData(element, value);
            } else {
                // @ts-expect-error fix indexing later
                element[key] = isBoolean(value) ? value : String(value);
            }
        }
    }
    if (children) {
        for (const child of Array.isArray(children) ? children : [children]) {
            element.append(child);
        }
    }
    return element;
}

// Новые утилиты для работы с формами

// Валидация email
export function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Валидация телефона (упрощенная)
export function validatePhone(phone: string): boolean {
    return phone.trim().length >= 5;
}

// Валидация адреса
export function validateAddress(address: string): boolean {
    return address.trim().length >= 3;
}

// Форматирование цены
export function formatPrice(price: number | null): string {
    if (price === null) return 'Бесценно';
    return `${price} синапсов`;
}

// Получение класса для категории
export function getCategoryClass(category: string): string {
    const categoryMap: Record<string, string> = {
        'софт-скил': 'card__category_soft',
        'хард-скил': 'card__category_hard',
        'кнопка': 'card__category_button',
        'дополнительное': 'card__category_additional',
        'другое': 'card__category_other'
    };
    return categoryMap[category] || 'card__category_other';
}