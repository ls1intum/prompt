package prompt.ls1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.integration.tease.model.Allocation;
import prompt.ls1.integration.tease.model.Project;
import prompt.ls1.integration.tease.model.Skill;
import prompt.ls1.integration.tease.model.Student;
import prompt.ls1.integration.tease.service.TeaseIntegrationService;

import java.util.List;
import java.util.UUID;

// https://github.com/ls1intum/team-allocator/blob/develop/docs/openapi_spec.yaml
@RestController
@RequestMapping("/tease")
@PreAuthorize("hasRole('ipraktikum-pm')")
public class TeaseIntegrationController {
    private final TeaseIntegrationService teaseIntegrationService;

    @Autowired
    public TeaseIntegrationController(final TeaseIntegrationService teaseIntegrationService) {
        this.teaseIntegrationService = teaseIntegrationService;
    }

    @GetMapping("/course-iterations/{courseIterationId}/projects")
    public ResponseEntity<List<Project>> getProjects(@PathVariable final UUID courseIterationId) {
        return ResponseEntity.ok(teaseIntegrationService.getProjects(courseIterationId));
    }

    @GetMapping("/course-iterations/{courseIterationId}/students")
    public ResponseEntity<List<Student>> getStudents(@PathVariable final UUID courseIterationId) {
        return ResponseEntity.ok(teaseIntegrationService.getStudents(courseIterationId));
    }

    @GetMapping("/course-iterations/{courseIterationId}/skills")
    public ResponseEntity<List<Skill>> getSkills(@PathVariable final UUID courseIterationId) {
        return ResponseEntity.ok(teaseIntegrationService.getSkills(courseIterationId));
    }

    @GetMapping("/course-iterations/{courseIterationId}/allocations")
    public ResponseEntity<List<Allocation>> getAllocations(@PathVariable final UUID courseIterationId) {
        return ResponseEntity.ok(teaseIntegrationService.getAllocations(courseIterationId));
    }

    @PostMapping("/course-iterations/{courseIterationId}/allocations")
    public ResponseEntity<String> createAllocation(@PathVariable final UUID courseIterationId,
                                                   @RequestBody final List<Allocation> allocations) {
        teaseIntegrationService.saveAllocations(courseIterationId, allocations);
        return ResponseEntity.ok().build();
    }
}
