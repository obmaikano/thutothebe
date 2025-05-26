# Back-of-the-Envelope Estimation - ThutoLMS

## System Overview
**ThutoLMS** - Botswana's National Learning Management System
- **Architecture**: Microservices with Spring Boot 3 + React + PostgreSQL + Redis
- **Scale**: National education platform for Botswana
- **Users**: Students, Teachers, Administrators across all educational levels

## 📊 User Base Estimation

### Botswana Education Statistics
```
Population: ~2.4M people
School-age population (5-24): ~40% = 960,000
Active students: ~800,000
Teachers: ~25,000
Administrators: ~2,000
Total Active Users: ~827,000
```

### User Distribution by Level
| Level | Students | Teachers | Ratio |
|-------|----------|----------|-------|
| Primary | 400,000 | 12,000 | 33:1 |
| Secondary | 300,000 | 10,000 | 30:1 |
| Tertiary | 100,000 | 3,000 | 33:1 |
| **Total** | **800,000** | **25,000** | **32:1** |

## 🕐 Usage Patterns

### Daily Active Users (DAU)
```
Peak school days: 70% of total users = ~580,000 DAU
Regular school days: 50% of total users = ~415,000 DAU
Weekends/holidays: 15% of total users = ~125,000 DAU
```

### Peak Hours Analysis
```
School Hours (8 AM - 4 PM): 80% of DAU
Evening Study (6 PM - 10 PM): 60% of DAU
Peak Concurrent Users: 40% of DAU = ~230,000 users
```

### Request Patterns
```
Average requests per user per session: 50
Average session duration: 45 minutes
Peak hour requests: 230,000 users × 50 requests = 11.5M requests/hour
Peak RPS: 11.5M ÷ 3600 = ~3,200 RPS
```

## 💾 Data Storage Estimation

### Core Entities Data Size

#### Users (827,000 total)
```
User record: ~2KB per user
Total: 827,000 × 2KB = 1.65GB
Annual growth: 5% = 82MB/year
```

#### Courses & Classes
```
Courses: ~50,000 courses
Course data: ~5KB per course = 250MB
Classes per course: 10 average
Class data: ~3KB per class = 1.5GB
```

#### Grades & Assessments
```
Assessments per student per year: 100
Grade records: 800,000 students × 100 = 80M records
Grade record size: ~1KB
Total grades: 80M × 1KB = 80GB per year
5-year retention: 400GB
```

#### Announcements & Messages
```
Daily announcements: 1,000
Message size: ~2KB average
Annual announcements: 365,000 × 2KB = 730MB
Real-time messages: 10M messages/year × 1KB = 10GB
```

#### File Storage (Assignments, Resources)
```
Files per student per year: 50
Average file size: 2MB
Total: 800,000 × 50 × 2MB = 80TB per year
5-year retention: 400TB
```

### Total Storage Requirements
```
Database (PostgreSQL):
- Core data: ~85GB
- Indexes & metadata: ~25GB
- Total DB: ~110GB

File Storage:
- Current year: 80TB
- 5-year retention: 400TB

Backup & Redundancy (3x):
- Database: 330GB
- Files: 1.2PB
```

## 🖥️ Infrastructure Requirements

### Application Servers (Spring Boot)

#### CPU & Memory Calculation
```
Concurrent users: 230,000
Users per server instance: 1,000 (conservative)
Required instances: 230 servers

Per server specs:
- CPU: 4 cores (2.5GHz)
- RAM: 8GB (4GB heap + 4GB system)
- Network: 1Gbps

Total application tier:
- CPU cores: 920 cores
- RAM: 1.84TB
- Network: 230Gbps
```

#### Load Balancer Configuration
```
Primary load balancers: 2 (HA)
Capacity: 10,000 RPS each
SSL termination: Hardware accelerated
Health checks: Every 30 seconds
```

### Database Tier (PostgreSQL)

#### Master Database
```
CPU: 32 cores (high-frequency)
RAM: 256GB (large buffer pool)
Storage: 2TB NVMe SSD (RAID 10)
IOPS: 50,000 IOPS sustained
Network: 10Gbps
```

#### Read Replicas
```
Number of replicas: 4
Specs per replica:
- CPU: 16 cores
- RAM: 128GB
- Storage: 2TB NVMe SSD
- Network: 10Gbps

Read/Write ratio: 80/20
Read queries routed to replicas
```

#### Database Connections
```
Max concurrent connections: 2,000
Connection pool per app server: 10
Total connection pools: 230 × 10 = 2,300
Connection pooler (PgBouncer): Required
```

### Cache Tier (Redis)

#### Redis Cluster Configuration
```
Cache hit ratio target: 85%
Hot data size: ~20GB
Redis cluster nodes: 6 (3 masters, 3 replicas)

Per node specs:
- CPU: 8 cores
- RAM: 64GB (50GB for data + overhead)
- Network: 10Gbps
- Persistence: RDB + AOF
```

#### Cache Strategy
```
Session data: 230,000 sessions × 10KB = 2.3GB
Frequently accessed data: 15GB
Cache TTL: 1-24 hours based on data type
Eviction policy: LRU
```

### File Storage

#### Object Storage (S3-compatible)
```
Current capacity: 100TB
5-year capacity: 500TB
Replication: 3x (1.5PB total)
CDN integration: CloudFront/CloudFlare
Backup: Glacier for long-term retention
```

#### CDN Configuration
```
Edge locations: 5 (major cities in Botswana)
Cache ratio: 70% for static content
Bandwidth: 100Gbps aggregate
SSL/TLS: Enabled with HTTP/2
```

## 🌐 Network & Bandwidth

### Internet Bandwidth Requirements
```
Peak concurrent users: 230,000
Average bandwidth per user: 100Kbps
Peak bandwidth: 230,000 × 100Kbps = 23Gbps

Redundant connections:
- Primary: 30Gbps
- Secondary: 30Gbps
- Total: 60Gbps capacity
```

### Internal Network
```
Data center backbone: 100Gbps
Server-to-server: 10Gbps per server
Storage network: 40Gbps (dedicated)
Management network: 1Gbps (out-of-band)
```

## 💰 Cost Estimation (Annual)

### Infrastructure Costs (Cloud - AWS/Azure)

#### Compute (EC2/VM)
```
Application servers: 230 × $200/month = $552,000
Database servers: 5 × $2,000/month = $120,000
Redis cluster: 6 × $500/month = $36,000
Load balancers: 2 × $300/month = $7,200
Total compute: $715,200/year
```

#### Storage
```
Database storage: 2TB × $0.10/GB = $2,400
File storage: 500TB × $0.023/GB = $138,000
Backup storage: 1.5PB × $0.004/GB = $72,000
Total storage: $212,400/year
```

#### Network & CDN
```
Data transfer: 100TB/month × $0.09/GB = $108,000
CDN: 50TB/month × $0.085/GB = $51,000
Total network: $159,000/year
```

#### Additional Services
```
Monitoring & logging: $24,000
Security services: $36,000
Backup services: $18,000
Total additional: $78,000
```

### Total Annual Infrastructure Cost
```
Compute: $715,200
Storage: $212,400
Network: $159,000
Additional: $78,000
Total: $1,164,600/year
```

### Development & Operations
```
Development team: 12 developers × $60,000 = $720,000
DevOps team: 4 engineers × $70,000 = $280,000
QA team: 4 testers × $45,000 = $180,000
Project management: 2 PMs × $80,000 = $160,000
Total personnel: $1,340,000/year
```

### Total Annual Cost
```
Infrastructure: $1,164,600
Personnel: $1,340,000
Licensing & tools: $100,000
Training & support: $50,000
Contingency (10%): $265,460
Total: $2,920,060/year
```

## 📈 Performance Targets

### Response Time SLAs
```
Page load time: < 2 seconds (95th percentile)
API response time: < 500ms (95th percentile)
File upload: < 30 seconds for 10MB files
Search results: < 1 second
Database queries: < 100ms (average)
```

### Availability Targets
```
System uptime: 99.9% (8.76 hours downtime/year)
Planned maintenance: 4 hours/month
Unplanned downtime: < 4 hours/year
RTO (Recovery Time Objective): 1 hour
RPO (Recovery Point Objective): 15 minutes
```

### Scalability Metrics
```
Horizontal scaling: Auto-scale from 50-500 servers
Database scaling: Read replicas + sharding ready
Cache scaling: Redis cluster expansion
Storage scaling: Unlimited object storage
```

## 🔧 Monitoring & Alerting

### Key Metrics to Monitor
```
Application metrics:
- Response time (p50, p95, p99)
- Error rate (< 0.1%)
- Throughput (RPS)
- Active users

Infrastructure metrics:
- CPU utilization (< 70%)
- Memory usage (< 80%)
- Disk I/O (< 80%)
- Network utilization

Business metrics:
- User engagement
- Feature adoption
- Grade submission rates
- System usage patterns
```

### Alerting Thresholds
```
Critical alerts:
- System down (immediate)
- Error rate > 1% (5 minutes)
- Response time > 5s (5 minutes)

Warning alerts:
- CPU > 80% (15 minutes)
- Memory > 85% (15 minutes)
- Disk space > 90% (30 minutes)
```

## 🚀 Growth Planning

### 3-Year Growth Projection
```
Year 1: 827,000 users (baseline)
Year 2: 950,000 users (+15% growth)
Year 3: 1,100,000 users (+15% growth)

Infrastructure scaling:
- Servers: Linear scaling with user growth
- Database: Implement sharding by Year 2
- Storage: Exponential growth (2x per year)
- Bandwidth: Linear scaling with users
```

### Capacity Planning Triggers
```
Scale up triggers:
- CPU > 70% for 1 hour
- Memory > 80% for 30 minutes
- Response time > 2s for 15 minutes
- Queue depth > 1000 requests

Scale down triggers:
- CPU < 30% for 2 hours
- Memory < 50% for 2 hours
- Low traffic periods (nights/weekends)
```

## 🔒 Security Considerations

### Security Infrastructure
```
WAF (Web Application Firewall): $50,000/year
DDoS protection: $30,000/year
SSL certificates: $5,000/year
Security monitoring: $25,000/year
Penetration testing: $20,000/year
Total security: $130,000/year
```

### Compliance Requirements
```
Data protection: GDPR-like compliance
Student privacy: FERPA equivalent
Audit logging: 7-year retention
Encryption: At rest and in transit
Access controls: Role-based (RBAC)
```

## 📋 Summary

### Key Numbers
- **Users**: 827,000 total, 230,000 peak concurrent
- **Requests**: 3,200 RPS peak
- **Storage**: 110GB database, 400TB files
- **Servers**: 230 application servers
- **Cost**: $2.9M annually
- **Availability**: 99.9% uptime target

### Critical Success Factors
1. **Scalable architecture** with horizontal scaling
2. **Robust caching** strategy for performance
3. **Database optimization** with read replicas
4. **CDN implementation** for file delivery
5. **Comprehensive monitoring** and alerting
6. **Disaster recovery** planning
7. **Security-first** approach
8. **Cost optimization** through auto-scaling

### Risk Mitigation
- **Single points of failure**: Eliminated through redundancy
- **Data loss**: Multiple backups and replication
- **Performance degradation**: Auto-scaling and caching
- **Security breaches**: Multi-layered security approach
- **Cost overruns**: Continuous monitoring and optimization

This estimation provides a solid foundation for planning and implementing ThutoLMS at national scale while maintaining performance, reliability, and cost-effectiveness. 