package prompt.ls1.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import prompt.ls1.model.enums.SkillProficiency;

import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntroCourseParticipation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID courseIterationId;

    private UUID tutorId;

    private String appleId;

    private String macBookDeviceId;

    private String iPhoneDeviceId;

    private String iPadDeviceId;

    private String appleWatchDeviceId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(length = 50)
    private String seat;

    private String chairDevice;

    @Enumerated(EnumType.STRING)
    private SkillProficiency selfAssessment;

    @Enumerated(EnumType.STRING)
    private SkillProficiency supervisorAssessment;

    @Column(length = 500)
    private String studentComments;

    @Column(length = 500)
    private String tutorComments;

    private Boolean passed;

    private Boolean droppedOut;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinTable(name="intro_course_participation_absence",
            joinColumns = @JoinColumn(name = "intro_course_participation_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "intro_course_absence_id", referencedColumnName = "id"))
    private List<IntroCourseAbsence> absences;

}
