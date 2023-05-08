package prompt.ls1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.model.StudentProjectTeamPreferencesSubmission;
import prompt.ls1.service.StudentProjectTeamPreferencesSubmissionService;

import java.util.List;

@RestController
@RequestMapping("/project-team-preferences")
public class StudentProjectTeamPreferenceController {
    private final StudentProjectTeamPreferencesSubmissionService studentProjectTeamPreferencesSubmissionService;

    @Autowired
    public StudentProjectTeamPreferenceController(StudentProjectTeamPreferencesSubmissionService studentProjectTeamPreferencesSubmissionService) {
        this.studentProjectTeamPreferencesSubmissionService = studentProjectTeamPreferencesSubmissionService;
    }

    @GetMapping
    public ResponseEntity<List<StudentProjectTeamPreferencesSubmission>> getProjectTeamPreferencesSubmissions(
            @RequestParam(name = "applicationSemester") final String applicationSemesterName
    ) {
        return ResponseEntity.ok(studentProjectTeamPreferencesSubmissionService.getByApplicationSemester(applicationSemesterName));
    }

    @PostMapping
    public ResponseEntity<StudentProjectTeamPreferencesSubmission> createStudentProjectTeamPreferencesSubmissionForStudent(
            @RequestBody final StudentProjectTeamPreferencesSubmission studentProjectTeamPreferencesSubmission
    ) {
        return ResponseEntity.ok(studentProjectTeamPreferencesSubmissionService.create(studentProjectTeamPreferencesSubmission));
    }

    @DeleteMapping
    public ResponseEntity<String> deleteAllStudentProjectTeamPreferencesForApplicationSemester(
            @RequestParam(name = "applicationSemester") final String applicationSemesterName
    ) {
        studentProjectTeamPreferencesSubmissionService.deleteByApplicationSemester(applicationSemesterName);
        return ResponseEntity.ok().build();
    }
}
