package prompt.ls1.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table
public class CourseIterationPhase {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "course_phase_id")
    private CoursePhase coursePhase;

    @Column(columnDefinition = "DATE")
    private Date startDate;

    @Column(columnDefinition = "DATE")
    private Date endDate;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinTable(name="course_iteration_check_entries",
            joinColumns = @JoinColumn(name = "course_iteration_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "check_entry_id", referencedColumnName = "id"))
    private Set<CourseIterationPhaseCheckEntry> checkEntries;
}
