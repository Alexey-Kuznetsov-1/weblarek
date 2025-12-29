import { Card } from './Card';
import { ICard } from '../../types';
import { EventEmitter } from '../base/Events';

export class PreviewCard extends Card<ICard> {
    private _button: HTMLElement | null = null;
    private _description: HTMLElement | null = null;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._events = events;
        
        const buttonElement = container.querySelector('.card__button');
        const descriptionElement = container.querySelector('.card__text');
        
        if (buttonElement) {
            this._button = buttonElement as HTMLElement;
            this._button.addEventListener('click', () => {
                const id = this.container.dataset.id;
                if (id) {
                    // Отправляем одно событие, презентер сам решит что делать
                    this._events.emit('preview:action', { id });
                }
            });
        }
        
        if (descriptionElement) {
            this._description = descriptionElement as HTMLElement;
        }
    }

    render(data: ICard): HTMLElement {
        super.render(data);
        this.container.dataset.id = data.id;
        return this.container;
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

    set buttonDisabled(value: boolean) {
        if (this._button) {
            this.setDisabled(this._button, value);
        }
    }

    updateButton(inCart: boolean, price: number | null) {
        if (!this._button) return;
        
        if (price === null) {
            this.buttonText = 'Недоступно';
            this.buttonDisabled = true;
        } else if (inCart) {
            this.buttonText = 'Удалить из корзины';
            this.buttonDisabled = false;
        } else {
            this.buttonText = 'Купить';
            this.buttonDisabled = false;
        }
    }
}