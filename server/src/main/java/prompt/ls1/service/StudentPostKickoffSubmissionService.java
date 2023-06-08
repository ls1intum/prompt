package prompt.ls1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceConflictException;
import prompt.ls1.exception.ResourceInvalidParametersException;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.ApplicationSemester;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.model.Student;
import prompt.ls1.model.StudentApplication;
import prompt.ls1.model.StudentPostKickoffSubmission;
import prompt.ls1.repository.ApplicationSemesterRepository;
import prompt.ls1.repository.ProjectTeamRepository;
import prompt.ls1.repository.StudentApplicationRepository;
import prompt.ls1.repository.StudentRepository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class StudentPostKickoffSubmissionService {
    private final StudentRepository studentRepository;
    private final ProjectTeamRepository projectTeamRepository;
    private final StudentApplicationRepository studentApplicationRepository;
    private final ApplicationSemesterRepository applicationSemesterRepository;

    @Autowired
    public StudentPostKickoffSubmissionService(
            StudentRepository studentRepository,
            ProjectTeamRepository projectTeamRepository,
            StudentApplicationRepository studentApplicationRepository,
            ApplicationSemesterRepository applicationSemesterRepository) {
        this.studentRepository = studentRepository;
        this.projectTeamRepository = projectTeamRepository;
        this.studentApplicationRepository = studentApplicationRepository;
        this.applicationSemesterRepository = applicationSemesterRepository;
    }

    public List<StudentPostKickoffSubmission> getByApplicationSemester(final String applicationSemesterName) {
        final ApplicationSemester applicationSemester = applicationSemesterRepository.findBySemesterName(applicationSemesterName)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Application semester with name %s not found.", applicationSemesterName)));

        final List<StudentApplication> studentApplications = studentApplicationRepository.findAllByApplicationSemesterId(applicationSemester.getId());

        return studentApplications
                .stream().map(sa -> {
                    sa.getStudentPostKickOffSubmission().setStudent(sa.getStudent());
                    return sa.getStudentPostKickOffSubmission();
                }).toList();
    }

    public StudentPostKickoffSubmission create(final String studentPublicId,
                                               final String studentMatriculationNumber,
                                               StudentPostKickoffSubmission studentPostKickOffSubmission) {
        final ApplicationSemester applicationSemester = applicationSemesterRepository.findWithApplicationPeriodIncludes(new Date())
                .orElseThrow(() -> new ResourceNotFoundException("No application semester with open preferences submission period found."));

        final Student student = studentRepository.findByPublicId(UUID.fromString(studentPublicId))
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Student with id %s not found.", studentPublicId)));

        if (!student.getMatriculationNumber().equals(studentMatriculationNumber)) {
            throw new ResourceInvalidParametersException("The public id provided does not match with the matriculation number.");
        }

        final StudentApplication studentApplication = studentApplicationRepository
                .findByStudentAndApplicationSemester(student.getId(), applicationSemester.getId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Student application for student with id %s not found.", student.getId())));

       if (studentApplication.getStudentPostKickOffSubmission() != null) {
           throw new ResourceConflictException(String.format("Student preferences submission for student with id %s already exists.", student.getId()));
       }

        final List<ProjectTeam> projectTeams = projectTeamRepository
                .findAllByApplicationSemesterId(applicationSemester.getId());

        studentPostKickOffSubmission.getStudentProjectTeamPreferences().forEach(studentProjectTeamPreference -> {
            if (projectTeams.stream().noneMatch(pt -> pt.getId().equals(studentProjectTeamPreference.getProjectTeamId()))) {
                throw new ResourceNotFoundException(String.format("Project team with id %s not found.", studentProjectTeamPreference.getProjectTeamId()));
            }
        });

        studentApplication.setStudentPostKickOffSubmission(studentPostKickOffSubmission);

        return studentApplicationRepository.save(studentApplication).getStudentPostKickOffSubmission();
    }

    public List<StudentPostKickoffSubmission> deleteByApplicationSemester(final String applicationSemesterName) {
        final ApplicationSemester applicationSemester = applicationSemesterRepository.findBySemesterName(applicationSemesterName)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Application semester with name %s not found.", applicationSemesterName)));

        final List<StudentApplication> studentApplications = studentApplicationRepository.findAllByApplicationSemesterId(applicationSemester.getId());
        return studentApplications.stream().map(sa -> {
            sa.getStudentPostKickOffSubmission().setStudentProjectTeamPreferences(null);
            return studentApplicationRepository.save(sa).getStudentPostKickOffSubmission();
        }).toList();
    }
}
