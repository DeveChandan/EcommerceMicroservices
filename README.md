# EcommerceMicroservices

A modern microservices-based e-commerce platform.

---

## 🏗️ Project Structure

```
EcommerceMicroservices/
│
├── customer-service/         # NestJS microservice for customer management
├── product-order-service/    # NestJS microservice for products & orders
├── frontend/                 # Next.js React frontend
└── README.md
```

---

## 🚀 Technologies Used

### Backend (Microservices)
- **NestJS**: Progressive Node.js framework for building efficient, scalable server-side applications.
- **TypeScript**: Strongly typed JavaScript for safer, more robust code.
- **TypeORM**: ORM for database management (PostgreSQL/MySQL/SQLite supported).
- **RabbitMQ**: Message broker for microservice communication (via AMQP).
- **Docker**: Containerization for easy deployment and local development.

### Frontend
- **Next.js**: React framework for server-side rendering and static site generation.
- **React**: Component-based UI library.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Context API**: For global state management (auth, cart, etc.).
- **Fetch API / Axios**: For HTTP requests to backend services.

### DevOps & Tooling
- **Docker Compose**: For orchestrating multi-container Docker applications.
- **dotenv**: Environment variable management.
- **Jest**: Unit and integration testing.
- **ESLint & Prettier**: Code quality and formatting.

---

## 📦 Microservices Overview

### 1. Customer Service (`customer-service`)
- Handles customer registration, authentication, profile, and order history.
- Exposes REST APIs.
- Communicates with other services via RabbitMQ.

### 2. Product & Order Service (`product-order-service`)
- Manages product catalog, inventory, and order processing.
- Exposes REST APIs.
- Publishes order events to RabbitMQ.

### 3. Frontend (`frontend`)
- User-facing web application.
- Handles authentication, product browsing, cart, checkout, and order tracking.
- Communicates with backend services via REST APIs.

---

## 🛠️ Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/EcommerceMicroservices.git
   cd EcommerceMicroservices
   ```

2. **Set up environment variables**
   - Copy `.env.example` in each service and frontend to `.env` and fill in the values.

3. **Start services with Docker Compose**
   ```sh
   docker-compose up --build
   ```

4. **Access the app**
   - Frontend: [http://localhost:5000](http://localhost:5000)
   - Customer Service: [http://localhost:8001](http://localhost:8001)
   - Product & Order Service: [http://localhost:8000](http://localhost:8000)
   - RabbitMQ Management: [http://localhost:15672](http://localhost:15672) (default user/pass: guest/guest)

---

## 📚 Documentation

- Each service contains its own README with API docs and environment setup.
- See `/docs` for API contracts and architecture diagrams.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📝 License

MIT

---
