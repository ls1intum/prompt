package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import prompt.ls1.model.IntroCourseParticipation;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IntroCourseParticipationRepository extends JpaRepository<IntroCourseParticipation, UUID> {

    Optional<IntroCourseParticipation> findByStudentId(final UUID studentId);

    @Transactional
    Optional<IntroCourseParticipation> findByCourseIterationIdAndStudentId(final UUID courseIterationId, final UUID studentId);

    @Transactional
    List<IntroCourseParticipation> findAllByCourseIterationId(final UUID courseIterationId);
}
