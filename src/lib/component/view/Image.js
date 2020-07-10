import { View } from './View';
export class Image extends View {
    constructor() {
        super();
        this._style = new Proxy(this._style, {
            get: (target, key) => {
                // 获取style
                switch (key) {
                    case 'resize':
                        return target[key] || this.node.style.backgroundSize;
                    default:
                        return target[key] || this.node.style[key];
                }
            },
            set: (target, key, value) => {
                // 设置style
                target[key] = value;
                switch (key) {
                    case 'resize':
                        this.setImageResizeMode(value);
                        break;
                    default:
                        this.node.style[key] = value;
                }
                return true;
            }
        });
    }
    createNode() {
        this.node = document.createElement('div');
    }
    setImageResizeMode(value) {
        switch (value) {
            case 'origin':
                this.node.style.backgroundSize = 'initial';
                this.node.style.backgroundRepeat = 'no-repeat';
                this.node.style.backgroundPosition = 'center center';
                break;
            case 'contain':
                this.node.style.backgroundSize = 'contain';
                this.node.style.backgroundRepeat = 'no-repeat';
                this.node.style.backgroundPosition = 'center center';
                break;
            case 'cover':
                this.node.style.backgroundSize = 'cover';
                this.node.style.backgroundRepeat = 'no-repeat';
                this.node.style.backgroundPosition = 'center center';
                break;
            case 'stretch':
                this.node.style.backgroundSize = '100% 100%';
                this.node.style.backgroundRepeat = 'no-repeat';
                this.node.style.backgroundPosition = '0 0';
                break;
        }
    }
    get src() {
        return this._src;
    }
    set src(src) {
        this._src = src;
        this.node.style.backgroundImage = `url(${src})`;
    }
    set onload(onload) {
        this.node.onload = onload;
    }
    get onload() {
        return this.node.onload;
    }
    get style() {
        return this._style;
    }
    set style(_style) {
        this._style = Object.assign(this._style, _style);
    }
}