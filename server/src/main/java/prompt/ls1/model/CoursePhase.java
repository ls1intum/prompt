package prompt.ls1.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import prompt.ls1.model.enums.CoursePhaseType;

import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"sequentialOrder"}))
public class CoursePhase {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private Integer sequentialOrder;

    private CoursePhaseType type;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinTable(name="course_phase_course_phase_check",
            joinColumns = @JoinColumn(name = "course_phase_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "course_phase_check_id", referencedColumnName = "id"))
    private Set<CoursePhaseCheck> checks;
}
