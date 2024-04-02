package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import prompt.ls1.model.IntroCourseAbsence;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface IntroCourseAbsenceRepository extends JpaRepository<IntroCourseAbsence, UUID> {
    Optional<IntroCourseAbsence> findById(final UUID introCourseAbsenceId);
}
