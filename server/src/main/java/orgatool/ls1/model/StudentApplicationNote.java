package orgatool.ls1.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.ZonedDateTime;


@Data
@Entity
@Table(name = "student_application_note")
public class StudentApplicationNote implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinTable(	name = "user_note",
            joinColumns = @JoinColumn(name = "note_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private User author;

    @CreationTimestamp
    private ZonedDateTime timestamp;

    @Lob
    private String comment;
}
