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

    private StudyDegree studyDegree;

    private Short currentSemester;

    private StudyProgram studyProgram;

    private LanguageProficiency germanLanguageProficiency;

    private LanguageProficiency englishLanguageProficiency;

    private Set<Device> devices;

    private Set<Course> coursesTaken;

    @Lob
    private String experience;

    @Lob
    private String motivation;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_application_assessment_id")
    private StudentApplicationAssessment studentApplicationAssessment;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "project_team_id")
    private ProjectTeam projectTeam;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_intro_course_participation_id")
    private StudentIntroCourseParticipation introCourseParticipation;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_post_kickoff_submission_id")
    private StudentPostKickoffSubmission studentPostKickOffSubmission;

}
