import { Hummer } from '../base/Global';
export function formatUnit(size) {
    const deviceWidth = +Hummer.env.deviceWidth.replace('dp', '');
    if (typeof size === 'number') {
        return deviceWidth * (size / Hummer.env.remUEWidthInPixel) + 'px';
    }
    else if (typeof size === 'string') {
        return size.replace('dp', 'px');
    }
    return size;
}
//# sourceMappingURL=utils.js.map