import { Input } from './Input';
export class TextArea extends Input {
    constructor() {
        super();
        this._style = new Proxy(this._style, {
            get: (target, key) => {
                switch (key) {
                    case 'textLineClamp':
                        return target[key] || this.node.rows;
                    default:
                        return target[key];
                }
                // 获取style
            },
            set: (target, key, value) => {
                // 设置style
                target[key] = value;
                switch (key) {
                    case 'textLineClamp':
                        this.node.rows = value;
                        break;
                }
                return true;
            }
        });
    }
    createNode() {
        this.node = document.createElement('textarea');
    }
    get style() {
        return this._style;
    }
    set style(_style) {
        this._style = Object.assign(this._style, _style);
    }
}
//# sourceMappingURL=TextArea.js.map