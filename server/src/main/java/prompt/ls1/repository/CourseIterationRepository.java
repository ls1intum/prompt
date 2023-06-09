package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import prompt.ls1.model.CourseIteration;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseIterationRepository extends JpaRepository<CourseIteration, UUID> {
    Optional<CourseIteration> findBySemesterName(final String semesterName);

    @Query("select s from CourseIteration s where s.developerApplicationPeriodStart <= ?1 and s.developerApplicationPeriodEnd >= ?1")
    Optional<CourseIteration> findWithApplicationPeriodIncludes(final Date date);

    @Query("select s from CourseIteration s where s.coachApplicationPeriodStart <= ?1 and s.coachApplicationPeriodEnd >= ?1")
    Optional<CourseIteration> findWithCoachApplicationPeriodIncludes(final Date date);

    @Query("select s from CourseIteration s where s.tutorApplicationPeriodStart <= ?1 and s.tutorApplicationPeriodEnd >= ?1")
    Optional<CourseIteration> findWithTutorApplicationPeriodIncludes(final Date date);

    @Query("select s from CourseIteration s where (s.developerApplicationPeriodStart <= ?1 and s.developerApplicationPeriodEnd >= ?2)" +
            " or (s.developerApplicationPeriodStart >= ?1 and s.developerApplicationPeriodEnd <= ?2)" +
            " or (s.developerApplicationPeriodStart <= ?1 and s.developerApplicationPeriodEnd >= ?1)" +
            " or (s.developerApplicationPeriodStart >= ?1 and s.developerApplicationPeriodStart <= ?2)")
    List<CourseIteration> findWithDateRangeOverlap(final Date startDate, final Date endDate);
}
