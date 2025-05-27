package com.ohma.thutothebe.service.impl;

import com.ohma.thutothebe.dto.CurriculumDTO;
import com.ohma.thutothebe.entity.*;
import com.ohma.thutothebe.entity.enums.GradeLevel;
import com.ohma.thutothebe.exception.ResourceNotFoundException;
import com.ohma.thutothebe.mapper.CurriculumMapper;
import com.ohma.thutothebe.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
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

    @BeforeEach
    void setUp() {
        // Setup test data
        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setEmail("john.doe@example.com");

        testRegion = new Region();
        testRegion.setId(1L);
        testRegion.setName("Test Region");
        testRegion.setCode("TR");

        testSchool = new School();
        testSchool.setId(1L);
        testSchool.setName("Test School");
        testSchool.setCode("TS");
        testSchool.setRegion(testRegion);

        testCurriculum = new Curriculum();
        testCurriculum.setId(1L);
        testCurriculum.setTitle("Test Curriculum");
        testCurriculum.setDescription("Test Description");
        testCurriculum.setCurriculumType(CurriculumType.NATIONAL);
        testCurriculum.setGradeLevel(GradeLevel.STANDARD_1);
        testCurriculum.setStatus(CurriculumStatus.DRAFT);
        testCurriculum.setAcademicYear(2024);
        testCurriculum.setCreatedBy(testUser);
        testCurriculum.setRegion(testRegion);
        testCurriculum.setSchool(testSchool);
        testCurriculum.setActive(true);
        testCurriculum.setCurriculumVersion(1);
        testCurriculum.setCreatedAt(LocalDateTime.now());
        testCurriculum.setModifiedAt(LocalDateTime.now());

        testCurriculumDTO = new CurriculumDTO(
            1L,
            "Test Curriculum",
            "Test Description",
            CurriculumType.NATIONAL,
            GradeLevel.STANDARD_1,
            CurriculumStatus.DRAFT,
            2024,
            null,
            null,
            null,
            null,
            null,
            1L,
            "Test Region",
            1L,
            "Test School",
            1L,
            "John Doe",
            null,
            null,
            null,
            null,
            null,
            true,
            1,
            null,
            LocalDateTime.now(),
            LocalDateTime.now()
        );
    }

    @Test
    void testCreateCurriculum_Success() {
        // Arrange
        when(curriculumMapper.toEntity(testCurriculumDTO)).thenReturn(testCurriculum);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(regionRepository.findById(1L)).thenReturn(Optional.of(testRegion));
        when(schoolRepository.findById(1L)).thenReturn(Optional.of(testSchool));
        when(curriculumRepository.save(any(Curriculum.class))).thenReturn(testCurriculum);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        CurriculumDTO result = curriculumService.create(testCurriculumDTO);

        // Assert
        assertNotNull(result);
        assertEquals(testCurriculumDTO.title(), result.title());
        assertEquals(testCurriculumDTO.curriculumType(), result.curriculumType());
        assertEquals(testCurriculumDTO.gradeLevel(), result.gradeLevel());
        verify(curriculumRepository).save(any(Curriculum.class));
        verify(curriculumMapper).toDto(testCurriculum);
    }

    @Test
    void testCreateCurriculum_UserNotFound() {
        // Arrange
        when(curriculumMapper.toEntity(testCurriculumDTO)).thenReturn(testCurriculum);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            curriculumService.create(testCurriculumDTO);
        });
        verify(curriculumRepository, never()).save(any(Curriculum.class));
    }

    @Test
    void testGetById_Success() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        CurriculumDTO result = curriculumService.getById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testCurriculumDTO.id(), result.id());
        assertEquals(testCurriculumDTO.title(), result.title());
        verify(curriculumRepository).findById(1L);
        verify(curriculumMapper).toDto(testCurriculum);
    }

    @Test
    void testGetById_NotFound() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            curriculumService.getById(1L);
        });
        verify(curriculumRepository).findById(1L);
        verify(curriculumMapper, never()).toDto(any(Curriculum.class));
    }

    @Test
    void testUpdateCurriculum_Success() {
        // Arrange
        CurriculumDTO updatedDTO = new CurriculumDTO(
            1L,
            "Updated Curriculum",
            "Updated Description",
            CurriculumType.REGIONAL,
            GradeLevel.STANDARD_2,
            CurriculumStatus.UNDER_REVIEW,
            2024,
            null,
            null,
            null,
            null,
            null,
            1L,
            "Test Region",
            1L,
            "Test School",
            1L,
            "John Doe",
            null,
            null,
            null,
            null,
            null,
            true,
            1,
            null,
            LocalDateTime.now(),
            LocalDateTime.now()
        );

        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(curriculumRepository.save(any(Curriculum.class))).thenReturn(testCurriculum);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(updatedDTO);

        // Act
        CurriculumDTO result = curriculumService.update(1L, updatedDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Curriculum", result.title());
        assertEquals(CurriculumType.REGIONAL, result.curriculumType());
        verify(curriculumRepository).findById(1L);
        verify(curriculumRepository).save(testCurriculum);
    }

    @Test
    void testDeleteCurriculum_Success() {
        // Arrange
        when(curriculumRepository.existsById(1L)).thenReturn(true);

        // Act
        curriculumService.delete(1L);

        // Assert
        verify(curriculumRepository).existsById(1L);
        verify(curriculumRepository).deleteById(1L);
    }

    @Test
    void testDeleteCurriculum_NotFound() {
        // Arrange
        when(curriculumRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            curriculumService.delete(1L);
        });
        verify(curriculumRepository).existsById(1L);
        verify(curriculumRepository, never()).deleteById(1L);
    }

    @Test
    void testFindAllActive_Success() {
        // Arrange
        List<Curriculum> curricula = Arrays.asList(testCurriculum);
        when(curriculumRepository.findAllActive()).thenReturn(curricula);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        List<CurriculumDTO> result = curriculumService.findAllActive();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testCurriculumDTO.title(), result.get(0).title());
        verify(curriculumRepository).findAllActive();
    }

    @Test
    void testFindByStatus_Success() {
        // Arrange
        List<Curriculum> curricula = Arrays.asList(testCurriculum);
        when(curriculumRepository.findByStatus(CurriculumStatus.DRAFT)).thenReturn(curricula);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        List<CurriculumDTO> result = curriculumService.findByStatus(CurriculumStatus.DRAFT);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(CurriculumStatus.DRAFT, result.get(0).status());
        verify(curriculumRepository).findByStatus(CurriculumStatus.DRAFT);
    }

    @Test
    void testFindByCurriculumType_Success() {
        // Arrange
        List<Curriculum> curricula = Arrays.asList(testCurriculum);
        when(curriculumRepository.findByCurriculumType(CurriculumType.NATIONAL)).thenReturn(curricula);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        List<CurriculumDTO> result = curriculumService.findByCurriculumType(CurriculumType.NATIONAL);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(CurriculumType.NATIONAL, result.get(0).curriculumType());
        verify(curriculumRepository).findByCurriculumType(CurriculumType.NATIONAL);
    }

    @Test
    void testFindByGradeLevel_Success() {
        // Arrange
        List<Curriculum> curricula = Arrays.asList(testCurriculum);
        when(curriculumRepository.findByGradeLevel(GradeLevel.STANDARD_1)).thenReturn(curricula);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        List<CurriculumDTO> result = curriculumService.findByGradeLevel(GradeLevel.STANDARD_1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(GradeLevel.STANDARD_1, result.get(0).gradeLevel());
        verify(curriculumRepository).findByGradeLevel(GradeLevel.STANDARD_1);
    }

    @Test
    void testFindByAcademicYear_Success() {
        // Arrange
        List<Curriculum> curricula = Arrays.asList(testCurriculum);
        when(curriculumRepository.findByAcademicYear(2024)).thenReturn(curricula);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        List<CurriculumDTO> result = curriculumService.findByAcademicYear(2024);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(2024, result.get(0).academicYear());
        verify(curriculumRepository).findByAcademicYear(2024);
    }

    @Test
    void testFindByRegionId_Success() {
        // Arrange
        List<Curriculum> curricula = Arrays.asList(testCurriculum);
        when(curriculumRepository.findByRegionId(1L)).thenReturn(curricula);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        List<CurriculumDTO> result = curriculumService.findByRegionId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).regionId());
        verify(curriculumRepository).findByRegionId(1L);
    }

    @Test
    void testFindBySchoolId_Success() {
        // Arrange
        List<Curriculum> curricula = Arrays.asList(testCurriculum);
        when(curriculumRepository.findBySchoolId(1L)).thenReturn(curricula);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        List<CurriculumDTO> result = curriculumService.findBySchoolId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).schoolId());
        verify(curriculumRepository).findBySchoolId(1L);
    }

    @Test
    void testFindEffectiveOnDate_Success() {
        // Arrange
        LocalDate testDate = LocalDate.now();
        List<Curriculum> curricula = Arrays.asList(testCurriculum);
        when(curriculumRepository.findEffectiveOnDate(testDate)).thenReturn(curricula);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        List<CurriculumDTO> result = curriculumService.findEffectiveOnDate(testDate);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curriculumRepository).findEffectiveOnDate(testDate);
    }

    @Test
    void testFindByTitleContaining_Success() {
        // Arrange
        String searchTitle = "Test";
        List<Curriculum> curricula = Arrays.asList(testCurriculum);
        when(curriculumRepository.findByTitleContaining(searchTitle)).thenReturn(curricula);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        List<CurriculumDTO> result = curriculumService.findByTitleContaining(searchTitle);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).title().contains(searchTitle));
        verify(curriculumRepository).findByTitleContaining(searchTitle);
    }

    @Test
    void testExistsByTitleAndGradeLevelAndAcademicYear_Success() {
        // Arrange
        when(curriculumRepository.existsByTitleAndGradeLevelAndAcademicYear(
            "Test Curriculum", GradeLevel.STANDARD_1, 2024)).thenReturn(true);

        // Act
        boolean result = curriculumService.existsByTitleAndGradeLevelAndAcademicYear(
            "Test Curriculum", GradeLevel.STANDARD_1, 2024);

        // Assert
        assertTrue(result);
        verify(curriculumRepository).existsByTitleAndGradeLevelAndAcademicYear(
            "Test Curriculum", GradeLevel.STANDARD_1, 2024);
    }

    @Test
    void testApproveCurriculum_Success() {
        // Arrange
        User approver = new User();
        approver.setId(2L);
        approver.setFirstName("Jane");
        approver.setLastName("Smith");

        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(2L)).thenReturn(Optional.of(approver));
        when(curriculumRepository.save(any(Curriculum.class))).thenReturn(testCurriculum);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        CurriculumDTO result = curriculumService.approveCurriculum(1L, 2L);

        // Assert
        assertNotNull(result);
        assertEquals(CurriculumStatus.APPROVED, testCurriculum.getStatus());
        assertEquals(approver, testCurriculum.getApprovedBy());
        assertNotNull(testCurriculum.getApprovedAt());
        verify(curriculumRepository).findById(1L);
        verify(userRepository).findById(2L);
        verify(curriculumRepository).save(testCurriculum);
    }

    @Test
    void testApproveCurriculum_CurriculumNotFound() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            curriculumService.approveCurriculum(1L, 2L);
        });
        verify(curriculumRepository).findById(1L);
        verify(userRepository, never()).findById(anyLong());
        verify(curriculumRepository, never()).save(any(Curriculum.class));
    }

    @Test
    void testActivateCurriculum_Success() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(curriculumRepository.save(any(Curriculum.class))).thenReturn(testCurriculum);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        CurriculumDTO result = curriculumService.activateCurriculum(1L);

        // Assert
        assertNotNull(result);
        assertEquals(CurriculumStatus.ACTIVE, testCurriculum.getStatus());
        verify(curriculumRepository).findById(1L);
        verify(curriculumRepository).save(testCurriculum);
    }

    @Test
    void testSuspendCurriculum_Success() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(curriculumRepository.save(any(Curriculum.class))).thenReturn(testCurriculum);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        CurriculumDTO result = curriculumService.suspendCurriculum(1L);

        // Assert
        assertNotNull(result);
        assertEquals(CurriculumStatus.SUSPENDED, testCurriculum.getStatus());
        verify(curriculumRepository).findById(1L);
        verify(curriculumRepository).save(testCurriculum);
    }

    @Test
    void testArchiveCurriculum_Success() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(curriculumRepository.save(any(Curriculum.class))).thenReturn(testCurriculum);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        CurriculumDTO result = curriculumService.archiveCurriculum(1L);

        // Assert
        assertNotNull(result);
        assertEquals(CurriculumStatus.ARCHIVED, testCurriculum.getStatus());
        verify(curriculumRepository).findById(1L);
        verify(curriculumRepository).save(testCurriculum);
    }

    @Test
    void testGetAll_Success() {
        // Arrange
        List<Curriculum> curricula = Arrays.asList(testCurriculum);
        when(curriculumRepository.findAll()).thenReturn(curricula);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        List<CurriculumDTO> result = curriculumService.getAll();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testCurriculumDTO.title(), result.get(0).title());
        verify(curriculumRepository).findAll();
    }

    @Test
    void testFindByGradeLevelAndType_Success() {
        // Arrange
        List<Curriculum> curricula = Arrays.asList(testCurriculum);
        when(curriculumRepository.findByGradeLevelAndType(GradeLevel.STANDARD_1, CurriculumType.NATIONAL))
            .thenReturn(curricula);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        List<CurriculumDTO> result = curriculumService.findByGradeLevelAndType(GradeLevel.STANDARD_1, CurriculumType.NATIONAL);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(GradeLevel.STANDARD_1, result.get(0).gradeLevel());
        assertEquals(CurriculumType.NATIONAL, result.get(0).curriculumType());
        verify(curriculumRepository).findByGradeLevelAndType(GradeLevel.STANDARD_1, CurriculumType.NATIONAL);
    }

    @Test
    void testFindByStatusAndGradeLevelAndAcademicYear_Success() {
        // Arrange
        List<Curriculum> curricula = Arrays.asList(testCurriculum);
        when(curriculumRepository.findByStatusAndGradeLevelAndAcademicYear(
            CurriculumStatus.DRAFT, GradeLevel.STANDARD_1, 2024)).thenReturn(curricula);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        List<CurriculumDTO> result = curriculumService.findByStatusAndGradeLevelAndAcademicYear(
            CurriculumStatus.DRAFT, GradeLevel.STANDARD_1, 2024);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(CurriculumStatus.DRAFT, result.get(0).status());
        assertEquals(GradeLevel.STANDARD_1, result.get(0).gradeLevel());
        assertEquals(2024, result.get(0).academicYear());
        verify(curriculumRepository).findByStatusAndGradeLevelAndAcademicYear(
            CurriculumStatus.DRAFT, GradeLevel.STANDARD_1, 2024);
    }

    @Test
    void testFindByRegionAndGradeLevelAndAcademicYear_Success() {
        // Arrange
        List<Curriculum> curricula = Arrays.asList(testCurriculum);
        when(curriculumRepository.findByRegionAndGradeLevelAndAcademicYear(1L, GradeLevel.STANDARD_1, 2024))
            .thenReturn(curricula);
        when(curriculumMapper.toDto(testCurriculum)).thenReturn(testCurriculumDTO);

        // Act
        List<CurriculumDTO> result = curriculumService.findByRegionAndGradeLevelAndAcademicYear(1L, GradeLevel.STANDARD_1, 2024);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).regionId());
        assertEquals(GradeLevel.STANDARD_1, result.get(0).gradeLevel());
        assertEquals(2024, result.get(0).academicYear());
        verify(curriculumRepository).findByRegionAndGradeLevelAndAcademicYear(1L, GradeLevel.STANDARD_1, 2024);
    }

    // Test edge cases and error scenarios
    @Test
    void testCreateCurriculum_RegionNotFound() {
        // Arrange
        when(curriculumMapper.toEntity(testCurriculumDTO)).thenReturn(testCurriculum);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(regionRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            curriculumService.create(testCurriculumDTO);
        });
        verify(regionRepository).findById(1L);
        verify(curriculumRepository, never()).save(any(Curriculum.class));
    }

    @Test
    void testCreateCurriculum_SchoolNotFound() {
        // Arrange
        when(curriculumMapper.toEntity(testCurriculumDTO)).thenReturn(testCurriculum);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(regionRepository.findById(1L)).thenReturn(Optional.of(testRegion));
        when(schoolRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            curriculumService.create(testCurriculumDTO);
        });
        verify(schoolRepository).findById(1L);
        verify(curriculumRepository, never()).save(any(Curriculum.class));
    }

    @Test
    void testApproveCurriculum_ApproverNotFound() {
        // Arrange
        when(curriculumRepository.findById(1L)).thenReturn(Optional.of(testCurriculum));
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            curriculumService.approveCurriculum(1L, 2L);
        });
        verify(curriculumRepository).findById(1L);
        verify(userRepository).findById(2L);
        verify(curriculumRepository, never()).save(any(Curriculum.class));
    }
} 