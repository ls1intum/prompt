package prompt.ls1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.integration.tease.model.Allocation;
import prompt.ls1.integration.tease.model.Skill;
import prompt.ls1.integration.tease.model.Student;
import prompt.ls1.integration.tease.service.TeaseIntegrationService;

import java.util.List;

@RestController
@RequestMapping("/v1")
public class TeaseIntegrationController {
    private final TeaseIntegrationService teaseIntegrationService;

    @Autowired
    public TeaseIntegrationController(final TeaseIntegrationService teaseIntegrationService) {
        this.teaseIntegrationService = teaseIntegrationService;
    }

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getStudents() {
        return ResponseEntity.ok(teaseIntegrationService.getStudents());
    }

    @GetMapping("/skills")
    public ResponseEntity<List<Skill>> getSkills() {
        return ResponseEntity.ok(teaseIntegrationService.getSkills());
    }

    @PostMapping("/allocation")
    public ResponseEntity<String> createAllocation(@RequestBody final List<Allocation> allocations) {
        teaseIntegrationService.saveAllocations(allocations);
        return ResponseEntity.ok().build();
    }
}
