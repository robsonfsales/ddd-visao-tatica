import EventInterface from "./event.inteface";

export default interface EventHandlerInterface<T extends EventInterface=EventInterface> {
    handle(event: T): void;
}