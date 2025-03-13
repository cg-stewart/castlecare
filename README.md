# CastleCare: On-Demand Home Services Platform

![CastleCare Logo](https://via.placeholder.com/800x200/4CAF50/FFFFFF?text=CastleCare)

CastleCare is a modern, full-stack platform connecting homeowners with skilled service providers for on-demand home maintenance and care services. This monorepo contains both the customer-facing web application and the service provider portal, along with a robust Java Spring Boot backend API.

## 🚀 Features

### For Customers
- **Service Booking**: Easy-to-use interface for scheduling various home services
- **Real-time Tracking**: Monitor service provider location and ETA
- **Secure Payments**: Integrated payment processing with multiple options
- **Service History**: View past services, receipts, and provider ratings
- **Property Management**: Save multiple properties and service preferences

### For Service Providers (Drive)
- **Flexible Onboarding**: Simple application process with background verification
- **Service Selection**: Choose from multiple service categories based on skills
- **Earnings Dashboard**: Track earnings, tips, and upcoming jobs
- **Schedule Management**: Set availability and manage service requests
- **Route Optimization**: Efficient routing between service locations

### Core Platform Features
- **Authentication**: Secure user authentication with AWS Cognito
- **Role-based Access**: Different interfaces for customers and service providers
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Notifications**: Updates on service status and important alerts
- **Admin Dashboard**: Comprehensive management of users, services, and analytics

## 🛠️ Technology Stack

### Frontend
- **Next.js**: React framework for server-side rendering and static generation
- **TypeScript**: Type-safe JavaScript for robust application development
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Reusable UI components built on Radix UI
- **AWS Amplify**: Integration with AWS services for authentication and storage

### Backend
- **Spring Boot**: Java-based framework for building robust APIs
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Data access layer with Hibernate
- **PostgreSQL**: Primary database for persistent storage
- **Redis**: Caching and session management

### Infrastructure
- **AWS**: Cloud infrastructure (EC2, S3, Cognito, etc.)
- **Docker**: Containerization for consistent deployment
- **Terraform**: Infrastructure as code for AWS resources
- **GitHub Actions**: CI/CD pipelines for automated testing and deployment

## 📂 Project Structure

This is a monorepo built with pnpm workspaces:

```
/apps
  /web          # Next.js customer and service provider web application
  /api          # Spring Boot backend API
/packages
  /ui           # Shared UI components and design system
  /eslint-config # Shared ESLint configuration
  /typescript-config # Shared TypeScript configuration
/terraform      # Infrastructure as code
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- Java 17+
- Docker and Docker Compose
- AWS account (for certain features)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/castlecare.git
cd castlecare
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start the development environment
```bash
# Start the backend services with Docker
docker-compose up -d

# Start the web application
pnpm --filter web dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## 📝 Future Enhancements

- **Mobile Applications**: Native iOS and Android apps
- **AI-powered Recommendations**: Smart service scheduling based on property needs
- **Expanded Service Categories**: Additional specialized service offerings
- **Subscription Model**: Regular maintenance plans for recurring services
- **Integration with Smart Home Devices**: Connect with IoT devices for automated service requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 About the Developer

CastleCare was developed as a portfolio project to demonstrate full-stack development capabilities, system architecture design, and implementation of modern web technologies. The project showcases expertise in building scalable, user-friendly applications with complex business logic and integrations.

---

*Note: This is a portfolio project and not a real service. The application demonstrates technical capabilities and is not intended for commercial use.*
