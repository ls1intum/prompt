package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import prompt.ls1.model.Student;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {

    Optional<Student> findByTumId(final String tumId);

    Optional<Student> findByPublicId(final String publicId);

    Optional<Student> findByFirstNameAndLastName(final String firstName, final String lastName);

    List<Student> findAllByIdIn(final List<UUID> studentIds);
}
