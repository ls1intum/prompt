package prompt.ls1.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
import prompt.ls1.model.DeveloperApplication;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.service.ApplicationService;
import prompt.ls1.service.CourseIterationService;
import prompt.ls1.service.ProjectTeamService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/project-teams")
public class ProjectTeamController {
    private final CourseIterationService courseIterationService;
    private final ProjectTeamService projectTeamService;
    private final ApplicationService applicationService;

    @Autowired
    public ProjectTeamController(final CourseIterationService courseIterationService,
                                 final ProjectTeamService projectTeamService,
                                 final ApplicationService applicationService) {
        this.courseIterationService = courseIterationService;
        this.projectTeamService = projectTeamService;
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectTeam>> getProjectTeamsByCourseIteration(
            @RequestParam(name = "courseIteration") @NotNull String courseIterationName
    ) {
        final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);

        return ResponseEntity.ok(projectTeamService.findAllByCourseIterationId(courseIteration.getId()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<ProjectTeam> createProjectTeam(@RequestBody @NotNull ProjectTeam projectTeam,
                                                         @RequestParam(name= "courseIteration") @NotNull String courseIterationName) {
        final CourseIteration courseIteration = courseIterationService.findBySemesterName(courseIterationName);
        projectTeam.setCourseIteration(courseIteration);

        return ResponseEntity.ok(projectTeamService.create(projectTeam));
    }

    @PatchMapping(path = "/{projectTeamId}", consumes = "application/json-path+json")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<ProjectTeam> updateProjectTeam(@PathVariable UUID projectTeamId, @RequestBody JsonPatch patchProjectTeam)
                        throws JsonPatchException, JsonProcessingException{
        return ResponseEntity.ok(projectTeamService.update(projectTeamId, patchProjectTeam));
    }

    @DeleteMapping(path = "/{projectTeamId}")
    @PreAuthorize("hasRole('ipraktikum-pm')")
    public ResponseEntity<UUID> deleteProjectTeam(@PathVariable UUID projectTeamId) {
        return ResponseEntity.ok(projectTeamService.delete(projectTeamId));
    }

    @GetMapping("/{projectTeamId}/developers")
    @PreAuthorize("hasRole('ipraktikum-pm')  || hasRole('ipraktikum-coach') || hasRole('ipraktikum-pl')")
    public ResponseEntity<List<DeveloperApplication>> getProjectTeamDevelopersManagedBy(
            @PathVariable final UUID projectTeamId,
            JwtAuthenticationToken token) {
        if (token.getAuthorities().stream().anyMatch(authority -> authority.getAuthority().equals("ROLE_ipraktikum-pm"))) {
            return ResponseEntity.ok(applicationService.findDeveloperApplicationsByProjectTeamId(projectTeamId, Optional.empty()));
        }
        return ResponseEntity.ok(applicationService.findDeveloperApplicationsByProjectTeamId(projectTeamId, Optional.of(token.getName())));
    }
}
