package orgatool.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import orgatool.ls1.model.StudentApplication;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentApplicationRepository extends JpaRepository<StudentApplication, Long> {
    @Transactional
    @Query(value="select sa from StudentApplication sa where sa.applicationSemester.id=?1")
    List<StudentApplication> findAllByApplicationSemesterId(Long applicationSemester);

    @Transactional
    @Query(value="select sa from StudentApplication sa where sa.id=?1 and sa.applicationSemester.id=?2")
    Optional<StudentApplication> findByIdAndApplicationSemesterId(Long studentApplicationId, Long applicationSemesterId);
}
