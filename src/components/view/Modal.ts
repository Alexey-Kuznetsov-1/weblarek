import { Component } from '../base/Component';
import { IModal } from '../../types';
import { EventEmitter } from '../base/Events';

export class Modal extends Component<IModal> {
    private _closeButton: HTMLElement;
    private _content: HTMLElement;
    private _events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._events = events;
        
        this._closeButton = container.querySelector('.modal__close')!;
        this._content = container.querySelector('.modal__content')!;

        this._closeButton.addEventListener('click', () => this.close());
        container.addEventListener('click', (event: MouseEvent) => {
            if (event.target === container) {
                this.close();
            }
        });
    }

    set content(content: HTMLElement) {
        this._content.innerHTML = '';
        this._content.appendChild(content);
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this._handleEscape);
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this._content.innerHTML = '';
        document.removeEventListener('keydown', this._handleEscape);
        this._events.emit('modal:close');
    }

    private _handleEscape = (event: KeyboardEvent): void => {
        if (event.key === 'Escape') {
            this.close();
        }
    };
}