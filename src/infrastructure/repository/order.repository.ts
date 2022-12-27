import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository-interface";
import Address from "../../domain/vo/Address";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            })),
        },
        {
            include: [{model: OrderItemModel}],
        });
    }
        
    async update(entity: Order): Promise<void> {
         
        for (const item of entity.items) {
            await OrderItemModel.update(
                {
                    price: item.price,
                    quantity: item.quantity,
                },
                {
                    where : {
                        id: item.id,
                    },            
                }
            );
        }

        await OrderModel.update(
            {
                customer_id: entity.customerId,
                total: entity.total(),
            },
            {
                where : {
                    id: entity.id,
                },            
            }
        );
    }

    async find(id: string): Promise<Order> {
        let orderModel;

        try {
            orderModel = await OrderModel.findOne({
                where: { id, },
                include: ["items"],
                rejectOnEmpty: true,
            });

        }catch (error) {
           throw new Error("Order not found"); 
        }

        const items = orderModel.items.map((orderModelItems) => {
            let items = new OrderItem(
                orderModelItems.id, 
                orderModelItems.name, 
                orderModelItems.price,
                orderModelItems.product_id,
                orderModelItems.quantity
            );

            return items;
        });

        const order = new Order(id, orderModel.customer_id, items);
        return order;
    }

    async findAll(): Promise<Order[]> {
         const orderModels = await OrderModel.findAll({
            include: ["items"],
         });

         const orders = orderModels.map((orderModels) => {
            const items = orderModels.items.map((orderModelItems) => {
                let items = new OrderItem(
                    orderModelItems.id, 
                    orderModelItems.name, 
                    orderModelItems.price,
                    orderModelItems.product_id,
                    orderModelItems.quantity
                );
                return items;
            });

            let order = new Order(orderModels.id, orderModels.customer_id, items);
            return order;
         });

         return orders;
    }
}