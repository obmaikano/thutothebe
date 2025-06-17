# Thutothebe LMS - Docker Setup

This document provides instructions for running the Thutothebe Learning Management System using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB of available RAM
- At least 10GB of available disk space

## Architecture

The application consists of the following services:

- **Frontend**: React 18 + TypeScript + Vite (Port 3000)
- **Backend**: Spring Boot 3.2.3 + Java 17 (Port 8080)
- **Database**: PostgreSQL 15 (Port 5432)
- **Cache**: Redis 7 (Port 6379)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thutothebe
   ```

2. **Build and start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api/v1
   - Swagger UI: http://localhost:8080/api/v1/swagger-ui.html

## Detailed Commands

### Build and Start Services

```bash
# Build and start all services in detached mode
docker-compose up -d

# Build and start with logs visible
docker-compose up

# Build only (without starting)
docker-compose build

# Start specific service
docker-compose up -d postgres redis
```

### Service Management

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v

# Restart specific service
docker-compose restart backend

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# View all logs
docker-compose logs -f
```

### Development Commands

```bash
# Rebuild specific service
docker-compose build backend
docker-compose up -d backend

# Execute commands in running container
docker-compose exec backend bash
docker-compose exec postgres psql -U postgres -d thutothebe

# Scale services (if needed)
docker-compose up -d --scale backend=2
```

## Environment Variables

The following environment variables can be customized in the `docker-compose.yml`:

### Database Configuration
- `POSTGRES_DB`: Database name (default: thutothebe)
- `POSTGRES_USER`: Database user (default: postgres)
- `POSTGRES_PASSWORD`: Database password (default: postgres)

### Backend Configuration
- `JWT_SECRET`: JWT signing secret
- `SPRING_PROFILES_ACTIVE`: Spring profile (default: docker)

## Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Manual health check
curl http://localhost:8080/api/v1/actuator/health
curl http://localhost:3000/health
```

## Data Persistence

Data is persisted using Docker volumes:

- `postgres_data`: PostgreSQL database files
- `redis_data`: Redis cache files

### Backup Database

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres thutothebe > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres thutothebe < backup.sql
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check if ports are in use
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :8080
   netstat -tulpn | grep :5432
   netstat -tulpn | grep :6379
   ```

2. **Memory issues**
   ```bash
   # Check Docker memory usage
   docker stats
   
   # Increase Docker memory limit in Docker Desktop settings
   ```

3. **Build failures**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Database connection issues**
   ```bash
   # Check if PostgreSQL is ready
   docker-compose exec postgres pg_isready -U postgres
   
   # View database logs
   docker-compose logs postgres
   ```

### Service Dependencies

Services start in the following order:
1. PostgreSQL and Redis (parallel)
2. Backend (waits for database and cache)
3. Frontend (waits for backend)

### Logs and Debugging

```bash
# View real-time logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# View last 100 lines
docker-compose logs --tail=100 backend

# Debug container issues
docker-compose exec backend bash
```

## Production Considerations

For production deployment, consider:

1. **Security**
   - Change default passwords
   - Use environment files for secrets
   - Enable HTTPS/TLS
   - Configure firewall rules

2. **Performance**
   - Increase database connection pool size
   - Configure Redis memory limits
   - Use production-optimized Docker images
   - Set up monitoring and logging

3. **Scaling**
   - Use Docker Swarm or Kubernetes
   - Set up load balancers
   - Configure database replication
   - Implement caching strategies

## Development Mode

For development with hot reloading:

```bash
# Start only infrastructure services
docker-compose up -d postgres redis

# Run backend locally
cd backend
./mvnw spring-boot:run

# Run frontend locally
cd frontend
npm run dev
```

## Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

## Support

For issues and questions:
1. Check the logs: `docker-compose logs -f`
2. Verify service health: `docker-compose ps`
3. Review this documentation
4. Check the main project README for application-specific information 