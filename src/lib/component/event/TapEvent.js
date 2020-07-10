import { Event } from './Event';
export var TapState;
(function (TapState) {
    TapState[TapState["NORMAL"] = 0] = "NORMAL";
    TapState[TapState["BEGAN"] = 1] = "BEGAN";
    TapState[TapState["CHANGED"] = 2] = "CHANGED";
    TapState[TapState["ENDED"] = 3] = "ENDED";
    TapState[TapState["CANCELLED"] = 4] = "CANCELLED";
})(TapState || (TapState = {}));
export class TapEvent extends Event {
    get type() {
        return 'tap';
    }
}