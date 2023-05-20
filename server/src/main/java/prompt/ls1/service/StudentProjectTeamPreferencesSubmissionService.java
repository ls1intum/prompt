package prompt.ls1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceConflictException;
import prompt.ls1.exception.ResourceInvalidParametersException;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.ApplicationSemester;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.model.Student;
import prompt.ls1.model.StudentProjectTeamPreferencesSubmission;
import prompt.ls1.repository.ApplicationSemesterRepository;
import prompt.ls1.repository.ProjectTeamRepository;
import prompt.ls1.repository.StudentApplicationRepository;
import prompt.ls1.repository.StudentProjectTeamPreferencesSubmissionRepository;
import prompt.ls1.repository.StudentRepository;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudentProjectTeamPreferencesSubmissionService {

    private final StudentProjectTeamPreferencesSubmissionRepository studentProjectTeamPreferencesSubmissionRepository;
    private final StudentRepository studentRepository;
    private final ProjectTeamRepository projectTeamRepository;
    private final StudentApplicationRepository studentApplicationRepository;
    private final ApplicationSemesterRepository applicationSemesterRepository;

    @Autowired
    public StudentProjectTeamPreferencesSubmissionService(
            StudentProjectTeamPreferencesSubmissionRepository studentProjectTeamPreferencesSubmissionRepository,
            StudentRepository studentRepository,
            ProjectTeamRepository projectTeamRepository,
            StudentApplicationRepository studentApplicationRepository,
            ApplicationSemesterRepository applicationSemesterRepository) {
        this.studentProjectTeamPreferencesSubmissionRepository = studentProjectTeamPreferencesSubmissionRepository;
        this.studentRepository = studentRepository;
        this.projectTeamRepository = projectTeamRepository;
        this.studentApplicationRepository = studentApplicationRepository;
        this.applicationSemesterRepository = applicationSemesterRepository;
    }

    public List<StudentProjectTeamPreferencesSubmission> getByApplicationSemester(final String applicationSemesterName) {
        final ApplicationSemester applicationSemester = applicationSemesterRepository.findBySemesterName(applicationSemesterName)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Application semester with name %s not found.", applicationSemesterName)));

        final List<StudentProjectTeamPreferencesSubmission> studentProjectTeamPreferencesSubmissions = studentProjectTeamPreferencesSubmissionRepository
                .findAllByApplicationSemesterId(applicationSemester.getId());

        final List<UUID> studentIds = studentProjectTeamPreferencesSubmissions.stream()
                .map(StudentProjectTeamPreferencesSubmission::getStudentId)
                .distinct()
                .collect(Collectors.toList());
        final List<Student> students = studentRepository.findAllByIdIn(studentIds);

        studentProjectTeamPreferencesSubmissions.forEach(studentProjectTeamPreferencesSubmission ->
                students.stream().filter(std -> std.getId().equals(studentProjectTeamPreferencesSubmission.getStudentId()))
                        .findFirst()
                        .ifPresent(studentProjectTeamPreferencesSubmission::setStudent));

        return studentProjectTeamPreferencesSubmissions;
    }

    public StudentProjectTeamPreferencesSubmission create(final String studentPublicId,
                                                          final String studentMatriculationNumber,
                                                          StudentProjectTeamPreferencesSubmission studentProjectTeamPreferencesSubmission) {
        final ApplicationSemester applicationSemester = applicationSemesterRepository.findWithApplicationPeriodIncludes(new Date())
                .orElseThrow(() -> new ResourceNotFoundException("No application semester with open preferences submission period found."));

        final Student student = studentRepository.findByPublicId(studentPublicId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Student with id %s not found.", studentProjectTeamPreferencesSubmission.getStudentId())));

        if (!student.getMatriculationNumber().equals(studentMatriculationNumber)) {
            throw new ResourceInvalidParametersException("The public id provided does not match with the matriculation number.");
        }

        studentProjectTeamPreferencesSubmission.setStudentId(student.getId());

        studentApplicationRepository
                .findByStudentAndApplicationSemester(student.getId(), applicationSemester.getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Student application for student with id %s not found.", student.getId())));

        studentProjectTeamPreferencesSubmissionRepository
                .findByStudentIdAndApplicationSemesterId(student.getId(), applicationSemester.getId())
                .ifPresent(existing -> {
                    throw new ResourceConflictException(String.format("Student preferences submission for student with id %s already exists.", student.getId()));
                });

        final List<ProjectTeam> projectTeams = projectTeamRepository
                .findAllByApplicationSemesterId(studentProjectTeamPreferencesSubmission.getApplicationSemesterId());

        studentProjectTeamPreferencesSubmission.getStudentProjectTeamPreferences().forEach(studentProjectTeamPreference -> {
            if (projectTeams.stream().noneMatch(pt -> pt.getId().equals(studentProjectTeamPreference.getProjectTeamId()))) {
                throw new ResourceNotFoundException(String.format("Project team with id %s not found.", studentProjectTeamPreference.getProjectTeamId()));
            }
        });

        return studentProjectTeamPreferencesSubmissionRepository.save(studentProjectTeamPreferencesSubmission);
    }

    public void deleteByApplicationSemester(final String applicationSemesterName) {
        final ApplicationSemester applicationSemester = applicationSemesterRepository.findBySemesterName(applicationSemesterName)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Application semester with name %s not found.", applicationSemesterName)));

        studentProjectTeamPreferencesSubmissionRepository.deleteAllByApplicationSemesterId(applicationSemester.getId());
    }
}
