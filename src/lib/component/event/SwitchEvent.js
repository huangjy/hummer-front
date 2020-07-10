import { Event } from './Event';
export class SwitchEvent extends Event {
    get type() {
        return 'switch';
    }
}