import { Event } from './Event';
export var PanState;
(function (PanState) {
    PanState[PanState["NORMAL"] = 0] = "NORMAL";
    PanState[PanState["BEGAN"] = 1] = "BEGAN";
    PanState[PanState["CHANGED"] = 2] = "CHANGED";
    PanState[PanState["ENDED"] = 3] = "ENDED";
    PanState[PanState["CANCELLED"] = 4] = "CANCELLED";
})(PanState || (PanState = {}));
export class PanEvent extends Event {
    get type() {
        return 'pan';
    }
}
//# sourceMappingURL=PanEvent.js.map