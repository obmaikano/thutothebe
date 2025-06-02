package com.ohma.thutothebe.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohma.thutothebe.dto.CurriculumDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.entity.enums.GradeLevel;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.CurriculumMapper;
import com.ohma.thutothebe.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CurriculumServiceImpl Tests")
class CurriculumServiceImplTest {

    @Mock
    private CurriculumRepository curriculumRepository;

    @Mock
    private CurriculumMapper curriculumMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RegionRepository regionRepository;

    @Mock
    private SchoolRepository schoolRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private CurriculumSubjectRepository curriculumSubjectRepository;

    @Mock
    private CurriculumTeacherRepository curriculumTeacherRepository;

    @Mock
    private CurriculumUnitRepository curriculumUnitRepository;

    @Mock
    private CurriculumTopicRepository curriculumTopicRepository;

    @InjectMocks
    private CurriculumServiceImpl curriculumService;

    private Curriculum testCurriculum;
    private CurriculumDTO testCurriculumDTO;
    private User testUser;
    private Region testRegion;
    private School testSchool;
    private Subject testSubject;
    private CurriculumSubject testCurriculumSubject;
    private CurriculumUnit testCurriculumUnit;
    private CurriculumTopic testCurriculumTopic;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setFirstName("Test");
        testUser.setLastName("User");

        // Setup test region
        testRegion = new Region();
        testRegion.setId(1L);
        testRegion.setName("Test Region");
        testRegion.setCode("TR");

        // Setup test school
        testSchool = new School();
        testSchool.setId(1L);
        testSchool.setName("Test School");
        testSchool.setRegion(testRegion);

        // Setup test subject
        testSubject = new Subject();
        testSubject.setId(1L);
        testSubject.setName("Mathematics");
        testSubject.setCode("MATH");
        testSubject.setActive(true);

        // Setup test curriculum
        testCurriculum = new Curriculum();
        testCurriculum.setId(1L);
        testCurriculum.setTitle("Test Curriculum");
        testCurriculum.setDescription("Test Description");
        testCurriculum.setCurriculumType(CurriculumType.NATIONAL);
        testCurriculum.setGradeLevel(GradeLevel.STANDARD_1);
        testCurriculum.setStatus(CurriculumStatus.DRAFT);
        testCurriculum.setAcademicYear(2024);
        testCurriculum.setEffectiveDate(LocalDate.now());
        testCurriculum.setExpiryDate(LocalDate.now().plusYears(1));
        testCurriculum.setLearningOutcomes("Test learning outcomes");
        testCurriculum.setDurationWeeks(40);
        testCurriculum.setTotalHours(1200);
        testCurriculum.setActive(true);
        testCurriculum.setCurriculumVersion(1);
        testCurriculum.setCreatedBy(testUser);
        testCurriculum.setRegion(testRegion);
        testCurriculum.setSchool(testSchool);

        // Setup test curriculum DTO
        testCurriculumDTO = new CurriculumDTO(
            1L,
            "Test Curriculum",
            "Test Description",
            CurriculumType.NATIONAL,
            GradeLevel.STANDARD_1,
            CurriculumStatus.DRAFT,
            2024,
            LocalDate.now(),
            LocalDate.now().plusYears(1),
            "Test learning outcomes",
            40,
            1200,
            1L, // regionId
            "Test Region", // regionName
            1L, // schoolId
            "Test School", // schoolName
            1L, // createdById
            "Test User", // createdByName
            null, // approvedById
            null, // approvedByName
            null, // approvedAt
            Set.of(1L), // subjectIds
            Set.of("Mathematics"), // subjectNames
            true,
            1,
            null, // metadata
            LocalDate.now().atStartOfDay(), // createdAt
            LocalDate.now().atStartOfDay() // modifiedAt
        );

        // Setup test curriculum subject
        testCurriculumSubject = new CurriculumSubject();
        testCurriculumSubject.setId(1L);
        testCurriculumSubject.setCurriculum(testCurriculum);
        testCurriculumSubject.setSubject(testSubject);
        testCurriculumSubject.setCore(true);
        testCurriculumSubject.setAllocatedHours(120);
        testCurriculumSubject.setWeightPercentage(25.0);
        testCurriculumSubject.setActive(true);

        // Setup test curriculum unit
        testCurriculumUnit = new CurriculumUnit();
        testCurriculumUnit.setId(1L);
        testCurriculumUnit.setCurriculum(testCurriculum);
        testCurriculumUnit.setTitle("Test Unit");
        testCurriculumUnit.setDescription("Test Unit Description");
        testCurriculumUnit.setUnitOrder(1);
        testCurriculumUnit.setDurationWeeks(10);
        testCurriculumUnit.setAllocatedHours(300);
        testCurriculumUnit.setActive(true);

        // Setup test curriculum topic
        testCurriculumTopic = new CurriculumTopic();
        testCurriculumTopic.setId(1L);
        testCurriculumTopic.setCurriculumUnit(testCurriculumUnit);
        testCurriculumTopic.setTitle("Test Topic");
        testCurriculumTopic.setDescription("Test Topic Description");
        testCurriculumTopic.setTopicOrder(1);
        testCurriculumTopic.setDurationHours(30);
        testCurriculumTopic.setActive(true);
    }

    // ==================== DUPLICATE CURRICULUM TESTS ====================

    @Test
    @DisplayName("Test duplicateCurriculum - Success")
    void duplicateCurriculum_ShouldReturnDuplicatedCurriculum_WhenSuccessful() {
        // Arrange
        String newTitle = "Duplicated Curriculum";
        Integer newAcademicYear = 2025;

        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(curriculumRepository.existsByTitleAndGradeLevelAndAcademicYear(newTitle, GradeLevel.STANDARD_1, newAcademicYear))
            .thenReturn(false);
        when(curriculumRepository.save(any(Curriculum.class))).thenReturn(testCurriculum);
        when(curriculumSubjectRepository.findByCurriculumId(1L)).thenReturn(List.of(testCurriculumSubject));
        when(curriculumSubjectRepository.save(any(CurriculumSubject.class))).thenReturn(testCurriculumSubject);
        when(curriculumUnitRepository.findByCurriculumIdOrderByUnitOrder(1L)).thenReturn(List.of(testCurriculumUnit));
        when(curriculumUnitRepository.save(any(CurriculumUnit.class))).thenReturn(testCurriculumUnit);
        when(curriculumTopicRepository.findByCurriculumUnitIdOrderByTopicOrder(1L)).thenReturn(List.of(testCurriculumTopic));
        when(curriculumTopicRepository.save(any(CurriculumTopic.class))).thenReturn(testCurriculumTopic);
        when(curriculumMapper.toDto(any(Curriculum.class))).thenReturn(testCurriculumDTO);

        // Act
        CurriculumDTO result = curriculumService.duplicateCurriculum(1L, newTitle, newAcademicYear);

        // Assert
        assertNotNull(result);
        verify(curriculumRepository).findById(1L);
        verify(curriculumRepository).existsByTitleAndGradeLevelAndAcademicYear(newTitle, GradeLevel.STANDARD_1, newAcademicYear);
        verify(curriculumRepository).save(any(Curriculum.class));
        verify(curriculumSubjectRepository).save(any(CurriculumSubject.class));
        verify(curriculumUnitRepository).save(any(CurriculumUnit.class));
        verify(curriculumTopicRepository).save(any(CurriculumTopic.class));
    }

    @Test
    @DisplayName("Test duplicateCurriculum - Curriculum Not Found")
    void duplicateCurriculum_ShouldThrowException_WhenCurriculumNotFound() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, 
            () -> curriculumService.duplicateCurriculum(1L, "New Title", 2025));
        verify(curriculumRepository).findById(1L);
        verify(curriculumRepository, never()).save(any(Curriculum.class));
    }

    @Test
    @DisplayName("Test duplicateCurriculum - Title Already Exists")
    void duplicateCurriculum_ShouldThrowException_WhenTitleAlreadyExists() {
        // Arrange
        String existingTitle = "Existing Curriculum";
        Integer academicYear = 2025;

        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(curriculumRepository.existsByTitleAndGradeLevelAndAcademicYear(existingTitle, GradeLevel.STANDARD_1, academicYear))
            .thenReturn(true);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, 
            () -> curriculumService.duplicateCurriculum(1L, existingTitle, academicYear));
        verify(curriculumRepository).findById(1L);
        verify(curriculumRepository).existsByTitleAndGradeLevelAndAcademicYear(existingTitle, GradeLevel.STANDARD_1, academicYear);
        verify(curriculumRepository, never()).save(any(Curriculum.class));
    }

    // ==================== UPDATE CURRICULUM SUBJECTS TESTS ====================

    @Test
    @DisplayName("Test updateCurriculumSubjects - Success")
    void updateCurriculumSubjects_ShouldUpdateSubjects_WhenSuccessful() {
        // Arrange
        List<Long> subjectIds = List.of(1L, 2L);
        Subject newSubject = new Subject();
        newSubject.setId(2L);
        newSubject.setName("Science");
        newSubject.setCode("SCI");

        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(subjectRepository.existsById(1L)).thenReturn(true);
        when(subjectRepository.existsById(2L)).thenReturn(true);
        when(curriculumSubjectRepository.findByCurriculumId(1L)).thenReturn(List.of(testCurriculumSubject));
        when(curriculumSubjectRepository.findByCurriculumIdAndSubjectId(1L, 2L)).thenReturn(Optional.empty());
        when(subjectRepository.findById(2L)).thenReturn(Optional.of(newSubject));
        when(curriculumSubjectRepository.save(any(CurriculumSubject.class))).thenReturn(testCurriculumSubject);
        when(curriculumMapper.toDto(any(Curriculum.class))).thenReturn(testCurriculumDTO);

        // Act
        CurriculumDTO result = curriculumService.updateCurriculumSubjects(1L, subjectIds);

        // Assert
        assertNotNull(result);
        verify(curriculumRepository).findById(1L);
        verify(subjectRepository).existsById(1L);
        verify(subjectRepository).existsById(2L);
        verify(curriculumSubjectRepository).findByCurriculumId(1L);
        verify(curriculumSubjectRepository).save(any(CurriculumSubject.class));
    }

    @Test
    @DisplayName("Test updateCurriculumSubjects - Curriculum Not Found")
    void updateCurriculumSubjects_ShouldThrowException_WhenCurriculumNotFound() {
        // Arrange
        List<Long> subjectIds = List.of(1L);
        when(curriculumRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, 
            () -> curriculumService.updateCurriculumSubjects(1L, subjectIds));
        verify(curriculumRepository).findById(1L);
        verify(curriculumSubjectRepository, never()).save(any(CurriculumSubject.class));
    }

    @Test
    @DisplayName("Test updateCurriculumSubjects - Subject Not Found")
    void updateCurriculumSubjects_ShouldThrowException_WhenSubjectNotFound() {
        // Arrange
        List<Long> subjectIds = List.of(999L);
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(subjectRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, 
            () -> curriculumService.updateCurriculumSubjects(1L, subjectIds));
        verify(curriculumRepository).findById(1L);
        verify(subjectRepository).existsById(999L);
        verify(curriculumSubjectRepository, never()).save(any(CurriculumSubject.class));
    }

    @Test
    @DisplayName("Test updateCurriculumSubjects - Reactivate Existing Subject")
    void updateCurriculumSubjects_ShouldReactivateSubject_WhenSubjectWasDeactivated() {
        // Arrange
        List<Long> subjectIds = List.of(1L);
        CurriculumSubject inactiveSubject = new CurriculumSubject();
        inactiveSubject.setId(1L);
        inactiveSubject.setCurriculum(testCurriculum);
        inactiveSubject.setSubject(testSubject);
        inactiveSubject.setActive(false);

        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(subjectRepository.existsById(1L)).thenReturn(true);
        when(curriculumSubjectRepository.findByCurriculumId(1L)).thenReturn(List.of());
        when(curriculumSubjectRepository.findByCurriculumIdAndSubjectId(1L, 1L)).thenReturn(Optional.of(inactiveSubject));
        when(curriculumSubjectRepository.save(any(CurriculumSubject.class))).thenReturn(inactiveSubject);
        when(curriculumMapper.toDto(any(Curriculum.class))).thenReturn(testCurriculumDTO);

        // Act
        CurriculumDTO result = curriculumService.updateCurriculumSubjects(1L, subjectIds);

        // Assert
        assertNotNull(result);
        verify(curriculumSubjectRepository).save(argThat(cs -> cs.isActive()));
    }

    // ==================== EXPORT CURRICULUM TESTS ====================

    @Test
    @DisplayName("Test exportCurriculum - JSON Format Success")
    void exportCurriculum_ShouldReturnJsonString_WhenFormatIsJson() throws Exception {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(curriculumMapper.toDto(any(Curriculum.class))).thenReturn(testCurriculumDTO);
        when(curriculumSubjectRepository.findByCurriculumId(1L)).thenReturn(List.of(testCurriculumSubject));
        when(curriculumUnitRepository.findByCurriculumIdOrderByUnitOrder(1L)).thenReturn(List.of(testCurriculumUnit));
        when(curriculumTopicRepository.findByCurriculumUnitIdOrderByTopicOrder(1L)).thenReturn(List.of(testCurriculumTopic));

        // Act
        String result = curriculumService.exportCurriculum(1L, "json");

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("Test Curriculum"));
        assertTrue(result.contains("Mathematics"));
        verify(curriculumRepository).findById(1L);
        verify(curriculumSubjectRepository).findByCurriculumId(1L);
        verify(curriculumUnitRepository).findByCurriculumIdOrderByUnitOrder(1L);
        verify(curriculumTopicRepository).findByCurriculumUnitIdOrderByTopicOrder(1L);
    }

    @Test
    @DisplayName("Test exportCurriculum - XML Format Success")
    void exportCurriculum_ShouldReturnXmlString_WhenFormatIsXml() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(curriculumMapper.toDto(any(Curriculum.class))).thenReturn(testCurriculumDTO);
        when(curriculumSubjectRepository.findByCurriculumId(1L)).thenReturn(List.of(testCurriculumSubject));
        when(curriculumUnitRepository.findByCurriculumIdOrderByUnitOrder(1L)).thenReturn(List.of(testCurriculumUnit));
        when(curriculumTopicRepository.findByCurriculumUnitIdOrderByTopicOrder(1L)).thenReturn(List.of(testCurriculumTopic));

        // Act
        String result = curriculumService.exportCurriculum(1L, "xml");

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"));
        assertTrue(result.contains("<curriculumExport>"));
        assertTrue(result.contains("Test Curriculum"));
        verify(curriculumRepository).findById(1L);
    }

    @Test
    @DisplayName("Test exportCurriculum - Curriculum Not Found")
    void exportCurriculum_ShouldThrowException_WhenCurriculumNotFound() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, 
            () -> curriculumService.exportCurriculum(1L, "json"));
        verify(curriculumRepository).findById(1L);
    }

    @Test
    @DisplayName("Test exportCurriculum - Unsupported Format")
    void exportCurriculum_ShouldThrowException_WhenFormatIsUnsupported() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(curriculumMapper.toDto(any(Curriculum.class))).thenReturn(testCurriculumDTO);
        when(curriculumSubjectRepository.findByCurriculumId(1L)).thenReturn(List.of());
        when(curriculumUnitRepository.findByCurriculumIdOrderByUnitOrder(1L)).thenReturn(List.of());

        // Act & Assert
        assertThrows(RuntimeException.class, 
            () -> curriculumService.exportCurriculum(1L, "pdf"));
        verify(curriculumRepository).findById(1L);
    }

    // ==================== IMPORT CURRICULUM TESTS ====================

    @Test
    @DisplayName("Test importCurriculum - JSON Format Success")
    void importCurriculum_ShouldReturnImportedCurriculum_WhenJsonFormatIsValid() throws Exception {
        // Arrange
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // Create test export data
        CurriculumServiceImpl.CurriculumExportData exportData = new CurriculumServiceImpl.CurriculumExportData();
        exportData.setCurriculum(testCurriculumDTO);
        exportData.setSubjects(List.of());
        exportData.setUnits(List.of());
        exportData.setExportedAt(LocalDate.now());
        exportData.setVersion("1.0");

        String jsonContent = objectMapper.writeValueAsString(exportData);

        when(curriculumRepository.existsByTitleAndGradeLevelAndAcademicYear(anyString(), any(GradeLevel.class), anyInt()))
            .thenReturn(false);
        when(curriculumRepository.save(any(Curriculum.class))).thenReturn(testCurriculum);
        when(curriculumMapper.toDto(any(Curriculum.class))).thenReturn(testCurriculumDTO);

        // Act
        CurriculumDTO result = curriculumService.importCurriculum(jsonContent, "json");

        // Assert
        assertNotNull(result);
        verify(curriculumRepository).existsByTitleAndGradeLevelAndAcademicYear(anyString(), any(GradeLevel.class), anyInt());
        verify(curriculumRepository).save(any(Curriculum.class));
    }

    @Test
    @DisplayName("Test importCurriculum - Invalid JSON Format")
    void importCurriculum_ShouldThrowException_WhenJsonFormatIsInvalid() {
        // Arrange
        String invalidJson = "{ invalid json }";

        // Act & Assert
        assertThrows(RuntimeException.class, 
            () -> curriculumService.importCurriculum(invalidJson, "json"));
        verify(curriculumRepository, never()).save(any(Curriculum.class));
    }

    @Test
    @DisplayName("Test importCurriculum - Curriculum Already Exists")
    void importCurriculum_ShouldThrowException_WhenCurriculumAlreadyExists() throws Exception {
        // Arrange
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        CurriculumServiceImpl.CurriculumExportData exportData = new CurriculumServiceImpl.CurriculumExportData();
        exportData.setCurriculum(testCurriculumDTO);
        exportData.setSubjects(List.of());
        exportData.setUnits(List.of());

        String jsonContent = objectMapper.writeValueAsString(exportData);

        when(curriculumRepository.existsByTitleAndGradeLevelAndAcademicYear(anyString(), any(GradeLevel.class), anyInt()))
            .thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, 
            () -> curriculumService.importCurriculum(jsonContent, "json"));
        verify(curriculumRepository, never()).save(any(Curriculum.class));
    }

    @Test
    @DisplayName("Test importCurriculum - XML Format Not Supported")
    void importCurriculum_ShouldThrowException_WhenXmlFormatIsUsed() {
        // Arrange
        String xmlContent = "<?xml version=\"1.0\"?><curriculum></curriculum>";

        // Act & Assert
        assertThrows(RuntimeException.class, 
            () -> curriculumService.importCurriculum(xmlContent, "xml"));
        verify(curriculumRepository, never()).save(any(Curriculum.class));
    }

    @Test
    @DisplayName("Test importCurriculum - Unsupported Format")
    void importCurriculum_ShouldThrowException_WhenFormatIsUnsupported() {
        // Arrange
        String content = "some content";

        // Act & Assert
        assertThrows(RuntimeException.class, 
            () -> curriculumService.importCurriculum(content, "pdf"));
        verify(curriculumRepository, never()).save(any(Curriculum.class));
    }

    @Test
    @DisplayName("Test importCurriculum - Import with Subjects")
    void importCurriculum_ShouldImportSubjects_WhenSubjectsAreProvided() throws Exception {
        // Arrange
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        CurriculumServiceImpl.CurriculumSubjectExportData subjectData = new CurriculumServiceImpl.CurriculumSubjectExportData(
            1L, "Mathematics", "MATH", true, 120, 25.0, "Math objectives"
        );

        CurriculumServiceImpl.CurriculumExportData exportData = new CurriculumServiceImpl.CurriculumExportData();
        exportData.setCurriculum(testCurriculumDTO);
        exportData.setSubjects(List.of(subjectData));
        exportData.setUnits(List.of());

        String jsonContent = objectMapper.writeValueAsString(exportData);

        when(curriculumRepository.existsByTitleAndGradeLevelAndAcademicYear(anyString(), any(GradeLevel.class), anyInt()))
            .thenReturn(false);
        when(curriculumRepository.save(any(Curriculum.class))).thenReturn(testCurriculum);
        when(subjectRepository.findByCode("MATH")).thenReturn(Optional.of(testSubject));
        when(curriculumSubjectRepository.save(any(CurriculumSubject.class))).thenReturn(testCurriculumSubject);
        when(curriculumMapper.toDto(any(Curriculum.class))).thenReturn(testCurriculumDTO);

        // Act
        CurriculumDTO result = curriculumService.importCurriculum(jsonContent, "json");

        // Assert
        assertNotNull(result);
        verify(curriculumRepository).save(any(Curriculum.class));
        verify(subjectRepository).findByCode("MATH");
        verify(curriculumSubjectRepository).save(any(CurriculumSubject.class));
    }

    // ==================== LIFECYCLE TESTS ====================

    @Test
    @DisplayName("Test Full Curriculum Lifecycle - Create, Update, Export, Import, Duplicate")
    void testFullCurriculumLifecycle() throws Exception {
        // Test Create (inherited from BaseServiceImpl)
        when(curriculumMapper.toEntity(any(CurriculumDTO.class))).thenReturn(testCurriculum);
        when(curriculumRepository.save(any(Curriculum.class))).thenReturn(testCurriculum);
        when(curriculumMapper.toDto(any(Curriculum.class))).thenReturn(testCurriculumDTO);

        // Test Update Subjects
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(subjectRepository.existsById(1L)).thenReturn(true);
        when(curriculumSubjectRepository.findByCurriculumId(1L)).thenReturn(List.of());
        when(curriculumSubjectRepository.findByCurriculumIdAndSubjectId(1L, 1L)).thenReturn(Optional.empty());
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(testSubject));
        when(curriculumSubjectRepository.save(any(CurriculumSubject.class))).thenReturn(testCurriculumSubject);

        // Test Export
        when(curriculumSubjectRepository.findByCurriculumId(1L)).thenReturn(List.of(testCurriculumSubject));
        when(curriculumUnitRepository.findByCurriculumIdOrderByUnitOrder(1L)).thenReturn(List.of());
        when(curriculumTopicRepository.findByCurriculumUnitIdOrderByTopicOrder(anyLong())).thenReturn(List.of());

        // Test Duplicate
        when(curriculumRepository.existsByTitleAndGradeLevelAndAcademicYear(anyString(), any(GradeLevel.class), anyInt()))
            .thenReturn(false);

        // Execute lifecycle operations
        CurriculumDTO updatedCurriculum = curriculumService.updateCurriculumSubjects(1L, List.of(1L));
        assertNotNull(updatedCurriculum);

        String exportedData = curriculumService.exportCurriculum(1L, "json");
        assertNotNull(exportedData);
        assertTrue(exportedData.contains("Test Curriculum"));

        CurriculumDTO duplicatedCurriculum = curriculumService.duplicateCurriculum(1L, "Duplicated Curriculum", 2025);
        assertNotNull(duplicatedCurriculum);

        // Verify all operations were called
        verify(curriculumRepository, atLeast(3)).findById(1L);
        verify(curriculumSubjectRepository, atLeast(1)).save(any(CurriculumSubject.class));
        verify(curriculumRepository, atLeast(1)).save(any(Curriculum.class));
    }

    // ==================== EDGE CASES AND ERROR HANDLING TESTS ====================

    @Test
    @DisplayName("Test updateCurriculumSubjects - Empty Subject List")
    void updateCurriculumSubjects_ShouldDeactivateAllSubjects_WhenSubjectListIsEmpty() {
        // Arrange
        List<Long> emptySubjectIds = List.of();
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(curriculumSubjectRepository.findByCurriculumId(1L)).thenReturn(List.of(testCurriculumSubject));
        when(curriculumSubjectRepository.save(any(CurriculumSubject.class))).thenReturn(testCurriculumSubject);
        when(curriculumMapper.toDto(any(Curriculum.class))).thenReturn(testCurriculumDTO);

        // Act
        CurriculumDTO result = curriculumService.updateCurriculumSubjects(1L, emptySubjectIds);

        // Assert
        assertNotNull(result);
        verify(curriculumSubjectRepository).save(argThat(cs -> !cs.isActive()));
    }

    @Test
    @DisplayName("Test exportCurriculum - Empty Curriculum Data")
    void exportCurriculum_ShouldHandleEmptyData_WhenCurriculumHasNoSubjectsOrUnits() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(curriculumMapper.toDto(any(Curriculum.class))).thenReturn(testCurriculumDTO);
        when(curriculumSubjectRepository.findByCurriculumId(1L)).thenReturn(List.of());
        when(curriculumUnitRepository.findByCurriculumIdOrderByUnitOrder(1L)).thenReturn(List.of());

        // Act
        String result = curriculumService.exportCurriculum(1L, "json");

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("Test Curriculum"));
        verify(curriculumRepository).findById(1L);
    }

    @Test
    @DisplayName("Test importCurriculum - Missing Curriculum Data")
    void importCurriculum_ShouldThrowException_WhenCurriculumDataIsMissing() throws Exception {
        // Arrange
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        CurriculumServiceImpl.CurriculumExportData exportData = new CurriculumServiceImpl.CurriculumExportData();
        exportData.setCurriculum(null); // Missing curriculum data
        exportData.setSubjects(List.of());
        exportData.setUnits(List.of());

        String jsonContent = objectMapper.writeValueAsString(exportData);

        // Act & Assert
        assertThrows(RuntimeException.class, 
            () -> curriculumService.importCurriculum(jsonContent, "json"));
        verify(curriculumRepository, never()).save(any(Curriculum.class));
    }
} 