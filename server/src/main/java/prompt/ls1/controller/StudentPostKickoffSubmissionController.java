package prompt.ls1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import java.util.UUID;

@RestController
@RequestMapping("/post-kickoff-submissions")
public class StudentPostKickoffSubmissionController {
    private final StudentPostKickoffSubmissionService studentPostKickoffSubmissionService;

    @Autowired
    public StudentPostKickoffSubmissionController(StudentPostKickoffSubmissionService studentPostKickoffSubmissionService) {
        this.studentPostKickoffSubmissionService = studentPostKickoffSubmissionService;
    }

    @PostMapping("/invitations")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<String> sendKickoffSubmissionInvitations(
            @RequestParam(name = "courseIteration") final String courseIterationName
    ) {
        studentPostKickoffSubmissionService.inviteStudentsToKickoffSubmission(courseIterationName);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<List<StudentPostKickoffSubmission>> getProjectTeamPreferencesSubmissions(
            @RequestParam(name = "courseIteration") final String courseIterationName
    ) {
        return ResponseEntity.ok(studentPostKickoffSubmissionService.getByCourseIteration(courseIterationName));
    }

    @PostMapping("/verify-student/{studentPublicId}")
    public ResponseEntity<UUID> verifyStudentFormAccess(@PathVariable final String studentPublicId,
                                                        @RequestBody final String studentMatriculationNumber) {
        return ResponseEntity.ok(studentPostKickoffSubmissionService.verifyStudentFormAccess(studentPublicId, studentMatriculationNumber));
    }

    @PostMapping("/{studentId}")
    public ResponseEntity<StudentPostKickoffSubmission> createStudentPostKickoffsSubmissionForStudent(
            @PathVariable final String studentId,
            @RequestBody final StudentPostKickoffSubmission studentPostKickOffSubmission
    ) {
        return ResponseEntity.ok(studentPostKickoffSubmissionService.create(
                studentId,
                studentPostKickOffSubmission));
    }

    @DeleteMapping("/project-team-preferences")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<List<StudentPostKickoffSubmission>> deleteAllStudentProjectTeamPreferencesForCourseIteration(
            @RequestParam(name = "courseIteration") final String courseIterationName
    ) {
        return ResponseEntity.ok(studentPostKickoffSubmissionService.deleteByCourseIteration(courseIterationName));
    }
}
