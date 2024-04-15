package prompt.ls1.service;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceConflictException;
import prompt.ls1.exception.ResourceInvalidParametersException;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.CourseIteration;
import prompt.ls1.model.DeveloperApplication;
import prompt.ls1.model.DevelopmentProfile;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.model.Student;
import prompt.ls1.model.StudentPostKickoffSubmission;
import prompt.ls1.model.enums.ApplicationStatus;
import prompt.ls1.repository.CourseIterationRepository;
import prompt.ls1.repository.DeveloperApplicationRepository;
import prompt.ls1.repository.IntroCourseParticipationRepository;
import prompt.ls1.repository.ProjectTeamRepository;
import prompt.ls1.repository.StudentRepository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class StudentPostKickoffSubmissionService {
    private final StudentRepository studentRepository;
    private final ProjectTeamRepository projectTeamRepository;
    private final DeveloperApplicationRepository developerApplicationRepository;
    private final CourseIterationRepository courseIterationRepository;
    private final IntroCourseParticipationRepository introCourseParticipationRepository;
    private final MailingService mailingService;

    @Autowired
    public StudentPostKickoffSubmissionService(
            final StudentRepository studentRepository,
            final ProjectTeamRepository projectTeamRepository,
            final DeveloperApplicationRepository developerApplicationRepository,
            final CourseIterationRepository courseIterationRepository,
            final IntroCourseParticipationRepository introCourseParticipationRepository,
            final MailingService mailingService) {
        this.studentRepository = studentRepository;
        this.projectTeamRepository = projectTeamRepository;
        this.developerApplicationRepository = developerApplicationRepository;
        this.courseIterationRepository = courseIterationRepository;
        this.introCourseParticipationRepository = introCourseParticipationRepository;
        this.mailingService = mailingService;
    }

    public void inviteStudentsToKickoffSubmission(final String courseIterationName) {
        final CourseIteration courseIteration = courseIterationRepository.findBySemesterName(courseIterationName)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Course iteration with name %s not found.", courseIterationName)));

        developerApplicationRepository
                .findAllByCourseIterationId(courseIteration.getId())
                .stream()
                .filter(da -> da.getAssessment() != null && da.getAssessment().getStatus() == ApplicationStatus.INTRO_COURSE_PASSED)
                .forEach(developerApplication -> {
                    try {
                        mailingService.sendKickoffSubmissionLinkEmail(developerApplication.getStudent(), courseIteration);
                        log.info(String.format("Kickoff submission invitation email sent to student with id %s.", developerApplication.getStudent().getId()));
                    } catch (MessagingException e) {
                        log.error(String.format("An error occurred while sending the kickoff submission invitation email to student with id %s.",
                                developerApplication.getStudent().getId()), e);
                    }
                });
    }

    public DevelopmentProfile verifyStudentFormAccess(final String studentPublicId, final String studentMatriculationNumber) {
        final CourseIteration courseIteration = courseIterationRepository.findWithKickoffSubmissionPeriodIncludes(new Date())
                .orElseThrow(() -> new ResourceNotFoundException("No course iteration with open preferences submission period found."));

        final Student student = studentRepository.findByPublicId(UUID.fromString(studentPublicId))
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Student with id %s not found.", studentPublicId)));

        if (!student.getMatriculationNumber().equals(studentMatriculationNumber)) {
            throw new ResourceInvalidParametersException("The public id provided does not match with the matriculation number.");
        }

        final DeveloperApplication developerApplication = developerApplicationRepository
                .findByStudentAndCourseIteration(student.getId(), courseIteration.getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Developer application for student with id %s not found.", student.getId())));

        if (!developerApplication.getAssessment().getStatus().equals(ApplicationStatus.INTRO_COURSE_PASSED)) {
            throw new ResourceInvalidParametersException("No developer application with passed intro course challenge and provided parameters found.");
        }

        if (developerApplication.getStudentPostKickOffSubmission() != null) {
            throw new ResourceConflictException("Developer post kickoff submission already exists.");
        }

        introCourseParticipationRepository.findByCourseIterationIdAndStudentId(
                courseIteration.getId(), student.getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Intro course participation for student with id %s not found.", student.getId())));

        return student.getDevelopmentProfile();
    }

    public List<StudentPostKickoffSubmission> getByCourseIteration(final String courseIterationName) {
        final CourseIteration courseIteration = courseIterationRepository.findBySemesterName(courseIterationName)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Course iteration with name %s not found.", courseIterationName)));

        final List<DeveloperApplication> applications = developerApplicationRepository.findIntroCoursePassedApplicationsByCourseIterationId(courseIteration.getId());

        return applications
                .stream()
                .filter(sa -> sa.getStudentPostKickOffSubmission() != null)
                .map(sa -> {
                    sa.getStudentPostKickOffSubmission().setStudent(sa.getStudent());
                    return sa.getStudentPostKickOffSubmission();
                }).toList();
    }

    public StudentPostKickoffSubmission create(final String studentId,
                                               StudentPostKickoffSubmission studentPostKickOffSubmission) {
        final CourseIteration courseIteration = courseIterationRepository.findWithKickoffSubmissionPeriodIncludes(new Date())
                .orElseThrow(() -> new ResourceNotFoundException("No course iteration with open preferences submission period found."));

        final Student student = studentRepository.findById(UUID.fromString(studentId))
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Student with id %s not found.", studentId)));

        final DeveloperApplication application = developerApplicationRepository
                .findByStudentAndCourseIteration(student.getId(), courseIteration.getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Developer application for student with id %s not found.", student.getId())));

        if (!application.getAssessment().getStatus().equals(ApplicationStatus.INTRO_COURSE_PASSED)) {
            throw new ResourceInvalidParametersException("No developer application with provided parameters and passed intro course challenge found.");
        }

       if (application.getStudentPostKickOffSubmission() != null) {
           throw new ResourceConflictException(String.format("Student preferences submission for student with id %s already exists.", student.getId()));
       }

        final List<ProjectTeam> projectTeams = projectTeamRepository
                .findAllByCourseIterationId(courseIteration.getId());

        studentPostKickOffSubmission.getStudentProjectTeamPreferences().forEach(studentProjectTeamPreference -> {
            if (projectTeams.stream().noneMatch(pt -> pt.getId().equals(studentProjectTeamPreference.getProjectTeamId()))) {
                throw new ResourceNotFoundException(String.format("Project team with id %s not found.", studentProjectTeamPreference.getProjectTeamId()));
            }
        });

        application.setStudentPostKickOffSubmission(studentPostKickOffSubmission);

        return developerApplicationRepository.save(application).getStudentPostKickOffSubmission();
    }

    public List<StudentPostKickoffSubmission> deleteByCourseIteration(final String courseIterationName) {
        final CourseIteration courseIteration = courseIterationRepository.findBySemesterName(courseIterationName)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Course iteration with name %s not found.", courseIterationName)));

        final List<DeveloperApplication> applications = developerApplicationRepository.findAllByCourseIterationId(courseIteration.getId());
        return applications.stream().map(sa -> {
            sa.getStudentPostKickOffSubmission().setStudentProjectTeamPreferences(null);
            return developerApplicationRepository.save(sa).getStudentPostKickOffSubmission();
        }).toList();
    }
}
