import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Customer } from '../customers/entities/customer.entity';
import { CustomerOrder } from '../customers/entities/customer-order.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [Customer, CustomerOrder],
        synchronize: false,
        migrationsRun: true,
        migrations: ['dist/migrations/*.js'],
        logging: ['error'],
      }),
    }),
  ],
})
export class DatabaseModule {}
