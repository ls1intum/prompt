package prompt.ls1.controller;

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
import prompt.ls1.model.CoursePhase;
import prompt.ls1.model.CoursePhaseCheck;
import prompt.ls1.service.CoursePhaseService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/course-phases")
@PreAuthorize("hasRole('ipraktikum-pm')")
public class CoursePhaseController {
    private final CoursePhaseService coursePhaseService;

    @Autowired
    public CoursePhaseController(final CoursePhaseService coursePhaseService) {
        this.coursePhaseService = coursePhaseService;
    }

    @GetMapping
    public ResponseEntity<List<CoursePhase>> getAllCoursePhases() {
        return ResponseEntity.ok(coursePhaseService.findAll());
    }

    @PostMapping
    public ResponseEntity<CoursePhase> createCoursePhase(@RequestBody final CoursePhase coursePhase) {
        return ResponseEntity.ok(coursePhaseService.create(coursePhase));
    }

    @PostMapping("/{coursePhaseId}/course-phase-checks")
    public ResponseEntity<CoursePhase> createCoursePhaseCheck(@PathVariable final UUID coursePhaseId,
                                                              @RequestBody final CoursePhaseCheck coursePhaseCheck) {
        return ResponseEntity.ok(coursePhaseService.createCoursePhaseCheck(coursePhaseId, coursePhaseCheck));
    }

    @PatchMapping("/{coursePhaseId}/course-phase-checks")
    public ResponseEntity<CoursePhase> updateCoursePhaseCheckOrdering(@PathVariable final UUID coursePhaseId,
                                                                      @RequestBody final List<CoursePhaseCheck> coursePhaseChecks) {
        return ResponseEntity.ok(coursePhaseService.updateCoursePhaseCheckOrdering(coursePhaseId, coursePhaseChecks));
    }

    @DeleteMapping("/{coursePhaseId}/course-phase-checks/{coursePhaseCheckId}")
    public ResponseEntity<CoursePhase> deleteCoursePhaseCheck(@PathVariable final UUID coursePhaseId,
                                                              @PathVariable final UUID coursePhaseCheckId) {
        return ResponseEntity.ok(coursePhaseService.deleteCoursePhaseCheck(coursePhaseId, coursePhaseCheckId));
    }

    @DeleteMapping("/{coursePhaseId}")
    public ResponseEntity<UUID> deleteCoursePhase(@PathVariable final UUID coursePhaseId) {
        return ResponseEntity.ok(coursePhaseService.deleteById(coursePhaseId));
    }
}
