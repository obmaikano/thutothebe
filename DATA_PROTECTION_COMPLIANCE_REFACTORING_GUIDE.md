# Data Protection Compliance Refactoring Guide
**Based on Botswana Data Protection Bill 2024**

## Executive Summary

This guide provides comprehensive refactoring guidelines to ensure compliance with the Botswana Data Protection Bill 2024. The guide addresses key requirements including personal data handling, security measures, data subject rights, breach notification, and data protection impact assessments.

## Key Compliance Requirements from the Bill

### 1. Personal Data Protection (Sections 26-33)
- Lawful basis for processing personal data
- Consent mechanisms for sensitive personal data
- Data minimization and purpose limitation
- Special protection for children's data

### 2. Data Subject Rights (Part VIII)
- Right of access to personal data
- Right to rectification and erasure
- Right to data portability
- Right to object to processing

### 3. Security Measures (Section 62)
- Appropriate technical and organizational measures
- Access controls and authentication
- Data encryption and pseudonymization
- Regular security assessments

### 4. Breach Notification (Sections 63-64)
- 72-hour notification to Commission
- Communication to data subjects for high-risk breaches
- Documentation of all breaches

### 5. Data Protection Impact Assessment (Sections 65-67)
- Required for high-risk processing operations
- Assessment of necessity and proportionality
- Risk mitigation measures

## Current Architecture Analysis

### Strengths
✅ **BaseEntity Pattern**: Good foundation with audit trails (`createdAt`, `modifiedAt`, `version`)  
✅ **Multi-tenant Security**: Existing access controls with school/region isolation  
✅ **Activity Logging**: `UserActivityLog` entity for tracking user actions  
✅ **Document Access Logging**: `DocumentAccessLog` for file access tracking  
✅ **Role-based Access Control**: Permission system with user roles  

### Gaps Requiring Immediate Attention
❌ **Data Subject Consent Management**: No consent tracking mechanism  
❌ **Data Retention Policies**: No automatic data deletion/archiving  
❌ **Data Anonymization**: No pseudonymization or anonymization capabilities  
❌ **Breach Detection**: No automated breach detection system  
❌ **Data Export Capabilities**: Limited data portability features  
❌ **Data Protection Officer Integration**: No DPO workflow support  

## Required Refactoring Changes

### 1. Enhanced Entity Model

#### A. Data Protection Audit Entity
```java
@Entity
@Table(name = "data_protection_audit")
public class DataProtectionAudit extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "data_subject_id", nullable = false)
    private Person dataSubject;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "processing_activity", nullable = false)
    private ProcessingActivity processingActivity;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "lawful_basis", nullable = false)
    private LawfulBasis lawfulBasis;
    
    @Column(name = "purpose_description", nullable = false)
    private String purposeDescription;
    
    @Column(name = "data_categories", nullable = false)
    private String dataCategories; // JSON array of categories
    
    @Column(name = "retention_period_months")
    private Integer retentionPeriodMonths;
    
    @Column(name = "processing_start_date", nullable = false)
    private LocalDateTime processingStartDate;
    
    @Column(name = "processing_end_date")
    private LocalDateTime processingEndDate;
    
    @Column(name = "automated_decision_making")
    private boolean automatedDecisionMaking = false;
    
    @Column(name = "profiling")
    private boolean profiling = false;
    
    @Column(name = "third_party_transfers")
    private String thirdPartyTransfers; // JSON array of transfers
    
    @Column(name = "active", nullable = false)
    private boolean active = true;
}
```

#### B. Consent Management Entity
```java
@Entity
@Table(name = "data_subject_consent")
public class DataSubjectConsent extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "data_subject_id", nullable = false)
    private Person dataSubject;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "consent_type", nullable = false)
    private ConsentType consentType;
    
    @Column(name = "purpose", nullable = false)
    private String purpose;
    
    @Column(name = "data_categories", nullable = false)
    private String dataCategories; // JSON array
    
    @Column(name = "consent_given", nullable = false)
    private boolean consentGiven;
    
    @Column(name = "consent_date", nullable = false)
    private LocalDateTime consentDate;
    
    @Column(name = "consent_method", nullable = false)
    private String consentMethod; // "web_form", "paper", "verbal", etc.
    
    @Column(name = "consent_withdrawn")
    private boolean consentWithdrawn = false;
    
    @Column(name = "withdrawal_date")
    private LocalDateTime withdrawalDate;
    
    @Column(name = "withdrawal_method")
    private String withdrawalMethod;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;
    
    @Column(name = "active", nullable = false)
    private boolean active = true;
}
```

#### C. Data Breach Management Entity
```java
@Entity
@Table(name = "data_breach_incidents")
public class DataBreachIncident extends BaseEntity {
    
    @Column(name = "incident_id", unique = true, nullable = false)
    private String incidentId; // Auto-generated unique ID
    
    @Column(name = "breach_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private BreachType breachType;
    
    @Column(name = "severity", nullable = false)
    @Enumerated(EnumType.STRING)
    private BreachSeverity severity;
    
    @Column(name = "discovery_date", nullable = false)
    private LocalDateTime discoveryDate;
    
    @Column(name = "occurrence_date")
    private LocalDateTime occurrenceDate;
    
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "affected_data_categories", nullable = false)
    private String affectedDataCategories; // JSON array
    
    @Column(name = "affected_data_subjects_count")
    private Integer affectedDataSubjectsCount;
    
    @Column(name = "affected_records_count")
    private Integer affectedRecordsCount;
    
    @Column(name = "likely_consequences", columnDefinition = "TEXT")
    private String likelyConsequences;
    
    @Column(name = "containment_measures", columnDefinition = "TEXT")
    private String containmentMeasures;
    
    @Column(name = "commission_notified")
    private boolean commissionNotified = false;
    
    @Column(name = "commission_notification_date")
    private LocalDateTime commissionNotificationDate;
    
    @Column(name = "data_subjects_notified")
    private boolean dataSubjectsNotified = false;
    
    @Column(name = "data_subjects_notification_date")
    private LocalDateTime dataSubjectsNotificationDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by", nullable = false)
    private User reportedBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investigating_officer")
    private User investigatingOfficer;
    
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private BreachStatus status = BreachStatus.REPORTED;
    
    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;
    
    @Column(name = "resolution_date")
    private LocalDateTime resolutionDate;
}
```

#### D. Data Retention Policy Entity
```java
@Entity
@Table(name = "data_retention_policies")
public class DataRetentionPolicy extends BaseEntity {
    
    @Column(name = "policy_name", nullable = false)
    private String policyName;
    
    @Column(name = "entity_type", nullable = false)
    private String entityType; // Class name of the entity
    
    @Column(name = "data_category", nullable = false)
    @Enumerated(EnumType.STRING)
    private PersonalDataCategory dataCategory;
    
    @Column(name = "retention_period_months", nullable = false)
    private Integer retentionPeriodMonths;
    
    @Column(name = "retention_trigger", nullable = false)
    @Enumerated(EnumType.STRING)
    private RetentionTrigger retentionTrigger;
    
    @Column(name = "disposal_method", nullable = false)
    @Enumerated(EnumType.STRING)
    private DisposalMethod disposalMethod;
    
    @Column(name = "legal_basis", nullable = false)
    private String legalBasis;
    
    @Column(name = "exceptions", columnDefinition = "TEXT")
    private String exceptions;
    
    @Column(name = "active", nullable = false)
    private boolean active = true;
}
```

### 2. Enhanced BaseEntity with Data Protection Features

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Data
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    @Column(name = "version")
    private Long version;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "modified_at", nullable = false)
    private LocalDateTime modifiedAt;
    
    // NEW: Data Protection Fields
    @Column(name = "data_retention_date")
    private LocalDateTime dataRetentionDate;
    
    @Column(name = "anonymized")
    private boolean anonymized = false;
    
    @Column(name = "anonymized_date")
    private LocalDateTime anonymizedDate;
    
    @Column(name = "consent_required")
    private boolean consentRequired = false;
    
    @Column(name = "data_protection_impact_assessed")
    private boolean dataProtectionImpactAssessed = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        modifiedAt = LocalDateTime.now();
        calculateRetentionDate();
    }

    @PreUpdate
    protected void onUpdate() {
        modifiedAt = LocalDateTime.now();
    }
    
    // NEW: Calculate retention date based on policy
    protected void calculateRetentionDate() {
        // Implementation to be added in concrete entities
    }
    
    // NEW: Check if data should be retained
    public boolean shouldRetainData() {
        return dataRetentionDate == null || LocalDateTime.now().isBefore(dataRetentionDate);
    }
    
    // NEW: Mark for anonymization
    public void markForAnonymization() {
        this.anonymized = true;
        this.anonymizedDate = LocalDateTime.now();
    }
}
```

### 3. Service Layer Enhancements

#### A. Data Subject Rights Service
```java
@Service
@Transactional
public class DataSubjectRightsServiceImpl implements DataSubjectRightsService {
    
    // Export all personal data for a data subject (Right to data portability)
    public PersonalDataExportDto exportPersonalData(Long personId) {
        validateDataSubjectAccess(personId);
        
        PersonalDataExportDto exportDto = new PersonalDataExportDto();
        
        // Collect data from all relevant entities
        exportDto.setPersonalInfo(getPersonalInformation(personId));
        exportDto.setEducationalRecords(getEducationalRecords(personId));
        exportDto.setActivityLogs(getActivityLogs(personId));
        exportDto.setConsents(getConsentHistory(personId));
        exportDto.setProcessingActivities(getProcessingActivities(personId));
        
        // Log the data export request
        logDataSubjectRequest(personId, DataSubjectRequestType.DATA_EXPORT);
        
        return exportDto;
    }
    
    // Delete/anonymize personal data (Right to erasure)
    @Transactional
    public void erasePersonalData(Long personId, DataErasureRequest request) {
        validateDataSubjectAccess(personId);
        validateErasureRequest(request);
        
        if (request.isFullErasure()) {
            performFullErasure(personId);
        } else {
            performSelectiveErasure(personId, request.getDataCategories());
        }
        
        // Log the erasure request
        logDataSubjectRequest(personId, DataSubjectRequestType.DATA_ERASURE);
    }
    
    // Rectify personal data (Right to rectification)
    @Transactional
    public void rectifyPersonalData(Long personId, DataRectificationRequest request) {
        validateDataSubjectAccess(personId);
        
        // Update personal information
        updatePersonalInformation(personId, request.getUpdates());
        
        // Log the rectification request
        logDataSubjectRequest(personId, DataSubjectRequestType.DATA_RECTIFICATION);
    }
}
```

#### B. Data Protection Impact Assessment Service
```java
@Service
public class DataProtectionImpactAssessmentServiceImpl implements DataProtectionImpactAssessmentService {
    
    public DPIAResult assessProcessingActivity(ProcessingActivityAssessment assessment) {
        DPIAResult result = new DPIAResult();
        
        // Assess risk level
        RiskLevel riskLevel = calculateRiskLevel(assessment);
        result.setRiskLevel(riskLevel);
        
        // Check if DPIA is required
        boolean dpiaRequired = isDPIARequired(assessment, riskLevel);
        result.setDpiaRequired(dpiaRequired);
        
        if (dpiaRequired) {
            // Perform full DPIA
            result = performFullDPIA(assessment);
            
            // Check if prior consultation with Commission is required
            if (result.getRiskLevel() == RiskLevel.HIGH) {
                result.setPriorConsultationRequired(true);
            }
        }
        
        return result;
    }
    
    private boolean isDPIARequired(ProcessingActivityAssessment assessment, RiskLevel riskLevel) {
        // Section 65(3) requirements
        return assessment.isSystematicExtensiveEvaluation() ||
               assessment.isSensitiveDataLargeScale() ||
               assessment.isSystematicMonitoringPublicArea() ||
               riskLevel == RiskLevel.HIGH;
    }
}
```

#### C. Breach Detection and Notification Service
```java
@Service
public class DataBreachServiceImpl implements DataBreachService {
    
    @Async
    public void detectAndReportBreach(BreachIndicator indicator) {
        // Analyze breach indicators
        BreachAnalysisResult analysis = analyzeBreachIndicators(indicator);
        
        if (analysis.isConfirmedBreach()) {
            DataBreachIncident incident = createBreachIncident(analysis);
            
            // Immediate containment
            implementContainmentMeasures(incident);
            
            // Risk assessment
            BreachRiskAssessment risk = assessBreachRisk(incident);
            incident.setSeverity(risk.getSeverity());
            
            // Notification requirements (Section 63)
            if (risk.requiresCommissionNotification()) {
                scheduleCommissionNotification(incident);
            }
            
            // Data subject notification (Section 64)
            if (risk.requiresDataSubjectNotification()) {
                scheduleDataSubjectNotification(incident);
            }
            
            // Save incident
            dataBreachRepository.save(incident);
            
            // Alert security team
            alertSecurityTeam(incident);
        }
    }
    
    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void monitorForBreaches() {
        // Monitor failed login attempts
        checkFailedLoginAttempts();
        
        // Monitor unusual data access patterns
        checkUnusualDataAccess();
        
        // Monitor system performance anomalies
        checkSystemAnomalies();
        
        // Monitor data export volumes
        checkDataExportVolumes();
    }
}
```

### 4. Repository Layer Enhancements

#### A. Data Protection Aware Repository
```java
public interface DataProtectionAwareRepository<T extends BaseEntity, ID> extends JpaRepository<T, ID> {
    
    @Query("SELECT e FROM #{#entityName} e WHERE e.dataRetentionDate IS NULL OR e.dataRetentionDate > :currentDate")
    List<T> findAllWithinRetentionPeriod(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT e FROM #{#entityName} e WHERE e.dataRetentionDate <= :currentDate AND e.anonymized = false")
    List<T> findExpiredForAnonymization(@Param("currentDate") LocalDateTime currentDate);
    
    @Modifying
    @Query("UPDATE #{#entityName} e SET e.anonymized = true, e.anonymizedDate = :anonymizationDate WHERE e.id IN :ids")
    void markAsAnonymized(@Param("ids") List<ID> ids, @Param("anonymizationDate") LocalDateTime anonymizationDate);
}
```

#### B. Enhanced User Repository with Data Protection Features
```java
@Repository
public interface UserRepository extends DataProtectionAwareRepository<User, Long> {
    
    @EntityGraph(attributePaths = {"person", "school", "region"})
    @Query("SELECT u FROM User u WHERE u.person.id = :personId")
    Optional<User> findByPersonIdWithPersonalData(@Param("personId") Long personId);
    
    @Query("SELECT u FROM User u WHERE u.lastLoginTime < :cutoffDate AND u.active = true")
    List<User> findInactiveUsers(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    @Query("SELECT DISTINCT u FROM User u " +
           "JOIN u.person p " +
           "WHERE (:hasConsent = false OR EXISTS (" +
           "    SELECT c FROM DataSubjectConsent c " +
           "    WHERE c.dataSubject = p " +
           "    AND c.consentGiven = true " +
           "    AND c.consentWithdrawn = false " +
           "    AND (c.expiryDate IS NULL OR c.expiryDate > :currentDate)" +
           "))")
    List<User> findUsersWithValidConsent(@Param("hasConsent") boolean hasConsent, @Param("currentDate") LocalDateTime currentDate);
}
```

## Frontend Refactoring Requirements

### 1. Data Protection Dashboard

#### A. Privacy Dashboard Component
```tsx
// src/components/privacy/PrivacyDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, Grid, Typography, Button, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { dataSubjectRightsService } from '../services/dataSubjectRightsService';

export const PrivacyDashboard: React.FC = () => {
  const [consents, setConsents] = useState([]);
  const [dataProcessingInfo, setDataProcessingInfo] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    loadPrivacyData();
  }, []);

  const loadPrivacyData = async () => {
    try {
      const [consentsData, processingData, requestsData] = await Promise.all([
        dataSubjectRightsService.getUserConsents(),
        dataSubjectRightsService.getProcessingActivities(),
        dataSubjectRightsService.getPendingRequests()
      ]);
      
      setConsents(consentsData);
      setDataProcessingInfo(processingData);
      setPendingRequests(requestsData);
    } catch (error) {
      console.error('Failed to load privacy data:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Your Privacy & Data Protection
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <ConsentManagement 
          consents={consents} 
          onConsentUpdate={loadPrivacyData}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <DataRightsCard />
      </Grid>
      
      <Grid item xs={12}>
        <ProcessingActivitiesCard activities={dataProcessingInfo} />
      </Grid>
      
      <Grid item xs={12}>
        <PendingRequestsCard requests={pendingRequests} />
      </Grid>
    </Grid>
  );
};
```

#### B. Consent Management Component
```tsx
// src/components/privacy/ConsentManagement.tsx
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Switch, 
  FormControlLabel, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';

interface ConsentItem {
  id: string;
  purpose: string;
  description: string;
  dataCategories: string[];
  isGiven: boolean;
  isRequired: boolean;
  expiryDate?: string;
  canWithdraw: boolean;
}

interface ConsentManagementProps {
  consents: ConsentItem[];
  onConsentUpdate: () => void;
}

export const ConsentManagement: React.FC<ConsentManagementProps> = ({ 
  consents, 
  onConsentUpdate 
}) => {
  const [confirmDialog, setConfirmDialog] = useState({ open: false, consent: null });

  const handleConsentToggle = (consent: ConsentItem) => {
    if (consent.isGiven && consent.canWithdraw) {
      setConfirmDialog({ open: true, consent });
    } else if (!consent.isGiven) {
      updateConsent(consent.id, true);
    }
  };

  const updateConsent = async (consentId: string, granted: boolean) => {
    try {
      await dataSubjectRightsService.updateConsent(consentId, granted);
      onConsentUpdate();
      setConfirmDialog({ open: false, consent: null });
    } catch (error) {
      console.error('Failed to update consent:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Consent Management
        </Typography>
        
        {consents.map((consent) => (
          <div key={consent.id} className="consent-item">
            <FormControlLabel
              control={
                <Switch
                  checked={consent.isGiven}
                  onChange={() => handleConsentToggle(consent)}
                  disabled={consent.isRequired || !consent.canWithdraw}
                />
              }
              label={
                <div>
                  <Typography variant="subtitle2">{consent.purpose}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {consent.description}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Data: {consent.dataCategories.join(', ')}
                  </Typography>
                  {consent.expiryDate && (
                    <Typography variant="caption" color="warning.main">
                      Expires: {new Date(consent.expiryDate).toLocaleDateString()}
                    </Typography>
                  )}
                </div>
              }
            />
            {consent.isRequired && (
              <Alert severity="info" size="small">
                This consent is required for core service functionality
              </Alert>
            )}
          </div>
        ))}
        
        <ConsentWithdrawalDialog
          open={confirmDialog.open}
          consent={confirmDialog.consent}
          onConfirm={(consentId) => updateConsent(consentId, false)}
          onCancel={() => setConfirmDialog({ open: false, consent: null })}
        />
      </CardContent>
    </Card>
  );
};
```

### 2. Data Subject Rights Interface

#### A. Data Export Request Component
```tsx
// src/components/privacy/DataExportRequest.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Alert,
  CircularProgress,
  Download
} from '@mui/material';

interface DataCategory {
  id: string;
  name: string;
  description: string;
  estimatedSize: string;
}

export const DataExportRequest: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'processing' | 'ready' | 'error'>('idle');
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const dataCategories: DataCategory[] = [
    { id: 'personal_info', name: 'Personal Information', description: 'Name, email, contact details', estimatedSize: '< 1MB' },
    { id: 'educational_records', name: 'Educational Records', description: 'Grades, assignments, assessments', estimatedSize: '< 5MB' },
    { id: 'activity_logs', name: 'Activity Logs', description: 'Login history, system usage', estimatedSize: '< 2MB' },
    { id: 'communications', name: 'Communications', description: 'Messages, announcements', estimatedSize: '< 3MB' },
    { id: 'documents', name: 'Uploaded Documents', description: 'Files and documents you\'ve uploaded', estimatedSize: 'Variable' }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleExportRequest = async () => {
    if (selectedCategories.length === 0) return;
    
    setIsSubmitting(true);
    setExportStatus('processing');
    
    try {
      const response = await dataSubjectRightsService.requestDataExport(selectedCategories);
      
      // Poll for completion
      const jobId = response.jobId;
      pollExportStatus(jobId);
      
    } catch (error) {
      setExportStatus('error');
      setIsSubmitting(false);
    }
  };

  const pollExportStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await dataSubjectRightsService.getExportStatus(jobId);
        
        if (status.completed) {
          setExportStatus('ready');
          setDownloadLink(status.downloadUrl);
          setIsSubmitting(false);
          clearInterval(interval);
        } else if (status.failed) {
          setExportStatus('error');
          setIsSubmitting(false);
          clearInterval(interval);
        }
      } catch (error) {
        setExportStatus('error');
        setIsSubmitting(false);
        clearInterval(interval);
      }
    }, 2000);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Export Your Data
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Select the categories of data you'd like to export. We'll compile your data into a downloadable file.
        </Typography>

        <FormGroup>
          {dataCategories.map((category) => (
            <FormControlLabel
              key={category.id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  disabled={isSubmitting}
                />
              }
              label={
                <div>
                  <Typography variant="subtitle2">{category.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {category.description} • Est. size: {category.estimatedSize}
                  </Typography>
                </div>
              }
            />
          ))}
        </FormGroup>

        {exportStatus === 'processing' && (
          <Alert severity="info" icon={<CircularProgress size={20} />}>
            Processing your data export request. This may take a few minutes...
          </Alert>
        )}

        {exportStatus === 'ready' && downloadLink && (
          <Alert 
            severity="success" 
            action={
              <Button 
                color="inherit" 
                size="small" 
                startIcon={<Download />}
                href={downloadLink}
                download
              >
                Download
              </Button>
            }
          >
            Your data export is ready for download.
          </Alert>
        )}

        {exportStatus === 'error' && (
          <Alert severity="error">
            Failed to process your export request. Please try again or contact support.
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleExportRequest}
          disabled={selectedCategories.length === 0 || isSubmitting}
          fullWidth
          sx={{ mt: 2 }}
        >
          {isSubmitting ? 'Processing...' : 'Request Data Export'}
        </Button>
        
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
          Export requests are processed within 24 hours. Download links expire after 7 days.
        </Typography>
      </CardContent>
    </Card>
  );
};
```

#### B. Data Correction Request Component
```tsx
// src/components/privacy/DataCorrectionRequest.tsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Divider
} from '@mui/material';

interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}

export const DataCorrectionRequest: React.FC = () => {
  const [currentData, setCurrentData] = useState<PersonalData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: ''
  });
  
  const [proposedChanges, setProposedChanges] = useState<Partial<PersonalData>>({});
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadCurrentData();
  }, []);

  const loadCurrentData = async () => {
    try {
      const data = await dataSubjectRightsService.getCurrentPersonalData();
      setCurrentData(data);
    } catch (error) {
      console.error('Failed to load current data:', error);
    }
  };

  const handleFieldChange = (field: keyof PersonalData, value: string) => {
    setProposedChanges(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitCorrection = async () => {
    if (Object.keys(proposedChanges).length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      await dataSubjectRightsService.requestDataCorrection({
        changes: proposedChanges,
        justification
      });
      
      setSubmitStatus('success');
      setProposedChanges({});
      setJustification('');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = Object.keys(proposedChanges).length > 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Request Data Correction
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Review your personal data below and request corrections where needed.
        </Typography>

        <Grid container spacing={2}>
          {Object.entries(currentData).map(([field, value]) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                fullWidth
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                value={proposedChanges[field as keyof PersonalData] ?? value}
                onChange={(e) => handleFieldChange(field as keyof PersonalData, e.target.value)}
                helperText={
                  proposedChanges[field as keyof PersonalData] 
                    ? `Current: ${value}` 
                    : undefined
                }
                error={proposedChanges[field as keyof PersonalData] !== undefined}
              />
            </Grid>
          ))}
        </Grid>

        {hasChanges && (
          <>
            <Divider sx={{ my: 2 }} />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Justification for Changes"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Please explain why these changes are necessary..."
              sx={{ mb: 2 }}
            />
          </>
        )}

        {submitStatus === 'success' && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Your correction request has been submitted and will be reviewed within 5 business days.
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to submit correction request. Please try again.
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleSubmitCorrection}
          disabled={!hasChanges || !justification.trim() || isSubmitting}
          fullWidth
        >
          {isSubmitting ? 'Submitting...' : 'Submit Correction Request'}
        </Button>
      </CardContent>
    </Card>
  );
};
```

### 3. Enhanced Authentication & Security

#### A. Enhanced Login with Privacy Consent
```tsx
// src/components/auth/EnhancedLogin.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

export const EnhancedLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [consentGiven, setConsentGiven] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const handleLogin = async () => {
    if (!consentGiven && isFirstLogin) {
      alert('Please accept the privacy policy to continue');
      return;
    }

    try {
      const response = await authService.login(credentials, consentGiven);
      
      if (response.requiresConsent) {
        setIsFirstLogin(true);
        return;
      }
      
      // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom align="center">
          Sign In
        </Typography>

        <TextField
          fullWidth
          label="Username"
          value={credentials.username}
          onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
          margin="normal"
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          value={credentials.password}
          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          margin="normal"
        />

        {isFirstLogin && (
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2">First Time Login</Typography>
            Please review and accept our privacy policy before continuing.
          </Alert>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              required={isFirstLogin}
            />
          }
          label={
            <Typography variant="body2">
              I accept the{' '}
              <Button 
                variant="text" 
                size="small"
                onClick={() => setShowPrivacyPolicy(true)}
              >
                Privacy Policy
              </Button>
              {' '}and consent to data processing
            </Typography>
          }
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={!credentials.username || !credentials.password || (isFirstLogin && !consentGiven)}
          sx={{ mt: 2 }}
        >
          Sign In
        </Button>

        <PrivacyPolicyDialog
          open={showPrivacyPolicy}
          onClose={() => setShowPrivacyPolicy(false)}
          onAccept={() => {
            setConsentGiven(true);
            setShowPrivacyPolicy(false);
          }}
        />
      </CardContent>
    </Card>
  );
};
```

#### B. Session Management with Privacy Awareness
```tsx
// src/components/security/SessionManager.tsx
import React, { useEffect, useState } from 'react';
import { Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export const SessionManager: React.FC = () => {
  const [sessionWarning, setSessionWarning] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const checkSession = () => {
      const session = authService.getSessionInfo();
      
      if (session.expired) {
        setSessionExpired(true);
        // Log user out and clear sensitive data
        authService.logout();
        // Clear any cached personal data
        dataSubjectRightsService.clearCache();
        return;
      }
      
      const remaining = session.expiresAt - Date.now();
      setTimeRemaining(remaining);
      
      // Show warning 5 minutes before expiry
      if (remaining <= 5 * 60 * 1000 && remaining > 0) {
        setSessionWarning(true);
      }
    };

    const interval = setInterval(checkSession, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const extendSession = async () => {
    try {
      await authService.extendSession();
      setSessionWarning(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  };

  return (
    <>
      {sessionWarning && (
        <Alert 
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={extendSession}>
              Extend Session
            </Button>
          }
        >
          Your session will expire in {Math.floor(timeRemaining / 60000)} minutes. 
          Unsaved changes may be lost.
        </Alert>
      )}

      <Dialog open={sessionExpired}>
        <DialogTitle>Session Expired</DialogTitle>
        <DialogContent>
          Your session has expired for security reasons. Please log in again to continue.
          Any sensitive data has been cleared from your browser.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.location.reload()}>
            Return to Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
```

### 4. Privacy-First Form Components

#### A. Data Collection Form with Consent
```tsx
// src/components/forms/DataCollectionForm.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

interface DataCollectionFormProps {
  purpose: string;
  dataCategories: string[];
  retentionPeriod: string;
  onSubmit: (data: any, consents: any) => void;
}

export const DataCollectionForm: React.FC<DataCollectionFormProps> = ({
  purpose,
  dataCategories,
  retentionPeriod,
  onSubmit
}) => {
  const [formData, setFormData] = useState({});
  const [consents, setConsents] = useState({
    dataProcessing: false,
    communications: false,
    analytics: false
  });
  const [showDataPolicy, setShowDataPolicy] = useState(false);

  const canSubmit = consents.dataProcessing; // Minimum required consent

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {purpose}
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Data Collection Notice</Typography>
          We collect: {dataCategories.join(', ')}. 
          Data will be retained for: {retentionPeriod}.
        </Alert>

        {/* Form fields here */}
        
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Privacy & Consent Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Checkbox
                  checked={consents.dataProcessing}
                  onChange={(e) => setConsents(prev => ({
                    ...prev,
                    dataProcessing: e.target.checked
                  }))}
                  required
                />
              }
              label="I consent to the processing of my personal data for the stated purpose (Required)"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={consents.communications}
                  onChange={(e) => setConsents(prev => ({
                    ...prev,
                    communications: e.target.checked
                  }))}
                />
              }
              label="I consent to receive communications related to this service (Optional)"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={consents.analytics}
                  onChange={(e) => setConsents(prev => ({
                    ...prev,
                    analytics: e.target.checked
                  }))}
                />
              }
              label="I consent to the use of my data for analytics and service improvement (Optional)"
            />
          </AccordionDetails>
        </Accordion>

        <Button
          fullWidth
          variant="contained"
          disabled={!canSubmit}
          onClick={() => onSubmit(formData, consents)}
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};
```

### 5. Data Protection Officer (DPO) Interface

#### A. DPO Dashboard
```tsx
// src/components/dpo/DPODashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Badge,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';

export const DPODashboard: React.FC = () => {
  const [breachIncidents, setBreachIncidents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [complianceMetrics, setComplianceMetrics] = useState(null);

  useEffect(() => {
    loadDPOData();
  }, []);

  const loadDPOData = async () => {
    try {
      const [incidents, requests, metrics] = await Promise.all([
        dpoService.getBreachIncidents(),
        dpoService.getPendingDataSubjectRequests(),
        dpoService.getComplianceMetrics()
      ]);
      
      setBreachIncidents(incidents);
      setPendingRequests(requests);
      setComplianceMetrics(metrics);
    } catch (error) {
      console.error('Failed to load DPO data:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Data Protection Officer Dashboard
        </Typography>
      </Grid>

      {/* Urgent Alerts */}
      {breachIncidents.some(incident => incident.severity === 'HIGH') && (
        <Grid item xs={12}>
          <Alert severity="error">
            <Typography variant="subtitle1">
              High severity data breach incidents require immediate attention
            </Typography>
          </Alert>
        </Grid>
      )}

      {/* Breach Incidents */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Data Breach Incidents
              <Badge badgeContent={breachIncidents.length} color="error" sx={{ ml: 1 }} />
            </Typography>
            
            <List>
              {breachIncidents.slice(0, 5).map((incident) => (
                <ListItem key={incident.id}>
                  <ListItemText
                    primary={incident.description}
                    secondary={`Discovered: ${incident.discoveryDate}`}
                  />
                  <Chip 
                    label={incident.severity} 
                    color={incident.severity === 'HIGH' ? 'error' : 'warning'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
            
            <Button variant="outlined" fullWidth>
              View All Incidents
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Pending Requests */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pending Data Subject Requests
              <Badge badgeContent={pendingRequests.length} color="primary" sx={{ ml: 1 }} />
            </Typography>
            
            <List>
              {pendingRequests.slice(0, 5).map((request) => (
                <ListItem key={request.id}>
                  <ListItemText
                    primary={`${request.type} Request`}
                    secondary={`From: ${request.dataSubjectName} • ${request.submittedAt}`}
                  />
                  <Chip 
                    label={request.status} 
                    color="primary"
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
            
            <Button variant="outlined" fullWidth>
              Process Requests
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Compliance Metrics */}
      <Grid item xs={12}>
        <ComplianceMetricsCard metrics={complianceMetrics} />
      </Grid>
    </Grid>
  );
};
```

### 6. Frontend Service Layer

#### A. Data Subject Rights Service
```typescript
// src/services/dataSubjectRightsService.ts
class DataSubjectRightsService {
  private baseUrl = '/api/data-subject-rights';

  async getUserConsents(userId: string) {
    const response = await fetch(`${this.baseUrl}/consents/${userId}`);
    return response.json();
  }

  async updateConsent(consentId: string, granted: boolean) {
    const response = await fetch(`${this.baseUrl}/consent/${consentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ granted })
    });
    return response.json();
  }

  async requestDataExport(categories: string[]) {
    const response = await fetch(`${this.baseUrl}/export-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories })
    });
    return response.json();
  }

  async getExportStatus(jobId: string) {
    const response = await fetch(`${this.baseUrl}/export-status/${jobId}`);
    return response.json();
  }

  async requestDataCorrection(correctionRequest: any) {
    const response = await fetch(`${this.baseUrl}/correction-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(correctionRequest)
    });
    return response.json();
  }

  async requestDataErasure(erasureRequest: any) {
    const response = await fetch(`${this.baseUrl}/erasure-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(erasureRequest)
    });
    return response.json();
  }

  clearCache() {
    // Clear any cached personal data from localStorage/sessionStorage
    localStorage.removeItem('personalData');
    sessionStorage.clear();
  }
}

export const dataSubjectRightsService = new DataSubjectRightsService();
```

### 7. Privacy-First State Management

#### A. Privacy-Aware Redux Store
```typescript
// src/store/privacySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PrivacyState {
  consents: Record<string, boolean>;
  dataRetentionNotices: any[];
  sessionInfo: {
    expiresAt: number;
    warningShown: boolean;
  };
  sensitiveDataLoaded: boolean;
}

const initialState: PrivacyState = {
  consents: {},
  dataRetentionNotices: [],
  sessionInfo: { expiresAt: 0, warningShown: false },
  sensitiveDataLoaded: false
};

const privacySlice = createSlice({
  name: 'privacy',
  initialState,
  reducers: {
    updateConsent: (state, action: PayloadAction<{ id: string; granted: boolean }>) => {
      state.consents[action.payload.id] = action.payload.granted;
    },
    
    clearSensitiveData: (state) => {
      // Clear all sensitive data from state
      state.sensitiveDataLoaded = false;
      // Additional cleanup logic here
    },
    
    updateSessionInfo: (state, action: PayloadAction<{ expiresAt: number }>) => {
      state.sessionInfo.expiresAt = action.payload.expiresAt;
      state.sessionInfo.warningShown = false;
    }
  }
});

export const { updateConsent, clearSensitiveData, updateSessionInfo } = privacySlice.actions;
export default privacySlice.reducer;
```

### 8. Frontend Implementation Priority

## Implementation Priority

### Backend Implementation Phases

#### Phase 1: Critical Security (Immediate - 2 weeks)
1. ✅ Implement `DataBreachIncident` entity and service
2. ✅ Add breach detection and notification mechanisms
3. ✅ Enhance audit logging for all personal data access
4. ✅ Implement emergency data access controls

#### Phase 2: Data Subject Rights (2-4 weeks)
1. ✅ Implement `DataSubjectConsent` entity and management
2. ✅ Create data export functionality (Right to portability)
3. ✅ Implement data rectification and erasure capabilities
4. ✅ Add consent withdrawal mechanisms

#### Phase 3: Enhanced Compliance (4-8 weeks)
1. ✅ Implement `DataProtectionAudit` entity
2. ✅ Add Data Protection Impact Assessment workflow
3. ✅ Implement data retention policies and automated cleanup
4. ✅ Add anonymization and pseudonymization capabilities

#### Phase 4: Advanced Features (8-12 weeks)
1. ✅ Implement cross-border data transfer controls
2. ✅ Add advanced breach detection algorithms
3. ✅ Implement DPO workflow and reporting tools
4. ✅ Add comprehensive compliance dashboards

### Frontend Implementation Phases

#### Phase 1: Essential Privacy Features (1-2 weeks)
1. ✅ Enhanced login with privacy consent
2. ✅ Session management with data clearing
3. ✅ Basic consent management interface
4. ✅ Privacy dashboard foundation

#### Phase 2: Data Subject Rights (2-3 weeks)
1. ✅ Data export request interface
2. ✅ Data correction request forms
3. ✅ Data erasure request functionality
4. ✅ Request status tracking

#### Phase 3: Advanced Privacy Features (3-4 weeks)
1. ✅ Comprehensive consent management
2. ✅ Privacy-first form components
3. ✅ DPO workflow interfaces
4. ✅ Compliance monitoring dashboards

#### Phase 4: Enhanced Security (4-5 weeks)
1. ✅ Advanced session security
2. ✅ Data loss prevention
3. ✅ Audit trail visualization
4. ✅ Breach notification interfaces

### 9. Controller Layer Enhancements

#### A. Data Subject Rights Controller
```java
@RestController
@RequestMapping("/api/data-subject-rights")
public class DataSubjectRightsController extends BaseController<PersonalDataExportDto, Long> {
    
    @PostMapping("/export-request")
    public ResponseEntity<OhmaApiResponse<String>> requestDataExport(@RequestBody DataExportRequest request) {
        try {
            // Validate identity
            validateDataSubjectIdentity(request);
            
            // Create export job
            String jobId = dataSubjectRightsService.initiateDataExport(request.getPersonId());
            
            return ResponseEntity.ok(OhmaApiResponse.success(
                "Data export request initiated. Job ID: " + jobId, jobId));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }
    
    @PostMapping("/erasure-request")
    public ResponseEntity<OhmaApiResponse<String>> requestDataErasure(@RequestBody DataErasureRequest request) {
        try {
            validateDataSubjectIdentity(request);
            
            String jobId = dataSubjectRightsService.initiateDataErasure(request);
            
            return ResponseEntity.ok(OhmaApiResponse.success(
                "Data erasure request initiated. Job ID: " + jobId, jobId));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }
    
    @PostMapping("/consent-withdrawal")
    public ResponseEntity<OhmaApiResponse<String>> withdrawConsent(@RequestBody ConsentWithdrawalRequest request) {
        try {
            consentManagementService.withdrawConsent(request);
            
            return ResponseEntity.ok(OhmaApiResponse.success(
                "Consent withdrawn successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(OhmaApiResponse.error(400, e.getMessage()));
        }
    }
}
```

#### B. Enhanced Security Configuration
```java
@Configuration
@EnableWebSecurity
public class DataProtectionSecurityConfig {
    
    @Bean
    public SecurityFilterChain dataProtectionFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/data-subject-rights/**").hasAnyRole("DATA_SUBJECT", "DPO")
                .requestMatchers("/api/data-breach/**").hasRole("DPO")
                .requestMatchers("/api/dpia/**").hasAnyRole("DPO", "SYSTEM_ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(new DataProtectionAuditFilter(), UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(new ConsentValidationFilter(), BasicAuthenticationFilter.class);
            
        return http.build();
    }
    
    @Bean
    public DataProtectionAuditFilter dataProtectionAuditFilter() {
        return new DataProtectionAuditFilter();
    }
}
```

### 10. Scheduled Tasks for Compliance

```java
@Component
public class DataProtectionScheduledTasks {
    
    @Scheduled(cron = "0 0 2 * * ?") // Daily at 2 AM
    public void performDataRetentionCleanup() {
        // Find expired data
        List<BaseEntity> expiredEntities = findExpiredData();
        
        // Anonymize or delete based on policy
        for (BaseEntity entity : expiredEntities) {
            DataRetentionPolicy policy = getRetentionPolicy(entity.getClass());
            
            if (policy.getDisposalMethod() == DisposalMethod.ANONYMIZE) {
                anonymizeEntity(entity);
            } else if (policy.getDisposalMethod() == DisposalMethod.DELETE) {
                deleteEntity(entity);
            }
        }
    }
    
    @Scheduled(cron = "0 0 1 * * ?") // Daily at 1 AM
    public void checkConsentExpirations() {
        List<DataSubjectConsent> expiringConsents = consentRepository
            .findExpiringConsents(LocalDateTime.now().plusDays(30));
            
        for (DataSubjectConsent consent : expiringConsents) {
            sendConsentRenewalNotification(consent);
        }
    }
    
    @Scheduled(cron = "0 */15 * * * ?") // Every 15 minutes
    public void monitorBreachIndicators() {
        dataBreachService.monitorForBreaches();
    }
}
```

## Conclusion

This refactoring guide provides a comprehensive approach to achieving compliance with the Botswana Data Protection Bill 2024. The implementation should be done in phases, prioritizing critical security measures and data subject rights. Regular monitoring and continuous improvement of the data protection framework will ensure ongoing compliance and protection of personal data.

**Next Steps:**
1. Review and approve this refactoring plan
2. Begin Phase 1 implementation (Critical Security)
3. Establish Data Protection Officer role and responsibilities
4. Create compliance monitoring dashboard
5. Develop staff training materials
6. Regular compliance audits and assessments 