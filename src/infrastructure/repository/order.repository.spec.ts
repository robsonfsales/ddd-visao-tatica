import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/vo/Address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";
import OrderModel from "../db/sequelize/model/order.model";

describe("Order repository tests", () => {
    let sequileze: Sequelize;

    beforeEach(async() => {
        sequileze = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequileze.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequileze.sync();
    });

    afterEach(async() => {
        await sequileze.close();
    });


    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        customer.activate();
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where : { id: order.id},
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: order.customerId,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    product_id: orderItem.productId,
                    order_id: order.id,
                    quantity: orderItem.quantity,
                    name: orderItem.name,
                    price: orderItem.price,
                },
            ],
        });
    });


    it("should update a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        customer.activate();
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const orderRepository = new OrderRepository();
        const order = new Order("123", customer.id, [orderItem]);
        await orderRepository.create(order);

        for (const item of order.items) {
            item.changePrice(15);
            item.changeQuantity(3);
        }
        
        await orderRepository.update(order);
        
        const orderModel = await OrderModel.findOne({
            where : { id: order.id},
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: order.customerId,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: product.id,
                },
            ],
        });
    });

    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        customer.activate();
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const orderRepository = new OrderRepository();
        const order = new Order("123", customer.id, [orderItem]);      
        await orderRepository.create(order);

        const orderResult = await orderRepository.find(order.id);
        expect(order).toStrictEqual(orderResult);
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("123", "Customer 1");
        const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer1.changeAddress(address1);
        customer1.addRewardPoints(10);
        customer1.activate();

        const customer2 = new Customer("456", "Customer 2");
        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);
        customer2.addRewardPoints(20);
        customer2.activate();

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const productRepository = new ProductRepository();
        const product1 = new Product("123", "Product 1", 10);
        const product2 = new Product("345", "Product 2", 25);
        await productRepository.create(product1);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem(
            "1",
            product1.name,
            product1.price,
            product1.id,
            5
        );

        const orderItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            8
        );

        const orderItem3 = new OrderItem(
            "3",
            product2.name,
            product2.price,
            product2.id,
            3
        );

        const orderRepository = new OrderRepository();
        const order1 = new Order("678", customer1.id, [orderItem1, orderItem2]);    
        const order2 = new Order("985", customer2.id, [orderItem3]);
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders).toHaveLength(2);
        expect(orders).toContainEqual(order1);
        expect(orders).toContainEqual(order2);
    })

});