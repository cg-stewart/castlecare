# CastleCare API

On-demand home service platform API built with Spring Boot.

## Setup Instructions

### Prerequisites
- Java 21
- Maven
- Docker and Docker Compose

### Local Development Environment

1. **Start the required services using Docker Compose**

```bash
# From the project root
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Redis cache on port 6379

2. **Run the Spring Boot application**

```bash
# From the apps/api directory
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

3. **Create a test customer**

```bash
# From the apps/api directory
mvn spring-boot:run -Dspring-boot.run.main-class=com.callcastlecare.api.scripts.CreateTestCustomer -Dspring-boot.run.profiles=local
```

## API Endpoints

### Customer API

- `POST /api/v1/customers` - Create a new customer
- `GET /api/v1/customers/{id}` - Get customer by ID
- `GET /api/v1/customers/email/{email}` - Get customer by email
- `PUT /api/v1/customers/{id}` - Update customer
- `POST /api/v1/customers/{customerId}/addresses` - Add address to customer
- `GET /api/v1/customers/{customerId}/addresses` - Get customer addresses
- `DELETE /api/v1/customers/{customerId}/addresses/{addressId}` - Delete customer address

## Running Tests

```bash
# Run all tests
mvn test

# Run a specific test class
mvn test -Dtest=CustomerServiceTest
```

## Environment Variables

The following environment variables can be set for production deployments:

- `SPRING_PROFILES_ACTIVE` - Active Spring profile (default: local)
- `POSTGRES_URL` - PostgreSQL connection URL
- `POSTGRES_USER` - PostgreSQL username
- `POSTGRES_PASSWORD` - PostgreSQL password
- `REDIS_HOST` - Redis host
- `REDIS_PORT` - Redis port
- `RESEND_API_KEY` - Resend API key for email service
- `TWILIO_ACCOUNT_SID` - Twilio account SID for SMS service
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number
- `STRIPE_API_KEY` - Stripe API key for payment processing
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
