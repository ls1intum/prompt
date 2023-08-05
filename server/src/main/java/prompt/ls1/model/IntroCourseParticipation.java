package prompt.ls1.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import prompt.ls1.model.enums.SkillProficiency;

import java.util.UUID;

@Data
@Entity
@Table
public class IntroCourseParticipation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID tutorApplicationId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "developer_application_id")
    private DeveloperApplication developerApplication;

    private SkillProficiency introCourseSelfAssessment;

    private SkillProficiency supervisorAssessment;

    private String studentComments;

    private String tutorComments;

}
