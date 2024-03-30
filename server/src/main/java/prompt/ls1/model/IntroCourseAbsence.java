package prompt.ls1.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.util.Date;
import java.util.UUID;

@Data
@Entity
@Table
public class IntroCourseAbsence {
    @AllArgsConstructor
    @Getter
    private enum IntroCourseAbsenceReportStatus {
        PENDING("Pending"),
        ACCEPTED("Accepted"),
        REJECTED("Rejected");

        private String value;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(columnDefinition = "DATE")
    private Date date;
    
    private String excuse;

    private Boolean selfReported;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "intro_course_absence_report_status")
    private IntroCourseAbsenceReportStatus status;

    public void pend() {
        this.status = IntroCourseAbsenceReportStatus.PENDING;
    }

    public void accept() {
        this.status = IntroCourseAbsenceReportStatus.ACCEPTED;
    }

    public void reject() {
        this.status = IntroCourseAbsenceReportStatus.REJECTED;
    }
}
