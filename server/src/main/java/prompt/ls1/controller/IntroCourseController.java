package prompt.ls1.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
import prompt.ls1.controller.payload.Seat;
import prompt.ls1.controller.payload.SeatPlanAssignment;
import prompt.ls1.controller.payload.StudentTechnicalDetails;
import prompt.ls1.model.CourseIteration;
import prompt.ls1.model.IntroCourseAbsence;
import prompt.ls1.model.IntroCourseParticipation;
import prompt.ls1.model.Student;
import prompt.ls1.service.CourseIterationService;
import prompt.ls1.service.IntroCourseService;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/intro-course")
public class IntroCourseController {
    private final IntroCourseService introCourseService;
    private final CourseIterationService courseIterationService;

    @Autowired
    public IntroCourseController(final IntroCourseService introCourseService,
                                 final CourseIterationService courseIterationService) {
        this.introCourseService = introCourseService;
        this.courseIterationService = courseIterationService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ipraktikum-pm') || hasRole('ipraktikum-tutor')")
    public ResponseEntity<List<IntroCourseParticipation>> getAllIntroCourseParticipations(
            @RequestParam(name = "courseIteration") @NotNull final String courseIterationName
    ) {
        final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);

        return ResponseEntity.ok(introCourseService.findAllByCourseIterationId(courseIteration.getId()));
    }

    @GetMapping("/tutors")
    @PreAuthorize("hasRole('ipraktikum-pm') || hasRole('ipraktikum-tutor')")
    public ResponseEntity<List<Student>> getAllIntroCourseTutors(
            @RequestParam(name = "courseIteration") @NotNull final String courseIterationName
    ) {
        return ResponseEntity.ok(introCourseService.findAllIntroCourseTutors(courseIterationName));
    }

    @PatchMapping(path = "/{introCourseParticipationId}", consumes = "application/json-path+json")
    @PreAuthorize("hasRole('ipraktikum-pm') || hasRole('ipraktikum-tutor')")
    public ResponseEntity<IntroCourseParticipation> updateIntroCourseParticipation(
            @PathVariable UUID introCourseParticipationId,
            @RequestBody JsonPatch introCourseParticipationPatch)
            throws JsonPatchException, JsonProcessingException {
        return ResponseEntity.ok(introCourseService.update(introCourseParticipationId, introCourseParticipationPatch));
    }

    @PostMapping("/seat-plan-assignments")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<List<IntroCourseParticipation>> createSeatPlanAssignments(
            @RequestBody @NotNull final List<SeatPlanAssignment> seatPlanAssignments) {
        return ResponseEntity.ok(introCourseService.createSeatPlanAssignments(seatPlanAssignments));
    }

    @PostMapping("/{courseIterationId}/seat-plan")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<List<IntroCourseParticipation>> createSeatPlan(
            @PathVariable final UUID courseIterationId,
            @RequestBody @NotNull final List<Seat> seatPlan) {
        return ResponseEntity.ok(introCourseService.createSeatPlan(courseIterationId, seatPlan));
    }

    @PostMapping("/{introCourseParticipationId}/absences")
    @PreAuthorize("hasRole('ipraktikum-pm') || hasRole('ipraktikum-tutor')")
    public ResponseEntity<IntroCourseParticipation> createIntroCourseAbsence(
            @PathVariable final UUID introCourseParticipationId,
            @RequestBody @NotNull final IntroCourseAbsence introCourseAbsence) {
        return ResponseEntity.ok(introCourseService.createIntroCourseAbsence(introCourseParticipationId, introCourseAbsence));
    }

    @PostMapping("/{semesterName}/verify-student/{studentPublicId}")
    public ResponseEntity<UUID> verifyStudentFormAccess(@PathVariable final String semesterName,
                                                        @PathVariable final String studentPublicId,
                                                        @RequestBody final String studentMatriculationNumber) {
        return ResponseEntity.ok(introCourseService.verifyStudentFormAccess(semesterName, studentPublicId, studentMatriculationNumber));
    }

    @PostMapping("/{introCourseParticipationId}/not-passed")
    @PreAuthorize("hasRole('ipraktikum-pm') || hasRole('ipraktikum-tutor')")
    public ResponseEntity<IntroCourseParticipation> markAsNotPassed(@PathVariable final UUID introCourseParticipationId) {
       return ResponseEntity.ok(introCourseService.markAsNotPassed(introCourseParticipationId));
    }

    @PostMapping("/{introCourseParticipationId}/passed")
    public ResponseEntity<IntroCourseParticipation> markAsPassed(@PathVariable final UUID introCourseParticipationId) {
        return ResponseEntity.ok(introCourseService.markAsPassed(introCourseParticipationId));
    }

    @PostMapping("/{semesterName}/technical-details/{studentId}")
    public ResponseEntity<IntroCourseParticipation> saveStudentTechnicalDetails(
            @PathVariable final String semesterName,
            @PathVariable final UUID studentId,
            @RequestBody @NotNull final StudentTechnicalDetails studentTechnicalDetails) {
        return ResponseEntity.ok(introCourseService.saveStudentTechnicalDetails(semesterName, studentId, studentTechnicalDetails));
    }

    @PostMapping("/{courseIterationId}/technical-details-invitation")
    public ResponseEntity<String> sendInvitationForStudentTechnicalDetailsSubmission(
            @PathVariable final UUID courseIterationId) {
        introCourseService.sendInvitationsForStudentTechnicalDetailsSubmission(courseIterationId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{introCourseParticipationId}/absences/{introCourseAbsenceId}")
    @PreAuthorize("hasRole('ipraktikum-pm') || hasRole('ipraktikum-tutor')")
    public ResponseEntity<IntroCourseParticipation> deleteIntroCourseAbsence(
            @PathVariable final UUID introCourseParticipationId,
            @PathVariable final UUID introCourseAbsenceId) {
        return ResponseEntity.ok(introCourseService.deleteIntroCourseAbsence(introCourseParticipationId, introCourseAbsenceId));
    }
}
