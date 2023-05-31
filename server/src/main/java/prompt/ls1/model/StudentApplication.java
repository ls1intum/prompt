package prompt.ls1.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table
public class StudentApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinTable(name = "student_student_application",
            joinColumns = @JoinColumn(name = "student_application_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "student_id", referencedColumnName = "id"))
    private Student student;

    @ManyToOne(targetEntity = ApplicationSemester.class)
    @JoinColumn(name ="application_semester_id", referencedColumnName = "id")
    private ApplicationSemester applicationSemester;

    private String studyDegree;

    private Short currentSemester;

    private String studyProgram;

    private LanguageProficiency germanLanguageProficiency;

    private LanguageProficiency englishLanguageProficiency;

    private Set<Device> devices;

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
    private Set<StudentApplicationNote> notes;

    private Boolean assessed;

    private Boolean accepted;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "project_team_id")
    private ProjectTeam projectTeam;

    @OneToOne
    @MapsId
    private StudentIntroCourseParticipation introCourseParticipation;

}
