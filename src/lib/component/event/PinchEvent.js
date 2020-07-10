import { Event } from './Event';
export var PinchState;
(function (PinchState) {
    PinchState[PinchState["NORMAL"] = 0] = "NORMAL";
    PinchState[PinchState["BEGAN"] = 1] = "BEGAN";
    PinchState[PinchState["CHANGED"] = 2] = "CHANGED";
    PinchState[PinchState["ENDED"] = 3] = "ENDED";
    PinchState[PinchState["CANCELLED"] = 4] = "CANCELLED";
})(PinchState || (PinchState = {}));
export class PinchEvent extends Event {
    get type() {
        return 'pinch';
    }
}
//# sourceMappingURL=PinchEvent.js.map