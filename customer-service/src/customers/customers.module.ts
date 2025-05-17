import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CustomerOrder } from './entities/customer-order.entity';
import { RmqModule } from '../rmq/rmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, CustomerOrder]),
    RmqModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
