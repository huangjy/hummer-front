import { Event } from './Event';
export var InputState;
(function (InputState) {
    InputState[InputState["NORMAL"] = 0] = "NORMAL";
    InputState[InputState["BEGAN"] = 1] = "BEGAN";
    InputState[InputState["CHANGED"] = 2] = "CHANGED";
    InputState[InputState["ENDED"] = 3] = "ENDED";
})(InputState || (InputState = {}));
export class InputEvent extends Event {
    get type() {
        return 'input';
    }
}
//# sourceMappingURL=InputEvent.js.map