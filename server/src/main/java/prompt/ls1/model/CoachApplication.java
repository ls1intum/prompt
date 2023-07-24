package prompt.ls1.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Table
@Entity
@EqualsAndHashCode(callSuper = true)
public class CoachApplication extends Application {
    @ManyToOne
    @JoinTable(name = "student_coach_application",
            joinColumns = @JoinColumn(name = "application_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "student_id", referencedColumnName = "id"))
    private Student student;

    @Lob
    @Column(length = 500)
    private String solvedProblem;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "project_team_id")
    private ProjectTeam projectTeam;
}
