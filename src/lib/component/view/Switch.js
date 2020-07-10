import { View } from './View';
import { SwitchEvent } from '../event/SwitchEvent';
import { formatUnit } from '../../common/utils';
export class Switch extends View {
    constructor() {
        super();
        this._style = new Proxy(this._style, {
            get: (target, key) => {
                // 获取style
                switch (key) {
                    case 'onColor':
                        target[key] = target[key] || 'rgb(19, 206, 102)';
                        break;
                    case 'offColor':
                        target[key] = target[key] || 'rgb(255, 73, 73)';
                        break;
                    case 'thumbColor':
                        target[key] = target[key] || '#fff';
                        break;
                }
                return target[key] || this.node.style[key];
            },
            set: (target, key, value) => {
                target[key] = value;
                switch (key) {
                    case 'onColor':
                        if (this.checked) {
                            this.switchBtn.style.borderColor = value;
                            this.switchBtn.style.backgroundColor = value;
                        }
                        break;
                    case 'offColor':
                        if (!this.checked) {
                            this.switchBtn.style.borderColor = value;
                            this.switchBtn.style.backgroundColor = value;
                        }
                        break;
                    case 'thumbColor':
                        this.circle.style.backgroundColor = value;
                        break;
                    case 'height':
                        this.switchBtn.style[key] = formatUnit(value);
                        this.circle.style['height'] = formatUnit(value);
                        this.circle.style['width'] = formatUnit(value);
                        this.switchBtn.style['borderRadius'] = formatUnit(value);
                        break;
                    case 'width':
                        this.switchBtn.style[key] = formatUnit(value);
                        break;
                }
                return true;
            }
        });
        this.bindEvents();
    }
    createNode() {
        this.node = document.createElement('div');
        this.node.classList.add('hm-switch');
        this.switchBtn = document.createElement('div');
        this.switchBtn.classList.add('hm-switch-btn');
        this.circle = document.createElement('div');
        this.circle.classList.add('hm-switch-thumb');
        this.switchBtn.appendChild(this.circle);
        this.node.appendChild(this.switchBtn);
    }
    bindEvents() {
        let dom = this.node;
        let that = this;
        console.log('ddd');
        dom.addEventListener('click', function () {
            let className = dom.className;
            if (/hm-switch-checked/.test(className)) {
                that.checked = false;
            }
            else {
                that.checked = true;
            }
        });
    }
    addEventListener(key, listener) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        // 将事件callback加入到事件队列
        this.listeners[key].push(listener);
        if (!this.eventListeners[key]) {
            switch (key) {
                case 'switch':
                    this.addChangeEvent = (ev) => {
                        this.listeners['switch'].forEach((listener) => listener(ev));
                    };
            }
        }
    }
    set checked(val) {
        if (this.disabled) {
            return;
        }
        let changeCbk = this.addChangeEvent;
        if (val === true) {
            this.circle.style.right = '2px';
            this.switchBtn.style.borderColor = this._style.onColor || 'rgb(19, 206, 102)';
            this.switchBtn.style.backgroundColor = this._style.onColor || 'rgb(19, 206, 102)';
            this.node.classList.add('hm-switch-checked');
        }
        else {
            const width = +this._style.width.replace('px', '');
            const circleWidth = +this.circle.style['width'].replace('px', '');
            console.log(width, circleWidth);
            this.circle.style.right = (width - circleWidth - 2) + 'px';
            this.switchBtn.style.borderColor = this._style.offColor || 'rgb(255, 73, 73)';
            this.switchBtn.style.backgroundColor = this._style.offColor || 'rgb(255, 73, 73)';
            this.node.classList.remove('hm-switch-checked');
        }
        if (changeCbk) {
            const ev = new SwitchEvent();
            ev.target = this;
            ev.state = this.checked;
            changeCbk(ev);
        }
    }
    get checked() {
        return /hm-switch-checked/.test(this.node.className);
    }
    get style() {
        return this._style;
    }
    set style(_style) {
        this._style = Object.assign(this._style, _style);
    }
}