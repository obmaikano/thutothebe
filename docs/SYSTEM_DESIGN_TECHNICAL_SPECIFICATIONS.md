# ThutoLMS - Technical System Design Specifications

## 🏛️ Detailed Architecture Specifications

### API Gateway Configuration
```yaml
# Kong API Gateway Configuration
services:
  - name: user-service
    url: http://user-service:8080
    plugins:
      - name: rate-limiting
        config:
          minute: 1000
          hour: 10000
      - name: jwt
        config:
          secret_is_base64: false
          key_claim_name: iss
      - name: cors
        config:
          origins: ["https://thutolms.gov.bw"]
          
  - name: grade-service
    url: http://grade-service:8080
    plugins:
      - name: rate-limiting
        config:
          minute: 2000
          hour: 20000
      - name: request-size-limiting
        config:
          allowed_payload_size: 10
          
routes:
  - name: user-routes
    service: user-service
    paths: ["/api/v1/users"]
    strip_path: false
    
  - name: grade-routes
    service: grade-service
    paths: ["/api/v1/grades"]
    strip_path: false

# Rate Limiting Strategy
rate_limits:
  anonymous_users: 100 requests/minute
  authenticated_users: 1000 requests/minute
  premium_users: 5000 requests/minute
  admin_users: unlimited
```

### Database Schema Optimization
```sql
-- Optimized table structures with partitioning

-- Grades table with range partitioning by academic year
CREATE TABLE grades (
    id BIGSERIAL,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    grade_category_id BIGINT,
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    academic_year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    graded_by BIGINT NOT NULL,
    is_moderated BOOLEAN DEFAULT FALSE,
    moderated_by BIGINT,
    moderated_at TIMESTAMP WITH TIME ZONE,
    feedback TEXT,
    active BOOLEAN DEFAULT TRUE
) PARTITION BY RANGE (academic_year);

-- Create partitions for each academic year
CREATE TABLE grades_2024 PARTITION OF grades
    FOR VALUES FROM (2024) TO (2025);
CREATE TABLE grades_2025 PARTITION OF grades
    FOR VALUES FROM (2025) TO (2026);
CREATE TABLE grades_2026 PARTITION OF grades
    FOR VALUES FROM (2026) TO (2027);

-- Optimized indexes
CREATE INDEX CONCURRENTLY idx_grades_student_year 
    ON grades (student_id, academic_year) 
    INCLUDE (score, created_at);

CREATE INDEX CONCURRENTLY idx_grades_course_category 
    ON grades (course_id, grade_category_id) 
    WHERE active = true;

CREATE INDEX CONCURRENTLY idx_grades_moderation 
    ON grades (is_moderated, moderated_at) 
    WHERE active = true;

-- Materialized view for grade statistics
CREATE MATERIALIZED VIEW grade_statistics AS
SELECT 
    course_id,
    grade_category_id,
    academic_year,
    COUNT(*) as total_grades,
    AVG(score) as average_score,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY score) as median_score,
    MIN(score) as min_score,
    MAX(score) as max_score,
    STDDEV(score) as std_deviation,
    COUNT(*) FILTER (WHERE score >= 50) as passing_count,
    (COUNT(*) FILTER (WHERE score >= 50) * 100.0 / COUNT(*)) as pass_rate
FROM grades 
WHERE active = true 
GROUP BY course_id, grade_category_id, academic_year;

-- Refresh strategy for materialized view
CREATE OR REPLACE FUNCTION refresh_grade_statistics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY grade_statistics;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh every hour
SELECT cron.schedule('refresh-grade-stats', '0 * * * *', 'SELECT refresh_grade_statistics();');
```

### Redis Cluster Configuration
```yaml
# Redis Cluster Setup (6 nodes: 3 masters, 3 replicas)
redis_cluster:
  nodes:
    - host: redis-1.thutolms.local
      port: 7000
      role: master
      slots: "0-5460"
      
    - host: redis-2.thutolms.local
      port: 7001
      role: master
      slots: "5461-10922"
      
    - host: redis-3.thutolms.local
      port: 7002
      role: master
      slots: "10923-16383"
      
    - host: redis-4.thutolms.local
      port: 7003
      role: replica
      master: redis-1.thutolms.local:7000
      
    - host: redis-5.thutolms.local
      port: 7004
      role: replica
      master: redis-2.thutolms.local:7001
      
    - host: redis-6.thutolms.local
      port: 7005
      role: replica
      master: redis-3.thutolms.local:7002

  configuration:
    cluster-enabled: yes
    cluster-config-file: nodes.conf
    cluster-node-timeout: 5000
    appendonly: yes
    appendfsync: everysec
    maxmemory: 50gb
    maxmemory-policy: allkeys-lru
    tcp-keepalive: 60
    timeout: 300

# Cache Key Patterns and TTL Strategy
cache_patterns:
  user_sessions:
    pattern: "session:{user_id}:{session_id}"
    ttl: 86400  # 24 hours
    
  user_profiles:
    pattern: "user:{user_id}"
    ttl: 3600   # 1 hour
    
  course_data:
    pattern: "course:{course_id}"
    ttl: 7200   # 2 hours
    
  grade_summaries:
    pattern: "grades:{student_id}:{course_id}"
    ttl: 1800   # 30 minutes
    
  api_responses:
    pattern: "api:{endpoint}:{params_hash}"
    ttl: 300    # 5 minutes
```

### Spring Boot Application Configuration
```yaml
# application-production.yml
spring:
  application:
    name: thutolms-backend
    
  datasource:
    primary:
      url: jdbc:postgresql://postgres-primary:5432/thutolms
      username: ${DB_USERNAME}
      password: ${DB_PASSWORD}
      hikari:
        maximum-pool-size: 45
        minimum-idle: 10
        idle-timeout: 300000
        max-lifetime: 1800000
        connection-timeout: 20000
        leak-detection-threshold: 60000
        
    read-replica:
      url: jdbc:postgresql://postgres-replica:5432/thutolms
      username: ${DB_READ_USERNAME}
      password: ${DB_READ_PASSWORD}
      hikari:
        maximum-pool-size: 30
        minimum-idle: 5
        idle-timeout: 300000
        max-lifetime: 1800000
        
  data:
    redis:
      cluster:
        nodes:
          - redis-1.thutolms.local:7000
          - redis-2.thutolms.local:7001
          - redis-3.thutolms.local:7002
          - redis-4.thutolms.local:7003
          - redis-5.thutolms.local:7004
          - redis-6.thutolms.local:7005
        max-redirects: 3
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 100
          max-idle: 50
          min-idle: 10
          
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        jdbc:
          batch_size: 50
          fetch_size: 100
        cache:
          use_second_level_cache: true
          region:
            factory_class: org.hibernate.cache.jcache.JCacheRegionFactory
        generate_statistics: true
        
  cache:
    type: redis
    redis:
      time-to-live: 3600000  # 1 hour default
      cache-null-values: false
      
server:
  port: 8080
  tomcat:
    threads:
      max: 200
      min-spare: 20
    connection-timeout: 20000
    max-connections: 8192
    accept-count: 100
    
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus,info
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true

logging:
  level:
    com.ohma.thutothebe: INFO
    org.springframework.security: WARN
    org.hibernate.SQL: WARN
    org.hibernate.type.descriptor.sql.BasicBinder: WARN
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level [%X{traceId},%X{spanId}] %logger{36} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level [%X{traceId},%X{spanId}] %logger{36} - %msg%n"
```

### Kubernetes Deployment Specifications
```yaml
# Grade Service Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grade-service
  namespace: thutolms
  labels:
    app: grade-service
    version: v1
spec:
  replicas: 25
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
  selector:
    matchLabels:
      app: grade-service
  template:
    metadata:
      labels:
        app: grade-service
        version: v1
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/actuator/prometheus"
    spec:
      containers:
      - name: grade-service
        image: thutolms/grade-service:1.0.0
        ports:
        - containerPort: 8080
          name: http
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "production"
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: password
        resources:
          requests:
            memory: "4Gi"
            cpu: "2"
          limits:
            memory: "8Gi"
            cpu: "4"
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
          timeoutSeconds: 10
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        volumeMounts:
        - name: config-volume
          mountPath: /app/config
        - name: logs-volume
          mountPath: /app/logs
      volumes:
      - name: config-volume
        configMap:
          name: grade-service-config
      - name: logs-volume
        emptyDir: {}

---
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: grade-service-hpa
  namespace: thutolms
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: grade-service
  minReplicas: 10
  maxReplicas: 100
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 20
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60

---
# Service
apiVersion: v1
kind: Service
metadata:
  name: grade-service
  namespace: thutolms
  labels:
    app: grade-service
spec:
  selector:
    app: grade-service
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
    name: http
  type: ClusterIP
```

### Monitoring and Alerting Configuration
```yaml
# Prometheus AlertManager Rules
groups:
- name: thutolms.rules
  rules:
  
  # High Error Rate Alert
  - alert: HighErrorRate
    expr: |
      (
        sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
        /
        sum(rate(http_requests_total[5m])) by (service)
      ) > 0.01
    for: 5m
    labels:
      severity: critical
      service: "{{ $labels.service }}"
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value | humanizePercentage }} for service {{ $labels.service }}"
      
  # High Response Time Alert
  - alert: HighResponseTime
    expr: |
      histogram_quantile(0.95, 
        sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
      ) > 2
    for: 5m
    labels:
      severity: warning
      service: "{{ $labels.service }}"
    annotations:
      summary: "High response time detected"
      description: "95th percentile response time is {{ $value }}s for service {{ $labels.service }}"
      
  # Database Connection Pool Alert
  - alert: DatabaseConnectionPoolHigh
    expr: |
      (
        hikaricp_connections_active / hikaricp_connections_max
      ) > 0.8
    for: 3m
    labels:
      severity: warning
    annotations:
      summary: "Database connection pool utilization high"
      description: "Connection pool utilization is {{ $value | humanizePercentage }}"
      
  # Redis Memory Usage Alert
  - alert: RedisMemoryHigh
    expr: |
      (
        redis_memory_used_bytes / redis_memory_max_bytes
      ) > 0.9
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Redis memory usage critical"
      description: "Redis memory usage is {{ $value | humanizePercentage }}"
      
  # JVM Memory Alert
  - alert: JVMMemoryHigh
    expr: |
      (
        jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"}
      ) > 0.85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "JVM heap memory usage high"
      description: "JVM heap usage is {{ $value | humanizePercentage }} for instance {{ $labels.instance }}"

# Grafana Dashboard Configuration
dashboards:
  - name: "ThutoLMS Overview"
    panels:
      - title: "Request Rate"
        type: "graph"
        targets:
          - expr: 'sum(rate(http_requests_total[5m])) by (service)'
            legendFormat: "{{ service }}"
            
      - title: "Response Time (95th percentile)"
        type: "graph"
        targets:
          - expr: 'histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))'
            legendFormat: "{{ service }}"
            
      - title: "Error Rate"
        type: "graph"
        targets:
          - expr: 'sum(rate(http_requests_total{status=~"5.."}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service)'
            legendFormat: "{{ service }}"
            
      - title: "Active Users"
        type: "stat"
        targets:
          - expr: 'redis_connected_clients'
            
      - title: "Database Connections"
        type: "graph"
        targets:
          - expr: 'hikaricp_connections_active'
            legendFormat: "Active"
          - expr: 'hikaricp_connections_idle'
            legendFormat: "Idle"
```

### Security Configuration
```yaml
# OAuth2/JWT Security Configuration
security:
  oauth2:
    resourceserver:
      jwt:
        issuer-uri: https://auth.thutolms.gov.bw
        jwk-set-uri: https://auth.thutolms.gov.bw/.well-known/jwks.json
        
  cors:
    allowed-origins:
      - https://thutolms.gov.bw
      - https://app.thutolms.gov.bw
    allowed-methods:
      - GET
      - POST
      - PUT
      - DELETE
      - OPTIONS
    allowed-headers:
      - Authorization
      - Content-Type
      - X-Requested-With
    allow-credentials: true
    max-age: 3600

# Rate Limiting Configuration
rate-limiting:
  rules:
    - path: "/api/v1/auth/**"
      limit: 10
      window: 60  # seconds
      
    - path: "/api/v1/grades/**"
      limit: 1000
      window: 60
      
    - path: "/api/v1/files/upload"
      limit: 5
      window: 60
      
    - path: "/api/v1/**"
      limit: 500
      window: 60

# WAF Rules (ModSecurity)
waf_rules:
  - rule_id: 1001
    description: "Block SQL injection attempts"
    pattern: "(?i)(union|select|insert|delete|update|drop|create|alter|exec|execute)"
    action: "block"
    
  - rule_id: 1002
    description: "Block XSS attempts"
    pattern: "(?i)(<script|javascript:|vbscript:|onload=|onerror=)"
    action: "block"
    
  - rule_id: 1003
    description: "Rate limit by IP"
    condition: "requests_per_minute > 1000"
    action: "rate_limit"
    
  - rule_id: 1004
    description: "Block large payloads"
    condition: "content_length > 10485760"  # 10MB
    action: "block"
```

### Disaster Recovery Configuration
```yaml
# Backup Strategy Configuration
backup:
  database:
    primary:
      type: "continuous"
      method: "wal-e"
      destination: "s3://thutolms-backups/database/primary"
      retention: "30 days"
      encryption: "AES-256"
      
    snapshots:
      frequency: "daily"
      time: "02:00"
      retention: "90 days"
      compression: "gzip"
      
  files:
    method: "rsync"
    destination: "s3://thutolms-backups/files"
    frequency: "hourly"
    retention: "1 year"
    encryption: "AES-256"
    
  redis:
    method: "rdb_snapshot"
    frequency: "6 hours"
    retention: "7 days"
    destination: "s3://thutolms-backups/redis"

# Disaster Recovery Procedures
disaster_recovery:
  rto: "1 hour"  # Recovery Time Objective
  rpo: "15 minutes"  # Recovery Point Objective
  
  procedures:
    database_failover:
      detection_time: "30 seconds"
      promotion_time: "60 seconds"
      dns_update_time: "30 seconds"
      total_time: "2 minutes"
      
    application_failover:
      detection_time: "60 seconds"
      container_startup: "120 seconds"
      load_balancer_update: "30 seconds"
      total_time: "3.5 minutes"
      
    full_site_recovery:
      infrastructure_provisioning: "30 minutes"
      data_restoration: "20 minutes"
      application_deployment: "10 minutes"
      total_time: "60 minutes"

# Multi-Region Setup
regions:
  primary:
    name: "botswana-central"
    location: "Gaborone"
    services: ["all"]
    
  secondary:
    name: "botswana-north"
    location: "Francistown"
    services: ["read-replicas", "cdn", "backup"]
    
  tertiary:
    name: "south-africa-west"
    location: "Cape Town"
    services: ["disaster-recovery", "backup"]
```

This technical specification provides implementation-ready configurations for deploying and operating ThutoLMS at national scale with enterprise-grade reliability, security, and performance. 