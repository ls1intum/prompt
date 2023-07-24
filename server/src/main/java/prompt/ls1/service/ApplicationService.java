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
import prompt.ls1.exception.ResourceConflictException;
import prompt.ls1.exception.ResourceInvalidParametersException;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.Application;
import prompt.ls1.model.ApplicationAssessment;
import prompt.ls1.model.CoachApplication;
import prompt.ls1.model.DeveloperApplication;
import prompt.ls1.model.InstructorComment;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.model.Student;
import prompt.ls1.model.TutorApplication;
import prompt.ls1.repository.CoachApplicationRepository;
import prompt.ls1.repository.DeveloperApplicationRepository;
import prompt.ls1.repository.InstructorCommentRepository;
import prompt.ls1.repository.ProjectTeamRepository;
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
    private final InstructorCommentRepository instructorCommentRepository;
    private final StudentRepository studentRepository;
    private final ProjectTeamRepository projectTeamRepository;
    private final MailingService mailingService;

    @Autowired
    public ApplicationService(
            final DeveloperApplicationRepository developerApplicationRepository,
            final TutorApplicationRepository tutorApplicationRepository,
            final CoachApplicationRepository coachApplicationRepository,
            final InstructorCommentRepository instructorCommentRepository,
            final StudentRepository studentRepository,
            final ProjectTeamRepository projectTeamRepository,
            final MailingService mailingService) {
        this.developerApplicationRepository = developerApplicationRepository;
        this.tutorApplicationRepository = tutorApplicationRepository;
        this.coachApplicationRepository = coachApplicationRepository;
        this.instructorCommentRepository = instructorCommentRepository;
        this.studentRepository = studentRepository;
        this.projectTeamRepository = projectTeamRepository;
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
                developerApplication.getCourseIteration().getId());
        if (existingDeveloperApplication.isPresent()) {
            throw new ResourceConflictException(String.format("Developer application for student %s already exists. ",
                    developerApplication.getStudent().getTumId()));
        }

        developerApplication.setAssessment(null);

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
                tutorApplication.getCourseIteration().getId());
        if (existingTutorApplication.isPresent()) {
            throw new ResourceConflictException(String.format("Tutor application for student %s already exists. ",
                    tutorApplication.getStudent().getTumId()));
        }

        tutorApplication.setAssessment(null);

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
                coachApplication.getCourseIteration().getId());
        if (existingCoachApplication.isPresent()) {
            throw new ResourceConflictException(String.format("Coach application for student %s already exists. ",
                    coachApplication.getStudent().getTumId()));
        }

        coachApplication.setAssessment(null);

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
            mailingService.sendCoachInterviewInvitationEmail(coachApplication.getStudent(), coachApplication.getCourseIteration());
        } catch (MessagingException e) {
            log.error(String.format("Failed to send a coach interview invitation email. Error message: %s. Stacktrace: %s",
                    e.getMessage(), Arrays.toString(e.getStackTrace())));
        }

        coachApplication.getAssessment().setInterviewInviteSent(true);
        return coachApplicationRepository.save(coachApplication);
    }

    public TutorApplication sendTutorInterviewInvite(final UUID applicationId) {
        final TutorApplication tutorApplication = findTutorApplicationById(applicationId);

        try {
            mailingService.sendTutorInterviewInvitationEmail(tutorApplication.getStudent(), tutorApplication.getCourseIteration());
        } catch (MessagingException e) {
            log.error(String.format("Failed to send a tutor interview invitation email. Error message: %s. Stacktrace: %s",
                    e.getMessage(), Arrays.toString(e.getStackTrace())));
        }

        tutorApplication.getAssessment().setInterviewInviteSent(true);
        return tutorApplicationRepository.save(tutorApplication);
    }

    public CoachApplication sendCoachApplicationRejection(final UUID applicationId) {
        final CoachApplication coachApplication = findCoachApplicationById(applicationId);

        try {
            mailingService.sendCoachApplicationRejectionEmail(coachApplication.getStudent(), coachApplication.getCourseIteration());
        } catch (MessagingException e) {
            log.error(String.format("Failed to send a coach application rejection email. Error message: %s. Stacktrace: %s",
                    e.getMessage(), Arrays.toString(e.getStackTrace())));
        }

        coachApplication.getAssessment().setRejectionSent(true);
        return coachApplicationRepository.save(coachApplication);
    }

    public TutorApplication sendTutorApplicationRejection(final UUID applicationId) {
        final TutorApplication tutorApplication = findTutorApplicationById(applicationId);

        try {
            mailingService.sendTutorApplicationRejectionEmail(tutorApplication.getStudent(), tutorApplication.getCourseIteration());
        } catch (MessagingException e) {
            log.error(String.format("Failed to send a tutor application rejection email. Error message: %s. Stacktrace: %s",
                    e.getMessage(), Arrays.toString(e.getStackTrace())));
        }

        tutorApplication.getAssessment().setRejectionSent(true);
        return tutorApplicationRepository.save(tutorApplication);
    }

    public CoachApplication sendCoachApplicationAcceptance(final UUID applicationId) {
        final CoachApplication coachApplication = findCoachApplicationById(applicationId);

        try {
            mailingService.sendCoachApplicationAcceptanceEmail(coachApplication.getStudent(), coachApplication.getCourseIteration());
        } catch (MessagingException e) {
            log.error(String.format("Failed to send a coach application acceptance email. Error message: %s. Stacktrace: %s",
                    e.getMessage(), Arrays.toString(e.getStackTrace())));
        }

        coachApplication.getAssessment().setAccepted(true);
        coachApplication.getAssessment().setAcceptanceSent(true);
        return coachApplicationRepository.save(coachApplication);
    }

    public TutorApplication sendTutorApplicationAcceptance(final UUID applicationId) {
        final TutorApplication tutorApplication = findTutorApplicationById(applicationId);

        try {
            mailingService.sendTutorApplicationAcceptanceEmail(tutorApplication.getStudent(), tutorApplication.getCourseIteration());
        } catch (MessagingException e) {
            log.error(String.format("Failed to send a tutor application acceptance email. Error message: %s. Stacktrace: %s",
                    e.getMessage(), Arrays.toString(e.getStackTrace())));
        }

        tutorApplication.getAssessment().setAccepted(true);
        tutorApplication.getAssessment().setAcceptanceSent(true);
        return tutorApplicationRepository.save(tutorApplication);
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
                developerApplication.getAssessment().setAccepted(false);
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

        ProjectTeam projectTeam = projectTeamRepository.findById(projectTeamId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Project team with id %s not found.", projectTeamId)));

        if (!application.getCourseIteration().getId().equals(projectTeam.getCourseIteration().getId()) ||
                !application.getCourseIteration().getId().equals(courseIterationId)) {
            throw new ResourceInvalidParametersException(String.format("Developer application with id %s does not match the course iteration of" +
                    "the project team with id %s.", developerApplicationId, projectTeamId));
        }

        application.setProjectTeam(projectTeam);
        return developerApplicationRepository.save(application);
    }

    public Application removeFromProjectTeam(final UUID studentApplicationId, final UUID courseIterationId) {
        DeveloperApplication application = findDeveloperApplicationById(studentApplicationId);

        if (!application.getCourseIteration().getId().equals(courseIterationId)) {
            throw new ResourceInvalidParametersException(String.format("Developer application with id %s does not match with" +
                    "the course iteration with id %s.", studentApplicationId, courseIterationId));
        }

        application.setProjectTeam(null);
        return developerApplicationRepository.save(application);
    }

    public List<DeveloperApplication> findAllDeveloperApplicationsByCourseIteration(final UUID courseIterationId, final boolean accepted) {
        final List<DeveloperApplication> applications = developerApplicationRepository.findAllByCourseIterationId(courseIterationId);
        if (accepted) {
            return applications
                    .stream().filter(developerApplication -> developerApplication.getAssessment().getAccepted()).toList();
        }
        return applications;
    }

    public List<CoachApplication> findAllCoachApplicationsByCourseIteration(final UUID courseIterationId, final boolean accepted) {
        final List<CoachApplication> applications = coachApplicationRepository.findAllByCourseIterationId(courseIterationId);
        if (accepted) {
            return applications
                    .stream().filter(developerApplication -> developerApplication.getAssessment().getAccepted()).toList();
        }
        return applications;
    }

    public List<TutorApplication> findAllTutorApplicationsByCourseIteration(final UUID courseIterationId, final boolean accepted) {
        final List<TutorApplication> applications = tutorApplicationRepository.findAllByCourseIterationId(courseIterationId);
        if (accepted) {
            return applications
                    .stream().filter(developerApplication -> developerApplication.getAssessment().getAccepted()).toList();
        }
        return applications;
    }

    public void assignDeveloperApplicationToProjectTeam(final UUID studentId, final UUID projectTeamId) {
        final DeveloperApplication application = developerApplicationRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Developer application for student with id %s not found.", studentId)));
        final ProjectTeam projectTeam = projectTeamRepository.findById(projectTeamId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Project team with id %s not found.", projectTeamId)));

        application.setProjectTeam(projectTeam);
        developerApplicationRepository.save(application);
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
