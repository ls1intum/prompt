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
    private Date developerApplicationPeriodStart;

    @Column(columnDefinition = "DATE")
    private Date developerApplicationPeriodEnd;

    @Column(columnDefinition = "DATE")
    private Date coachApplicationPeriodStart;

    @Column(columnDefinition = "DATE")
    private Date coachApplicationPeriodEnd;

    @Column(columnDefinition = "DATE")
    private Date tutorApplicationPeriodStart;

    @Column(columnDefinition = "DATE")
    private Date tutorApplicationPeriodEnd;

    @Column(columnDefinition = "TIMESTAMP")
    private Date coachInterviewDate;

    @Column(columnDefinition = "TIMESTAMP")
    private Date tutorInterviewDate;

    private String coachInterviewPlannerLink;

    private String tutorInterviewPlannerLink;

    private String coachInterviewLocation;

    private String tutorInterviewLocation;

    @Column(columnDefinition = "boolean default false")
    private Boolean projectTeamPreferencesSubmissionOpen;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinTable(name="course_iteration_phases",
            joinColumns = @JoinColumn(name = "course_iteration_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "phase_id", referencedColumnName = "id"))
    private Set<CourseIterationPhase> phases;
}
