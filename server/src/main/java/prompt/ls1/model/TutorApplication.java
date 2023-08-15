package prompt.ls1.model;

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
                name = "TutorApplication.findEnrolledApplicationsByCourseIterationId",
                query = "SELECT da FROM TutorApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.ENROLLED"
        ),
        @NamedQuery(
                name = "TutorApplication.findAcceptedApplicationsByCourseIterationId",
                query = "SELECT da FROM TutorApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.ACCEPTED"
        ),
        @NamedQuery(
                name = "TutorApplication.findRejectedApplicationsByCourseIterationId",
                query = "SELECT da FROM TutorApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.REJECTED"
        ),
        @NamedQuery(
                name = "TutorApplication.findPendingInterviewApplicationsByCourseIterationId",
                query = "SELECT da FROM TutorApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.PENDING_INTERVIEW"
        ),
        @NamedQuery(
                name = "TutorApplication.findNotAssessedApplicationsByCourseIterationId",
                query = "SELECT da FROM TutorApplication da WHERE da.courseIterationId = :courseIterationId " +
                        "AND da.assessment.status = prompt.ls1.model.enums.ApplicationStatus.NOT_ASSESSED"
        )
})
public class TutorApplication extends Application {
    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Student student;

    @Lob
    @Column(length = 500)
    private String reasonGoodTutor;
}
