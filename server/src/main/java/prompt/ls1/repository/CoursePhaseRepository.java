package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import prompt.ls1.model.CoursePhase;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CoursePhaseRepository extends JpaRepository<CoursePhase, UUID> {

    Optional<CoursePhase> findBySequentialOrder(final Integer sequentialOrder);
}
