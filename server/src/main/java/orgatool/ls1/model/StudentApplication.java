package orgatool.ls1.model;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Set;

@Data
@Entity
@Table(name = "student_application")
@NamedEntityGraph(
        name = "student-application-entity-graph",
        attributeNodes = {
                @NamedAttributeNode(value = "notes", subgraph = "note-entity-subgraph"),
                @NamedAttributeNode("student")
        },
        subgraphs = {
                @NamedSubgraph(
                        name = "note-entity-subgraph",
                        attributeNodes = {
                                @NamedAttributeNode("author")
                        }
                )
        }
)
public class StudentApplication implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinTable(name = "student_student_application",
            joinColumns = @JoinColumn(name = "student_application_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id"))
    private Student student;

    private String studyDegree;

    private short currentSemester;

    private String studyProgram;

    @Lob
    private String experience;

    @Lob
    private String motivation;

    private boolean suggestedAsCoach;

    private boolean suggestedAsTutor;

    private boolean blockedByPM;

    private String reasonForBlockedByPM;

    @OneToMany(fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinTable(name = "note_student_application",
            joinColumns = @JoinColumn(name = "student_application_id"),
            inverseJoinColumns = @JoinColumn(name = "note_id"))
    private Set<StudentApplicationNote> notes;

}
