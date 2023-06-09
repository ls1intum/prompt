package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import prompt.ls1.model.InstructorComment;

import java.util.UUID;

@Repository
public interface InstructorCommentRepository extends JpaRepository<InstructorComment, UUID> {}
