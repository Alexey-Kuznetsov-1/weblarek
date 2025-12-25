import { Component } from '../base/Component';
import { IGallery } from '../../types';

export class Gallery extends Component<IGallery> {
    private _itemsContainer: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._itemsContainer = container;
    }

    set items(elements: HTMLElement[]) {
        this._itemsContainer.innerHTML = '';
        elements.forEach(element => {
            this._itemsContainer.appendChild(element);
        });
    }
}