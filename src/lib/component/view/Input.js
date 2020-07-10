import { View, SIZE_STYLE } from './View';
import { formatUnit } from '../../common/utils';
export const INPUT_SIZE_STYLE = [
    'fontSize'
].concat(SIZE_STYLE);
export class Input extends View {
    constructor() {
        super();
        this._placeholderCssIndex = 0;
        this._style = new Proxy({}, {
            get: (target, key) => {
                switch (key) {
                    case 'type':
                        return target[key] || this.node.type;
                    case 'maxLength':
                        return target[key] || this.node.maxLength;
                    case 'placeholderColor':
                    case 'placeholderFontSize':
                    case 'returnKeyType':
                        return target[key];
                    case 'cursorColor':
                        return target[key] || this.node.style['caretColor'];
                    case 'color':
                    case 'fontSize':
                    default:
                        return target[key] || this.node.style[key];
                }
                // 获取style
            },
            set: (target, key, value) => {
                // 设置style
                if (SIZE_STYLE.includes(key)) {
                    target[key] = formatUnit(value);
                }
                else {
                    target[key] = value;
                }
                switch (key) {
                    case 'type':
                        this.node.type = value;
                        break;
                    case 'placeholderColor':
                        this.changePlaceholder({ color: value, fontSize: this.style.placeholderFontSize });
                        break;
                    case 'placeholderFontSize':
                        this.changePlaceholder({ color: this.style.placeholderColor, fontSize: value });
                        break;
                    case 'cursorColor':
                        this.node.style.caretColor = value;
                        break;
                    case 'maxLength':
                        this.node.maxLength = value;
                        break;
                    case 'returnKeyType': // TODO not support
                        break;
                    case 'color':
                    case 'fontSize':
                    default:
                        if (INPUT_SIZE_STYLE.includes(key)) {
                            this.node.style[key] = formatUnit(value);
                        }
                        else {
                            this.node.style[key] = value;
                        }
                }
                return true;
            }
        });
        this.defaultStyle();
    }
    defaultStyle() {
        this.node.classList.add('hm-default-inline');
    }
    /**
     * 通过添加伪类::placeholder来修改placeholder
     */
    changePlaceholder({ fontSize, color }) {
        this.node.classList.remove(this._randomPlaceholderClass);
        this._randomPlaceholderClass = `hm-placeholder-${++this._placeholderCssIndex}`;
        this.node.classList.add(this._randomPlaceholderClass);
        if (document.styleSheets.item(0)) {
            const item = document.styleSheets.item(0);
            if (item.addRule) {
                item.addRule(`.${this._randomPlaceholderClass}::placeholder`, `font-size: ${formatUnit(fontSize)}; color: ${color};`);
            }
        }
    }
    createNode() {
        this.node = document.createElement('input');
    }
    get text() {
        return this.node.value;
    }
    set text(value) {
        this.node.value = value;
    }
    get focused() {
        return document.activeElement === this.node;
    }
    set focused(focused) {
        if (focused) {
            this.node.focus();
        }
        else {
            this.node.blur();
        }
    }
    get placeholder() {
        return this.node.placeholder;
    }
    set placeholder(value) {
        this.node.placeholder = value;
    }
    get style() {
        return this._style;
    }
    set style(_style) {
        this._style = Object.assign(this._style, _style);
    }
    clear() {
        this.text = '';
    }
}