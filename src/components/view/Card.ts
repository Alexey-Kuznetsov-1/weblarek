// src/components/view/Card.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { categoryMap } from '../../utils/constants';

export interface ICard {
    title: string;
    image: string;
    category: string;
    price: number | null;
    description?: string;
    buttonText?: string;
    index?: number;
}

export class Card<T> extends Component<T> {
    protected container: HTMLElement;
    protected events: EventEmitter;
    
    protected _title: HTMLElement | null;
    protected _image: HTMLImageElement | null;
    protected _category: HTMLElement | null;
    protected _price: HTMLElement | null;
    protected _button?: HTMLButtonElement | null;
    protected _description?: HTMLElement | null;
    protected _index?: HTMLElement | null;

    constructor(
        container: HTMLElement,
        events: EventEmitter
    ) {
        super(container);
        this.container = container;
        this.events = events;
        
        // Находим элементы (могут быть null для некоторых типов карточек)
        this._title = this.container.querySelector('.card__title');
        this._image = this.container.querySelector('.card__image');
        this._category = this.container.querySelector('.card__category');
        this._price = this.container.querySelector('.card__price');
        
        // Опциональные элементы
        this._button = this.container.querySelector('.card__button');
        this._description = this.container.querySelector('.card__text');
        this._index = this.container.querySelector('.basket__item-index');
        
        // УБРАЛИ СТРОГУЮ ПРОВЕРКУ - разные карточки имеют разные элементы
        // Вместо этого проверяем в дочерних классах то, что им нужно
    }

    set title(value: string) {
        if (this._title) this.setText(this._title, value);
    }

    set image(value: string) {
        if (this._image) this.setImage(this._image, value);
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this._category.className = 'card__category';
            this._category.classList.add(categoryClass);
        }
    }

    set price(value: number | null) {
        if (this._price) {
            const priceText = value !== null ? `${value} синапсов` : 'Бесценно';
            this.setText(this._price, priceText);
        }
    }

    set description(value: string) {
        if (this._description) {
            this.setText(this._description, value);
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this.setText(this._button, value);
        }
    }

    set index(value: number) {
        if (this._index) {
            this.setText(this._index, value);
        }
    }

    updateButton(inCart: boolean, price: number | null): void {
        if (!this._button) return;

        if (price === null) {
            if (this._button) {
                this.buttonText = 'Недоступно';
                this.setDisabled(this._button, true);
            }
        } else {
            if (this._button) {
                this.buttonText = inCart ? 'Убрать из корзины' : 'В корзину';
                this.setDisabled(this._button, false);
            }
        }
    }
}