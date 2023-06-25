package prompt.ls1.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ApplicationService {
    private final DeveloperApplicationRepository developerApplicationRepository;
    private final TutorApplicationRepository tutorApplicationRepository;
    private final CoachApplicationRepository coachApplicationRepository;
    private final InstructorCommentRepository instructorCommentRepository;
    private final StudentRepository studentRepository;
    private final ProjectTeamRepository projectTeamRepository;

    @Autowired
    public ApplicationService(
            final DeveloperApplicationRepository developerApplicationRepository,
            final TutorApplicationRepository tutorApplicationRepository,
            final CoachApplicationRepository coachApplicationRepository,
            final InstructorCommentRepository instructorCommentRepository,
            final StudentRepository studentRepository,
            final ProjectTeamRepository projectTeamRepository) {
        this.developerApplicationRepository = developerApplicationRepository;
        this.tutorApplicationRepository = tutorApplicationRepository;
        this.coachApplicationRepository = coachApplicationRepository;
        this.instructorCommentRepository = instructorCommentRepository;
        this.studentRepository = studentRepository;
        this.projectTeamRepository = projectTeamRepository;
    }

    public DeveloperApplication findDeveloperApplicationById(final UUID developerApplicationId) {
        return developerApplicationRepository.findById(developerApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Developer application with id %s not found.", developerApplicationId)));
    }

    public Application createDeveloperApplication(final DeveloperApplication developerApplication) {
        Student student = developerApplication.getStudent();
        Optional<Student> existingStudent = findStudent(student.getTumId(), student.getMatriculationNumber(), student.getEmail());

        if (existingStudent.isEmpty()) {
            student.setPublicId(UUID.randomUUID());
            studentRepository.save(student);
        } else {
            developerApplication.setStudent(existingStudent.get());
        }

        final Optional<DeveloperApplication> existingDeveloperApplication = developerApplicationRepository.findByStudentAndCourseIteration(
                developerApplication.getStudent().getId(),
                developerApplication.getCourseIteration().getId());
        if (existingDeveloperApplication.isPresent()) {
            throw new ResourceConflictException(String.format("Developer application for student %s already exists. ",
                    developerApplication.getStudent().getTumId()));
        }

        return developerApplicationRepository.save(developerApplication);
    }

    public Application createTutorApplication(final TutorApplication tutorApplication) {
        Student student = tutorApplication.getStudent();
        Optional<Student> existingStudent = findStudent(student.getTumId(), student.getMatriculationNumber(), student.getEmail());

        if (student.getTumId() != null) {
            existingStudent = studentRepository.findByTumId(student.getTumId());
        } else if (student.getFirstName() != null && student.getLastName() != null) {
            existingStudent = studentRepository.findByFirstNameAndLastName(student.getFirstName(), student.getLastName());
        }
        if (existingStudent.isEmpty()) {
            student.setPublicId(UUID.randomUUID());
            studentRepository.save(student);
        } else {
            tutorApplication.setStudent(existingStudent.get());
        }

        return tutorApplicationRepository.save(tutorApplication);
    }

    public Application createCoachApplication(final CoachApplication coachApplication) {
        Student student = coachApplication.getStudent();
        Optional<Student> existingStudent = findStudent(student.getTumId(), student.getMatriculationNumber(), student.getEmail());

        if (student.getTumId() != null) {
            existingStudent = studentRepository.findByTumId(student.getTumId());
        } else if (student.getFirstName() != null && student.getLastName() != null) {
            existingStudent = studentRepository.findByFirstNameAndLastName(student.getFirstName(), student.getLastName());
        }
        if (existingStudent.isEmpty()) {
            student.setPublicId(UUID.randomUUID());
            studentRepository.save(student);
        } else {
            coachApplication.setStudent(existingStudent.get());
        }

        return coachApplicationRepository.save(coachApplication);
    }

    public DeveloperApplication updateDeveloperApplication(final UUID developerApplicationId, JsonPatch patchDeveloperApplication)
            throws JsonPatchException, JsonProcessingException {
        DeveloperApplication existingApplication = findDeveloperApplicationById(developerApplicationId);

        DeveloperApplication patchedApplication = applyPatchToDeveloperApplication(patchDeveloperApplication, existingApplication);
        return developerApplicationRepository.save(patchedApplication);
    }

    public DeveloperApplication updateDeveloperApplicationAssessment(final UUID developerApplicationId, JsonPatch patchDeveloperApplicationAssessment)
            throws JsonPatchException, JsonProcessingException {
        DeveloperApplication application = findDeveloperApplicationById(developerApplicationId);

        ApplicationAssessment patchedApplicationAssessment = applyPatchToStudentApplicationAssessment(
                patchDeveloperApplicationAssessment, application.getAssessment());

        application.setAssessment(patchedApplicationAssessment);
        return developerApplicationRepository.save(application);
    }

    public Application createInstructorComment(final UUID developerApplicationId, final InstructorComment instructorComment) {
        DeveloperApplication application = findDeveloperApplicationById(developerApplicationId);
        application.getAssessment().getInstructorComments().add(instructorComment);
        instructorCommentRepository.save(instructorComment);

        return developerApplicationRepository.findById(developerApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Developer application with id %s not found.", developerApplicationId)));
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
        if (tumId != null || matriculationNumber != null) {
            return studentRepository.findByTumIdOrMatriculationNumber(tumId, matriculationNumber);
        }
        return studentRepository.findByEmail(email);
    }
}
