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
        { "studentId", "applicationSemesterId" }) })
@NoArgsConstructor
public class StudentProjectTeamPreferencesSubmission implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID studentId;

    private UUID applicationSemesterId;

    private String appleId;

    private String macBookDeviceId;

    private String iPhoneDeviceId;

    private String iPadDeviceId;

    private String appleWatchDeviceId;

    @Transient
    private Student student;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinTable(joinColumns = @JoinColumn(name = "id", referencedColumnName="id"))
    private List<StudentProjectTeamPreference> studentProjectTeamPreferences;
}
