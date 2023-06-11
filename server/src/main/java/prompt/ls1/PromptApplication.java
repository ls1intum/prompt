package prompt.ls1;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import prompt.ls1.model.CoursePhase;
import prompt.ls1.model.CoursePhaseType;
import prompt.ls1.service.CoursePhaseService;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@SpringBootApplication
public class PromptApplication implements ApplicationRunner {

	private static final Logger logger = LoggerFactory.getLogger(PromptApplication.class);
	@Autowired
	private CoursePhaseService coursePhaseService;

	public static void main(String[] args) {SpringApplication.run(PromptApplication.class, args);}

	@Override
	public void run(ApplicationArguments applicationArguments) {
		if (coursePhaseService.findAll().isEmpty()) {
			final List<CoursePhase> defaultCoursePhases = new ArrayList<>();
			defaultCoursePhases.add(new CoursePhase(UUID.randomUUID(), "Pre-Application", 0, CoursePhaseType.PRE_APPLICATION));
			defaultCoursePhases.add(new CoursePhase(UUID.randomUUID(), "Application", 1, CoursePhaseType.APPLICATION));
			defaultCoursePhases.add(new CoursePhase(UUID.randomUUID(), "Student Pre-Selection", 2, CoursePhaseType.STUDENT_PRE_SELECTION));
			defaultCoursePhases.add(new CoursePhase(UUID.randomUUID(), "Student Admission", 3, CoursePhaseType.STUDENT_ADMISSION));
			defaultCoursePhases.add(new CoursePhase(UUID.randomUUID(), "Intro Course Planning", 4, CoursePhaseType.INTRO_COURSE_PLANNING));
			defaultCoursePhases.add(new CoursePhase(UUID.randomUUID(), "Intro Course Assessment", 5, CoursePhaseType.INTRO_COURSE_ASSESSMENT));
			defaultCoursePhases.add(new CoursePhase(UUID.randomUUID(), "Project Preferences Collection", 6, CoursePhaseType.PROJECT_PREFERENCES_COLLECTION));
			defaultCoursePhases.add(new CoursePhase(UUID.randomUUID(), "Team Allocation", 7, CoursePhaseType.TEAM_ALLOCATION));
			defaultCoursePhases.add(new CoursePhase(UUID.randomUUID(), "Project Infrastructure Setup", 8, CoursePhaseType.PROJECT_INFRASTRUCTURE_SETUP));
			defaultCoursePhases.add(new CoursePhase(UUID.randomUUID(), "Intermediate Grading", 9, CoursePhaseType.INTERMEDIATE_GRADING));
			defaultCoursePhases.add(new CoursePhase(UUID.randomUUID(), "Final Delivery", 10, CoursePhaseType.FINAL_DELIVERY));
			defaultCoursePhases.add(new CoursePhase(UUID.randomUUID(), "Final Grading", 11, CoursePhaseType.FINAL_GRADING));

			defaultCoursePhases.forEach(coursePhase -> coursePhaseService.create(coursePhase));
			logger.info("Default course phases created.");
		}
	}

}
