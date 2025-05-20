"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const products_service_1 = require("../products/products.service");
const rmq_service_1 = require("../rmq/rmq.service");
let OrdersService = class OrdersService {
    constructor(orderRepository, orderItemRepository, productsService, rmqService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productsService = productsService;
        this.rmqService = rmqService;
    }
    async findAll() {
        return this.orderRepository.find({ relations: ['items', 'items.product'] });
    }
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['items', 'items.product']
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async findByCustomer(customerId) {
        return this.orderRepository.find({
            where: { customerId },
            relations: ['items', 'items.product'],
            order: { createdAt: 'DESC' }
        });
    }
    async create(createOrderInput) {
        let totalAmount = 0;
        const orderItems = [];
        for (const item of createOrderInput.items) {
            const product = await this.productsService.findOne(item.productId);
            if (product.inventory < item.quantity) {
                throw new Error(`Insufficient inventory for product: ${product.name}`);
            }
            const itemPrice = product.price;
            totalAmount += itemPrice * item.quantity;
            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: itemPrice,
            });
            await this.productsService.decreaseInventory(product.id, item.quantity);
        }
        const newOrder = this.orderRepository.create({
            customerId: createOrderInput.customerId,
            totalAmount,
            shippingAddress: createOrderInput.shippingAddress,
            status: order_entity_1.OrderStatus.PENDING,
        });
        const savedOrder = await this.orderRepository.save(newOrder);
        for (const item of orderItems) {
            await this.orderItemRepository.save({
                ...item,
                orderId: savedOrder.id,
            });
        }
        const completeOrder = await this.findOne(savedOrder.id);
        await this.rmqService.publishOrderCreated(completeOrder);
        return completeOrder;
    }
    async updateStatus(id, status) {
        const order = await this.findOne(id);
        order.status = status;
        return this.orderRepository.save(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        products_service_1.ProductsService,
        rmq_service_1.RmqService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map