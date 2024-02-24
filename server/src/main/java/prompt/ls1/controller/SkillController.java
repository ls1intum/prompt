package prompt.ls1.controller;

import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.model.Skill;
import prompt.ls1.service.SkillService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/skills")
public class SkillController {
    private final SkillService skillService;

    @Autowired
    public SkillController(final SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills(@RequestParam UUID courseIterationId) {
        return ResponseEntity.ok(skillService.getByCourseIterationId(courseIterationId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Skill> createSkill(@RequestBody @NotNull Skill skill) {
        return ResponseEntity.ok(skillService.create(skill));
    }

    @PostMapping(path = "/{skillId}")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<Skill> toggleSkill(@PathVariable UUID skillId) {
        return ResponseEntity.ok(skillService.toggle(skillId));
    }

    @DeleteMapping(path = "/{skillId}")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<UUID> deleteSkill(@PathVariable UUID skillId) {
        return ResponseEntity.ok(skillService.delete(skillId));
    }
}
