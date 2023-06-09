package prompt.ls1.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceInvalidParametersException;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.model.Student;
import prompt.ls1.model.StudentApplication;
import prompt.ls1.model.InstructorComment;
import prompt.ls1.model.StudentApplicationAssessment;
import prompt.ls1.repository.ProjectTeamRepository;
import prompt.ls1.repository.InstructorCommentRepository;
import prompt.ls1.repository.StudentApplicationRepository;
import prompt.ls1.repository.StudentRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentApplicationService {
    private final StudentApplicationRepository studentApplicationRepository;
    private final InstructorCommentRepository instructorCommentRepository;
    private final StudentRepository studentRepository;
    private final ProjectTeamRepository projectTeamRepository;

    @Autowired
    public StudentApplicationService(
            StudentApplicationRepository studentApplicationRepository,
            InstructorCommentRepository instructorCommentRepository,
            StudentRepository studentRepository,
            ProjectTeamRepository projectTeamRepository) {
        this.studentApplicationRepository = studentApplicationRepository;
        this.instructorCommentRepository = instructorCommentRepository;
        this.studentRepository = studentRepository;
        this.projectTeamRepository = projectTeamRepository;
    }

    public StudentApplication findById(final UUID studentApplicationId) {
        return studentApplicationRepository.findById(studentApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Student application with id %s not found.", studentApplicationId)));
    }

    public StudentApplication create(final StudentApplication studentApplication) {
        Optional<Student> existingStudent = Optional.empty();
        Student student = studentApplication.getStudent();
        if (student.getTumId() != null) {
            existingStudent = studentRepository.findByTumId(student.getTumId());
        } else if (student.getFirstName() != null && student.getLastName() != null) {
            existingStudent = studentRepository.findByFirstNameAndLastName(student.getFirstName(), student.getLastName());
        }
        if (existingStudent.isEmpty()) {
            student.setPublicId(UUID.randomUUID());
            studentRepository.save(student);
        } else {
            studentApplication.setStudent(existingStudent.get());
        }

        return studentApplicationRepository.save(studentApplication);
    }

    public StudentApplication update(final UUID studentApplicationId, JsonPatch patchStudentApplication)
            throws JsonPatchException, JsonProcessingException {
        StudentApplication existingStudentApplication = findById(studentApplicationId);

        StudentApplication patchedStudentApplication = applyPatchToStudentApplication(patchStudentApplication, existingStudentApplication);
        return studentApplicationRepository.save(patchedStudentApplication);
    }

    public StudentApplication updateStudentApplicationAssessment(final UUID studentApplicationId, JsonPatch patchStudentApplicationAssessment)
            throws JsonPatchException, JsonProcessingException {
        StudentApplication studentApplication = findById(studentApplicationId);

        StudentApplicationAssessment patchedStudentApplicationAssessment = applyPatchToStudentApplicationAssessment(
                patchStudentApplicationAssessment, studentApplication.getStudentApplicationAssessment());

        studentApplication.setStudentApplicationAssessment(patchedStudentApplicationAssessment);
        return studentApplicationRepository.save(studentApplication);
    }

    public StudentApplication createInstructorComment(final UUID studentApplicationId, final InstructorComment instructorComment) {
        StudentApplication studentApplication = findById(studentApplicationId);
        studentApplication.getStudentApplicationAssessment().getInstructorComments().add(instructorComment);
        instructorCommentRepository.save(instructorComment);

        return studentApplicationRepository.findById(studentApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Student application with id %s not found.", studentApplicationId)));
    }

    public StudentApplication assignToProjectTeam(final UUID studentApplicationId, final UUID projectTeamId, final UUID applicationSemesterId) {
        StudentApplication studentApplication = findById(studentApplicationId);

        ProjectTeam projectTeam = projectTeamRepository.findById(projectTeamId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Project team with id %s not found.", projectTeamId)));

        if (!studentApplication.getApplicationSemester().getId().equals(projectTeam.getApplicationSemester().getId()) ||
                !studentApplication.getApplicationSemester().getId().equals(applicationSemesterId)) {
            throw new ResourceInvalidParametersException(String.format("Student application with id %s does not match the application semester of" +
                    "the project team with id %s.", studentApplicationId, projectTeamId));
        }

        studentApplication.setProjectTeam(projectTeam);
        return studentApplicationRepository.save(studentApplication);
    }

    public StudentApplication removeFromProjectTeam(final UUID studentApplicationId, final UUID applicationSemesterId) {
        StudentApplication studentApplication = findById(studentApplicationId);

        if (!studentApplication.getApplicationSemester().getId().equals(applicationSemesterId)) {
            throw new ResourceInvalidParametersException(String.format("Student application with id %s does not match with" +
                    "the application semester with id %s.", studentApplicationId, applicationSemesterId));
        }

        studentApplication.setProjectTeam(null);
        return studentApplicationRepository.save(studentApplication);
    }

    public List<StudentApplication> findAllByApplicationSemester(final UUID applicationSemesterId, final boolean accepted) {
        final List<StudentApplication> studentApplications = studentApplicationRepository.findAllByApplicationSemesterId(applicationSemesterId);
        if (accepted) {
            return studentApplications
                    .stream().filter(studentApplication -> studentApplication.getStudentApplicationAssessment().getAccepted()).toList();
        }
        return studentApplications;
    }

    public void assignProjectTeam(final UUID studentId, final UUID projectTeamId) {
        final StudentApplication studentApplication = studentApplicationRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Student application for student with id %s not found.", studentId)));
        final ProjectTeam projectTeam = projectTeamRepository.findById(projectTeamId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Project team with id %s not found.", projectTeamId)));

        studentApplication.setProjectTeam(projectTeam);
        studentApplicationRepository.save(studentApplication);
    }

    private StudentApplication applyPatchToStudentApplication(
            JsonPatch patch, StudentApplication targetStudentApplication) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(targetStudentApplication, JsonNode.class));
        return objectMapper.treeToValue(patched, StudentApplication.class);
    }

    private StudentApplicationAssessment applyPatchToStudentApplicationAssessment(
            JsonPatch patch, StudentApplicationAssessment targetStudentApplicationAssessment) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(targetStudentApplicationAssessment, JsonNode.class));
        return objectMapper.treeToValue(patched, StudentApplicationAssessment.class);
    }
}
