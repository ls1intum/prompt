package prompt.ls1.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
                name = "DeveloperApplication.findEnrolledApplicationsByCourseIterationId",
                query = "SELECT da FROM DeveloperApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.ENROLLED"
        ),
        @NamedQuery(
                name = "DeveloperApplication.findAcceptedApplicationsByCourseIterationId",
                query = "SELECT da FROM DeveloperApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.ACCEPTED"
        ),
        @NamedQuery(
                name = "DeveloperApplication.findRejectedApplicationsByCourseIterationId",
                query = "SELECT da FROM DeveloperApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.REJECTED"
        ),
        @NamedQuery(
                name = "DeveloperApplication.findPendingInterviewApplicationsByCourseIterationId",
                query = "SELECT da FROM DeveloperApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.PENDING_INTERVIEW"
        ),
        @NamedQuery(
                name = "DeveloperApplication.findNotAssessedApplicationsByCourseIterationId",
                query = "SELECT da FROM DeveloperApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.NOT_ASSESSED"
        ),
        @NamedQuery(
                name = "DeveloperApplication.findIntroCoursePassedApplicationsByCourseIterationId",
                query = "SELECT da FROM DeveloperApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.INTRO_COURSE_PASSED"
        ),
        @NamedQuery(
                name = "DeveloperApplication.findIntroCourseNotPassedApplicationsByCourseIterationId",
                query = "SELECT da FROM DeveloperApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.INTRO_COURSE_NOT_PASSED"
        )
})
public class DeveloperApplication extends Application {
    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Student student;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "post_kickoff_submission_id")
    private StudentPostKickoffSubmission studentPostKickOffSubmission;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "project_team_id")
    private ProjectTeam projectTeam;
}
