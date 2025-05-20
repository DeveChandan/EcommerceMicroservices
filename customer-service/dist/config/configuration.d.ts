declare const _default: () => {
    database: {
        host: string | undefined;
        port: string | number;
        username: string | undefined;
        password: string | undefined;
        database: string;
    };
    rabbitmq: {
        uri: string;
        exchange: string;
        queues: {
            orderCreated: string;
            customerUpdated: string;
        };
    };
};
export default _default;
