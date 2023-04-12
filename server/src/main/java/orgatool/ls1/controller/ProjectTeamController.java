package orgatool.ls1.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import orgatool.ls1.model.ApplicationSemester;
import orgatool.ls1.model.ProjectTeam;
import orgatool.ls1.repository.ApplicationSemesterRepository;
import orgatool.ls1.repository.ProjectTeamRepository;
import orgatool.ls1.repository.StudentApplicationRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/project-teams")
public class ProjectTeamController {
    @Autowired
    private ProjectTeamRepository projectTeamRepository;
    @Autowired
    private ApplicationSemesterRepository applicationSemesterRepository;
    @Autowired
    private StudentApplicationRepository studentApplicationRepository;

    @GetMapping
    public ResponseEntity<List<ProjectTeam>> getProjectTeamsByApplicationSemester(@RequestParam(name = "applicationSemester") @NotNull String applicationSemesterName) {
        Optional<ApplicationSemester> applicationSemester = applicationSemesterRepository.findBySemesterName(applicationSemesterName);
        if (applicationSemester.isEmpty()) {
            return new ResponseEntity(String.format("Application semester %s not found.", applicationSemesterName), HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(projectTeamRepository.findAllByApplicationSemesterId(applicationSemester.get().getId()));
    }

    @PostMapping
    public ResponseEntity<ProjectTeam> createProjectTeam(@RequestBody @NotNull ProjectTeam projectTeam, @RequestParam(name="applicationSemester") @NotNull String applicationSemesterName) {
        Optional<ApplicationSemester> applicationSemester = applicationSemesterRepository.findBySemesterName(applicationSemesterName);
        if (applicationSemester.isEmpty()) {
            return new ResponseEntity(String.format("Application semester %s not found.", applicationSemesterName), HttpStatus.NOT_FOUND);
        }

        projectTeam.setApplicationSemester(applicationSemester.get());
        return ResponseEntity.ok(projectTeamRepository.save(projectTeam));
    }

    @PatchMapping(path = "/{id}", consumes = "application/json-path+json")
    public ResponseEntity<ProjectTeam> updateProjectTeam(@PathVariable Long id, @RequestBody JsonPatch patchProjectTeam) {
        try {
            Optional<ProjectTeam> existingProjectTeam = projectTeamRepository.findById(id);
            if (existingProjectTeam.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            ProjectTeam pathcedProjectTeam = applyPatchToProjectTeam(patchProjectTeam, existingProjectTeam.get());
            return ResponseEntity.ok(projectTeamRepository.save(pathcedProjectTeam));
        } catch (JsonPatchException | JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private ProjectTeam applyPatchToProjectTeam(
            JsonPatch patch, ProjectTeam targetProjectTeam) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(targetProjectTeam, JsonNode.class));
        return objectMapper.treeToValue(patched, ProjectTeam.class);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Long> deleteProjectTeam(@PathVariable Long id) {
        Optional<ProjectTeam> existingProjectTeam = projectTeamRepository.findById(id);
        if (existingProjectTeam.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        projectTeamRepository.delete(existingProjectTeam.get());
        return ResponseEntity.ok(existingProjectTeam.get().getId());
    }

}
