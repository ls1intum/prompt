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
import prompt.ls1.model.DeveloperApplication;
import prompt.ls1.model.IntroCourseAbsence;
import prompt.ls1.model.IntroCourseParticipation;
import prompt.ls1.model.Student;
import prompt.ls1.model.TutorApplication;
import prompt.ls1.model.enums.Device;
import prompt.ls1.repository.CourseIterationRepository;
import prompt.ls1.repository.DeveloperApplicationRepository;
import prompt.ls1.repository.IntroCourseParticipationRepository;
import prompt.ls1.repository.StudentRepository;
import prompt.ls1.repository.TutorApplicationRepository;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class IntroCourseService {
    private final IntroCourseParticipationRepository introCourseParticipationRepository;
    private final CourseIterationRepository courseIterationRepository;
    private final StudentRepository studentRepository;
    private final DeveloperApplicationRepository developerApplicationRepository;
    private final TutorApplicationRepository tutorApplicationRepository;

    @Autowired
    public IntroCourseService(final IntroCourseParticipationRepository introCourseParticipationRepository,
                              final CourseIterationRepository courseIterationRepository,
                              final StudentRepository studentRepository,
                              final DeveloperApplicationRepository developerApplicationRepository,
                              final TutorApplicationRepository tutorApplicationRepository) {
        this.introCourseParticipationRepository = introCourseParticipationRepository;
        this.courseIterationRepository = courseIterationRepository;
        this.studentRepository = studentRepository;
        this.developerApplicationRepository = developerApplicationRepository;
        this.tutorApplicationRepository = tutorApplicationRepository;
    }

    public List<IntroCourseParticipation> findAllByCourseIterationId(final UUID courseIterationId) {
        return introCourseParticipationRepository.findAllByCourseIterationId(courseIterationId);
    }

    public List<Student> findAllIntroCourseTutors(final String courseIterationName) {
        final UUID courseIterationId = courseIterationRepository.findBySemesterName(courseIterationName)
                .orElseThrow(() ->
                        new ResourceNotFoundException(String.format("Course iteration with name %s not found.",
                                courseIterationName)))
                .getId();
        return tutorApplicationRepository.findAllByCourseIterationId(courseIterationId)
                .stream()
                .map(TutorApplication::getStudent)
                .toList();
    }

    public IntroCourseParticipation update(UUID introCourseParticipationId, JsonPatch introCourseParticipationPatch)
            throws JsonPatchException, JsonProcessingException {
        final IntroCourseParticipation existingIntroCourseParticipation = findById(introCourseParticipationId);

        final IntroCourseParticipation patchedIntroCourseParticipation = applyPatch(introCourseParticipationPatch, existingIntroCourseParticipation);
        return introCourseParticipationRepository.save(patchedIntroCourseParticipation);
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
                    .filter(introCourseParticipation -> {
                        final DeveloperApplication developerApplication = developerApplicationRepository
                                .findByStudentAndCourseIteration(introCourseParticipation.getStudent().getId(), courseIterationId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                        String.format("Developer application for student with id %s not found.",
                                                introCourseParticipation.getStudent().getId())));
                        return !developerApplication.getDevices().contains(Device.MACBOOK);
                    })
                    .map(introCourseParticipation -> {
                        final Seat seatWithDevice = seatPlan.stream()
                                .filter(seat -> seat.getChairDevice() != null && !seat.getChairDevice().isBlank())
                                .findFirst()
                                .orElseThrow(() -> new ResourceInvalidParametersException("There are not enough seats with chair devices."));
                        introCourseParticipation.setSeat(seatWithDevice.getSeat());
                        introCourseParticipation.setChairDevice(seatWithDevice.getChairDevice());

                        if (seatWithDevice.getTutorId() != null && !seatWithDevice.getTutorId().isBlank()) {
                            final Student tutor = studentRepository.findById(UUID.fromString(seatWithDevice.getTutorId()))
                                    .orElseThrow(() -> new ResourceNotFoundException(
                                            String.format("Student with id %s not found.",
                                                    seatWithDevice.getTutorId())));
                            introCourseParticipation.setTutorId(tutor.getId());
                        }

                        seatPlan.remove(seatWithDevice);

                        return introCourseParticipationRepository.save(introCourseParticipation);
                    }))
                .ifPresent(values -> updatedIntroCourseParticipations.addAll(values.toList()));

        Optional.of(introCourseParticipations.stream()
                        .filter(introCourseParticipation -> {
                            final DeveloperApplication developerApplication = developerApplicationRepository
                                    .findByStudentAndCourseIteration(introCourseParticipation.getStudent().getId(), courseIterationId)
                                    .orElseThrow(() -> new ResourceNotFoundException(
                                            String.format("Developer application for student with id %s not found.",
                                                    introCourseParticipation.getStudent().getId())));
                            return developerApplication.getDevices().contains(Device.MACBOOK);
                        })
                        .map(introCourseParticipation -> {
                            final Seat seat = seatPlan.stream()
                                    .findFirst()
                                    .orElseThrow(() -> new ResourceInvalidParametersException("There are not enough seats."));
                            introCourseParticipation.setSeat(seat.getSeat());

                            if (seat.getTutorId() != null && !seat.getTutorId().isBlank()) {
                                final Student tutor = studentRepository.findById(UUID.fromString(seat.getTutorId()))
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                String.format("Student with id %s not found.",
                                                        seat.getTutorId())));
                                introCourseParticipation.setTutorId(tutor.getId());
                            }

                            seatPlan.remove(seat);

                            return introCourseParticipationRepository.save(introCourseParticipation);
                        }))
                .ifPresent(values -> updatedIntroCourseParticipations.addAll(values.toList()));

        return updatedIntroCourseParticipations;
    }

    public IntroCourseParticipation deleteIntroCourseAbsence(final UUID introCourseParticipationId,
                                                             final UUID introCourseAbsenceId) {
        final IntroCourseParticipation introCourseParticipation = findById(introCourseParticipationId);
        final IntroCourseAbsence introCourseAbsence = introCourseParticipation.getAbsences()
                .stream()
                .filter(absence -> absence.getId().equals(introCourseAbsenceId))
                .findFirst()
                .orElseThrow(() -> {
                    throw new ResourceInvalidParametersException(
                            String.format("Intro course absence with id %s not found.",
                                           introCourseAbsenceId));
                });
        introCourseParticipation.getAbsences().remove(introCourseAbsence);

        return introCourseParticipationRepository.save(introCourseParticipation);
    }

    public IntroCourseParticipation createIntroCourseAbsence(final UUID introCourseParticipationId,
                                                             final IntroCourseAbsence introCourseAbsence) {
        final IntroCourseParticipation introCourseParticipation = findById(introCourseParticipationId);
        introCourseParticipation.getAbsences()
                .stream()
                .filter(absence -> absence.getDate().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
                        .isEqual(introCourseAbsence.getDate().toInstant()
                                .atZone(ZoneId.systemDefault())
                                .toLocalDate()))
                .findFirst()
                .ifPresent(absence -> {
                    throw new ResourceInvalidParametersException(
                            String.format("Intro course absence for date %s already exists.",
                                    introCourseAbsence.getDate()));
                });
        introCourseParticipation.getAbsences().add(introCourseAbsence);

        return introCourseParticipationRepository.save(introCourseParticipation);
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
