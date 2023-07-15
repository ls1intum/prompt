package prompt.ls1.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.mail.MessagingException;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.model.Application;
import prompt.ls1.model.CoachApplication;
import prompt.ls1.model.CourseIteration;
import prompt.ls1.model.DeveloperApplication;
import prompt.ls1.model.InstructorComment;
import prompt.ls1.model.TutorApplication;
import prompt.ls1.service.ApplicationService;
import prompt.ls1.service.CourseIterationService;
import prompt.ls1.service.MailingService;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/applications")
public class ApplicationController {
    private final Bucket bucket;
    private final ApplicationService applicationService;
    private final CourseIterationService courseIterationService;
    private final MailingService mailingService;

    @Autowired
    public ApplicationController(final ApplicationService applicationService,
                                 final CourseIterationService courseIterationService,
                                 final MailingService mailingService) {
        Bandwidth limit = Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1)));
        this.bucket = Bucket.builder()
                .addLimit(limit)
                .build();
        this.applicationService = applicationService;
        this.courseIterationService = courseIterationService;
        this.mailingService = mailingService;
    }

    @GetMapping("/developer")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<List<DeveloperApplication>> getAllDeveloperApplications(
            @RequestParam(name = "courseIteration") @NotNull String courseIterationName,
            @RequestParam(required = false, defaultValue = "false") boolean accepted
    ) {
        final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);

        return ResponseEntity.ok(applicationService.findAllDeveloperApplicationsByCourseIteration(courseIteration.getId(), accepted));
    }

    @GetMapping("/coach")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<List<CoachApplication>> getAllCoachApplications(
            @RequestParam(name = "courseIteration") @NotNull String courseIterationName,
            @RequestParam(required = false, defaultValue = "false") boolean accepted
    ) {
        final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);

        return ResponseEntity.ok(applicationService.findAllCoachApplicationsByCourseIteration(courseIteration.getId(), accepted));
    }

    @GetMapping("/tutor")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<List<TutorApplication>> getAllTutorApplications(
            @RequestParam(name = "courseIteration") @NotNull String courseIterationName,
            @RequestParam(required = false, defaultValue = "false") boolean accepted
    ) {
        final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);

        return ResponseEntity.ok(applicationService.findAllTutorApplicationsByCourseIteration(courseIteration.getId(), accepted));
    }

    @PostMapping("/developer")
    public ResponseEntity<DeveloperApplication> createDeveloperApplication(@RequestBody DeveloperApplication developerApplication,
                                              @RequestParam(name = "courseIteration") String courseIterationName) {
        if (bucket.tryConsume(1)) {
            final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);
            developerApplication.setCourseIteration(courseIteration);

            final DeveloperApplication application = applicationService.createDeveloperApplication(developerApplication);

            try {
                mailingService.sendDeveloperApplicationConfirmationEmail(application.getStudent(), application, courseIteration);
            } catch (MessagingException e) {
                log.error(String.format("Failed to send a confirmation email on POST /applications/developer. Error message: %s. Stacktrace: %s",
                        e.getMessage(), Arrays.toString(e.getStackTrace())));
            }

            return ResponseEntity.ok(application);
        }

        log.error("Post request on /applications/developer rejected due to exceeded request velocity.");
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }

    @PostMapping("/tutor")
    public ResponseEntity<Application> createTutorApplication(@RequestBody TutorApplication tutorApplication,
                                                                  @RequestParam(name = "courseIteration") String courseIterationName) {
        if (bucket.tryConsume(1)) {
            final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);
            tutorApplication.setCourseIteration(courseIteration);

            final TutorApplication application = applicationService.createTutorApplication(tutorApplication);

            try {
                mailingService.sendTutorApplicationConfirmationEmail(application.getStudent(), application, courseIteration);
            } catch (MessagingException e) {
                log.error(String.format("Failed to send a confirmation email on POST /applications/tutor. Error message: %s. Stacktrace: %s",
                        e.getMessage(), Arrays.toString(e.getStackTrace())));
            }

            return ResponseEntity.ok(application);
        }

        log.error("Post request on /applications/tutor rejected due to exceeded request velocity.");
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }

    @PostMapping("/coach")
    public ResponseEntity<Application> createCoachApplication(@RequestBody CoachApplication coachApplication,
                                                                  @RequestParam(name = "courseIteration") String courseIterationName) {
        if (bucket.tryConsume(1)) {
            final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);
            coachApplication.setCourseIteration(courseIteration);

            final CoachApplication application = applicationService.createCoachApplication(coachApplication);
            try {
                mailingService.sendCoachApplicationConfirmationEmail(application.getStudent(), application, courseIteration);
            } catch (MessagingException e) {
                log.error(String.format("Failed to send a confirmation email on POST /applications/developer. Error message: %s. Stacktrace: %s",
                        e.getMessage(), Arrays.toString(e.getStackTrace())));
            }

            return ResponseEntity.ok(application);
        }

        log.error("Post request on /applications/coach rejected due to exceeded request velocity.");
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }

    @PostMapping("/coach/{applicationId}/interview-invitations")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> sendCoachInterviewInvitation(@PathVariable UUID applicationId) {
        return ResponseEntity.ok(applicationService.sendCoachInterviewInvite(applicationId));
    }

    @PostMapping("/tutor/{applicationId}/interview-invitations")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> sendTutorInterviewInvitation(@PathVariable UUID applicationId) {
        return ResponseEntity.ok(applicationService.sendTutorInterviewInvite(applicationId));
    }

    @PostMapping("/coach/{applicationId}/acceptance")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> sendCoachApplicationAcceptance(@PathVariable UUID applicationId) {
        return ResponseEntity.ok(applicationService.sendCoachApplicationAcceptance(applicationId));
    }

    @PostMapping("/tutor/{applicationId}/acceptance")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> sendTutorApplicationAcceptance(@PathVariable UUID applicationId) {
        return ResponseEntity.ok(applicationService.sendTutorApplicationAcceptance(applicationId));
    }

    @PostMapping("/coach/{applicationId}/rejection")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> sendCoachApplicationRejection(@PathVariable UUID applicationId) {
        return ResponseEntity.ok(applicationService.sendCoachApplicationRejection(applicationId));
    }

    @PostMapping("/tutor/{applicationId}/rejection")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> sendTutorApplicationRejection(@PathVariable UUID applicationId) {
        return ResponseEntity.ok(applicationService.sendTutorApplicationRejection(applicationId));
    }

    @PatchMapping(path = "/developer/{developerApplicationId}", consumes = "application/json-path+json")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> updateProjectTeam(@PathVariable final UUID developerApplicationId,
                                                         @RequestBody JsonPatch patchStudentApplication)
            throws JsonPatchException, JsonProcessingException {
        return ResponseEntity.ok(applicationService.updateDeveloperApplication(developerApplicationId, patchStudentApplication));
    }

    @PatchMapping(path = "/developer/{developerApplicationId}/assessment", consumes = "application/json-path+json")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> updateDeveloperApplicationAssessment(@PathVariable final UUID developerApplicationId,
                                                                          @RequestBody JsonPatch patchStudentApplicationAssessment)
            throws JsonPatchException, JsonProcessingException {
        return ResponseEntity.ok(applicationService.updateDeveloperApplicationAssessment(developerApplicationId, patchStudentApplicationAssessment));
    }

    @PatchMapping(path = "/coach/{coachApplicationId}/assessment", consumes = "application/json-path+json")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> updateCoachApplicationAssessment(@PathVariable final UUID coachApplicationId,
                                                                            @RequestBody JsonPatch patchStudentApplicationAssessment) throws JsonPatchException, JsonProcessingException {
        return ResponseEntity.ok(applicationService.updateCoachApplicationAssessment(coachApplicationId, patchStudentApplicationAssessment));
    }

    @PatchMapping(path = "/tutor/{tutorApplicationId}/assessment", consumes = "application/json-path+json")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> updateTutorApplicationAssessment(@PathVariable final UUID tutorApplicationId,
                                                                            @RequestBody JsonPatch patchStudentApplicationAssessment)
            throws JsonPatchException, JsonProcessingException {
        return ResponseEntity.ok(applicationService.updateTutorApplicationAssessment(tutorApplicationId, patchStudentApplicationAssessment));
    }

    @PostMapping("/developer/{applicationId}/instructor-comments")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> createInstructorCommentForDeveloperApplication(@PathVariable UUID applicationId,
                                                  @RequestBody InstructorComment instructorComment) {
        return ResponseEntity.ok(applicationService.createInstructorCommentForDeveloperApplication(applicationId, instructorComment));
    }

    @PostMapping("/coach/{applicationId}/instructor-comments")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> createInstructorCommentForCoachApplication(@PathVariable UUID applicationId,
                                                               @RequestBody InstructorComment instructorComment) {
        return ResponseEntity.ok(applicationService.createInstructorCommentForCoachApplication(applicationId, instructorComment));
    }

    @PostMapping("/tutor/{applicationId}/instructor-comments")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> createInstructorCommentForTutorApplication(@PathVariable UUID applicationId,
                                                               @RequestBody InstructorComment instructorComment) {
        return ResponseEntity.ok(applicationService.createInstructorCommentForTutorApplication(applicationId, instructorComment));
    }

    @PostMapping(path = "/developer/{developerApplicationId}/project-team/{projectTeamId}")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> assignStudentApplicationToProjectTeam(
            @RequestParam(name="courseIteration") @NotNull String courseIterationName,
            @PathVariable UUID developerApplicationId,
            @PathVariable UUID projectTeamId
    ) {
        final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);

        return ResponseEntity.ok(applicationService.assignDeveloperApplicationToProjectTeam(developerApplicationId, projectTeamId, courseIteration.getId()));
    }

    @DeleteMapping(path = "/developer/{developerApplicationId}/project-team")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Application> removeStudentApplicationFromProjectTeam(
            @RequestParam(name = "courseIteration") @NotNull String courseIterationName,
            @PathVariable UUID developerApplicationId
    ) {
        final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);

        return ResponseEntity.ok(applicationService.removeFromProjectTeam(developerApplicationId, courseIteration.getId()));
    }

    @DeleteMapping("/developer/{developerApplicationId}")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<UUID> deleteDeveloperApplication(@PathVariable final UUID developerApplicationId) {
        return ResponseEntity.ok(applicationService.deleteDeveloperApplication(developerApplicationId));
    }

    @DeleteMapping("/coach/{coachApplicationId}")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<UUID> deleteCoachApplication(@PathVariable final UUID coachApplicationId) {
        return ResponseEntity.ok(applicationService.deleteCoachApplication(coachApplicationId));
    }

    @DeleteMapping("/tutor/{tutorApplicationId}")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<UUID> deleteTutorApplication(@PathVariable final UUID tutorApplicationId) {
        return ResponseEntity.ok(applicationService.deleteTutorApplication(tutorApplicationId));
    }

}
