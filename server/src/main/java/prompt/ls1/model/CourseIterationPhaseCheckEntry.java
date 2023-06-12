package prompt.ls1.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table
public class CourseIterationPhaseCheckEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "course_phase_check_id")
    private CoursePhaseCheck coursePhaseCheck;

    private Boolean fulfilled;
}
