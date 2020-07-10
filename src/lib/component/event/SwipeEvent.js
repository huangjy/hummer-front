import { Event } from './Event';
export var SwipeState;
(function (SwipeState) {
    SwipeState[SwipeState["NORMAL"] = 0] = "NORMAL";
    SwipeState[SwipeState["BEGAN"] = 1] = "BEGAN";
    SwipeState[SwipeState["CHANGED"] = 2] = "CHANGED";
    SwipeState[SwipeState["ENDED"] = 3] = "ENDED";
    SwipeState[SwipeState["CANCELLED"] = 4] = "CANCELLED";
})(SwipeState || (SwipeState = {}));
export class SwipeEvent extends Event {
    get type() {
        return 'swipe';
    }
}
//# sourceMappingURL=SwipeEvent.js.map