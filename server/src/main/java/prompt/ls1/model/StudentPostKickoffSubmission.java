package prompt.ls1.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import prompt.ls1.model.enums.SkillProficiency;

import java.io.Serializable;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table
@NoArgsConstructor
public class StudentPostKickoffSubmission implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private SkillProficiency selfReportedExperienceLevel;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinTable(name="student_post_kickoff_submission_student_skill",
            joinColumns = @JoinColumn(name = "student_post_kickoff_submission_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "student_skill_id", referencedColumnName = "id"))
    private Set<StudentSkill> studentSkills;

    @Transient
    private Student student;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinTable(name="student_post_kickoff_submission_student_project_team_preference",
            joinColumns = @JoinColumn(name = "student_post_kickoff_submission_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "student_project_team_preferences_id", referencedColumnName = "id"))
    private Set<StudentProjectTeamPreference> studentProjectTeamPreferences;

    private String reasonForFirstChoice;

    private String reasonForLastChoice;
}
