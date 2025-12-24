// src/components/view/Modal.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        
        const closeButton = container.querySelector('.modal__close');
        const content = container.querySelector('.modal__content');
        
        if (!closeButton || !content) {
            throw new Error('Не найдены элементы модального окна');
        }
        
        this._closeButton = closeButton as HTMLButtonElement;
        this._content = content as HTMLElement;

        this._closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) this.close();
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.body.classList.add('modal-open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.body.classList.remove('modal-open');
        this.events.emit('modal:close');
    }
}