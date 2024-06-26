package prompt.ls1.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
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
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.model.CourseIteration;
import prompt.ls1.service.CourseIterationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/course-iterations")
public class CourseIterationController {
    private final CourseIterationService courseIterationService;

    @Autowired
    public CourseIterationController(CourseIterationService courseIterationService) {
        this.courseIterationService = courseIterationService;
    }

    @GetMapping
    public ResponseEntity<List<CourseIteration>> getAllCourseIterations() {
        return ResponseEntity.ok(courseIterationService.findAll());
    }

    @GetMapping ("/open/developer")
    public ResponseEntity<CourseIteration> getCourseIterationWithOpenDeveloperApplicationPhase() {
        return ResponseEntity.ok(courseIterationService.findWithOpenDeveloperApplicationPeriod());
    }

    @GetMapping ("/open/coach")
    public ResponseEntity<CourseIteration> getCourseIterationWithOpenCoachApplicationPhase() {
        return ResponseEntity.ok(courseIterationService.findWithOpenCoachApplicationPeriod());
    }

    @GetMapping ("/open/tutor")
    public ResponseEntity<CourseIteration> getCourseIterationWithOpenTutorApplicationPhase() {
        return ResponseEntity.ok(courseIterationService.findWithOpenTutorApplicationPeriod());
    }

    @GetMapping ("/open/kick-off")
    public ResponseEntity<CourseIteration> getCourseIterationWithOpenKickOffPhase() {
        return ResponseEntity.ok(courseIterationService.findWithOpenKickOffPeriod());
    }

    @PostMapping
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<CourseIteration> createCourseIteration(@RequestBody CourseIteration courseIteration) {
        return ResponseEntity.ok(courseIterationService.create(courseIteration));
    }

    @PatchMapping(path = "/{courseIterationId}", consumes = "application/json-path+json")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<CourseIteration> updateCourseIteration(@PathVariable UUID courseIterationId,
                                                                     @RequestBody JsonPatch patchCourseIteration)
            throws JsonPatchException, JsonProcessingException{
        return ResponseEntity.ok(courseIterationService.update(courseIterationId, patchCourseIteration));
    }

    @PostMapping("/{courseIterationId}/course-iteration-phase-check-entries/{courseIterationPhaseCheckEntryId}")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<CourseIteration> toggleCourseIterationPhaseCheckEntry(@PathVariable final UUID courseIterationId,
                                                                                @PathVariable final UUID courseIterationPhaseCheckEntryId) {
        return ResponseEntity.ok(courseIterationService.toggleCourseIterationPhaseCheckEntry(courseIterationId, courseIterationPhaseCheckEntryId));
    }

    @DeleteMapping("/{courseIterationId}")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<UUID> deleteCourseIteration(@PathVariable UUID courseIterationId) {
        return ResponseEntity.ok(courseIterationService.deleteById(courseIterationId));
    }
}
