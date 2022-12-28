import CustomerAddressChangedEvent from "../customer/customer-address-change.event";
import ConsoleLogWhenCostumerAddressIsChangedHandler from "../customer/handler/console-log-customer-address-is-changed.handler copy";
import EventDispatcher from "./event-dispatcher";

describe("Domain customer address changed events tests", () => {
    it("should register an customer address changed event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new ConsoleLogWhenCostumerAddressIsChangedHandler();

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);
    
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should unregister an customer address changed event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new ConsoleLogWhenCostumerAddressIsChangedHandler();    

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);


        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler);
    
        eventDispatcher.unregister("CustomerAddressChangedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(0);

    });

    it("should unregister all customer address changed event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new ConsoleLogWhenCostumerAddressIsChangedHandler();

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);
                
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler);
        
        eventDispatcher.unregisterAll();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeUndefined();
    });

    it("should notify all customer address changed event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new ConsoleLogWhenCostumerAddressIsChangedHandler();

        const spyEventHandler = jest.spyOn(eventHandler, "handle");        

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);
        
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler);

        const customerAddressChangedEvent = new CustomerAddressChangedEvent({            
            id: "628",
            nome: "Customer 1",
            endereco: "Street 1, 123, 13542-365 - São Paulo",
        });

        // Quando o notify for executado o ConsoleLogWhenCostumerAddressIsChangedHandler.handle() e devem ser chamado.
        eventDispatcher.notify(customerAddressChangedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });
});