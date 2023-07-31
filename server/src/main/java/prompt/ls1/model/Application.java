package prompt.ls1.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import prompt.ls1.model.enums.Course;
import prompt.ls1.model.enums.Device;
import prompt.ls1.model.enums.LanguageProficiency;
import prompt.ls1.model.enums.StudyDegree;
import prompt.ls1.model.enums.StudyProgram;

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

    @Enumerated(EnumType.STRING)
    private StudyDegree studyDegree;

    @Min(1)
    @Max(99)
    private Short currentSemester;

    @Enumerated(EnumType.STRING)
    private StudyProgram studyProgram;

    @Enumerated(EnumType.STRING)
    private LanguageProficiency germanLanguageProficiency;

    @Enumerated(EnumType.STRING)
    private LanguageProficiency englishLanguageProficiency;

    @Enumerated(EnumType.STRING)
    private Set<Device> devices;

    @Enumerated(EnumType.STRING)
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
