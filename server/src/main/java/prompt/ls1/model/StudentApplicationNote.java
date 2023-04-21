package prompt.ls1.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;


@Data
@Entity
@Table(name = "student_application_note")
public class StudentApplicationNote implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinTable(	name = "user_note",
            joinColumns = @JoinColumn(name = "note_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private User author;

    @CreationTimestamp
    @Column(columnDefinition = "TIMESTAMP")
    private Date timestamp;

    @Lob
    @Column
    private String comment;

    @ManyToOne()
    @JoinColumn(name = "student_application_id")
    private StudentApplication studentApplication;
}
