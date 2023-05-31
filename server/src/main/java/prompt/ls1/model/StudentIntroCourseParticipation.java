package prompt.ls1.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table
public class StudentIntroCourseParticipation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(mappedBy = "introCourseParticipation")
    @PrimaryKeyJoinColumn
    private StudentApplication studentApplication;

    @OneToMany(mappedBy = "studentApplication")
    private Set<StudentSkill> studentSkills;

    private SkillProficiency introCourseSelfAssessment;

    private SkillProficiency supervisorAssessment;

    private String studentComments;

    private String tutorComments;

}
