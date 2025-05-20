"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Init1697123456789 = void 0;
class Init1697123456789 {
    constructor() {
        this.name = 'Init1697123456789';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "customer" (
        "id" SERIAL NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "address" character varying,
        "phoneNumber" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_customer_email" UNIQUE ("email"),
        CONSTRAINT "PK_customer_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TYPE "customer_order_status_enum" AS ENUM (
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "customer_order" (
        "id" SERIAL NOT NULL,
        "orderId" integer NOT NULL,
        "customerId" integer NOT NULL,
        "totalAmount" numeric(10,2) NOT NULL,
        "status" "customer_order_status_enum" NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_customer_order_id" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      ALTER TABLE "customer_order" 
      ADD CONSTRAINT "FK_customer_order_customer" 
      FOREIGN KEY ("customerId") REFERENCES "customer"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
        await queryRunner.query(`
      INSERT INTO "customer" ("firstName", "lastName", "email", "password", "address", "phoneNumber")
      VALUES 
        ('John', 'Doe', 'john.doe@example.com', 'password123', '123 Main St, City', '555-1234'),
        ('Jane', 'Smith', 'jane.smith@example.com', 'password123', '456 Oak Ave, Town', '555-5678'),
        ('Alice', 'Johnson', 'alice.johnson@example.com', 'password123', '789 Pine Rd, Village', '555-9012')
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "customer_order" DROP CONSTRAINT "FK_customer_order_customer"`);
        await queryRunner.query(`DROP TABLE "customer_order"`);
        await queryRunner.query(`DROP TYPE "customer_order_status_enum"`);
        await queryRunner.query(`DROP TABLE "customer"`);
    }
}
exports.Init1697123456789 = Init1697123456789;
//# sourceMappingURL=1697123456789-init.js.map