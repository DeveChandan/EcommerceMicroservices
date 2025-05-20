import { RmqService } from './rmq.service';
export declare class RmqModule {
    private readonly rmqService;
    constructor(rmqService: RmqService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
