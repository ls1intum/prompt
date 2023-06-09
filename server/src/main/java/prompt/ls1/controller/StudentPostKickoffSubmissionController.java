package prompt.ls1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.model.StudentPostKickoffSubmission;
import prompt.ls1.service.StudentPostKickoffSubmissionService;

import java.util.List;

@RestController
@RequestMapping("/post-kickoff-submissions")
public class StudentPostKickoffSubmissionController {
    private final StudentPostKickoffSubmissionService studentPostKickoffSubmissionService;

    @Autowired
    public StudentPostKickoffSubmissionController(StudentPostKickoffSubmissionService studentPostKickoffSubmissionService) {
        this.studentPostKickoffSubmissionService = studentPostKickoffSubmissionService;
    }

    @GetMapping
    public ResponseEntity<List<StudentPostKickoffSubmission>> getProjectTeamPreferencesSubmissions(
            @RequestParam(name = "applicationSemester") final String applicationSemesterName
    ) {
        return ResponseEntity.ok(studentPostKickoffSubmissionService.getByApplicationSemester(applicationSemesterName));
    }

    @PostMapping("/{studentPublicId}")
    public ResponseEntity<StudentPostKickoffSubmission> createStudentPostKickoffsSubmissionForStudent(
            @PathVariable final String studentPublicId,
            @RequestParam final String studentMatriculationNumber,
            @RequestBody final StudentPostKickoffSubmission studentPostKickOffSubmission
    ) {
        return ResponseEntity.ok(studentPostKickoffSubmissionService.create(
                studentPublicId,
                studentMatriculationNumber,
                studentPostKickOffSubmission));
    }

    @DeleteMapping("/project-team-preferences")
    public ResponseEntity<List<StudentPostKickoffSubmission>> deleteAllStudentProjectTeamPreferencesForApplicationSemester(
            @RequestParam(name = "applicationSemester") final String applicationSemesterName
    ) {
        return ResponseEntity.ok(studentPostKickoffSubmissionService.deleteByApplicationSemester(applicationSemesterName));
    }
}
