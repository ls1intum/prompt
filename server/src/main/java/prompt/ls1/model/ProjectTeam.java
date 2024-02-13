package prompt.ls1.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import java.io.Serializable;
import java.util.UUID;

@Data
@Entity
@Table
public class ProjectTeam implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String name;

    @Column(unique = true)
    private String projectKey;

    @Column
    private String customer;

    @Column(length = 20)
    @Length(max = 20)
    private String projectLeadTumId;

    @Column(length = 20)
    @Length(max = 20)
    private String coachTumId;

    @ManyToOne
    @JoinColumn(name ="course_iteration_id", referencedColumnName = "id")
    private CourseIteration courseIteration;
}
