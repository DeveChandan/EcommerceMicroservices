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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RmqModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const rmq_service_1 = require("./rmq.service");
let RmqModule = class RmqModule {
    constructor(rmqService) {
        this.rmqService = rmqService;
    }
    async onModuleInit() {
        this.rmqService.getClient().connect();
    }
    async onModuleDestroy() {
        this.rmqService.getClient().close();
    }
};
exports.RmqModule = RmqModule;
exports.RmqModule = RmqModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'ECOMMERCE_SERVICE',
                    imports: [config_1.ConfigModule],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [
                                configService.get('rabbitmq.uri') || 'amqp://localhost:5672'
                            ],
                            queue: configService.get('rabbitmq.queues.orderCreated') || 'order_created_queue',
                            queueOptions: {
                                durable: true,
                            },
                            exchange: configService.get('rabbitmq.exchange') || 'ecommerce_exchange',
                            noAck: true,
                        },
                    }),
                    inject: [config_1.ConfigService],
                },
            ]),
        ],
        providers: [rmq_service_1.RmqService],
        exports: [rmq_service_1.RmqService],
    }),
    __metadata("design:paramtypes", [rmq_service_1.RmqService])
], RmqModule);
//# sourceMappingURL=rmq.module.js.map