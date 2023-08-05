package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import prompt.ls1.model.IntroCourseParticipation;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IntroCourseParticipationRepository extends JpaRepository<IntroCourseParticipation, UUID> {

    Optional<IntroCourseParticipation> findByDeveloperApplicationId(final UUID developerApplicationId);

    @Transactional
    @Query(value="select icp from IntroCourseParticipation icp where icp.developerApplication.courseIterationId = ?1")
    List<IntroCourseParticipation> findAllByCourseIterationId(final UUID courseIterationId);
}
