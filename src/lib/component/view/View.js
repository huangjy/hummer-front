import * as Hammer from 'hammerjs';
import { InputEvent, InputState } from '../event/InputEvent';
import { PanEvent, PanState } from '../event/PanEvent';
import { PinchEvent, PinchState } from '../event/PinchEvent';
import { SwipeEvent, SwipeState } from '../event/SwipeEvent';
import { TapEvent, TapState } from '../event/TapEvent';
import { LongPressEvent, LongPressState } from '../event/LongPressEvent';
import { ScrollEvent } from '../event/ScrollEvent';
import { formatUnit } from '../../common/utils';
export const SIZE_STYLE = [
    'top',
    'left',
    'bottom',
    'right',
    'margin',
    'marginTop',
    'marginLeft',
    'marginBottom',
    'marginRight',
    'padding',
    'paddingTop',
    'paddingLeft',
    'paddingBottom',
    'paddingRight',
    'width',
    'height',
    'minWidth',
    'minHeight',
    'maxWidth',
    'maxHeight',
    'borderRadius',
    'borderWidth'
];
export class View {
    constructor(viewID) {
        this.viewID = viewID;
        this.createNode();
        this._enabled = true;
        this.subViews = new Set();
        this.listeners = {};
        this.eventListeners = {};
        this._style = new Proxy({}, {
            get: (target, key) => {
                // 获取style
                return target[key] || this.node.style[key];
            },
            set: (target, key, value) => {
                // 设置style
                switch (key) {
                    case 'backgroundColor':
                        const reg = /gradient/;
                        target[key] = value;
                        reg.test(value) ?
                            // TODO: 加前缀
                            this.node.style['background'] = '-webkit-' + value :
                            this.node.style[key] = value;
                        break;
                    case 'shadow':
                        target[key] = value;
                        // TODO: 加前缀
                        this.node.style['boxShadow'] = value;
                        break;
                    default:
                        if (SIZE_STYLE.includes(key)) {
                            target[key] = formatUnit(value);
                            this.node.style[key] = formatUnit(value);
                        }
                        else {
                            target[key] = value;
                            this.node.style[key] = value;
                        }
                }
                return true;
            }
        });
        this.defaultStyle();
        this.initialize();
    }
    defaultStyle() {
        this.node.classList.add('hm-default');
    }
    createNode() {
        this.node = document.createElement('div');
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(_enabled) {
        this._enabled = _enabled;
        if (!_enabled) {
            this.node.disabled = true;
        }
        else {
            this.node.disabled = false;
        }
    }
    get style() {
        return this._style;
    }
    set style(_style) {
        this._style = Object.assign(this._style, _style);
    }
    /**
     * 初始化生命周期函数，目前在前端SDK上没用，兼容端的代码
     */
    initialize() {
    }
    /**
     * 销毁时机
     */
    finalize() {
    }
    appendChild(subview) {
        this.node.appendChild(subview.node);
        this.subViews.add(subview);
    }
    removeChild(subview) {
        this.node.removeChild(subview.node);
        this.subViews.delete(subview);
    }
    removeAll() {
        this.node.innerHTML = '';
        this.subViews.clear();
    }
    insertBefore(subview, existingView) {
        this.node.insertBefore(subview.node, existingView.node);
        this.subViews.add(subview);
    }
    /**
     * 用指定的节点替换当前节点的一个子节点，并返回被替换掉的节点
     */
    replaceChild(newSubview, oldSubview) {
        this.node.replaceChild(newSubview.node, oldSubview.node);
        this.subViews.add(newSubview);
        this.subViews.delete(oldSubview);
    }
    getElementById(viewID) {
        for (let view of this.subViews) {
            if (view.viewID === viewID) {
                return view;
            }
        }
        return null;
    }
    addEventListener(key, listener) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        // 将事件callback加入到事件队列
        this.listeners[key].push(listener);
        // 注册事件监听
        if (!this.eventListeners[key]) {
            if (key === 'longPress') {
                const press = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new LongPressEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = LongPressState.BEGAN;
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const pressup = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new LongPressEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = LongPressState.ENDED;
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const hammer = new Hammer(this.node);
                hammer.on('press', press);
                hammer.on('pressup', pressup);
                this.eventListeners[key] = { hammer, press, pressup };
            }
            else if (key === 'pan') {
                const panstart = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new PanEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = PanState.BEGAN;
                    ev.translation = { deltaX: e.deltaX + 'dp', deltaY: e.deltaY + 'dp' };
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const panmove = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new PanEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = PanState.CHANGED;
                    ev.translation = { deltaX: e.deltaX + 'dp', deltaY: e.deltaY + 'dp' };
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const panend = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new PanEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = PanState.ENDED;
                    ev.translation = { deltaX: e.deltaX + 'dp', deltaY: e.deltaY + 'dp' };
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const pancancel = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new PanEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = PanState.CANCELLED;
                    ev.translation = { deltaX: e.deltaX + 'dp', deltaY: e.deltaY + 'dp' };
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const hammer = new Hammer(this.node);
                hammer.on('panstart', panstart);
                hammer.on('panmove', panmove);
                hammer.on('panend', panend);
                hammer.on('pancancel', pancancel);
                this.eventListeners[key] = { hammer, panstart, panmove, panend, pancancel };
            }
            else if (key === 'pinch') {
                const pinchstart = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new PinchEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = PinchState.BEGAN;
                    ev.scale = e.scale;
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const pinchmove = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new PinchEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = PinchState.CHANGED;
                    ev.scale = e.scale;
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const pinchend = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new PinchEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = PinchState.ENDED;
                    ev.scale = e.scale;
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const pinchcancel = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new PinchEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = PinchState.CANCELLED;
                    ev.scale = e.scale;
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const hammer = new Hammer(this.node);
                hammer.on('pinchstart', pinchstart);
                hammer.on('pinchmove', pinchmove);
                hammer.on('pinchend', pinchend);
                hammer.on('pinchcancel', pinchcancel);
                this.eventListeners[key] = { hammer, pinchstart, pinchmove, pinchend, pinchcancel };
            }
            else if (key === 'swipe') {
                const swipeleft = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new SwipeEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = SwipeState.BEGAN;
                    ev.direction = 'left';
                    // TODO swipe.state
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const swiperight = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new SwipeEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = SwipeState.BEGAN;
                    ev.direction = 'right';
                    // TODO swipe.state
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const swipeup = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new SwipeEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = SwipeState.BEGAN;
                    ev.direction = 'up';
                    // TODO swipe.state
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const swipedown = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new SwipeEvent();
                    ev.target = this;
                    ev.timestamp = e.timeStamp;
                    ev.state = SwipeState.BEGAN;
                    ev.direction = 'down';
                    // TODO swipe.state
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const hammer = new Hammer(this.node);
                hammer.on('swipeleft', swipeleft);
                hammer.on('swiperight', swiperight);
                hammer.on('swipeup', swipeup);
                hammer.on('swipedown', swipedown);
                this.eventListeners[key] = { hammer, swipeleft, swiperight, swipeup, swipedown };
            }
            else if (key === 'tap') {
                const tap = (event) => {
                    if (!this.enabled)
                        return;
                    const ev = new TapEvent();
                    ev.target = this;
                    ev.position = {
                        x: event.center.x + 'dp',
                        y: event.center.y + 'dp'
                    };
                    ev.timestamp = event.timeStamp;
                    ev.state = TapState.BEGAN;
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const hammer = new Hammer(this.node);
                hammer.on(key, tap);
                this.eventListeners[key] = { hammer, tap };
            }
            else if (key === 'input') {
                const input = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new InputEvent();
                    ev.target = this;
                    ev.state = InputState.CHANGED;
                    ev.text = e.target.value;
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const focus = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new InputEvent();
                    ev.target = this;
                    ev.state = InputState.BEGAN;
                    ev.text = e.target.value;
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                const blur = (e) => {
                    if (!this.enabled)
                        return;
                    const ev = new InputEvent();
                    ev.target = this;
                    ev.state = InputState.ENDED;
                    ev.text = e.target.value;
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                this.node.addEventListener('input', input);
                this.node.addEventListener('focus', focus);
                this.node.addEventListener('blur', blur);
                this.eventListeners[key] = { input, focus, blur };
            }
            else if (key === 'scroll') {
                const scroll = () => {
                    if (!this.enabled)
                        return;
                    const ev = new ScrollEvent();
                    ev.target = this;
                    this.listeners[key].forEach((listener) => listener(ev));
                };
                this.node.addEventListener(key, scroll);
                this.eventListeners[key] = { scroll };
            }
        }
    }
    removeEventListener(key, listener) {
        if (this.listeners[key]) {
            // 将事件从事件队列中删除
            this.listeners[key] = this.listeners[key].filter((_listener) => _listener !== listener);
            // 如果事件队列为空，取消事件监听
            if (this.listeners[key].length === 0) {
                if (key === 'longPress') {
                    const { hammer, press, pressup } = this.eventListeners[key];
                    hammer.off('press', press);
                    hammer.off('pressup', pressup);
                }
                else if (key === 'pan') {
                    const { hammer, panstart, panmove, panend, pancancel } = this.eventListeners[key];
                    hammer.off('panstart', panstart);
                    hammer.off('panmove', panmove);
                    hammer.off('panend', panend);
                    hammer.off('pancancel', pancancel);
                }
                else if (key === 'pinch') {
                    const { hammer, pinchstart, pinchmove, pinchend, pinchcancel } = this.eventListeners[key];
                    hammer.off('pinchstart', pinchstart);
                    hammer.off('pinchmove', pinchmove);
                    hammer.off('pinchend', pinchend);
                    hammer.off('pinchcancel', pinchcancel);
                }
                else if (key === 'swipe') {
                    const { hammer, swipeleft, swiperight, swipeup, swipedown } = this.eventListeners[key];
                    hammer.off('swipeleft', swipeleft);
                    hammer.off('swiperight', swiperight);
                    hammer.off('swipeup', swipeup);
                    hammer.off('swipedown', swipedown);
                }
                else if (key === 'tap') {
                    const { hammer, tap } = this.eventListeners[key];
                    hammer.off('tap', tap);
                }
                else if (key === 'input') {
                    const { input, focus, blur } = this.eventListeners[key];
                    this.node.removeEventListener('input', input);
                    this.node.removeEventListener('focus', focus);
                    this.node.removeEventListener('blur', blur);
                }
                else if (key === 'scroll') {
                    const { scroll } = this.eventListeners[key];
                    this.node.removeEventListener('scroll', scroll);
                }
            }
        }
    }
}
//# sourceMappingURL=View.js.map