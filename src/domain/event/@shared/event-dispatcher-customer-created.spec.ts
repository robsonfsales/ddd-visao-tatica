import CustomerCreatedEvent from "../customer/customer-created.event";
import ConsoleLog1WhenCostumerIsCreatedHandler from "../customer/handler/console-log1-customer-is-created.handler";
import ConsoleLog2WhenCostumerIsCreatedHandler from "../customer/handler/console-log2-customer-is-created.handler";
import EventDispatcher from "./event-dispatcher";

describe("Domain customer events tests", () => {
    it("should register an customer created event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new ConsoleLog1WhenCostumerIsCreatedHandler();
        const eventHandler2 = new ConsoleLog2WhenCostumerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);
    });

    it("should unregister an customer created event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new ConsoleLog1WhenCostumerIsCreatedHandler();
        const eventHandler2 = new ConsoleLog2WhenCostumerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);

    });

    it("should unregister all customer created event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new ConsoleLog1WhenCostumerIsCreatedHandler();
        const eventHandler2 = new ConsoleLog2WhenCostumerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
        
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

        eventDispatcher.unregisterAll();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();
    });

    it("should notify all customer created event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new ConsoleLog1WhenCostumerIsCreatedHandler();
        const eventHandler2 = new ConsoleLog2WhenCostumerIsCreatedHandler();

        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

        const customerCreatedEvent = new CustomerCreatedEvent({            
            name: "Customer 1",
            address: "Street 1, 123, 13542-365 - São Paulo",
        });

        // Quando o notify for executado o ConsoleLog1WhenCostumerIsCreatedHandler.handle() e 
        // ConsoleLog2WhenCostumerIsCreatedHandler.handle() devem ser chamado.
        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });
});