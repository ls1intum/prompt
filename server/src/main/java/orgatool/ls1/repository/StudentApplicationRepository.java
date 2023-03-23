package orgatool.ls1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import orgatool.ls1.model.StudentApplication;

@Repository
public interface StudentApplicationRepository extends JpaRepository<StudentApplication, String> {}
