package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import prompt.ls1.model.CourseIterationPhase;

import java.util.UUID;

@Repository
public interface CourseIterationPhaseRepository extends JpaRepository<CourseIterationPhase, UUID> {

    @Transactional
    @Modifying
    @Query("DELETE FROM CourseIterationPhase cip WHERE cip.coursePhase.id = :coursePhaseId")
    void deleteAllByCoursePhaseId(final UUID coursePhaseId);
}
