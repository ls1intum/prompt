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

    @Query("select s from CourseIteration s where s.applicationPeriodStart <= ?1 and s.applicationPeriodEnd > ?1")
    Optional<CourseIteration> findWithApplicationPeriodIncludes(final Date date);

    @Query("select s from CourseIteration s where (s.applicationPeriodStart <= ?1 and s.applicationPeriodEnd >= ?2)" +
            " or (s.applicationPeriodStart >= ?1 and s.applicationPeriodEnd <= ?2)" +
            " or (s.applicationPeriodStart <= ?1 and s.applicationPeriodEnd >= ?1)" +
            " or (s.applicationPeriodStart >= ?1 and s.applicationPeriodStart <= ?2)")
    List<CourseIteration> findWithDateRangeOverlap(final Date startDate, final Date endDate);
}
