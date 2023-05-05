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

    @Autowired
    private ProjectTeamRepository projectTeamRepository;

    public ProjectTeam create(final ProjectTeam projectTeam) {
        Optional<ProjectTeam> existingProjectTeam = projectTeamRepository.findFirstByName(projectTeam.getName());
        if (existingProjectTeam.isPresent()) {
            throw new ResourceConflictException(String.format("Project team with name %s already exists.", projectTeam.getName()));
        }

        return projectTeamRepository.save(projectTeam);
    }

    public ProjectTeam update(UUID projectTeamId, JsonPatch patchProjectTeam) throws JsonPatchException, JsonProcessingException {
        Optional<ProjectTeam> existingProjectTeam = projectTeamRepository.findById(projectTeamId);
        if (existingProjectTeam.isEmpty()) {
            throw new ResourceNotFoundException(String.format("Project team with id %s not found.", projectTeamId));
        }

        ProjectTeam pathcedProjectTeam = applyPatchToProjectTeam(patchProjectTeam, existingProjectTeam.get());
        return projectTeamRepository.save(pathcedProjectTeam);
    }

    public UUID delete(final UUID projectTeamId) {
        Optional<ProjectTeam> existingProjectTeam = projectTeamRepository.findById(projectTeamId);
        if (existingProjectTeam.isEmpty()) {
            throw new ResourceNotFoundException(String.format("Project team with id %s not found.", projectTeamId));
        }

        projectTeamRepository.delete(existingProjectTeam.get());
        return existingProjectTeam.get().getId();
    }

    public List<ProjectTeam> findAllByApplicationSemesterId(final UUID applicationSemesterId) {
        return projectTeamRepository.findAllByApplicationSemesterId(applicationSemesterId);
    }

    private ProjectTeam applyPatchToProjectTeam(
            JsonPatch patch, ProjectTeam targetProjectTeam) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(targetProjectTeam, JsonNode.class));
        return objectMapper.treeToValue(patched, ProjectTeam.class);
    }
}
