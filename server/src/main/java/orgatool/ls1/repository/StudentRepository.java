package orgatool.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import orgatool.ls1.model.Student;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByTumId(final String tumId);

    Optional<Student> findByFirstNameAndLastName(final String firstName, final String lastName);
}
