package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import prompt.ls1.model.CoachApplication;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CoachApplicationRepository extends JpaRepository<CoachApplication, UUID> {
    @Transactional
    @Query(value="select ca from CoachApplication ca where ca.courseIterationId=?1")
    List<CoachApplication> findAllByCourseIterationId(final UUID courseIterationId);

    @Transactional
    List<CoachApplication> findEnrolledApplicationsByCourseIterationId(final UUID courseIterationId);

    @Transactional
    List<CoachApplication> findAcceptedApplicationsByCourseIterationId(final UUID courseIterationId);

    @Transactional
    List<CoachApplication> findRejectedApplicationsByCourseIterationId(final UUID courseIterationId);

    @Transactional
    List<CoachApplication> findNotAssessedApplicationsByCourseIterationId(final UUID courseIterationId);

    @Transactional
    List<CoachApplication> findPendingInterviewApplicationsByCourseIterationId(final UUID courseIterationId);

    @Transactional
    @Query(value="select da from CoachApplication da where da.courseIterationId=?2 and da.student.id=?1")
    Optional<CoachApplication> findByStudentAndCourseIteration(final UUID studentId, final UUID courseIterationId);
}
