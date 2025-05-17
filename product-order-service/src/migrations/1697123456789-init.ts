import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1697123456789 implements MigrationInterface {
  name = 'Init1697123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create product table
    await queryRunner.query(`
      CREATE TABLE "product" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "inventory" integer NOT NULL DEFAULT '0',
        "isActive" boolean NOT NULL DEFAULT true,
        "imageUrl" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_product_id" PRIMARY KEY ("id")
      )
    `);

    // Create order table with enum type
    await queryRunner.query(`
      CREATE TYPE "order_status_enum" AS ENUM (
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "order" (
        "id" SERIAL NOT NULL,
        "customerId" integer NOT NULL,
        "totalAmount" numeric(10,2) NOT NULL,
        "status" "order_status_enum" NOT NULL DEFAULT 'pending',
        "shippingAddress" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_id" PRIMARY KEY ("id")
      )
    `);

    // Create order item table
    await queryRunner.query(`
      CREATE TABLE "order_item" (
        "id" SERIAL NOT NULL,
        "orderId" integer NOT NULL,
        "productId" integer NOT NULL,
        "quantity" integer NOT NULL,
        "price" numeric(10,2) NOT NULL,
        CONSTRAINT "PK_order_item_id" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "order_item" 
      ADD CONSTRAINT "FK_order_item_order" 
      FOREIGN KEY ("orderId") REFERENCES "order"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "order_item" 
      ADD CONSTRAINT "FK_order_item_product" 
      FOREIGN KEY ("productId") REFERENCES "product"("id") 
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // Insert some sample products
    await queryRunner.query(`
      INSERT INTO "product" ("name", "description", "price", "inventory", "imageUrl")
      VALUES 
        ('Smartphone X', 'Latest smartphone with advanced features', 799.99, 50, 'https://via.placeholder.com/300'),
        ('Laptop Pro', 'High-performance laptop for professionals', 1299.99, 30, 'https://via.placeholder.com/300'),
        ('Wireless Headphones', 'Premium noise-cancelling headphones', 249.99, 100, 'https://via.placeholder.com/300'),
        ('Smart Watch', 'Fitness and health tracking smartwatch', 199.99, 75, 'https://via.placeholder.com/300'),
        ('Tablet Ultra', 'Lightweight tablet with stunning display', 499.99, 40, 'https://via.placeholder.com/300')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_order_item_product"`);
    await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_order_item_order"`);
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "order_status_enum"`);
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
