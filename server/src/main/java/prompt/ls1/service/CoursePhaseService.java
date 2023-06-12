package prompt.ls1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceConflictException;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.CourseIteration;
import prompt.ls1.model.CourseIterationPhaseCheckEntry;
import prompt.ls1.model.CoursePhase;
import prompt.ls1.model.CoursePhaseCheck;
import prompt.ls1.repository.CourseIterationPhaseCheckEntryRepository;
import prompt.ls1.repository.CourseIterationPhaseRepository;
import prompt.ls1.repository.CourseIterationRepository;
import prompt.ls1.repository.CoursePhaseCheckRepository;
import prompt.ls1.repository.CoursePhaseRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CoursePhaseService {
    private final CoursePhaseRepository coursePhaseRepository;
    private final CourseIterationRepository courseIterationRepository;
    private final CourseIterationPhaseCheckEntryRepository courseIterationPhaseCheckEntryRepository;
    private final CourseIterationPhaseRepository courseIterationPhaseRepository;
    private final CoursePhaseCheckRepository coursePhaseCheckRepository;

    @Autowired
    public CoursePhaseService(final CoursePhaseRepository coursePhaseRepository,
                              final CourseIterationRepository courseIterationRepository,
                              final CourseIterationPhaseCheckEntryRepository courseIterationPhaseCheckEntryRepository,
                              final CourseIterationPhaseRepository courseIterationPhaseRepository,
                              final CoursePhaseCheckRepository coursePhaseCheckRepository) {
        this.coursePhaseRepository = coursePhaseRepository;
        this.courseIterationRepository = courseIterationRepository;
        this.courseIterationPhaseCheckEntryRepository = courseIterationPhaseCheckEntryRepository;
        this.courseIterationPhaseRepository = courseIterationPhaseRepository;
        this.coursePhaseCheckRepository = coursePhaseCheckRepository;
    }

    public List<CoursePhase> findAll() {
        return coursePhaseRepository.findAll();
    }
    public CoursePhase create(final CoursePhase coursePhase) {
        final Optional<CoursePhase> conflictingCoursePhase = coursePhaseRepository
                .findBySequentialOrder(coursePhase.getSequentialOrder());
        if (conflictingCoursePhase.isPresent()) {
            throw new ResourceConflictException(String.format("Course phase with and sequential order " +
                    "%s already exists.", coursePhase.getSequentialOrder()));
        }

        return coursePhaseRepository.save(coursePhase);
    }

    public CoursePhase createCoursePhaseCheck(final UUID coursePhaseId, final CoursePhaseCheck coursePhaseCheck) {
        final CoursePhase coursePhase = findById(coursePhaseId);
        final Optional<CoursePhaseCheck> conflictingCoursePhaseCheck = coursePhase.getChecks()
                .stream().filter(check -> check.getSequentialOrder().equals(coursePhaseCheck.getSequentialOrder())).findFirst();
        if (conflictingCoursePhaseCheck.isPresent()) {
            throw new ResourceConflictException(String.format("Course phase check with sequential order %s already exists " +
                    "for course phase with id %s", coursePhaseCheck.getSequentialOrder(), coursePhaseId));
        }

        coursePhase.getChecks().add(coursePhaseCheck);
        final CoursePhase savedCoursePhase = coursePhaseRepository.save(coursePhase);
        final CoursePhaseCheck savedCoursePhaseCheck = savedCoursePhase.getChecks()
                .stream()
                .filter(check -> check.getTitle().equals(coursePhaseCheck.getTitle()) &&
                        check.getDescription().equals(coursePhaseCheck.getDescription()) &&
                        check.getSequentialOrder().equals(coursePhaseCheck.getSequentialOrder()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Course phase check with title %s not found for course phase with id " +
                        "%s.", coursePhaseCheck.getTitle(), coursePhase.getId())));

        final List<CourseIteration> courseIterations = courseIterationRepository.findAll();
        courseIterations.forEach(courseIteration -> {
            courseIteration.getPhases().stream().filter(phase -> phase.getCoursePhase().getId().equals(coursePhase.getId()))
                    .findFirst().ifPresent(phase -> {
                        final CourseIterationPhaseCheckEntry courseIterationPhaseCheckEntry = new CourseIterationPhaseCheckEntry();
                        courseIterationPhaseCheckEntry.setCoursePhaseCheck(savedCoursePhaseCheck);
                        courseIterationPhaseCheckEntry.setFulfilled(false);
                        phase.getCheckEntries()
                                .add(courseIterationPhaseCheckEntryRepository.save(courseIterationPhaseCheckEntry));
                        courseIterationPhaseRepository.save(phase);
                    });
        });

        return savedCoursePhase;
    }

    public CoursePhase deleteCoursePhaseCheck(final UUID coursePhaseId, final UUID coursePhaseCheckId) {
        final CoursePhase coursePhase = findById(coursePhaseId);
        final CoursePhaseCheck coursePhaseCheck = coursePhase.getChecks()
                .stream()
                .filter(check -> check.getId().equals(coursePhaseCheckId))
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException(String.format("Course phase check with id %s not found for course phase with id %s.",
                                coursePhaseCheckId, coursePhaseId)));
        coursePhase.getChecks().forEach(check -> {
            if (check.getSequentialOrder() > coursePhaseCheck.getSequentialOrder()) {
                check.setSequentialOrder(check.getSequentialOrder() - 1);
                coursePhaseCheckRepository.save(check);
            }
        });
        coursePhase.getChecks().remove(coursePhaseCheck);

        final List<CourseIteration> courseIterations = courseIterationRepository.findAll();
        courseIterations.forEach(courseIteration -> {
            courseIteration.getPhases().stream().filter(phase -> phase.getCoursePhase().getId().equals(coursePhase.getId()))
                    .findFirst().ifPresent(phase -> {
                        phase.getCheckEntries()
                                .stream()
                                .filter(checkEntry -> checkEntry.getCoursePhaseCheck().getId().equals(coursePhaseCheckId))
                                .findFirst()
                                .ifPresent(courseIterationPhaseCheckEntry -> {
                                    phase.getCheckEntries().remove(courseIterationPhaseCheckEntry);
                                    courseIterationPhaseRepository.save(phase);
                                });
                    });
        });

        return coursePhaseRepository.save(coursePhase);
    }

    public UUID deleteById(final UUID coursePhaseId) {
        final CoursePhase coursePhase = findById(coursePhaseId);
        coursePhaseRepository.delete(coursePhase);

        return  coursePhase.getId();
    }

    private CoursePhase findById(final UUID coursePhaseId) {
        return coursePhaseRepository.findById(coursePhaseId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Course phase with %s not found.", coursePhaseId)));
    }

}
