package prompt.ls1.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceConflictException;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.repository.ProjectTeamRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectTeamService {
    private final ProjectTeamRepository projectTeamRepository;

    @Autowired
    public ProjectTeamService(ProjectTeamRepository projectTeamRepository) {
        this.projectTeamRepository = projectTeamRepository;
    }

    public ProjectTeam create(final ProjectTeam projectTeam) {
        Optional<ProjectTeam> existingProjectTeam = projectTeamRepository.findFirstByName(projectTeam.getName());
        if (existingProjectTeam.isPresent()) {
            throw new ResourceConflictException(String.format("Project team with name %s already exists.", projectTeam.getName()));
        }

        return projectTeamRepository.save(projectTeam);
    }

    public ProjectTeam update(UUID projectTeamId, JsonPatch patchProjectTeam) throws JsonPatchException, JsonProcessingException {
        ProjectTeam existingProjectTeam = findById(projectTeamId);

        ProjectTeam patchedProjectTeam = applyPatchToProjectTeam(patchProjectTeam, existingProjectTeam);
        return projectTeamRepository.save(patchedProjectTeam);
    }

    public UUID delete(final UUID projectTeamId) {
        ProjectTeam existingProjectTeam = findById(projectTeamId);

        projectTeamRepository.delete(existingProjectTeam);
        return existingProjectTeam.getId();
    }

    public List<ProjectTeam> findAllByCourseIterationId(final UUID courseIterationId) {
        return projectTeamRepository.findAllByCourseIterationId(courseIterationId);
    }

    public ProjectTeam findById(final UUID projectTeamId) {
        return projectTeamRepository.findById(projectTeamId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Project team with id %s not found.", projectTeamId)));
    }

    public ProjectTeam findByName(final String projectTeamName) {
        return projectTeamRepository.findByName(projectTeamName)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Project team with name %s not found.", projectTeamName)));
    }

    private ProjectTeam applyPatchToProjectTeam(
            JsonPatch patch, ProjectTeam targetProjectTeam) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(targetProjectTeam, JsonNode.class));
        return objectMapper.treeToValue(patched, ProjectTeam.class);
    }
}
