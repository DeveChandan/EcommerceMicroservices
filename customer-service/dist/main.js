"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.connectMicroservice({
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
            noAck: false,
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    await app.startAllMicroservices();
    const port = configService.get('port') || 8001;
    await app.listen(port, '0.0.0.0');
    console.log(`Customer service is running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map