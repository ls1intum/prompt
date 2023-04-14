package orgatool.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import orgatool.ls1.model.ProjectTeam;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectTeamRepository extends JpaRepository<ProjectTeam, Long> {
    @Transactional
    @Query(value="select pt from ProjectTeam pt where pt.applicationSemester.id=?1")
    List<ProjectTeam> findAllByApplicationSemesterId(Long applicationSemester);

    @Transactional
    @Query(value="select pt from ProjectTeam pt where pt.id=?1 and pt.applicationSemester.id=?2")
    Optional<ProjectTeam> findByIdAndApplicationSemesterId(Long projectTeamId, Long applicationSemesterId);

}
