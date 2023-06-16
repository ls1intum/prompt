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
    @Query(value="select sa from StudentApplication sa where sa.courseIteration.id=?1")
    List<StudentApplication> findAllByCourseIterationId(final UUID courseIterationId);

    @Transactional
    @Query(value="select sa from StudentApplication sa where sa.student.id=?1")
    Optional<StudentApplication> findByStudentId(final UUID studentId);

    Optional<StudentApplication> findById(final UUID studentApplicationId);

    @Transactional
    @Query(value="select sa from StudentApplication sa where sa.courseIteration.id=?2 and sa.student.id=?1")
    Optional<StudentApplication> findByStudentAndCourseIteration(final UUID studentId, final UUID courseIterationId);
}
