import { View } from './View';
import { formatUnit } from '../../common/utils';
export class Text extends View {
    constructor() {
        super();
        this.node.classList.add('hm-text');
        this._style = new Proxy(this._style, {
            get: (target, key) => {
                // 获取style
                return target[key] || this.node.style[key];
            },
            set: (target, key, value) => {
                // 设置style
                target[key] = value;
                switch (key) {
                    case 'textLineClamp': // TODO
                        target[key] = value;
                        break;
                    case 'fontSize':
                        target[key] = formatUnit(value);
                        this.node.style[key] = formatUnit(value);
                }
                return true;
            }
        });
    }
    createNode() {
        this.node = document.createElement('span');
    }
    get text() {
        return this.node.innerText;
    }
    set text(value) {
        this.node.innerText = value;
    }
    get formattedText() {
        return this.node.innerHTML;
    }
    set formattedText(value) {
        this.node.innerHTML = value;
    }
    get style() {
        return this._style;
    }
    set style(_style) {
        this._style = Object.assign(this._style, _style);
    }
}
//# sourceMappingURL=Text.js.map