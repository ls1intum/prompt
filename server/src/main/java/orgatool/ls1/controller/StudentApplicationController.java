package orgatool.ls1.controller;

import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import orgatool.ls1.model.ApplicationSemester;
import orgatool.ls1.model.ProjectTeam;
import orgatool.ls1.model.Student;
import orgatool.ls1.model.StudentApplication;
import orgatool.ls1.model.StudentApplicationNote;
import orgatool.ls1.model.User;
import orgatool.ls1.repository.ApplicationSemesterRepository;
import orgatool.ls1.repository.ProjectTeamRepository;
import orgatool.ls1.repository.StudentApplicationNoteRepository;
import orgatool.ls1.repository.StudentApplicationRepository;
import orgatool.ls1.repository.StudentRepository;
import orgatool.ls1.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student-applications")
public class StudentApplicationController {

    @Autowired
    private StudentApplicationRepository studentApplicationRepository;
    @Autowired
    private StudentApplicationNoteRepository studentApplicationNoteRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ApplicationSemesterRepository applicationSemesterRepository;
    @Autowired
    private ProjectTeamRepository projectTeamRepository;

    @GetMapping
    public ResponseEntity<List<StudentApplication>> getAllStudentApplications(
            @RequestParam(name = "applicationSemester") @NotNull String applicationSemesterName,
            @RequestParam(defaultValue = "false") boolean onlyAccepted
    ) {
        Optional<ApplicationSemester> applicationSemester = applicationSemesterRepository.findBySemesterName(applicationSemesterName);
        if (applicationSemester.isEmpty()) {
            return new ResponseEntity(String.format("Application semester %s not found.", applicationSemesterName), HttpStatus.NOT_FOUND);
        }

        if (onlyAccepted) {
            return ResponseEntity.ok(studentApplicationRepository.findAllByApplicationSemesterId(applicationSemester.get().getId())
                    .stream()
                    .filter(studentApplication -> studentApplication.getAccepted().equals(true))
                    .toList());
        }
        return ResponseEntity.ok(studentApplicationRepository.findAllByApplicationSemesterId(applicationSemester.get().getId()));
    }

    @PostMapping
    public StudentApplication create(@RequestBody StudentApplication studentApplication) {
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

    @PostMapping("/{studentApplicationId}/notes")
    public ResponseEntity<StudentApplication> createNote(@PathVariable Long studentApplicationId,
                                     @RequestBody StudentApplicationNote studentApplicationNote) {
        Optional<StudentApplication> studentApplication = studentApplicationRepository.findById(studentApplicationId);
        Optional<User> user = userRepository.findById(studentApplicationNote.getAuthor().getId());
        if (studentApplication.isPresent() && user.isPresent()) {
            studentApplicationNote.setAuthor(user.get());
            studentApplication.get().getNotes().add(studentApplicationNote);
            studentApplicationNoteRepository.save(studentApplicationNote);
            Optional<StudentApplication> updatedStudentApplication = studentApplicationRepository.findById(studentApplicationId);
            if (updatedStudentApplication.isPresent()) {
                ResponseEntity.ok(updatedStudentApplication.get());
            } else {
                ResponseEntity.internalServerError();
            }
        }

        return null;
    }

    @PostMapping(path = "/{studentApplicationId}/project-team/{projectTeamId}")
    public ResponseEntity<StudentApplication> assignStudentApplicationToProjectTeam(
            @RequestParam(name="applicationSemester") @NotNull String applicationSemesterName,
            @PathVariable Long studentApplicationId,
            @PathVariable Long projectTeamId
    ) {
        Optional<ApplicationSemester> applicationSemester = applicationSemesterRepository.findBySemesterName(applicationSemesterName);
        if (applicationSemester.isEmpty()) {
            return new ResponseEntity(String.format("Application semester %s not found.", applicationSemesterName), HttpStatus.NOT_FOUND);
        }

        Optional<StudentApplication> studentApplication = studentApplicationRepository
                .findByIdAndApplicationSemesterId(studentApplicationId, applicationSemester.get().getId());
        if (studentApplication.isEmpty()) {
            return new ResponseEntity(String.format("Student application with id %s and application semester %s not found.",
                    studentApplicationId, applicationSemester.get().getSemesterName()), HttpStatus.NOT_FOUND);
        }

        Optional<ProjectTeam> projectTeam = projectTeamRepository
                .findByIdAndApplicationSemesterId(projectTeamId, applicationSemester.get().getId());
        if (projectTeam.isEmpty()) {
            return new ResponseEntity(String.format("Project team with id %s and application semester %s not found.",
                    projectTeamId, applicationSemester.get().getSemesterName()), HttpStatus.NOT_FOUND);
        }

        studentApplication.get().setProjectTeam(projectTeam.get());

        return ResponseEntity.ok(studentApplicationRepository.save(studentApplication.get()));
    }

    @DeleteMapping(path = "/{studentApplicationId}/project-team")
    public ResponseEntity<StudentApplication> removeStudentApplicationFromProjectTeam(
            @RequestParam(name = "applicationSemester") @NotNull String applicationSemesterName,
            @PathVariable Long studentApplicationId
    ) {
        Optional<ApplicationSemester> applicationSemester = applicationSemesterRepository.findBySemesterName(applicationSemesterName);
        if (applicationSemester.isEmpty()) {
            return new ResponseEntity(String.format("Application semester %s not found.", applicationSemesterName), HttpStatus.NOT_FOUND);
        }

        Optional<StudentApplication> studentApplication = studentApplicationRepository
                .findByIdAndApplicationSemesterId(studentApplicationId, applicationSemester.get().getId());
        if (studentApplication.isEmpty()) {
            return new ResponseEntity(String.format("Student application with id %s and application semester %s not found.",
                    studentApplicationId, applicationSemester.get().getSemesterName()), HttpStatus.NOT_FOUND);
        }

        studentApplication.get().setProjectTeam(null);
        return ResponseEntity.ok(studentApplicationRepository.save(studentApplication.get()));
    }

}
