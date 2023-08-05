package prompt.ls1.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.IntroCourseParticipation;
import prompt.ls1.repository.IntroCourseParticipationRepository;

import java.util.List;
import java.util.UUID;

@Service
public class IntroCourseService {
    private final IntroCourseParticipationRepository introCourseParticipationRepository;

    @Autowired
    public IntroCourseService(final IntroCourseParticipationRepository introCourseParticipationRepository) {
        this.introCourseParticipationRepository = introCourseParticipationRepository;
    }

    public List<IntroCourseParticipation> findAllByCourseIterationId(final UUID courseIterationId) {
        return introCourseParticipationRepository.findAllByCourseIterationId(courseIterationId);
    }

    public IntroCourseParticipation update(UUID introCourseParticipationId, JsonPatch introCourseParticipationPatch)
            throws JsonPatchException, JsonProcessingException {
        final IntroCourseParticipation existingIntroCourseParticipation = findById(introCourseParticipationId);

        final IntroCourseParticipation patchedIntroCourseParticipation = applyPatch(introCourseParticipationPatch, existingIntroCourseParticipation);
        return introCourseParticipationRepository.save(patchedIntroCourseParticipation);
    }

    private IntroCourseParticipation findById(final UUID introCourseParticipationId) {
        return introCourseParticipationRepository.findById(introCourseParticipationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Intro course participation with id %s not found.", introCourseParticipationId)));
    }

    private IntroCourseParticipation applyPatch(
            JsonPatch patch, IntroCourseParticipation targetIntroCourseParticipation) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(targetIntroCourseParticipation, JsonNode.class));
        return objectMapper.treeToValue(patched, IntroCourseParticipation.class);
    }
}
