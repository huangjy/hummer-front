import { Environment } from './Environment';
export class HummerGlobal {
    constructor() {
        this.env = new Environment();
    }
    render(page) {
        window.addEventListener('load', () => {
            const body = document.getElementsByTagName('body')[0];
            body.appendChild(page.node);
            const event = new CustomEvent('render-ready', {});
            window.dispatchEvent(event);
        });
    }
}
export const Hummer = new HummerGlobal();