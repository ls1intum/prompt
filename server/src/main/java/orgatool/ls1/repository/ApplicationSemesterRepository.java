package orgatool.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import orgatool.ls1.model.ApplicationSemester;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationSemesterRepository extends JpaRepository<ApplicationSemester, String> {
    Optional<ApplicationSemester> findBySemesterName(final String semesterName);

    @Query("select s from ApplicationSemester s where s.applicationPeriodStart <= ?1 and s.applicationPeriodEnd > ?1")
    List<ApplicationSemester> findAllWithApplicationPeriodIncludes(final Date date);
}
