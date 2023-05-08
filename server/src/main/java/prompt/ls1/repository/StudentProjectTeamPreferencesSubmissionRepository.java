package prompt.ls1.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import prompt.ls1.model.StudentProjectTeamPreferencesSubmission;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentProjectTeamPreferencesSubmissionRepository extends JpaRepository<StudentProjectTeamPreferencesSubmission, UUID> {

    Optional<StudentProjectTeamPreferencesSubmission> findByStudentIdAndApplicationSemesterId(final UUID studentId, final UUID applicationSemesterId);

    List<StudentProjectTeamPreferencesSubmission> findAllByApplicationSemesterId(final UUID applicationSemesterId);

    @Transactional
    void deleteAllByApplicationSemesterId(final UUID applicationSemesterId);
}
