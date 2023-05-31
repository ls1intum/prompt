package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import prompt.ls1.model.StudentApplication;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentApplicationRepository extends JpaRepository<StudentApplication, UUID> {
    @Transactional
    @Query(value="select sa from StudentApplication sa where sa.applicationSemester.id=?1")
    List<StudentApplication> findAllByApplicationSemesterId(final UUID applicationSemesterId);

    Optional<StudentApplication> findById(final UUID studentApplicationId);

    @Transactional
    @Query(value="select sa from StudentApplication sa where sa.applicationSemester.id=?2 and sa.student.id=?1")
    Optional<StudentApplication> findByStudentAndApplicationSemester(final UUID studentId, final UUID applicationSemesterId);
}
