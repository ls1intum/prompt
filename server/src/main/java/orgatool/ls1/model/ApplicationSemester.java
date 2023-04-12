package orgatool.ls1.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "application_semester")
public class ApplicationSemester {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true)
    private String semesterName;

    @Column(columnDefinition = "TIMESTAMP")
    private Date applicationPeriodStart;

    @Column(columnDefinition = "TIMESTAMP")
    private Date applicationPeriodEnd;
}
