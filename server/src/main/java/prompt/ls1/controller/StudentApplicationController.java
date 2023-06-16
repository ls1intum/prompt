package prompt.ls1.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.model.CourseIteration;
import prompt.ls1.model.StudentApplication;
import prompt.ls1.model.InstructorComment;
import prompt.ls1.service.CourseIterationService;
import prompt.ls1.service.StudentApplicationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/student-applications")
public class StudentApplicationController {
    private final StudentApplicationService studentApplicationService;
    private final CourseIterationService courseIterationService;

    @Autowired
    public StudentApplicationController(StudentApplicationService studentApplicationService,
                                        CourseIterationService courseIterationService) {
        this.studentApplicationService = studentApplicationService;
        this.courseIterationService = courseIterationService;
    }

    @GetMapping
    public ResponseEntity<List<StudentApplication>> getAllStudentApplications(
            @RequestParam(name = "courseIteration") @NotNull String courseIterationName,
            @RequestParam(required = false, defaultValue = "false") boolean accepted
    ) {
        final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);

        return ResponseEntity.ok(studentApplicationService.findAllByCourseIteration(courseIteration.getId(), accepted));
    }

    @PostMapping
    public ResponseEntity<StudentApplication> create(@RequestBody StudentApplication studentApplication,
                                     @RequestParam(name = "courseIteration") String courseIterationName) {
        final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);
        studentApplication.setCourseIteration(courseIteration);

        return ResponseEntity.ok(studentApplicationService.create(studentApplication));
    }

    @PatchMapping(path = "/{studentApplicationId}", consumes = "application/json-path+json")
    public ResponseEntity<StudentApplication> updateProjectTeam(@PathVariable final UUID studentApplicationId,
                                                                @RequestBody JsonPatch patchStudentApplication)
            throws JsonPatchException, JsonProcessingException {
        return ResponseEntity.ok(studentApplicationService.update(studentApplicationId, patchStudentApplication));
    }

    @PatchMapping(path = "/{studentApplicationId}/assessment", consumes = "application/json-path+json")
    public ResponseEntity<StudentApplication> updateStudentApplicationAssessment(@PathVariable final UUID studentApplicationId,
                                                                                 @RequestBody JsonPatch patchStudentApplicationAssessment)
            throws JsonPatchException, JsonProcessingException {
        return ResponseEntity.ok(studentApplicationService.updateStudentApplicationAssessment(studentApplicationId, patchStudentApplicationAssessment));
    }

    @PostMapping("/{studentApplicationId}/instructor-comments")
    public ResponseEntity<StudentApplication> createNote(@PathVariable UUID studentApplicationId,
                                     @RequestBody InstructorComment instructorComment) {
        return ResponseEntity.ok(studentApplicationService.createInstructorComment(studentApplicationId, instructorComment));
    }

    @PostMapping(path = "/{studentApplicationId}/project-team/{projectTeamId}")
    public ResponseEntity<StudentApplication> assignStudentApplicationToProjectTeam(
            @RequestParam(name="courseIteration") @NotNull String courseIterationName,
            @PathVariable UUID studentApplicationId,
            @PathVariable UUID projectTeamId
    ) {
        final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);

        return ResponseEntity.ok(studentApplicationService.assignToProjectTeam(studentApplicationId, projectTeamId, courseIteration.getId()));
    }

    @DeleteMapping(path = "/{studentApplicationId}/project-team")
    public ResponseEntity<StudentApplication> removeStudentApplicationFromProjectTeam(
            @RequestParam(name = "courseIteration") @NotNull String courseIterationName,
            @PathVariable UUID studentApplicationId
    ) {
        final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);

        return ResponseEntity.ok(studentApplicationService.removeFromProjectTeam(studentApplicationId, courseIteration.getId()));
    }

}
