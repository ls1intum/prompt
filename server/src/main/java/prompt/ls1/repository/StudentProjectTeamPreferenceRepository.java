package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import prompt.ls1.model.StudentProjectTeamPreference;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentProjectTeamPreferenceRepository extends JpaRepository<StudentProjectTeamPreference, UUID> {
    List<StudentProjectTeamPreference> findAllByApplicationSemesterId(final UUID applicationSemesterId);

    List<StudentProjectTeamPreference> findAllByStudentIdAndApplicationSemesterId(final UUID studentId, final UUID applicationSemesterId);

    @Transactional
    void deleteAllByApplicationSemesterId(final UUID applicationSemesterId);
}
