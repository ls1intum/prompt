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
import prompt.ls1.model.ApplicationSemester;
import prompt.ls1.model.StudentApplication;
import prompt.ls1.model.StudentApplicationNote;
import prompt.ls1.service.ApplicationSemesterService;
import prompt.ls1.service.StudentApplicationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/student-applications")
public class StudentApplicationController {
    @Autowired
    private StudentApplicationService studentApplicationService;

    @Autowired
    private ApplicationSemesterService applicationSemesterService;

    @GetMapping
    public ResponseEntity<List<StudentApplication>> getAllStudentApplications(
            @RequestParam(name = "applicationSemester") @NotNull String applicationSemesterName
    ) {
        final ApplicationSemester applicationSemester = applicationSemesterService.findBySemesterName(applicationSemesterName);

        return ResponseEntity.ok(studentApplicationService.findAllByApplicationSemester(applicationSemester.getId()));
    }

    @PostMapping
    public ResponseEntity<StudentApplication> create(@RequestBody StudentApplication studentApplication,
                                     @RequestParam(name = "applicationSemester") String applicationSemesterName) {
        final ApplicationSemester applicationSemester = applicationSemesterService.findBySemesterName(applicationSemesterName);
        studentApplication.setApplicationSemester(applicationSemester);

        return ResponseEntity.ok(studentApplicationService.create(studentApplication));
    }

    @PatchMapping(path = "/{studentApplicationId}", consumes = "application/json-path+json")
    public ResponseEntity<StudentApplication> updateProjectTeam(@PathVariable UUID studentApplicationId, @RequestBody JsonPatch patchStudentApplication)
            throws JsonPatchException, JsonProcessingException {
        return ResponseEntity.ok(studentApplicationService.update(studentApplicationId, patchStudentApplication));
    }

    @PostMapping("/{studentApplicationId}/notes")
    public ResponseEntity<StudentApplication> createNote(@PathVariable UUID studentApplicationId,
                                     @RequestBody StudentApplicationNote studentApplicationNote) {
        return ResponseEntity.ok(studentApplicationService.createNote(studentApplicationId, studentApplicationNote));
    }

    @PostMapping(path = "/{studentApplicationId}/project-team/{projectTeamId}")
    public ResponseEntity<StudentApplication> assignStudentApplicationToProjectTeam(
            @RequestParam(name="applicationSemester") @NotNull String applicationSemesterName,
            @PathVariable UUID studentApplicationId,
            @PathVariable UUID projectTeamId
    ) {
        final ApplicationSemester applicationSemester = applicationSemesterService.findBySemesterName(applicationSemesterName);

        return ResponseEntity.ok(studentApplicationService.assignToProjectTeam(studentApplicationId, projectTeamId, applicationSemester.getId()));
    }

    @DeleteMapping(path = "/{studentApplicationId}/project-team")
    public ResponseEntity<StudentApplication> removeStudentApplicationFromProjectTeam(
            @RequestParam(name = "applicationSemester") @NotNull String applicationSemesterName,
            @PathVariable UUID studentApplicationId
    ) {
        final ApplicationSemester applicationSemester = applicationSemesterService.findBySemesterName(applicationSemesterName);

        return ResponseEntity.ok(studentApplicationService.removeFromProjectTeam(studentApplicationId, applicationSemester.getId()));
    }

}
