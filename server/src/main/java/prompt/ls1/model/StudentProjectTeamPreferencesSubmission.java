package prompt.ls1.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(uniqueConstraints = { @UniqueConstraint(columnNames =
        { "student_id", "application_semester_id" }) })
@NoArgsConstructor
public class StudentProjectTeamPreferencesSubmission implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "student_id")
    private UUID studentId;

    @Column(name = "application_semester_id")
    private UUID applicationSemesterId;

    private String appleId;

    private String macBookDeviceId;

    private String iPhoneDeviceId;

    private String iPadDeviceId;

    private String appleWatchDeviceId;

    private StudentExperienceLevel selfReportedExperienceLevel;

    @Transient
    private Student student;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinTable(name="student_project_team_preference_submission",
            joinColumns = @JoinColumn(name = "student_project_team_preferences_submission_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "student_project_team_preferences_id", referencedColumnName = "id"))
    private List<StudentProjectTeamPreference> studentProjectTeamPreferences;
}
