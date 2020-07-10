export class Environment {
    constructor() {
        this.deviceHeight = window.screen.height + 'dp';
        this.deviceWidth = window.screen.width + 'dp';
        this.availableHeight = window.screen.availHeight + 'dp';
        this.availableWidth = window.screen.availWidth + 'dp';
        this.osVersion = '';
        this.platform = 'web';
        this.scale = window.devicePixelRatio;
        this.remUEWidthInPixel = 750;
        this.remUEWidthInPixelRatio = 2;
    }
}
//# sourceMappingURL=Environment.js.map