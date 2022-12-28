import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-change.event";

export default class ConsoleLogWhenCostumerAddressIsChangedHandler implements EventHandlerInterface<CustomerAddressChangedEvent> {
    handle(event: CustomerAddressChangedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.nome} alterado para: ${event.eventData.endereco}`);
    }
}