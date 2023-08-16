package prompt.ls1.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import prompt.ls1.model.enums.ApplicationStatus;

import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Integer assessmentScore;

    private Double technicalChallengeProgrammingScore;

    private Double technicalChallengeQuizScore;

    @OneToMany(fetch = FetchType.EAGER, orphanRemoval = true)
    private Set<InstructorComment> instructorComments;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "application_status")
    private ApplicationStatus status;
}
