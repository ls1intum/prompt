package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import prompt.ls1.model.DeveloperApplication;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeveloperApplicationRepository extends JpaRepository<DeveloperApplication, UUID> {

    @Transactional
    @Query(value="select da from DeveloperApplication da where da.courseIterationId=?1")
    List<DeveloperApplication> findAllByCourseIterationId(final UUID courseIterationId);

    @Transactional
    List<DeveloperApplication> findEnrolledApplicationsByCourseIterationId(final UUID courseIterationId);

    @Transactional
    List<DeveloperApplication> findAcceptedApplicationsByCourseIterationId(final UUID courseIterationId);

    @Transactional
    List<DeveloperApplication> findRejectedApplicationsByCourseIterationId(final UUID courseIterationId);

    @Transactional
    List<DeveloperApplication> findNotAssessedApplicationsByCourseIterationId(final UUID courseIterationId);

    @Transactional
    List<DeveloperApplication> findPendingInterviewApplicationsByCourseIterationId(final UUID courseIterationId);

    @Transactional
    List<DeveloperApplication> findIntroCoursePassedApplicationsByCourseIterationId(final UUID courseIterationId);

    @Transactional
    List<DeveloperApplication> findIntroCourseNotPassedApplicationsByCourseIterationId(final UUID courseIterationId);

    @Transactional
    @Query(value="select da from DeveloperApplication da where da.student.id=?1")
    Optional<DeveloperApplication> findByStudentId(final UUID studentId);

    Optional<DeveloperApplication> findById(final UUID developerApplicationId);

    @Transactional
    @Query(value="select da from DeveloperApplication da where da.courseIterationId=?2 and da.student.id=?1")
    Optional<DeveloperApplication> findByStudentAndCourseIteration(final UUID studentId, final UUID courseIterationId);

}
