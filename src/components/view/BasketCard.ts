import { Component } from '../base/Component';
import { IBasketItem } from '../../types';

interface BasketCardActions {
    onClick: () => void;
}

export class BasketCard extends Component<IBasketItem> {
    private _indexElement: HTMLElement;
    private _titleElement: HTMLElement;
    private _priceElement: HTMLElement;
    private _deleteButton: HTMLElement;

    constructor(container: HTMLElement, actions: BasketCardActions) {
        super(container);
        
        this._indexElement = container.querySelector('.basket__item-index')!;
        this._titleElement = container.querySelector('.card__title')!;
        this._priceElement = container.querySelector('.card__price')!;
        this._deleteButton = container.querySelector('.basket__item-delete')!;
        
        this._deleteButton.addEventListener('click', actions.onClick);
    }

    render(data: IBasketItem): HTMLElement {
        this._indexElement.textContent = data.index.toString();
        this._titleElement.textContent = data.title;
        this._priceElement.textContent = data.price ? `${data.price} синапсов` : 'Бесценно';
        
        return this.container;
    }
}