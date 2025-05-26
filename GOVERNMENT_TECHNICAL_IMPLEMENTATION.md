# ThutoLMS - Government Server Technical Implementation

## 🖥️ Server Configuration Specifications

### Application Server Configuration
```bash
# Physical Server Specifications
# Dell PowerEdge R750 or equivalent

Hardware Configuration:
- CPU: 2x Intel Xeon Gold 6248R (24 cores, 48 threads each)
- RAM: 256GB DDR4-3200 ECC (8x 32GB modules)
- Storage: 
  - OS: 2x 480GB SSD RAID 1
  - Application: 2x 1.92TB NVMe SSD RAID 1
  - Logs: 4x 2TB SATA HDD RAID 10
- Network: 2x 25GbE + 2x 1GbE (management)
- Power: Dual 750W PSU
- Management: iDRAC9 Enterprise

Operating System Configuration:
- OS: Red Hat Enterprise Linux 8.6 (Government Edition)
- Kernel: Hardened kernel with security patches
- SELinux: Enforcing mode
- Firewall: firewalld with custom rules
- Time sync: chrony with government NTP servers

# /etc/chrony.conf
server ntp1.gov.bw iburst
server ntp2.gov.bw iburst
server ntp3.gov.bw iburst
driftfile /var/lib/chrony/drift
makestep 1.0 3
rtcsync
```

### Database Server Configuration
```bash
# High-Performance Database Server
# Dell PowerEdge R7525 or equivalent

Hardware Configuration:
- CPU: 2x AMD EPYC 7543 (32 cores, 64 threads each)
- RAM: 1TB DDR4-3200 ECC (16x 64GB modules)
- Storage:
  - OS: 2x 480GB SSD RAID 1
  - Database: 8x 3.84TB NVMe SSD RAID 10
  - WAL: 2x 1.92TB NVMe SSD RAID 1
  - Backup: 4x 8TB SAS HDD RAID 10
- Network: 2x 100GbE + 2x 25GbE
- Power: Dual 1100W PSU

PostgreSQL Configuration:
# /var/lib/pgsql/data/postgresql.conf

# Memory Configuration
shared_buffers = 256GB                    # 25% of RAM
effective_cache_size = 768GB              # 75% of RAM
work_mem = 256MB                          # For complex queries
maintenance_work_mem = 8GB                # For maintenance operations
wal_buffers = 64MB                        # WAL buffer size

# Connection Configuration
max_connections = 2000                    # Maximum connections
superuser_reserved_connections = 10       # Reserved for superuser

# WAL Configuration
wal_level = replica                       # For replication
max_wal_size = 16GB                      # Maximum WAL size
min_wal_size = 4GB                       # Minimum WAL size
checkpoint_completion_target = 0.9        # Checkpoint completion target
wal_compression = on                      # Compress WAL

# Replication Configuration
hot_standby = on                          # Enable hot standby
max_replication_slots = 10                # Replication slots
max_wal_senders = 10                     # WAL senders

# Performance Configuration
random_page_cost = 1.1                   # SSD optimization
effective_io_concurrency = 200           # Concurrent I/O operations
max_worker_processes = 64                # Worker processes
max_parallel_workers = 32               # Parallel workers
max_parallel_workers_per_gather = 16    # Parallel workers per gather

# Logging Configuration
log_destination = 'stderr,syslog'        # Log destinations
logging_collector = on                   # Enable log collector
log_directory = '/var/log/postgresql'    # Log directory
log_filename = 'postgresql-%Y-%m-%d.log' # Log filename pattern
log_min_duration_statement = 1000       # Log slow queries (1 second)
log_checkpoints = on                     # Log checkpoints
log_connections = on                     # Log connections
log_disconnections = on                  # Log disconnections
log_lock_waits = on                      # Log lock waits
```

### Load Balancer Configuration
```bash
# F5 Big-IP Configuration for Government Environment

# Virtual Server Configuration
ltm virtual thutolms-https {
    destination 10.1.1.100:443
    ip-protocol tcp
    pool thutolms-app-pool
    profiles {
        tcp { }
        http { }
        clientssl {
            context clientside
            cert-key-chain {
                thutolms-gov-bw {
                    cert thutolms.gov.bw.crt
                    key thutolms.gov.bw.key
                }
            }
        }
    }
    rules {
        security-headers
        government-compliance
    }
    source-address-translation {
        type automap
    }
}

# Pool Configuration
ltm pool thutolms-app-pool {
    members {
        10.1.2.10:8080 {
            address 10.1.2.10
            session monitor-enabled
            state up
        }
        10.1.2.11:8080 {
            address 10.1.2.11
            session monitor-enabled
            state up
        }
        # ... additional pool members
    }
    monitor http_thutolms
    load-balancing-mode least-connections-member
}

# Health Monitor
ltm monitor http http_thutolms {
    defaults-from http
    destination *:8080
    interval 10
    recv "UP"
    send "GET /actuator/health HTTP/1.1\r\nHost: thutolms.gov.bw\r\nConnection: Close\r\n\r\n"
    timeout 30
}

# Security iRule
ltm rule security-headers {
    when HTTP_RESPONSE {
        # Government security headers
        HTTP::header insert "Strict-Transport-Security" "max-age=31536000; includeSubDomains"
        HTTP::header insert "X-Frame-Options" "DENY"
        HTTP::header insert "X-Content-Type-Options" "nosniff"
        HTTP::header insert "X-XSS-Protection" "1; mode=block"
        HTTP::header insert "Content-Security-Policy" "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
        HTTP::header insert "Referrer-Policy" "strict-origin-when-cross-origin"
    }
}
```

## 🔒 Government Security Hardening

### Operating System Hardening
```bash
#!/bin/bash
# Government Security Hardening Script

# 1. System Updates and Patches
dnf update -y
dnf install -y aide rkhunter chkrootkit

# 2. Kernel Hardening
cat >> /etc/sysctl.d/99-security.conf << EOF
# Network Security
net.ipv4.ip_forward = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1
net.ipv4.tcp_syncookies = 1

# Memory Protection
kernel.dmesg_restrict = 1
kernel.kptr_restrict = 2
kernel.yama.ptrace_scope = 1
kernel.kexec_load_disabled = 1

# File System Security
fs.suid_dumpable = 0
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
EOF

sysctl -p /etc/sysctl.d/99-security.conf

# 3. Firewall Configuration
systemctl enable firewalld
systemctl start firewalld

# Create government zone
firewall-cmd --permanent --new-zone=government
firewall-cmd --permanent --zone=government --add-source=10.0.0.0/8
firewall-cmd --permanent --zone=government --add-source=172.16.0.0/12
firewall-cmd --permanent --zone=government --add-source=192.168.0.0/16

# Application ports
firewall-cmd --permanent --zone=government --add-port=8080/tcp
firewall-cmd --permanent --zone=government --add-port=5432/tcp
firewall-cmd --permanent --zone=government --add-port=6379/tcp

# Management ports
firewall-cmd --permanent --zone=government --add-port=22/tcp
firewall-cmd --permanent --zone=government --add-port=161/udp

firewall-cmd --reload

# 4. SSH Hardening
cat > /etc/ssh/sshd_config.d/99-government.conf << EOF
# Government SSH Configuration
Protocol 2
Port 22
PermitRootLogin no
MaxAuthTries 3
MaxSessions 4
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
PrintMotd no
ClientAliveInterval 300
ClientAliveCountMax 2
LoginGraceTime 60
AllowGroups sshusers
EOF

systemctl restart sshd

# 5. Audit Configuration
cat > /etc/audit/rules.d/government.rules << EOF
# Government Audit Rules

# System calls
-a always,exit -F arch=b64 -S adjtimex -S settimeofday -k time-change
-a always,exit -F arch=b64 -S clock_settime -k time-change
-w /etc/localtime -p wa -k time-change

# User and group modifications
-w /etc/group -p wa -k identity
-w /etc/passwd -p wa -k identity
-w /etc/gshadow -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/security/opasswd -p wa -k identity

# Network configuration
-w /etc/hosts -p wa -k system-locale
-w /etc/sysconfig/network -p wa -k system-locale

# System administration
-w /var/log/sudo.log -p wa -k actions
-w /etc/sudoers -p wa -k scope
-w /etc/sudoers.d/ -p wa -k scope

# Application specific
-w /opt/thutolms/ -p wa -k thutolms-changes
-w /var/log/thutolms/ -p wa -k thutolms-logs
EOF

systemctl enable auditd
systemctl restart auditd
```

### Application Security Configuration
```yaml
# Spring Boot Security Configuration for Government
# application-government.yml

spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://auth.gov.bw
          jwk-set-uri: https://auth.gov.bw/.well-known/jwks.json
          
  session:
    store-type: redis
    redis:
      namespace: "thutolms:session"
      flush-mode: on_save
    timeout: 1800  # 30 minutes
    
server:
  ssl:
    enabled: true
    key-store: /etc/ssl/thutolms/keystore.p12
    key-store-password: ${SSL_KEYSTORE_PASSWORD}
    key-store-type: PKCS12
    key-alias: thutolms-gov-bw
    
  # Security headers
  servlet:
    session:
      cookie:
        secure: true
        http-only: true
        same-site: strict
        
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,info
      base-path: /actuator
  endpoint:
    health:
      show-details: when-authorized
      roles: ADMIN
      
# Government-specific security configuration
government:
  security:
    audit:
      enabled: true
      log-level: INFO
      include-request-details: true
      
    session:
      max-concurrent-sessions: 1
      prevent-login-if-maximum-exceeded: true
      
    password:
      min-length: 12
      require-uppercase: true
      require-lowercase: true
      require-numbers: true
      require-special-chars: true
      max-age-days: 90
      
    access:
      failed-login-attempts: 3
      lockout-duration-minutes: 30
      
logging:
  level:
    org.springframework.security: INFO
    com.ohma.thutothebe.security: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level [%X{userId},%X{sessionId}] %logger{36} - %msg%n"
```

## 🌐 Government Network Integration

### GWAN Integration Configuration
```bash
# Government Wide Area Network Integration

# Network Interface Configuration
# /etc/sysconfig/network-scripts/ifcfg-ens1f0
TYPE=Ethernet
BOOTPROTO=static
DEVICE=ens1f0
ONBOOT=yes
IPADDR=10.1.2.10
NETMASK=255.255.255.0
GATEWAY=10.1.2.1
DNS1=10.1.1.10
DNS2=10.1.1.11
DOMAIN=gov.bw

# /etc/sysconfig/network-scripts/ifcfg-ens1f1
TYPE=Ethernet
BOOTPROTO=static
DEVICE=ens1f1
ONBOOT=yes
IPADDR=10.1.3.10
NETMASK=255.255.255.0
# Secondary network for management

# Routing Configuration
# /etc/sysconfig/network-scripts/route-ens1f0
10.0.0.0/8 via 10.1.2.1 dev ens1f0
172.16.0.0/12 via 10.1.2.1 dev ens1f0
192.168.0.0/16 via 10.1.2.1 dev ens1f0

# DNS Configuration for Government Domain
# /etc/systemd/resolved.conf
[Resolve]
DNS=10.1.1.10 10.1.1.11
FallbackDNS=8.8.8.8 8.8.4.4
Domains=gov.bw
DNSSEC=yes
DNSOverTLS=opportunistic
```

### Government PKI Integration
```bash
#!/bin/bash
# Government PKI Certificate Management

# Install Government Root CA
cp /media/government-ca/root-ca.crt /etc/pki/ca-trust/source/anchors/
update-ca-trust

# Configure certificate for ThutoLMS
mkdir -p /etc/ssl/thutolms
chmod 700 /etc/ssl/thutolms

# Generate certificate request
openssl req -new -newkey rsa:4096 -nodes \
    -keyout /etc/ssl/thutolms/thutolms.key \
    -out /etc/ssl/thutolms/thutolms.csr \
    -subj "/C=BW/ST=South-East/L=Gaborone/O=Government of Botswana/OU=Ministry of Education/CN=thutolms.gov.bw"

# Submit CSR to Government CA (manual process)
echo "Submit /etc/ssl/thutolms/thutolms.csr to Government Certificate Authority"

# After receiving signed certificate
# cp signed-certificate.crt /etc/ssl/thutolms/thutolms.crt
# cp intermediate-ca.crt /etc/ssl/thutolms/intermediate.crt

# Create certificate chain
# cat /etc/ssl/thutolms/thutolms.crt /etc/ssl/thutolms/intermediate.crt > /etc/ssl/thutolms/chain.crt

# Create PKCS12 keystore for Java applications
# openssl pkcs12 -export -in /etc/ssl/thutolms/chain.crt -inkey /etc/ssl/thutolms/thutolms.key \
#     -out /etc/ssl/thutolms/keystore.p12 -name thutolms-gov-bw

# Set permissions
chown -R thutolms:thutolms /etc/ssl/thutolms
chmod 600 /etc/ssl/thutolms/*.key
chmod 644 /etc/ssl/thutolms/*.crt
```

## 📊 Monitoring and Compliance

### Government Monitoring Configuration
```yaml
# Prometheus Configuration for Government Environment
# /etc/prometheus/prometheus.yml

global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    environment: 'government'
    datacenter: 'gaborone'

rule_files:
  - "government_rules.yml"
  - "security_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager.gov.bw:9093

scrape_configs:
  - job_name: 'thutolms-app'
    static_configs:
      - targets: 
        - '10.1.2.10:8080'
        - '10.1.2.11:8080'
        - '10.1.2.12:8080'
    metrics_path: '/actuator/prometheus'
    scrape_interval: 30s
    
  - job_name: 'postgresql'
    static_configs:
      - targets:
        - '10.1.2.20:9187'
        - '10.1.2.21:9187'
    scrape_interval: 30s
    
  - job_name: 'redis'
    static_configs:
      - targets:
        - '10.1.2.30:9121'
        - '10.1.2.31:9121'
    scrape_interval: 30s
    
  - job_name: 'node-exporter'
    static_configs:
      - targets:
        - '10.1.2.10:9100'
        - '10.1.2.11:9100'
        - '10.1.2.12:9100'
        - '10.1.2.20:9100'
        - '10.1.2.21:9100'
        - '10.1.2.30:9100'
        - '10.1.2.31:9100'
    scrape_interval: 30s

# Government-specific alert rules
# /etc/prometheus/government_rules.yml
groups:
- name: government.security
  rules:
  - alert: UnauthorizedAccess
    expr: increase(http_requests_total{status=~"401|403"}[5m]) > 10
    for: 2m
    labels:
      severity: critical
      category: security
    annotations:
      summary: "Multiple unauthorized access attempts detected"
      description: "{{ $value }} unauthorized access attempts in the last 5 minutes"
      
  - alert: GovernmentDataAccess
    expr: increase(thutolms_data_access_total{classification="confidential"}[1h]) > 1000
    for: 5m
    labels:
      severity: warning
      category: compliance
    annotations:
      summary: "High volume of confidential data access"
      description: "{{ $value }} confidential data access events in the last hour"
      
  - alert: SystemModification
    expr: increase(node_filesystem_files_total[1h]) > 100
    for: 10m
    labels:
      severity: warning
      category: integrity
    annotations:
      summary: "Significant file system changes detected"
      description: "{{ $value }} new files created in the last hour"
```

### Compliance Reporting
```bash
#!/bin/bash
# Government Compliance Reporting Script

REPORT_DATE=$(date +%Y-%m-%d)
REPORT_DIR="/var/reports/compliance"
mkdir -p $REPORT_DIR

# Generate security compliance report
cat > $REPORT_DIR/security-compliance-$REPORT_DATE.txt << EOF
THUTOLMS SECURITY COMPLIANCE REPORT
Date: $REPORT_DATE
Generated by: $(whoami)
Server: $(hostname)

=== SYSTEM SECURITY STATUS ===
EOF

# Check system updates
echo "System Updates:" >> $REPORT_DIR/security-compliance-$REPORT_DATE.txt
dnf check-update | wc -l >> $REPORT_DIR/security-compliance-$REPORT_DATE.txt

# Check failed login attempts
echo "Failed Login Attempts (last 24h):" >> $REPORT_DIR/security-compliance-$REPORT_DATE.txt
grep "Failed password" /var/log/secure | grep "$(date +%b\ %d)" | wc -l >> $REPORT_DIR/security-compliance-$REPORT_DATE.txt

# Check audit log size
echo "Audit Log Size:" >> $REPORT_DIR/security-compliance-$REPORT_DATE.txt
du -h /var/log/audit/audit.log >> $REPORT_DIR/security-compliance-$REPORT_DATE.txt

# Check certificate expiry
echo "Certificate Expiry:" >> $REPORT_DIR/security-compliance-$REPORT_DATE.txt
openssl x509 -in /etc/ssl/thutolms/thutolms.crt -noout -enddate >> $REPORT_DIR/security-compliance-$REPORT_DATE.txt

# Generate database compliance report
psql -h localhost -U postgres -d thutolms -c "
SELECT 
    'Total Users' as metric,
    COUNT(*) as value
FROM users
UNION ALL
SELECT 
    'Active Sessions (last 24h)',
    COUNT(DISTINCT user_id)
FROM user_sessions 
WHERE created_at > NOW() - INTERVAL '24 hours'
UNION ALL
SELECT 
    'Grade Modifications (last 24h)',
    COUNT(*)
FROM audit_log 
WHERE table_name = 'grades' 
AND created_at > NOW() - INTERVAL '24 hours'
" >> $REPORT_DIR/database-compliance-$REPORT_DATE.txt

# Send report to government monitoring system
# curl -X POST -H "Content-Type: application/json" \
#     -d @$REPORT_DIR/security-compliance-$REPORT_DATE.txt \
#     https://monitoring.gov.bw/api/reports/thutolms

echo "Compliance report generated: $REPORT_DIR/security-compliance-$REPORT_DATE.txt"
```

This technical implementation guide provides the detailed configurations and procedures needed to deploy ThutoLMS on government servers with appropriate security hardening, compliance monitoring, and integration with government infrastructure. 