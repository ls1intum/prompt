package prompt.ls1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
public class KickoffSubmissionController {
    private final StudentPostKickoffSubmissionService studentPostKickoffSubmissionService;

    @Autowired
    public KickoffSubmissionController(StudentPostKickoffSubmissionService studentPostKickoffSubmissionService) {
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

    @PostMapping
    public ResponseEntity<StudentPostKickoffSubmission> createPostKickoffsSubmission(
            @RequestBody final StudentPostKickoffSubmission studentPostKickOffSubmission,
            JwtAuthenticationToken token
    ) {
        return ResponseEntity.ok(studentPostKickoffSubmissionService.create(token.getName(), studentPostKickOffSubmission));
    }

    @DeleteMapping("/project-team-preferences")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<List<StudentPostKickoffSubmission>> deleteAllStudentProjectTeamPreferencesForCourseIteration(
            @RequestParam(name = "courseIteration") final String courseIterationName
    ) {
        return ResponseEntity.ok(studentPostKickoffSubmissionService.deleteByCourseIteration(courseIterationName));
    }
}
