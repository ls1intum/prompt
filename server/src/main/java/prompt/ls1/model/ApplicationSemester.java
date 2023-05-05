package prompt.ls1.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Data
@Entity
@Table(name = "application_semester")
public class ApplicationSemester {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String semesterName;

    @Column(unique = true)
    private String iosTag;

    @Column(columnDefinition = "DATE")
    private Date applicationPeriodStart;

    @Column(columnDefinition = "DATE")
    private Date applicationPeriodEnd;

    @Column(columnDefinition = "boolean default false")
    private Boolean projectTeamPreferencesSubmissionOpen;
}
