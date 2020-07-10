import { Event } from './Event';
export var LongPressState;
(function (LongPressState) {
    LongPressState[LongPressState["NORMAL"] = 0] = "NORMAL";
    LongPressState[LongPressState["BEGAN"] = 1] = "BEGAN";
    LongPressState[LongPressState["CHANGED"] = 2] = "CHANGED";
    LongPressState[LongPressState["ENDED"] = 3] = "ENDED";
    LongPressState[LongPressState["CANCELLED"] = 4] = "CANCELLED";
})(LongPressState || (LongPressState = {}));
export class LongPressEvent extends Event {
    get type() {
        return 'longPress';
    }
}
//# sourceMappingURL=LongPressEvent.js.map