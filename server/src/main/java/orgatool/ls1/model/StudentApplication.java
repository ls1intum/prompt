package orgatool.ls1.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "student_application")
public class StudentApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinTable(name = "student_student_application",
            joinColumns = @JoinColumn(name = "student_application_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id"))
    private Student student;

    @ManyToOne(targetEntity = ApplicationSemester.class)
    @JoinColumn(name ="application_semester_id", referencedColumnName = "id")
    private ApplicationSemester applicationSemester;

    private String studyDegree;

    private Short currentSemester;

    private String studyProgram;

    @Lob
    private String experience;

    @Lob
    private String motivation;

    private Boolean suggestedAsCoach;

    private Boolean suggestedAsTutor;

    private Boolean blockedByPM;

    private String reasonForBlockedByPM;

    private Integer assessmentScore;

    @OneToMany(fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinTable(name = "note_student_application",
            joinColumns = @JoinColumn(name = "student_application_id"),
            inverseJoinColumns = @JoinColumn(name = "note_id"))
    private Set<StudentApplicationNote> notes;

    private Boolean assessed;

    private Boolean accepted;

    @ManyToOne()
    @JoinColumn(name = "project_team_id")
    private ProjectTeam projectTeam;

}
