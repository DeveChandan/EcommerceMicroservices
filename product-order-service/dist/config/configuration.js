"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    database: {
        host: process.env.PGHOST,
        port: process.env.PGPORT || 5432,
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE || 'product_order_db',
    },
    rabbitmq: {
        uri: process.env.RABBITMQ_URI || 'amqp://localhost:5672',
        exchange: 'ecommerce_exchange',
        queues: {
            orderCreated: 'order_created_queue',
            customerUpdated: 'customer_updated_queue',
        },
    },
});
//# sourceMappingURL=configuration.js.map