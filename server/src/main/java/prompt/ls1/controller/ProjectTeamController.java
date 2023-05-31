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
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.service.ApplicationSemesterService;
import prompt.ls1.service.ProjectTeamService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/project-teams")
public class ProjectTeamController {
    private final ApplicationSemesterService applicationSemesterService;
    private final ProjectTeamService projectTeamService;

    @Autowired
    public ProjectTeamController(ApplicationSemesterService applicationSemesterService,
                                 ProjectTeamService projectTeamService) {
        this.applicationSemesterService = applicationSemesterService;
        this.projectTeamService = projectTeamService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectTeam>> getProjectTeamsByApplicationSemester(
            @RequestParam(name = "applicationSemester") @NotNull String applicationSemesterName
    ) {
        final ApplicationSemester applicationSemester = applicationSemesterService.findBySemesterName(applicationSemesterName);

        return ResponseEntity.ok(projectTeamService.findAllByApplicationSemesterId(applicationSemester.getId()));
    }

    @PostMapping
    public ResponseEntity<ProjectTeam> createProjectTeam(@RequestBody @NotNull ProjectTeam projectTeam,
                                                         @RequestParam(name="applicationSemester") @NotNull String applicationSemesterName) {
        final ApplicationSemester applicationSemester = applicationSemesterService.findBySemesterName(applicationSemesterName);
        projectTeam.setApplicationSemester(applicationSemester);

        return ResponseEntity.ok(projectTeamService.create(projectTeam));
    }

    @PatchMapping(path = "/{projectTeamId}", consumes = "application/json-path+json")
    public ResponseEntity<ProjectTeam> updateProjectTeam(@PathVariable UUID projectTeamId, @RequestBody JsonPatch patchProjectTeam)
                        throws JsonPatchException, JsonProcessingException{
        return ResponseEntity.ok(projectTeamService.update(projectTeamId, patchProjectTeam));
    }

    @DeleteMapping(path = "/{projectTeamId}")
    public ResponseEntity<UUID> deleteProjectTeam(@PathVariable UUID projectTeamId) {
        return ResponseEntity.ok(projectTeamService.delete(projectTeamId));
    }

}
