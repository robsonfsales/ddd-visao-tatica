import Address from "../vo/Address";
import Customer from "./customer";

describe("Customer unit tests", () => {

    it("should add reward points", () => {
        const customer = new Customer("c1", "Costumer 1");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(6);
        expect(customer.rewardPoints).toBe(16);
    });

    it("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "Sales");
        }).toThrowError("Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrowError("Name is required");
    });

    it("should change name", () => {
        // Triple A

        // Arrange
        let customer = new Customer("123", "Sales");

        // Act
        customer.changeName("Jane");

        // Assert
        expect(customer.name).toBe("Jane");        
    });

    it("should activate customer", () => {
        // Arrange
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Street 1", 123, "13542-365", "São Paulo");
        customer.changeAddress(address);

        // Act
        customer.activate();

        // Assert
        expect(customer.isActive()).toBe(true);        
    });

    it("should deactivate customer", () => {
        // Arrange
        const customer = new Customer("1", "Customer 1");

        // Act
        customer.deactivate();

        // Assert
        expect(customer.isActive()).toBe(false);        
    });

    it("should throw error when address is undefined when you activate a customer", () => {
        
        expect(() => {
            const customer = new Customer("1", "Customer 1");
            customer.activate();
        }).toThrowError("Address is mandatory to activate a customer");     
    });
});