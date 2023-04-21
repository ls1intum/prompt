package prompt.ls1.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.Nullable;
import java.io.Serializable;
import java.util.UUID;

@Data
@Entity
@Table(name = "student_project_team_preference",
        uniqueConstraints = { @UniqueConstraint(columnNames =
                { "studentId", "projectTeamId", "applicationSemesterId" }) })
@NoArgsConstructor
public class StudentProjectTeamPreference implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID studentId;

    private UUID projectTeamId;

    private UUID applicationSemesterId;

    private Integer priorityScore;

    @Transient
    @Nullable
    private Student student;

    public StudentProjectTeamPreference(final UUID applicationSemesterId,
                                        final UUID studentId,
                                        final UUID projectTeamId,
                                        final Integer priorityScore) {
        this.applicationSemesterId = applicationSemesterId;
        this.studentId = studentId;
        this.projectTeamId = projectTeamId;
        this.priorityScore = priorityScore;
    }
}
