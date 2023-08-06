package prompt.ls1.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import prompt.ls1.model.enums.SkillProficiency;

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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(length = 50)
    private String seat;

    private Boolean chairDeviceRequired;

    private SkillProficiency introCourseSelfAssessment;

    private SkillProficiency supervisorAssessment;

    private String studentComments;

    private String tutorComments;

}
