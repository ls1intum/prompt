package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import prompt.ls1.model.ProjectTeam;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectTeamRepository extends JpaRepository<ProjectTeam, UUID> {
    Optional<ProjectTeam> findFirstByName(final String projectTeamName);

    @Transactional
    @Query(value="select pt from ProjectTeam pt where pt.courseIteration.id=?1")
    List<ProjectTeam> findAllByCourseIterationId(final UUID courseIterationId);

    Optional<ProjectTeam> findById(final UUID projectTeamId);

    Optional<ProjectTeam> findByName(final String projectTeamName);

}
