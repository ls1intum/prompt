package prompt.ls1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceConflictException;
import prompt.ls1.model.CoursePhase;
import prompt.ls1.repository.CoursePhaseRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CoursePhaseService {
    private final CoursePhaseRepository coursePhaseRepository;

    @Autowired
    public CoursePhaseService(final CoursePhaseRepository coursePhaseRepository) {
        this.coursePhaseRepository = coursePhaseRepository;
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

}
