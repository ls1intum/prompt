package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import prompt.ls1.model.CourseIteration;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseIterationRepository extends JpaRepository<CourseIteration, UUID> {
    Optional<CourseIteration> findBySemesterName(final String semesterName);

    @Transactional
    @Query("select s from CourseIteration s where s.developerApplicationPeriodStart <= ?1 and s.developerApplicationPeriodEnd >= ?1")
    Optional<CourseIteration> findWithApplicationPeriodIncludes(final Date date);

    @Transactional
    @Query("select s from CourseIteration s where s.coachApplicationPeriodStart <= ?1 and s.coachApplicationPeriodEnd >= ?1")
    Optional<CourseIteration> findWithCoachApplicationPeriodIncludes(final Date date);

    @Transactional
    @Query("select s from CourseIteration s where s.tutorApplicationPeriodStart <= ?1 and s.tutorApplicationPeriodEnd >= ?1")
    Optional<CourseIteration> findWithTutorApplicationPeriodIncludes(final Date date);

    @Transactional
    @Query("select s from CourseIteration s where s.kickoffSubmissionPeriodStart <= ?1 and s.kickoffSubmissionPeriodEnd >= ?1")
    Optional<CourseIteration> findWithKickoffSubmissionPeriodIncludes(final Date date);

    @Query("select s from CourseIteration s where (s.developerApplicationPeriodStart <= ?1 and s.developerApplicationPeriodEnd >= ?2)" +
            " or (s.developerApplicationPeriodStart >= ?1 and s.developerApplicationPeriodEnd <= ?2)" +
            " or (s.developerApplicationPeriodStart <= ?1 and s.developerApplicationPeriodEnd >= ?1)" +
            " or (s.developerApplicationPeriodStart >= ?1 and s.developerApplicationPeriodStart <= ?2)")
    List<CourseIteration> findWithApplicationPeriodOverlap(final Date startDate, final Date endDate);

    @Query("select s from CourseIteration s where (s.kickoffSubmissionPeriodStart <= ?1 and s.kickoffSubmissionPeriodEnd >= ?2)" +
            " or (s.kickoffSubmissionPeriodStart >= ?1 and s.kickoffSubmissionPeriodEnd <= ?2)" +
            " or (s.kickoffSubmissionPeriodStart <= ?1 and s.kickoffSubmissionPeriodEnd >= ?1)" +
            " or (s.kickoffSubmissionPeriodStart >= ?1 and s.kickoffSubmissionPeriodStart <= ?2)")
    List<CourseIteration> findWithKickoffSubmissionPeriodOverlap(final Date startDate, final Date endDate);
}
