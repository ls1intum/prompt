package prompt.ls1.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.controller.payload.TechnicalChallengeScore;
import prompt.ls1.exception.AccessDeniedException;
import prompt.ls1.exception.ResourceConflictException;
import prompt.ls1.exception.ResourceInvalidParametersException;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.*;
import prompt.ls1.model.enums.ApplicationStatus;
import prompt.ls1.repository.CoachApplicationRepository;
import prompt.ls1.repository.CourseIterationRepository;
import prompt.ls1.repository.DeveloperApplicationRepository;
import prompt.ls1.repository.InstructorCommentRepository;
import prompt.ls1.repository.IntroCourseParticipationRepository;
import prompt.ls1.repository.StudentRepository;
import prompt.ls1.repository.TutorApplicationRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class ApplicationService {
    private final DeveloperApplicationRepository developerApplicationRepository;
    private final TutorApplicationRepository tutorApplicationRepository;
    private final CoachApplicationRepository coachApplicationRepository;
    private final CourseIterationRepository courseIterationRepository;
    private final InstructorCommentRepository instructorCommentRepository;
    private final StudentRepository studentRepository;
    private final ProjectTeamService projectTeamService;
    private final IntroCourseParticipationRepository introCourseParticipationRepository;
    private final MailingService mailingService;

    @Autowired
    public ApplicationService(
            final DeveloperApplicationRepository developerApplicationRepository,
            final TutorApplicationRepository tutorApplicationRepository,
            final CoachApplicationRepository coachApplicationRepository,
            final CourseIterationRepository courseIterationRepository,
            final InstructorCommentRepository instructorCommentRepository,
            final StudentRepository studentRepository,
            final ProjectTeamService projectTeamService,
            final IntroCourseParticipationRepository introCourseParticipationRepository,
            final MailingService mailingService) {
        this.developerApplicationRepository = developerApplicationRepository;
        this.tutorApplicationRepository = tutorApplicationRepository;
        this.coachApplicationRepository = coachApplicationRepository;
        this.courseIterationRepository = courseIterationRepository;
        this.instructorCommentRepository = instructorCommentRepository;
        this.studentRepository = studentRepository;
        this.projectTeamService = projectTeamService;
        this.introCourseParticipationRepository = introCourseParticipationRepository;
        this.mailingService = mailingService;
    }

    public DeveloperApplication findDeveloperApplicationById(final UUID developerApplicationId) {
        return developerApplicationRepository.findById(developerApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Developer application with id %s not found.", developerApplicationId)));
    }

    public CoachApplication findCoachApplicationById(final UUID coachApplicationId) {
        return coachApplicationRepository.findById(coachApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Coach application with id %s not found.", coachApplicationId)));
    }

    public TutorApplication findTutorApplicationById(final UUID tutorApplicationId) {
        return tutorApplicationRepository.findById(tutorApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Tutor application with id %s not found.", tutorApplicationId)));
    }

    public List<Application> findAllApplicationsByCourseIterationAndApplicationTypeAndApplicationStatus(
            final UUID courseIterationId,
            final String applicationType,
            final Optional<ApplicationStatus> applicationStatus
    ) {
        final List<Application> applications = new ArrayList<>();

        switch (applicationType) {
            case "developer" -> {
                if (applicationStatus.isPresent()) {
                    switch (applicationStatus.get()) {
                        case ENROLLED -> applications.addAll(developerApplicationRepository.findEnrolledApplicationsByCourseIterationId(courseIterationId));
                        case ACCEPTED -> applications.addAll(developerApplicationRepository.findAcceptedApplicationsByCourseIterationId(courseIterationId));
                        case REJECTED -> applications.addAll(developerApplicationRepository.findRejectedApplicationsByCourseIterationId(courseIterationId));
                        case PENDING_INTERVIEW -> applications.addAll(developerApplicationRepository.findPendingInterviewApplicationsByCourseIterationId(courseIterationId));
                        case NOT_ASSESSED -> applications.addAll(developerApplicationRepository.findNotAssessedApplicationsByCourseIterationId(courseIterationId));
                        case INTRO_COURSE_PASSED -> applications.addAll(developerApplicationRepository.findIntroCoursePassedApplicationsByCourseIterationId(courseIterationId));
                        case INTRO_COURSE_NOT_PASSED -> applications.addAll(developerApplicationRepository.findIntroCourseNotPassedApplicationsByCourseIterationId(courseIterationId));
                        default -> applications.addAll(developerApplicationRepository.findAllByCourseIterationId(courseIterationId));
                    }
                } else {
                    applications.addAll(developerApplicationRepository.findAllByCourseIterationId(courseIterationId));
                }
            }
            case "coach" -> {
                if (applicationStatus.isPresent()) {
                    switch (applicationStatus.get()) {
                        case ENROLLED -> applications.addAll(coachApplicationRepository.findEnrolledApplicationsByCourseIterationId(courseIterationId));
                        case ACCEPTED -> applications.addAll(coachApplicationRepository.findAcceptedApplicationsByCourseIterationId(courseIterationId));
                        case REJECTED -> applications.addAll(coachApplicationRepository.findRejectedApplicationsByCourseIterationId(courseIterationId));
                        case PENDING_INTERVIEW -> applications.addAll(coachApplicationRepository.findPendingInterviewApplicationsByCourseIterationId(courseIterationId));
                        case NOT_ASSESSED -> applications.addAll(coachApplicationRepository.findNotAssessedApplicationsByCourseIterationId(courseIterationId));
                        default -> applications.addAll(coachApplicationRepository.findAllByCourseIterationId(courseIterationId));
                    }
                } else {
                    applications.addAll(coachApplicationRepository.findAllByCourseIterationId(courseIterationId));
                }
            }
            case "tutor" -> {
                if (applicationStatus.isPresent()) {
                    switch (applicationStatus.get()) {
                        case ENROLLED -> applications.addAll(tutorApplicationRepository.findEnrolledApplicationsByCourseIterationId(courseIterationId));
                        case ACCEPTED -> applications.addAll(tutorApplicationRepository.findAcceptedApplicationsByCourseIterationId(courseIterationId));
                        case REJECTED -> applications.addAll(tutorApplicationRepository.findRejectedApplicationsByCourseIterationId(courseIterationId));
                        case PENDING_INTERVIEW -> applications.addAll(tutorApplicationRepository.findPendingInterviewApplicationsByCourseIterationId(courseIterationId));
                        case NOT_ASSESSED -> applications.addAll(tutorApplicationRepository.findNotAssessedApplicationsByCourseIterationId(courseIterationId));
                        default -> applications.addAll(tutorApplicationRepository.findAllByCourseIterationId(courseIterationId));
                    }
                } else {
                    applications.addAll(tutorApplicationRepository.findAllByCourseIterationId(courseIterationId));
                }
            }
            default ->
                    throw new ResourceInvalidParametersException(String.format("Application type %s is not supported.",
                            applicationType));
        }

        return applications;
    }

    public List<DeveloperApplication> findDeveloperApplicationsByProjectTeamId(final UUID projectTeamId, final Optional<String> managedBy) {
        final ProjectTeam projectTeam = projectTeamService.findById(projectTeamId);
        if (managedBy.isEmpty()) {
            return developerApplicationRepository.findByProjectTeamId(projectTeamId);
        }
        if ((projectTeam.getCoachTumId() != null && projectTeam.getCoachTumId().equals(managedBy.get())) ||
                (projectTeam.getProjectLeadTumId() != null && projectTeam.getProjectLeadTumId().equals(managedBy.get()))) {
            return developerApplicationRepository.findByProjectTeamId(projectTeamId);
        }
        throw new ResourceNotFoundException("Could not find a project team.");
    }

    public DeveloperApplication createDeveloperApplication(final DeveloperApplication developerApplication) {
        Optional<Student> existingStudent = findStudent(developerApplication.getStudent().getTumId(),
                developerApplication.getStudent().getMatriculationNumber(), developerApplication.getStudent().getEmail());

        if (existingStudent.isEmpty()) {
            developerApplication.getStudent().setPublicId(UUID.randomUUID());
            studentRepository.save(developerApplication.getStudent());
        } else {
            developerApplication.setStudent(checkAndUpdateStudent(existingStudent.get(), developerApplication.getStudent()));
        }

        final Optional<DeveloperApplication> existingDeveloperApplication = developerApplicationRepository.findByStudentAndCourseIteration(
                developerApplication.getStudent().getId(),
                developerApplication.getCourseIterationId());
        if (existingDeveloperApplication.isPresent()) {
            throw new ResourceConflictException(String.format("Developer application for student %s already exists. ",
                    developerApplication.getStudent().getTumId()));
        }

        developerApplication.setAssessment(ApplicationAssessment.builder().status(ApplicationStatus.NOT_ASSESSED).build());

        return developerApplicationRepository.save(developerApplication);
    }

    public TutorApplication createTutorApplication(final TutorApplication tutorApplication) {
        Optional<Student> existingStudent = findStudent(tutorApplication.getStudent().getTumId(),
                tutorApplication.getStudent().getMatriculationNumber(), tutorApplication.getStudent().getEmail());

        if (existingStudent.isEmpty()) {
            tutorApplication.getStudent().setPublicId(UUID.randomUUID());
            studentRepository.save(tutorApplication.getStudent());
        } else {
            tutorApplication.setStudent(checkAndUpdateStudent(existingStudent.get(), tutorApplication.getStudent()));
        }

        final Optional<TutorApplication> existingTutorApplication = tutorApplicationRepository.findByStudentAndCourseIteration(
                tutorApplication.getStudent().getId(),
                tutorApplication.getCourseIterationId());
        if (existingTutorApplication.isPresent()) {
            throw new ResourceConflictException(String.format("Tutor application for student %s already exists. ",
                    tutorApplication.getStudent().getTumId()));
        }

        tutorApplication.setAssessment(ApplicationAssessment.builder().status(ApplicationStatus.NOT_ASSESSED).build());

        return tutorApplicationRepository.save(tutorApplication);
    }

    public CoachApplication createCoachApplication(final CoachApplication coachApplication) {
        Optional<Student> existingStudent = findStudent(coachApplication.getStudent().getTumId(),
                coachApplication.getStudent().getMatriculationNumber(), coachApplication.getStudent().getEmail());

        if (existingStudent.isEmpty()) {
            coachApplication.getStudent().setPublicId(UUID.randomUUID());
            studentRepository.save(coachApplication.getStudent());
        } else {
            coachApplication.setStudent(checkAndUpdateStudent(existingStudent.get(), coachApplication.getStudent()));
        }

        final Optional<CoachApplication> existingCoachApplication = coachApplicationRepository.findByStudentAndCourseIteration(
                coachApplication.getStudent().getId(),
                coachApplication.getCourseIterationId());
        if (existingCoachApplication.isPresent()) {
            throw new ResourceConflictException(String.format("Coach application for student %s already exists. ",
                    coachApplication.getStudent().getTumId()));
        }

        coachApplication.setAssessment(ApplicationAssessment.builder().status(ApplicationStatus.NOT_ASSESSED).build());

        return coachApplicationRepository.save(coachApplication);
    }

    public DeveloperApplication updateDeveloperApplication(final UUID developerApplicationId, JsonPatch patchDeveloperApplication)
            throws JsonPatchException, JsonProcessingException {
        DeveloperApplication existingApplication = findDeveloperApplicationById(developerApplicationId);

        DeveloperApplication patchedApplication = applyPatchToDeveloperApplication(patchDeveloperApplication, existingApplication);
        return developerApplicationRepository.save(patchedApplication);
    }

    public CoachApplication sendCoachInterviewInvite(final UUID applicationId) {
        final CoachApplication coachApplication = findCoachApplicationById(applicationId);

        try {
            final CourseIteration courseIteration = courseIterationRepository.findById(coachApplication.getCourseIterationId())
                            .orElseThrow(() -> new ResourceNotFoundException(String.format("Course iteration with id %s not found.",
                                    coachApplication.getCourseIterationId())));
            mailingService.sendCoachInterviewInvitationEmail(coachApplication.getStudent(), courseIteration);
        } catch (MessagingException e) {
            log.error(String.format("Failed to send a coach interview invitation email. Error message: %s. Stacktrace: %s",
                    e.getMessage(), Arrays.toString(e.getStackTrace())));
        }

        return coachApplicationRepository.save((CoachApplication) setApplicationStatus(coachApplication, ApplicationStatus.PENDING_INTERVIEW));
    }

    public TutorApplication sendTutorInterviewInvite(final UUID applicationId) {
        final TutorApplication tutorApplication = findTutorApplicationById(applicationId);

        try {
            final CourseIteration courseIteration = courseIterationRepository.findById(tutorApplication.getCourseIterationId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Course iteration with id %s not found.",
                            tutorApplication.getCourseIterationId())));
            mailingService.sendTutorInterviewInvitationEmail(tutorApplication.getStudent(), courseIteration);
        } catch (MessagingException e) {
            log.error(String.format("Failed to send a tutor interview invitation email. Error message: %s. Stacktrace: %s",
                    e.getMessage(), Arrays.toString(e.getStackTrace())));
        }

        return tutorApplicationRepository.save((TutorApplication) setApplicationStatus(tutorApplication, ApplicationStatus.PENDING_INTERVIEW));
    }

    public CoachApplication sendCoachApplicationRejection(final UUID applicationId) {
        final CoachApplication coachApplication = findCoachApplicationById(applicationId);

        try {
            final CourseIteration courseIteration = courseIterationRepository.findById(coachApplication.getCourseIterationId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Course iteration with id %s not found.",
                            coachApplication.getCourseIterationId())));
            mailingService.sendCoachApplicationRejectionEmail(coachApplication.getStudent(), courseIteration);
        } catch (MessagingException e) {
            log.error(String.format("Failed to send a coach application rejection email. Error message: %s. Stacktrace: %s",
                    e.getMessage(), Arrays.toString(e.getStackTrace())));
        }

        return coachApplicationRepository.save((CoachApplication) setApplicationStatus(coachApplication, ApplicationStatus.REJECTED));
    }

    public TutorApplication sendTutorApplicationRejection(final UUID applicationId) {
        final TutorApplication tutorApplication = findTutorApplicationById(applicationId);

        try {
            final CourseIteration courseIteration = courseIterationRepository.findById(tutorApplication.getCourseIterationId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Course iteration with id %s not found.",
                            tutorApplication.getCourseIterationId())));
            mailingService.sendTutorApplicationRejectionEmail(tutorApplication.getStudent(), courseIteration);
        } catch (MessagingException e) {
            log.error(String.format("Failed to send a tutor application rejection email. Error message: %s. Stacktrace: %s",
                    e.getMessage(), Arrays.toString(e.getStackTrace())));
        }

        return tutorApplicationRepository.save((TutorApplication) setApplicationStatus(tutorApplication, ApplicationStatus.REJECTED));
    }

    public CoachApplication sendCoachApplicationAcceptance(final UUID applicationId) {
        final CoachApplication coachApplication = findCoachApplicationById(applicationId);

        try {
            final CourseIteration courseIteration = courseIterationRepository.findById(coachApplication.getCourseIterationId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Course iteration with id %s not found.",
                            coachApplication.getCourseIterationId())));
            mailingService.sendCoachApplicationAcceptanceEmail(coachApplication.getStudent(), courseIteration);
        } catch (MessagingException e) {
            log.error(String.format("Failed to send a coach application acceptance email. Error message: %s. Stacktrace: %s",
                    e.getMessage(), Arrays.toString(e.getStackTrace())));
        }

        return coachApplicationRepository.save((CoachApplication) setApplicationStatus(coachApplication, ApplicationStatus.ACCEPTED));
    }

    public TutorApplication sendTutorApplicationAcceptance(final UUID applicationId) {
        final TutorApplication tutorApplication = findTutorApplicationById(applicationId);

        try {
            final CourseIteration courseIteration = courseIterationRepository.findById(tutorApplication.getCourseIterationId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Course iteration with id %s not found.",
                            tutorApplication.getCourseIterationId())));
            mailingService.sendTutorApplicationAcceptanceEmail(tutorApplication.getStudent(), courseIteration);
        } catch (MessagingException e) {
            log.error(String.format("Failed to send a tutor application acceptance email. Error message: %s. Stacktrace: %s",
                    e.getMessage(), Arrays.toString(e.getStackTrace())));
        }

        return tutorApplicationRepository.save((TutorApplication) setApplicationStatus(tutorApplication, ApplicationStatus.ACCEPTED));
    }

    public Student updateStudentAssessment(final UUID studentId, JsonPatch patchStudentAssessment)
            throws JsonPatchException, JsonProcessingException {
        final Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Student with id %s not found.", studentId)));

        final Student patchedStudent = applyPatchToStudent(patchStudentAssessment, student);

        return studentRepository.save(patchedStudent);
    }

    public DeveloperApplication updateDeveloperApplicationAssessment(final UUID developerApplicationId, JsonPatch patchDeveloperApplicationAssessment)
            throws JsonPatchException, JsonProcessingException {
        final DeveloperApplication application = findDeveloperApplicationById(developerApplicationId);

        ApplicationAssessment patchedApplicationAssessment = applyPatchToStudentApplicationAssessment(
                patchDeveloperApplicationAssessment,
                application.getAssessment() != null ? application.getAssessment() : new ApplicationAssessment());

        application.setAssessment(patchedApplicationAssessment);
        return developerApplicationRepository.save(application);
    }

    public CoachApplication updateCoachApplicationAssessment(final UUID coachApplicationId, JsonPatch patchDeveloperApplicationAssessment)
            throws JsonPatchException, JsonProcessingException {
        final CoachApplication application = findCoachApplicationById(coachApplicationId);

        ApplicationAssessment patchedApplicationAssessment = applyPatchToStudentApplicationAssessment(
                patchDeveloperApplicationAssessment,
                application.getAssessment() != null ? application.getAssessment() : new ApplicationAssessment());

        application.setAssessment(patchedApplicationAssessment);
        return coachApplicationRepository.save(application);
    }

    public TutorApplication updateTutorApplicationAssessment(final UUID tutorApplicationId, JsonPatch patchDeveloperApplicationAssessment)
            throws JsonPatchException, JsonProcessingException {
        final TutorApplication application = findTutorApplicationById(tutorApplicationId);

        ApplicationAssessment patchedApplicationAssessment = applyPatchToStudentApplicationAssessment(
                patchDeveloperApplicationAssessment,
                application.getAssessment() != null ? application.getAssessment() : new ApplicationAssessment());

        application.setAssessment(patchedApplicationAssessment);
        return tutorApplicationRepository.save(application);
    }

    public List<DeveloperApplication> enrollDeveloperApplicationToCourse(final List<UUID> developerApplicationIds) {
        final List<DeveloperApplication> updatedDeveloperApplications = new ArrayList<>();
        developerApplicationIds.forEach(developerApplicationId -> {
            final DeveloperApplication developerApplication = findDeveloperApplicationById(developerApplicationId);
            if (developerApplication.getAssessment().getStatus().equals(ApplicationStatus.ENROLLED)) {
                updatedDeveloperApplications.add(developerApplication);
                return;
            }

            setApplicationStatus(developerApplication, ApplicationStatus.ENROLLED);
            final IntroCourseParticipation introCourseParticipation = IntroCourseParticipation
                    .builder()
                    .courseIterationId(developerApplication.getCourseIterationId())
                    .student(developerApplication.getStudent())
                    .build();

            introCourseParticipationRepository.save(introCourseParticipation);
            updatedDeveloperApplications.add(developerApplicationRepository.save(developerApplication));
        });

        return updatedDeveloperApplications;
    }

    public List<CoachApplication> enrollCoachApplicationToCourse(final List<UUID> coachApplicationIds) {
        final List<CoachApplication> updatedCoachApplications = new ArrayList<>();
        coachApplicationIds.forEach(coachApplicationId -> {
            final CoachApplication coachApplication = findCoachApplicationById(coachApplicationId);
            setApplicationStatus(coachApplication, ApplicationStatus.ENROLLED);
            updatedCoachApplications.add(coachApplicationRepository.save(coachApplication));
        });

        return updatedCoachApplications;
    }

    public List<TutorApplication> enrollTutorApplicationToCourse(final List<UUID> tutorApplicationIds) {
        final List<TutorApplication> updatedTutorApplications = new ArrayList<>();
        tutorApplicationIds.forEach(tutorApplicationId -> {
            final TutorApplication tutorApplication = findTutorApplicationById(tutorApplicationId);
            setApplicationStatus(tutorApplication, ApplicationStatus.ENROLLED);
            updatedTutorApplications.add(tutorApplicationRepository.save(tutorApplication));
        });

        return updatedTutorApplications;
    }

    public List<DeveloperApplication> assignTechnicalChallengeScoresToDeveloperApplications(final Double programmingScoreThreshold,
                                                                                            final Double quizScoreThreshold,
                                                                                            final List<TechnicalChallengeScore> scores) {
        final List<DeveloperApplication> updatedDeveloperApplications = new ArrayList<>();
        scores.forEach(score -> {
            final DeveloperApplication developerApplication = findDeveloperApplicationById(score.getDeveloperApplicationId());
            if (developerApplication.getAssessment() == null) {
                developerApplication.setAssessment(new ApplicationAssessment());
            }
            developerApplication.getAssessment().setTechnicalChallengeProgrammingScore(score.getProgrammingScore());
            developerApplication.getAssessment().setTechnicalChallengeQuizScore(score.getQuizScore());
            if (score.getProgrammingScore() < programmingScoreThreshold || score.getQuizScore() < quizScoreThreshold) {
                developerApplication.getAssessment().setStatus(ApplicationStatus.REJECTED);
            }

            updatedDeveloperApplications.add(developerApplicationRepository.save(developerApplication));
        });

        return updatedDeveloperApplications;
    }

    public Application createInstructorCommentForDeveloperApplication(final UUID developerApplicationId, final InstructorComment instructorComment) {
        final DeveloperApplication application = findDeveloperApplicationById(developerApplicationId);
        if (application.getAssessment() == null) {
            application.setAssessment(new ApplicationAssessment());
        }
        if (application.getAssessment().getInstructorComments() == null) {
            application.getAssessment().setInstructorComments(new HashSet<>());
        }
        application.getAssessment().getInstructorComments().add(instructorComment);
        instructorCommentRepository.save(instructorComment);

        return findDeveloperApplicationById(developerApplicationId);
    }

    public Application createInstructorCommentForCoachApplication(final UUID coachApplicationId, final InstructorComment instructorComment) {
        final CoachApplication application = findCoachApplicationById(coachApplicationId);
        if (application.getAssessment() == null) {
            application.setAssessment(new ApplicationAssessment());
        }
        if (application.getAssessment().getInstructorComments() == null) {
            application.getAssessment().setInstructorComments(new HashSet<>());
        }
        application.getAssessment().getInstructorComments().add(instructorComment);
        instructorCommentRepository.save(instructorComment);

        return findCoachApplicationById(coachApplicationId);
    }

    public Application createInstructorCommentForTutorApplication(final UUID tutorApplicationId, final InstructorComment instructorComment) {
        final TutorApplication application = findTutorApplicationById(tutorApplicationId);
        if (application.getAssessment() == null) {
            application.setAssessment(new ApplicationAssessment());
        }
        if (application.getAssessment().getInstructorComments() == null) {
            application.getAssessment().setInstructorComments(new HashSet<>());
        }
        application.getAssessment().getInstructorComments().add(instructorComment);
        instructorCommentRepository.save(instructorComment);

        return findTutorApplicationById(tutorApplicationId);
    }

    public Application assignDeveloperApplicationToProjectTeam(final UUID developerApplicationId, final UUID projectTeamId, final UUID courseIterationId) {
        DeveloperApplication application = findDeveloperApplicationById(developerApplicationId);

        ProjectTeam projectTeam = projectTeamService.findById(projectTeamId);

        if (!application.getCourseIterationId().equals(projectTeam.getCourseIteration().getId()) ||
                !application.getCourseIterationId().equals(courseIterationId)) {
            throw new ResourceInvalidParametersException(String.format("Developer application with id %s does not match the course iteration of" +
                    "the project team with id %s.", developerApplicationId, projectTeamId));
        }

        application.setProjectTeam(projectTeam);
        return developerApplicationRepository.save(application);
    }

    public Application removeFromProjectTeam(final UUID studentApplicationId, final UUID courseIterationId) {
        DeveloperApplication application = findDeveloperApplicationById(studentApplicationId);

        if (!application.getCourseIterationId().equals(courseIterationId)) {
            throw new ResourceInvalidParametersException(String.format("Developer application with id %s does not match with" +
                    "the course iteration with id %s.", studentApplicationId, courseIterationId));
        }

        application.setProjectTeam(null);
        return developerApplicationRepository.save(application);
    }

    public void assignDeveloperApplicationToProjectTeam(final UUID studentId, final UUID projectTeamId) {
        final DeveloperApplication application = developerApplicationRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Developer application for student with id %s not found.", studentId)));
        final ProjectTeam projectTeam = projectTeamService.findById(projectTeamId);

        application.setProjectTeam(projectTeam);
        developerApplicationRepository.save(application);
    }

    public DeveloperApplication gradeDeveloperApplication(final UUID applicationId, final Grade grade, final Optional<String> author) {
        final DeveloperApplication application = findDeveloperApplicationById(applicationId);
        final ProjectTeam projectTeam = application.getProjectTeam();
        if (author.isPresent() && !(
                (projectTeam.getCoachTumId()!= null && projectTeam.getCoachTumId().equals(author.get()))
                        || (projectTeam.getProjectLeadTumId() != null && projectTeam.getProjectLeadTumId().equals(author.get())))
        ) {
            throw new AccessDeniedException("Access denied.");
        }
        application.setFinalGrade(grade);
        return developerApplicationRepository.save(application);
    }

    public UUID deleteDeveloperApplication(final UUID developerApplicationId) {
        findDeveloperApplicationById(developerApplicationId);
        developerApplicationRepository.deleteById(developerApplicationId);

        return developerApplicationId;
    }

    public UUID deleteCoachApplication(final UUID coachApplicationId) {
        findCoachApplicationById(coachApplicationId);
        coachApplicationRepository.deleteById(coachApplicationId);

        return coachApplicationId;
    }

    public UUID deleteTutorApplication(final UUID tutorApplicationId) {
        findTutorApplicationById(tutorApplicationId);
        tutorApplicationRepository.deleteById(tutorApplicationId);

        return tutorApplicationId;
    }

    private Application setApplicationStatus(final Application application, final ApplicationStatus status) {
        if (application.getAssessment() == null) {
            application.setAssessment(new ApplicationAssessment());
        }
        application.getAssessment().setStatus(status);
        return application;
    }

    private Student applyPatchToStudent(
            JsonPatch patch, Student student) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(student, JsonNode.class));
        return objectMapper.treeToValue(patched, Student.class);
    }

    private DeveloperApplication applyPatchToDeveloperApplication(
            JsonPatch patch, DeveloperApplication developerApplication) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(developerApplication, JsonNode.class));
        return objectMapper.treeToValue(patched, DeveloperApplication.class);
    }

    private TutorApplication applyPatchToTutorApplication(
            JsonPatch patch, TutorApplication tutorApplication) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(tutorApplication, JsonNode.class));
        return objectMapper.treeToValue(patched, TutorApplication.class);
    }

    private CoachApplication applyPatchToCoachApplication(
            JsonPatch patch, CoachApplication coachApplication) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(coachApplication, JsonNode.class));
        return objectMapper.treeToValue(patched, CoachApplication.class);
    }

    private ApplicationAssessment applyPatchToStudentApplicationAssessment(
            JsonPatch patch, ApplicationAssessment targetApplicationAssessment) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(targetApplicationAssessment, JsonNode.class));
        return objectMapper.treeToValue(patched, ApplicationAssessment.class);
    }

    private Optional<Student> findStudent(final String tumId, final String matriculationNumber, final String email) {
        if ((tumId != null && !tumId.isBlank()) || (matriculationNumber != null && !matriculationNumber.isBlank())) {
            return studentRepository.findByTumIdOrMatriculationNumber(tumId, matriculationNumber);
        }
        return studentRepository.findByEmail(email);
    }

    private Student checkAndUpdateStudent(final Student existingStudent, final Student updatedStudent) {
        if (((existingStudent.getTumId() != null && !existingStudent.getTumId().isBlank()) && !existingStudent.getTumId().equals(updatedStudent.getTumId())) ||
                (existingStudent.getMatriculationNumber() != null && !existingStudent.getMatriculationNumber().isBlank()) && !existingStudent.getMatriculationNumber().equals(updatedStudent.getMatriculationNumber())) {
            throw new ResourceInvalidParametersException("Provided TUM ID does not match with the matriculation number you submitted. " +
                    "If You are sure the data is entered correct, please contact the Program Management.");
        }
        existingStudent.setGender(updatedStudent.getGender());
        existingStudent.setFirstName(updatedStudent.getFirstName());
        existingStudent.setLastName(updatedStudent.getLastName());
        existingStudent.setEmail(updatedStudent.getEmail());

        return studentRepository.save(existingStudent);
    }
}
