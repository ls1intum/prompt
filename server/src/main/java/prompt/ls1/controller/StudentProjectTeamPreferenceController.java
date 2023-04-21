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
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.model.Student;
import prompt.ls1.model.StudentProjectTeamPreference;
import prompt.ls1.repository.ProjectTeamRepository;
import prompt.ls1.repository.StudentProjectTeamPreferenceRepository;
import prompt.ls1.repository.StudentRepository;
import prompt.ls1.service.ApplicationSemesterService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/project-team-preferences")
public class StudentProjectTeamPreferenceController {
    @Autowired
    private StudentProjectTeamPreferenceRepository studentProjectTeamPreferenceRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ProjectTeamRepository projectTeamRepository;

    @Autowired
    private ApplicationSemesterService applicationSemesterService;

    @GetMapping(value = {"/{studentId}", ""})
    public ResponseEntity<List<StudentProjectTeamPreference>> getProjectTeamPreferences(
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

            final List<StudentProjectTeamPreference> studentProjectTeamPreferences = studentProjectTeamPreferenceRepository
                    .findAllByStudentIdAndApplicationSemesterId(student.get().getId(), applicationSemester.getId());

            return ResponseEntity.ok(studentProjectTeamPreferences);
        }

        final List<Student> students = studentRepository.findAll();
        final List<StudentProjectTeamPreference> studentProjectTeamPreferences = studentProjectTeamPreferenceRepository
                .findAllByApplicationSemesterId(applicationSemester.getId());
        studentProjectTeamPreferences.forEach(studentProjectTeamPreference -> {
            Optional<Student> student = students.stream().filter(std -> std.getId().equals(studentProjectTeamPreference.getStudentId())).findFirst();
            if (student.isPresent()) {
                studentProjectTeamPreference.setStudent(student.get());
            }
        });

        return ResponseEntity.ok(studentProjectTeamPreferences);
    }

    @PostMapping("/{studentId}")
    public ResponseEntity<List<StudentProjectTeamPreference>> createStudentProjectTeamPreferencesForStudent(
            @RequestParam(name = "applicationSemester") String applicationSemesterName,
            @PathVariable UUID studentId,
            @RequestBody Map<UUID, Integer> preferences
    ) {
        final ApplicationSemester applicationSemester = applicationSemesterService.findBySemesterName(applicationSemesterName);

        final Optional<Student> student = studentRepository.findById(studentId);
        if (student.isEmpty()) {
            return new ResponseEntity(String.format("Student with id %s not found.", studentId),
                    HttpStatus.BAD_REQUEST);
        }

        final List<ProjectTeam> projectTeams = projectTeamRepository.findAllByApplicationSemesterId(applicationSemester.getId());

        List<StudentProjectTeamPreference> studentProjectTeamPreferences = new ArrayList<>();
        preferences.forEach((projectTeamId, priorityScore) -> {
            final Optional<ProjectTeam> projectTeam = projectTeams.stream().filter(pt -> pt.getId().equals(projectTeamId)).findFirst();
            if (projectTeam.isPresent()) {
                final StudentProjectTeamPreference projectTeamPreference =
                        new StudentProjectTeamPreference(applicationSemester.getId(), student.get().getId(), projectTeamId, priorityScore);

                studentProjectTeamPreferences.add(studentProjectTeamPreferenceRepository.save(projectTeamPreference));
            }
        });

        return ResponseEntity.ok(studentProjectTeamPreferences);
    }

    @DeleteMapping
    public ResponseEntity deleteAllStudentProjectTeamPreferencesForApplicationSemester(
            @RequestParam(name = "applicationSemester") final String applicationSemesterName
    ) {
        final ApplicationSemester applicationSemester = applicationSemesterService.findBySemesterName(applicationSemesterName);

        studentProjectTeamPreferenceRepository.deleteAllByApplicationSemesterId(applicationSemester.getId());

        return ResponseEntity.ok().build();
    }
}
