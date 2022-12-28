import EventInterface from "../@shared/event.inteface";

export default class CustomerAddressChangedEvent implements EventInterface {
    dataTimeOccurred: Date;
    eventData: any;
    
    constructor(eventData: any) {
        this.dataTimeOccurred = new Date();
        this.eventData = eventData;
    }
}