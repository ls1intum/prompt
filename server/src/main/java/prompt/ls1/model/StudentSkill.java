package prompt.ls1.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import prompt.ls1.model.enums.SkillAssessmentSource;
import prompt.ls1.model.enums.SkillProficiency;

import java.util.UUID;

@Data
@Entity
@Table
public class StudentSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "skill_id")
    private Skill skill;

    private SkillAssessmentSource skillAssessmentSource;

    private SkillProficiency skillProficiency;
}
