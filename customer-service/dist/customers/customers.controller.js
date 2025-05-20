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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("./customers.service");
const microservices_1 = require("@nestjs/microservices");
class CreateCustomerDto {
}
class UpdateCustomerDto {
}
class LoginDto {
}
let CustomersController = class CustomersController {
    constructor(customersService) {
        this.customersService = customersService;
    }
    async findAll() {
        return this.customersService.findAll();
    }
    async findOne(id) {
        const customer = await this.customersService.findOne(id);
        if (!customer) {
            throw new common_1.HttpException('Customer not found', common_1.HttpStatus.NOT_FOUND);
        }
        return customer;
    }
    async create(createCustomerDto) {
        try {
            return await this.customersService.create(createCustomerDto);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.HttpException('Email already exists', common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, updateCustomerDto) {
        const updated = await this.customersService.update(id, updateCustomerDto);
        if (!updated) {
            throw new common_1.HttpException('Customer not found', common_1.HttpStatus.NOT_FOUND);
        }
        return updated;
    }
    async login(loginDto) {
        try {
            return await this.customersService.validateCustomer(loginDto.email, loginDto.password);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async getCustomerOrders(id) {
        return this.customersService.getCustomerOrders(id);
    }
    async remove(id) {
        const deleted = await this.customersService.remove(id);
        if (!deleted) {
            throw new common_1.HttpException('Customer not found', common_1.HttpStatus.NOT_FOUND);
        }
        return { message: 'Customer deleted successfully' };
    }
    async handleOrderCreatedEvent(data) {
        await this.customersService.createCustomerOrder(data);
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "login", null);
__decorate([
    (0, common_1.Get)(':id/orders'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomerOrders", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "remove", null);
__decorate([
    (0, microservices_1.EventPattern)('order.created'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "handleOrderCreatedEvent", null);
exports.CustomersController = CustomersController = __decorate([
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map