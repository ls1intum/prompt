package prompt.ls1.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;


@Data
@Entity
@Table
public class InstructorComment implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String author;

    @CreationTimestamp
    @Column(columnDefinition = "TIMESTAMP")
    private Date timestamp;

    @Lob
    @Column
    private String text;

}
