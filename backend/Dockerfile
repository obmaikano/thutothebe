# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user and group
RUN addgroup -g 1001 spring && \
    adduser -S -u 1001 -G spring spring && \
    mkdir -p /app/logs && \
    chown -R spring:spring /app/logs

USER spring

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD wget -qO- http://localhost:8080/api/v1/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
