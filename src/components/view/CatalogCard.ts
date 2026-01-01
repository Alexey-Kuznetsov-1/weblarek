import { Card } from './Card';
import { ICard } from '../../types';

interface CatalogCardActions {
    onClick: () => void;
}

export class CatalogCard extends Card<ICard> {
    constructor(container: HTMLElement, actions: CatalogCardActions) {
        super(container);
        this.container.addEventListener('click', actions.onClick);
    }
}