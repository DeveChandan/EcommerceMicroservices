export default () => ({
  port: parseInt(process.env.CUSTOMER_SERVICE_PORT, 10) || 8001,
  database: {
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT, 10) || 5432,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || 'customer_db',
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
