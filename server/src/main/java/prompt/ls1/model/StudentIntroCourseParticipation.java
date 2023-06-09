package prompt.ls1.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table
public class StudentIntroCourseParticipation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private SkillProficiency introCourseSelfAssessment;

    private SkillProficiency supervisorAssessment;

    private String studentComments;

    private String tutorComments;

}
