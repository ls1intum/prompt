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
import prompt.ls1.model.StudentApplicationNote;
import prompt.ls1.model.User;
import prompt.ls1.repository.ProjectTeamRepository;
import prompt.ls1.repository.StudentApplicationNoteRepository;
import prompt.ls1.repository.StudentApplicationRepository;
import prompt.ls1.repository.StudentRepository;
import prompt.ls1.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentApplicationService {
    @Autowired
    private StudentApplicationRepository studentApplicationRepository;

    @Autowired
    private StudentApplicationNoteRepository studentApplicationNoteRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectTeamRepository projectTeamRepository;

    public StudentApplication findById(final UUID studentApplicationId) {
        Optional<StudentApplication> studentApplication = studentApplicationRepository.findById(studentApplicationId);
        if (studentApplication.isEmpty()) {
            throw new ResourceNotFoundException(String.format("Student application with id %s not found.", studentApplicationId));
        }
        return studentApplication.get();
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
            studentRepository.save(student);
        }

        return studentApplicationRepository.save(studentApplication);
    }

    public StudentApplication update(final UUID studentApplicationId, JsonPatch patchStudentApplication)
            throws JsonPatchException, JsonProcessingException  {
        StudentApplication existingStudentApplication = findById(studentApplicationId);

        StudentApplication patchedStudentApplication = applyPatchToStudentApplication(patchStudentApplication, existingStudentApplication);
        return studentApplicationRepository.save(patchedStudentApplication);
    }

    public StudentApplication createNote(final UUID studentApplicationId, final StudentApplicationNote studentApplicationNote) {
        StudentApplication studentApplication = findById(studentApplicationId);

        Optional<User> user = userRepository.findById(studentApplicationNote.getAuthor().getId());
        if (user.isEmpty()) {
            throw new ResourceNotFoundException(String.format("User with id %s not found.", studentApplicationNote.getAuthor().getId()));
        }

        studentApplicationNote.setAuthor(user.get());
        studentApplication.getNotes().add(studentApplicationNote);
        studentApplicationNoteRepository.save(studentApplicationNote);

        Optional<StudentApplication> updatedStudentApplication = studentApplicationRepository.findById(studentApplicationId);
        if (updatedStudentApplication.isEmpty()) {
            throw new ResourceNotFoundException(String.format("Student application with id %s not found.", studentApplicationId));
        }

        return updatedStudentApplication.get();
    }

    public StudentApplication assignToProjectTeam(final UUID studentApplicationId, final UUID projectTeamId, final UUID applicationSemesterId) {
        StudentApplication studentApplication = findById(studentApplicationId);

        Optional<ProjectTeam> projectTeam = projectTeamRepository.findById(projectTeamId);
        if (projectTeam.isEmpty()) {
            throw new ResourceNotFoundException(String.format("Project team with id %s not found.", projectTeamId));
        }

        if (!studentApplication.getApplicationSemester().getId().equals(projectTeam.get().getApplicationSemester().getId()) ||
                !studentApplication.getApplicationSemester().getId().equals(applicationSemesterId)) {
            throw new ResourceInvalidParametersException(String.format("Student application with id %s does not match the application semester of" +
                    "the project team with id %s.", studentApplicationId, projectTeamId));
        }

        studentApplication.setProjectTeam(projectTeam.get());
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

    public List<StudentApplication> findAllByApplicationSemester(final UUID applicationSemesterId) {
        return studentApplicationRepository.findAllByApplicationSemesterId(applicationSemesterId);
    }

    private StudentApplication applyPatchToStudentApplication(
            JsonPatch patch, StudentApplication targetStudentApplication) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(targetStudentApplication, JsonNode.class));
        return objectMapper.treeToValue(patched, StudentApplication.class);
    }
}
