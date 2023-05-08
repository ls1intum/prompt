package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import prompt.ls1.model.ApplicationSemester;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationSemesterRepository extends JpaRepository<ApplicationSemester, UUID> {
    Optional<ApplicationSemester> findBySemesterName(final String semesterName);

    @Query("select s from ApplicationSemester s where s.applicationPeriodStart <= ?1 and s.applicationPeriodEnd > ?1")
    Optional<ApplicationSemester> findWithApplicationPeriodIncludes(final Date date);

    @Query("select s from ApplicationSemester s where (s.applicationPeriodStart <= ?1 and s.applicationPeriodEnd >= ?2)" +
            " or (s.applicationPeriodStart >= ?1 and s.applicationPeriodEnd <= ?2)" +
            " or (s.applicationPeriodStart <= ?1 and s.applicationPeriodEnd >= ?1)" +
            " or (s.applicationPeriodStart >= ?1 and s.applicationPeriodStart <= ?2)")
    List<ApplicationSemester> findWithDateRangeOverlap(final Date startDate, final Date endDate);
}
