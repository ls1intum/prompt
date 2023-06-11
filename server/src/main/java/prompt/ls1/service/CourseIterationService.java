package prompt.ls1.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceConflictException;
import prompt.ls1.exception.ResourceInvalidParametersException;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.CourseIteration;
import prompt.ls1.model.CourseIterationPhase;
import prompt.ls1.model.CoursePhase;
import prompt.ls1.repository.CourseIterationRepository;
import prompt.ls1.repository.CoursePhaseRepository;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class CourseIterationService {
    private final CourseIterationRepository courseIterationRepository;
    private final CoursePhaseRepository coursePhaseRepository;
    private final SimpleDateFormat simpleDateFormat;

    @Autowired
    public CourseIterationService(final CourseIterationRepository courseIterationRepository,
                                  final CoursePhaseRepository coursePhaseRepository) {
        this.courseIterationRepository = courseIterationRepository;
        this.coursePhaseRepository = coursePhaseRepository;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", Locale.GERMAN);
    }

    public CourseIteration create(final CourseIteration courseIteration) {
        Optional<CourseIteration> conflictingCourseIteration = courseIterationRepository
                .findBySemesterName(courseIteration.getSemesterName());
        if (conflictingCourseIteration.isPresent()) {
            throw new ResourceConflictException(String.format("Course iteration with name %s already exists.", courseIteration.getSemesterName()));
        }

        if (courseIteration.getApplicationPeriodStart().after(courseIteration.getApplicationPeriodEnd())) {
            throw new ResourceInvalidParametersException("Application period start date is after the end date.");
        }

        List<CourseIteration> courseIterationPeriodOverlap = courseIterationRepository
                .findWithDateRangeOverlap(courseIteration.getApplicationPeriodStart(), courseIteration.getApplicationPeriodEnd());
        if (!courseIterationPeriodOverlap.isEmpty()) {
            throw new ResourceInvalidParametersException(String.format("Course iteration application period overlaps with existing course iteration with name %s",
                    courseIterationPeriodOverlap.get(0).getSemesterName()));
        }

        courseIteration.setPhases(new HashSet<>());
        List<CoursePhase> coursePhases = coursePhaseRepository.findAll();
        coursePhases.forEach(coursePhase -> {
            final CourseIterationPhase courseIterationPhase = new CourseIterationPhase();
            courseIterationPhase.setCoursePhase(coursePhase);
            courseIteration.getPhases().add(courseIterationPhase);
        });

        return courseIterationRepository.save(courseIteration);
    }

    public CourseIteration update(final UUID courseIterationId, JsonPatch patchCourseIteration)
            throws JsonPatchException, JsonProcessingException{
        Optional<CourseIteration> existingCourseIteration = courseIterationRepository.findById(courseIterationId);
        if (existingCourseIteration.isEmpty()) {
            throw new ResourceNotFoundException(String.format("Course iteration with id %s not found.",
                    courseIterationId));
        }

        CourseIteration patchedCourseIteration = applyPatchToCourseIteration(patchCourseIteration, existingCourseIteration.get());
        return courseIterationRepository.save(patchedCourseIteration);
    }

    public UUID deleteById(final UUID courseIterationId) {
        CourseIteration courseIteration = courseIterationRepository.findById(courseIterationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Course iteration with id %s not found.", courseIterationId)));

        courseIterationRepository.deleteById(courseIterationId);
        return courseIteration.getId();
    }

    public CourseIteration findBySemesterName(final String courseIterationName) {
        return courseIterationRepository.findBySemesterName(courseIterationName)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Course iteration with name %s not found.", courseIterationName)));
    }

    public List<CourseIteration> findAll() {
        return courseIterationRepository.findAll();
    }

    public CourseIteration findWithOpenApplicationPeriod() {
        return courseIterationRepository.findWithApplicationPeriodIncludes(new Date())
                .orElseThrow(() -> new ResourceNotFoundException("Course iteration with open application period not found."));
    }

    private CourseIteration applyPatchToCourseIteration(
            JsonPatch patch, CourseIteration targetCourseIteration) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(targetCourseIteration, JsonNode.class));
        return objectMapper.treeToValue(patched, CourseIteration.class);
    }
}
