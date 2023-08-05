package prompt.ls1.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.model.CourseIteration;
import prompt.ls1.model.IntroCourseParticipation;
import prompt.ls1.service.CourseIterationService;
import prompt.ls1.service.IntroCourseService;

import java.util.List;
import java.util.UUID;

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
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<List<IntroCourseParticipation>> getAllIntroCourseParticipations(
            @RequestParam(name = "courseIteration") @NotNull final String courseIterationName
    ) {
        final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);

        return ResponseEntity.ok(introCourseService.findAllByCourseIterationId(courseIteration.getId()));
    }

    @PatchMapping(path = "/{introCourseParticipationId}", consumes = "application/json-path+json")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<IntroCourseParticipation> updateIntroCourseParticipation(
            @PathVariable UUID introCourseParticipationId,
            @RequestBody JsonPatch introCourseParticipationPatch)
            throws JsonPatchException, JsonProcessingException {
        return ResponseEntity.ok(introCourseService.update(introCourseParticipationId, introCourseParticipationPatch));
    }
}
