import { Event } from './Event';
export var ScrollState;
(function (ScrollState) {
    ScrollState[ScrollState["NORMAL"] = 0] = "NORMAL";
    ScrollState[ScrollState["BEGAN"] = 1] = "BEGAN";
    ScrollState[ScrollState["SCROLL"] = 2] = "SCROLL";
    ScrollState[ScrollState["ENDED"] = 3] = "ENDED";
})(ScrollState || (ScrollState = {}));
export class ScrollEvent extends Event {
    get type() {
        return 'scroll';
    }
}
//# sourceMappingURL=ScrollEvent.js.map