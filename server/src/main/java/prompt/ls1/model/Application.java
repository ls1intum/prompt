package prompt.ls1.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@MappedSuperclass
public abstract class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(targetEntity = CourseIteration.class)
    @JoinColumn(name ="course_iteration_id", referencedColumnName = "id")
    private CourseIteration courseIteration;

    private StudyDegree studyDegree;

    @Min(1)
    @Max(99)
    private Short currentSemester;

    private StudyProgram studyProgram;

    private LanguageProficiency germanLanguageProficiency;

    private LanguageProficiency englishLanguageProficiency;

    private Set<Device> devices;

    private Set<Course> coursesTaken;

    @Lob
    @Column(length = 500)
    private String experience;

    @Lob
    @Column(length = 500)
    private String motivation;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "application_assessment_id")
    private ApplicationAssessment assessment;

}
