# Clean Architecture User Management API

## Overview

This project implements a User Management API following Clean Architecture principles as defined by Robert C. Martin (Uncle Bob). The application is built using TypeScript, Express.js, and follows SOLID principles with a clear separation of concerns.

## Docker Support

The project includes Docker support for both development and production environments.

## Build Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run docker:dev:build
   ```

### Development Environment

To start the development environment:

```bash
npm run docker:dev
```

This will:

- Start the API in development mode with hot-reload
- Start a MongoDB instance
- Mount the source code as a volume for live updates
- Expose the API on port 3000
- Expose MongoDB on port 27017

To rebuild the development containers:

```bash
npm run docker:dev:build
```

### Production Environment

To start the production environment:

```bash
npm run docker:prod
```

This will:

- Build the application in production mode
- Start the API with optimized settings
- Start a MongoDB instance
- Use production-ready container configurations
- Enable automatic container restarts

To rebuild the production containers:

```bash
npm run docker:prod:build
```

## Architecture Layers

The project follows a four-layer architecture, from the most inner (domain) to the most outer (infrastructure) layer:

```
src/
├── domain/           # Enterprise Business Rules
├── application/      # Application Business Rules
├── exposition/       # Interface Adapters
└── infrastructure/   # Frameworks & Drivers
```

### 1. Domain Layer (`src/domain/`)

The core business logic and business rules.

- **Entities/**: Contains enterprise-wide business rules
  - `User.ts`: Core user entity with validation rules
- **Repositories/**: Repository interfaces
  - `IUserRepository.ts`: Defines data access contract

**Rules**:

- No dependencies on outer layers
- Pure business logic
- No framework dependencies
- Uses only TypeScript/JavaScript

### 2. Application Layer (`src/application/`)

Application-specific business rules.

- **UseCases/**: Implementation of application use cases
  - `CreateUserUseCase.ts`
  - `UpdateUserUseCase.ts`
  - `DeleteUserUseCase.ts`
  - etc.
- **DTOs/**: Data Transfer Objects
  - `CreateUserDto.ts`
  - `UpdateUserDto.ts`
- **Errors/**: Custom error classes
  - `BusinessError.ts`
  - `ValidationError.ts`
- **Services/**: Application services
  - `UserService.ts`

**Rules**:

- Can only depend on the domain layer
- Contains application flow logic
- Implements use cases
- No framework-specific code

### 3. Exposition Layer (`src/exposition/`)

Adapts external input to internal format and vice-versa.

- **REST/**: REST API implementation
  - **Controllers/**: HTTP request handlers
  - **Middlewares/**: Express middlewares
  - **Config/**: API configuration
  - **Decorators/**: Custom decorators
  - **Utils/**: Helper utilities

**Rules**:

- Adapts external requests to internal format
- Handles HTTP-specific logic
- Can depend on application and domain layers
- Framework-specific code isolated here

### 4. Infrastructure Layer (`src/infrastructure/`)

External frameworks and tools implementation.

- **Logger/**: Logging implementation
- **TypeORM/**: Database implementation
  - **Entities/**: ORM entities
  - **Repositories/**: Repository implementations
  - **Mappers/**: Entity-Domain mappers
  - **Config/**: Database configuration
- **DependencyInjection/**: DI configuration

**Rules**:

- Implements interfaces defined in inner layers
- Contains all external framework code
- Can depend on all other layers
- Provides concrete implementations

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. Start the development server:

   Without Docker:

   ```bash
   npm run dev
   ```

   With Docker:

   ```bash
   npm run docker:dev
   ```

5. Access the API documentation:
   ```
   http://localhost:3000/api-docs
   ```

## Testing

Run tests with:

```bash
npm test
```

Tests are organized by layer:

- Unit tests for domain and application layers
- Integration tests for infrastructure layer
- E2E tests for exposition layer

## Development Guidelines

1. Follow the dependency rule
2. Keep business logic in domain/application layers
3. Use dependency injection
4. Write tests for all use cases
5. Document API changes in Swagger
6. Follow SOLID principles
7. Use TypeScript features appropriately

## Error Handling

- Business errors in application layer
- Validation errors in domain layer
- HTTP errors in exposition layer
- Infrastructure errors properly mapped

## API Documentation

Swagger UI available at `/api-docs` endpoint with:

- Endpoint documentation
- Request/response schemas
- Authentication requirements
- Error responses

## Best Practices by Layer

### 1. Domain Layer Best Practices

1. **Pure Business Logic**

   - Keep domain entities free from infrastructure concerns
   - Implement domain-specific validation rules
   - Use value objects for complex attributes
   - Avoid dependencies on external frameworks

2. **Rich Domain Models**

   - Encapsulate business rules within entities
   - Use domain events for state changes
   - Implement domain-specific interfaces
   - Keep entities independent of persistence concerns

3. **Validation**
   - Implement self-validation in domain entities
   - Use value objects for complex validations
   - Throw domain-specific exceptions
   - Validate invariants in constructors

### 2. Application Layer Best Practices

1. **Use Cases**

   - One use case per business operation
   - Return DTOs instead of domain entities
   - Handle all business rule validations
   - Keep use cases focused and single-purpose

2. **DTOs**

   - Use separate DTOs for input and output
   - Implement validation rules using decorators
   - Keep DTOs simple and flat
   - Use class-transformer for object mapping

3. **Services**

   - Keep services stateless
   - Use dependency injection
   - Coordinate complex operations
   - Don't implement business rules in services

4. **Error Handling**
   - Use custom error classes
   - Separate business errors from validation errors
   - Include meaningful error messages
   - Handle all edge cases

### 3. Exposition Layer Best Practices

1. **Controllers**

   - Keep controllers thin
   - Handle HTTP-specific logic only
   - Use proper HTTP status codes
   - Implement proper error handling
   - Document API endpoints

2. **Middleware**

   - Implement cross-cutting concerns
   - Handle authentication/authorization
   - Validate request data
   - Log requests and responses

3. **Request/Response Handling**

   - Validate input data
   - Transform responses to DTOs
   - Handle errors consistently
   - Use proper content types

4. **API Documentation**
   - Document all endpoints
   - Include request/response examples
   - Document error responses
   - Keep documentation up-to-date

### 4. Infrastructure Layer Best Practices

1. **Repositories**

   - Return domain models from methods
   - Keep mapping logic within repositories
   - Use the Unit of Work pattern
   - Implement proper error handling
   - Use meaningful method names

2. **Database**

   - Use migrations for schema changes
   - Implement proper indexing
   - Handle transactions properly
   - Implement proper connection pooling

3. **External Services**

   - Implement retry mechanisms
   - Handle timeouts properly
   - Log external service calls
   - Use circuit breakers

4. **Dependency Injection**
   - Use constructor injection
   - Register dependencies properly
   - Use interfaces for loose coupling
   - Configure scopes appropriately

## Repository Pattern Best Practices

1. **Domain Model Mapping**

   - Map between persistence models and domain models
   - Keep mapping logic in repositories or mappers
   - Use automapper patterns where appropriate
   - Maintain separation of concerns

2. **Error Handling**

   - Handle database-specific errors
   - Convert to domain-specific exceptions
   - Log database errors properly
   - Implement proper transaction handling

3. **Query Optimization**

   - Use proper indexing
   - Implement pagination
   - Optimize complex queries
   - Use eager loading when appropriate

4. **Testing**
   - Mock repository interfaces
   - Test database operations
   - Use in-memory databases for testing
   - Test error conditions
