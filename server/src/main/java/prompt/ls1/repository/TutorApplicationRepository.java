package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import prompt.ls1.model.TutorApplication;

import java.util.List;
import java.util.UUID;

@Repository
public interface TutorApplicationRepository extends JpaRepository<TutorApplication, UUID> {
    @Transactional
    @Query(value="select da from TutorApplication da where da.courseIteration.id=?1")
    List<TutorApplication> findAllByCourseIterationId(final UUID courseIterationId);
}
