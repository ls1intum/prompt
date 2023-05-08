package prompt.ls1.controller;

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
import prompt.ls1.model.ApplicationSemester;
import prompt.ls1.model.Student;
import prompt.ls1.model.StudentProjectTeamPreferencesSubmission;
import prompt.ls1.repository.StudentProjectTeamPreferenceRepository;
import prompt.ls1.repository.StudentProjectTeamPreferencesSubmissionRepository;
import prompt.ls1.repository.StudentRepository;
import prompt.ls1.service.ApplicationSemesterService;
import prompt.ls1.service.StudentProjectTeamPreferencesSubmissionService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/project-team-preferences")
public class StudentProjectTeamPreferenceController {
    @Autowired
    private StudentProjectTeamPreferencesSubmissionService studentProjectTeamPreferencesSubmissionService;
    @Autowired
    private StudentProjectTeamPreferencesSubmissionRepository studentProjectTeamPreferencesSubmissionRepository;
    @Autowired
    private StudentProjectTeamPreferenceRepository studentProjectTeamPreferenceRepository;
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ApplicationSemesterService applicationSemesterService;

    @GetMapping(value = {"/{studentId}", ""})
    public ResponseEntity<List<StudentProjectTeamPreferencesSubmission>> getProjectTeamPreferencesSubmissions(
            @PathVariable(required = false) final UUID studentId,
            @RequestParam(name = "applicationSemester") final String applicationSemesterName
    ) {
        final ApplicationSemester applicationSemester = applicationSemesterService.findBySemesterName(applicationSemesterName);

        if (studentId != null) {
            final Optional<Student> student = studentRepository.findById(studentId);
            if (student.isEmpty()) {
                return new ResponseEntity(String.format("Student with id %s not found.", studentId),
                        HttpStatus.BAD_REQUEST);
            }

            final List<StudentProjectTeamPreferencesSubmission> studentProjectTeamPreferencesSubmissions =
                    studentProjectTeamPreferencesSubmissionRepository
                            .findAllByStudentIdAndApplicationSemesterId(student.get().getId(), applicationSemester.getId());

            return ResponseEntity.ok(studentProjectTeamPreferencesSubmissions);
        }

        final List<Student> students = studentRepository.findAll();
        final List<StudentProjectTeamPreferencesSubmission> studentProjectTeamPreferencesSubmissions = studentProjectTeamPreferencesSubmissionRepository
                .findAllByApplicationSemesterId(applicationSemester.getId());
        studentProjectTeamPreferencesSubmissions.forEach(studentProjectTeamPreferencesSubmission -> {
            Optional<Student> student = students.stream().filter(std -> std.getId().equals(studentProjectTeamPreferencesSubmission.getStudentId())).findFirst();
            if (student.isPresent()) {
                studentProjectTeamPreferencesSubmission.setStudent(student.get());
            }
        });

        return ResponseEntity.ok(studentProjectTeamPreferencesSubmissions);
    }

    @PostMapping
    public ResponseEntity<StudentProjectTeamPreferencesSubmission> createStudentProjectTeamPreferencesSubmissionForStudent(
            @RequestBody final StudentProjectTeamPreferencesSubmission studentProjectTeamPreferencesSubmission
    ) {
        return ResponseEntity.ok(studentProjectTeamPreferencesSubmissionService.create(studentProjectTeamPreferencesSubmission));
    }

    @DeleteMapping
    public ResponseEntity deleteAllStudentProjectTeamPreferencesForApplicationSemester(
            @RequestParam(name = "applicationSemester") final String applicationSemesterName
    ) {
        final ApplicationSemester applicationSemester = applicationSemesterService.findBySemesterName(applicationSemesterName);

        studentProjectTeamPreferencesSubmissionRepository.deleteAllByApplicationSemesterId(applicationSemester.getId());

        return ResponseEntity.ok().build();
    }
}
