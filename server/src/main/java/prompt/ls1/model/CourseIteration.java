package prompt.ls1.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table
public class CourseIteration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String semesterName;

    @Column(unique = true)
    private String iosTag;

    @Column(columnDefinition = "DATE")
    private Date applicationPeriodStart;

    @Column(columnDefinition = "DATE")
    private Date applicationPeriodEnd;

    @Column(columnDefinition = "boolean default false")
    private Boolean projectTeamPreferencesSubmissionOpen;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinTable(name="course_iteration_phases",
            joinColumns = @JoinColumn(name = "course_iteration_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "phase_id", referencedColumnName = "id"))
    private Set<CourseIterationPhase> phases;
}
