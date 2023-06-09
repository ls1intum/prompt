package prompt.ls1.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Table
@Entity
public class DeveloperApplication extends Application {
    @ManyToOne
    @JoinTable(name = "student_developer_application",
            joinColumns = @JoinColumn(name = "application_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "student_id", referencedColumnName = "id"))
    private Student student;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "intro_course_participation_id")
    private IntroCourseParticipation introCourseParticipation;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "post_kickoff_submission_id")
    private StudentPostKickoffSubmission studentPostKickOffSubmission;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "project_team_id")
    private ProjectTeam projectTeam;
}
