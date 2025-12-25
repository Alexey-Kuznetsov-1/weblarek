import { Component } from '../base/Component';
import { ICard } from '../../types';
import { getCategoryClass, formatPrice } from '../../utils/utils';

export abstract class Card<T extends ICard> extends Component<T> {
    protected _title: HTMLElement | null = null;
    protected _image: HTMLImageElement | null = null;
    protected _category: HTMLElement | null = null;
    protected _price: HTMLElement | null = null;
    protected _id: string = '';

    constructor(container: HTMLElement) {
        super(container);
        
        const titleElement = container.querySelector('.card__title');
        if (titleElement) this._title = titleElement as HTMLElement;
        
        const imageElement = container.querySelector('.card__image');
        if (imageElement) this._image = imageElement as HTMLImageElement;
        
        const categoryElement = container.querySelector('.card__category');
        if (categoryElement) this._category = categoryElement as HTMLElement;
        
        const priceElement = container.querySelector('.card__price');
        if (priceElement) this._price = priceElement as HTMLElement;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
        // Сохраняем id в dataset для отладки
        this.container.dataset.id = value;
    }

    set title(value: string) {
        if (this._title) {
            this.setText(this._title, value);
        }
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value);
        }
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const categoryClass = getCategoryClass(value);
            this._category.className = `card__category ${categoryClass}`;
        }
    }

    set price(value: number | null) {
        if (this._price) {
            this.setText(this._price, formatPrice(value));
        }
    }
}