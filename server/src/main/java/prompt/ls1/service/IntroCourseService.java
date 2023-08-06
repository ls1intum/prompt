package prompt.ls1.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.controller.payload.Seat;
import prompt.ls1.controller.payload.SeatPlanAssignment;
import prompt.ls1.exception.ResourceInvalidParametersException;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.IntroCourseParticipation;
import prompt.ls1.repository.CourseIterationRepository;
import prompt.ls1.repository.IntroCourseParticipationRepository;
import prompt.ls1.repository.StudentRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Predicate;

@Service
public class IntroCourseService {
    private final IntroCourseParticipationRepository introCourseParticipationRepository;
    private final CourseIterationRepository courseIterationRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public IntroCourseService(final IntroCourseParticipationRepository introCourseParticipationRepository,
                              final CourseIterationRepository courseIterationRepository,
                              final StudentRepository studentRepository) {
        this.introCourseParticipationRepository = introCourseParticipationRepository;
        this.courseIterationRepository = courseIterationRepository;
        this.studentRepository = studentRepository;
    }

    public List<IntroCourseParticipation> findAllByCourseIterationId(final UUID courseIterationId) {
        return introCourseParticipationRepository.findAllByCourseIterationId(courseIterationId);
    }

    public List<IntroCourseParticipation> createSeatPlanAssignments(final List<SeatPlanAssignment> seatPlanAssignments) {
        return seatPlanAssignments
                .stream()
                .map(seatPlanAssignment -> {
                    final IntroCourseParticipation introCourseParticipation = findById(seatPlanAssignment.getIntroCourseParticipationId());

                    if (seatPlanAssignment.getTutorId() != null) {
                        final UUID studentId = studentRepository.findById(seatPlanAssignment.getTutorId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                        String.format("Student with id %s not found.",
                                                seatPlanAssignment.getTutorId()))).getId();

                        introCourseParticipation.setTutorId(studentId);
                    }

                    introCourseParticipation.setSeat(seatPlanAssignment.getSeat());

                    return introCourseParticipationRepository.save(introCourseParticipation);
                })
                .toList();
    }

    public List<IntroCourseParticipation> createSeatPlan(final UUID courseIterationId, final List<Seat> seatPlan) {
        courseIterationRepository.findById(courseIterationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(String.format("Course iteration with id %s not found.", courseIterationId)));
        final List<IntroCourseParticipation> introCourseParticipations =
                introCourseParticipationRepository.findAllByCourseIterationId(courseIterationId);

        final List<IntroCourseParticipation> updatedIntroCourseParticipations = new ArrayList<>();

        Optional.of(introCourseParticipations.stream()
                .filter(IntroCourseParticipation::getChairDeviceRequired)
                .map(introCourseParticipation -> {
                    final Seat seatWithDevice = seatPlan.stream().filter(Seat::getWithChairDevice)
                            .findFirst()
                            .orElseThrow(() -> new ResourceInvalidParametersException("There are not enough seats with chair devices."));
                    introCourseParticipation.setSeat(seatWithDevice.getSeat());
                    seatPlan.remove(seatWithDevice);

                    return introCourseParticipationRepository.save(introCourseParticipation);
                }))
                .ifPresent(values -> updatedIntroCourseParticipations.addAll(values.toList()));

        Optional.of(introCourseParticipations.stream()
                .filter(Predicate.not(IntroCourseParticipation::getChairDeviceRequired))
                .map(introCourseParticipation -> {
                    final Seat seatWithDevice = seatPlan.stream()
                            .findFirst()
                            .orElseThrow(() -> new ResourceInvalidParametersException("There are not enough seats."));
                    introCourseParticipation.setSeat(seatWithDevice.getSeat());
                    seatPlan.remove(seatWithDevice);

                    return introCourseParticipationRepository.save(introCourseParticipation);
                }))
                .ifPresent(values -> updatedIntroCourseParticipations.addAll(values.toList()));

        return updatedIntroCourseParticipations;
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
