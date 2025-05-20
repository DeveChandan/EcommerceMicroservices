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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./entities/customer.entity");
const customer_order_entity_1 = require("./entities/customer-order.entity");
const rmq_service_1 = require("../rmq/rmq.service");
const jwt = require("jsonwebtoken");
let CustomersService = class CustomersService {
    constructor(customerRepository, customerOrderRepository, rmqService) {
        this.customerRepository = customerRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.rmqService = rmqService;
    }
    async findAll() {
        return this.customerRepository.find({ select: ['id', 'firstName', 'lastName', 'email', 'address', 'phoneNumber', 'createdAt'] });
    }
    async findOne(id) {
        const customer = await this.customerRepository.findOne({
            where: { id },
            select: ['id', 'firstName', 'lastName', 'email', 'address', 'phoneNumber', 'createdAt']
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    async findByEmail(email) {
        const customer = await this.customerRepository.findOne({ where: { email } });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with email ${email} not found`);
        }
        return customer;
    }
    async create(customerData) {
        const existingCustomer = await this.customerRepository.findOne({ where: { email: customerData.email } });
        if (existingCustomer) {
            throw new common_1.ConflictException('Email already exists');
        }
        const newCustomer = this.customerRepository.create(customerData);
        const savedCustomer = await this.customerRepository.save(newCustomer);
        const { password, ...result } = savedCustomer;
        return result;
    }
    async update(id, customerData) {
        await this.findOne(id);
        await this.customerRepository.update(id, customerData);
        return this.findOne(id);
    }
    async validateCustomer(email, password) {
        const customer = await this.customerRepository.findOne({ where: { email } });
        if (!customer) {
            throw new Error('Invalid credentials');
        }
        if (customer.password !== password) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ sub: customer.id, email: customer.email }, 'your-secret-key', { expiresIn: '1h' });
        const { password: _, ...customerWithoutPassword } = customer;
        return {
            customer: customerWithoutPassword,
            token,
        };
    }
    async getCustomerOrders(customerId) {
        await this.findOne(customerId);
        return this.customerOrderRepository.find({
            where: { customerId },
            order: { createdAt: 'DESC' },
        });
    }
    async createCustomerOrder(orderData) {
        await this.findOne(orderData.customerId);
        const customerOrder = this.customerOrderRepository.create({
            orderId: orderData.id,
            customerId: orderData.customerId,
            totalAmount: orderData.totalAmount,
            status: orderData.status,
            createdAt: new Date(orderData.createdAt),
        });
        return this.customerOrderRepository.save(customerOrder);
    }
    async remove(id) {
        const result = await this.customerRepository.delete(id);
        return result.affected !== 0;
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_order_entity_1.CustomerOrder)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        rmq_service_1.RmqService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map