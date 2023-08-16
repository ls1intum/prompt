package prompt.ls1.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.NamedQueries;
import org.hibernate.annotations.NamedQuery;

@Data
@Table
@Entity
@EqualsAndHashCode(callSuper = true)
@NamedQueries({
        @NamedQuery(
                name = "CoachApplication.findEnrolledApplicationsByCourseIterationId",
                query = "SELECT da FROM CoachApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.ENROLLED"
        ),
        @NamedQuery(
                name = "CoachApplication.findAcceptedApplicationsByCourseIterationId",
                query = "SELECT da FROM CoachApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.ACCEPTED"
        ),
        @NamedQuery(
                name = "CoachApplication.findRejectedApplicationsByCourseIterationId",
                query = "SELECT da FROM CoachApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.REJECTED"
        ),
        @NamedQuery(
                name = "CoachApplication.findPendingInterviewApplicationsByCourseIterationId",
                query = "SELECT da FROM CoachApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.PENDING_INTERVIEW"
        ),
        @NamedQuery(
                name = "CoachApplication.findNotAssessedApplicationsByCourseIterationId",
                query = "SELECT da FROM CoachApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.NOT_ASSESSED"
        )
})
public class CoachApplication extends Application {
    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Student student;

    @Lob
    @Column(length = 500)
    private String solvedProblem;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "project_team_id")
    private ProjectTeam projectTeam;
}
