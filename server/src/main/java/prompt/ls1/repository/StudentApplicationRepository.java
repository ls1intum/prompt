package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import prompt.ls1.model.ApplicationSemester;
import prompt.ls1.model.Student;
import prompt.ls1.model.StudentApplication;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentApplicationRepository extends JpaRepository<StudentApplication, UUID> {
    @Transactional
    @Query(value="select sa from StudentApplication sa where sa.applicationSemester.id=?1")
    List<StudentApplication> findAllByApplicationSemesterId(UUID applicationSemesterId);

    Optional<StudentApplication> findById(final UUID studentApplicationId);

    Optional<StudentApplication> findByStudentAndApplicationSemester(final Student student, final ApplicationSemester applicationSemester);
}
