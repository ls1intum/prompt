package prompt.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import prompt.ls1.model.Student;

import java.util.Optional;
import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {

    Optional<Student> findByTumId(final String tumId);

    Optional<Student> findByFirstNameAndLastName(final String firstName, final String lastName);
}
