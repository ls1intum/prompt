package prompt.ls1.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table
public class ApplicationAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Boolean suggestedAsCoach;

    private Boolean suggestedAsTutor;

    private Boolean blockedByPM;

    private String reasonForBlockedByPM;

    private Integer assessmentScore;

    private Double technicalChallengeProgrammingScore;

    private Double technicalChallengeQuizScore;

    private Boolean interviewInviteSent;
    private Boolean acceptanceSent;

    private Boolean rejectionSent;

    @OneToMany(fetch = FetchType.EAGER, orphanRemoval = true)
    private Set<InstructorComment> instructorComments;

    private Boolean assessed;

    private Boolean accepted;
}
