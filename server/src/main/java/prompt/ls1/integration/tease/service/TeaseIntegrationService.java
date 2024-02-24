package prompt.ls1.integration.tease.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.integration.tease.mapper.TeaseProjectMapper;
import prompt.ls1.integration.tease.mapper.TeaseSkillMapper;
import prompt.ls1.integration.tease.mapper.TeaseStudentMapper;
import prompt.ls1.integration.tease.model.Allocation;
import prompt.ls1.integration.tease.model.Project;
import prompt.ls1.integration.tease.model.Skill;
import prompt.ls1.integration.tease.model.Student;
import prompt.ls1.model.Application;
import prompt.ls1.model.DeveloperApplication;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.model.enums.ApplicationStatus;
import prompt.ls1.service.ApplicationService;
import prompt.ls1.service.CourseIterationService;
import prompt.ls1.service.ProjectTeamService;
import prompt.ls1.service.SkillService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TeaseIntegrationService {
    private final CourseIterationService courseIterationService;
    private final ApplicationService applicationService;
    private final ProjectTeamService projectTeamService;
    private final SkillService skillService;
    private final TeaseStudentMapper teaseStudentMapper;
    private final TeaseProjectMapper teaseProjectMapper;
    private final TeaseSkillMapper teaseSkillMapper;

    @Autowired
    public TeaseIntegrationService(final CourseIterationService courseIterationService,
                                   final ApplicationService applicationService,
                                   final ProjectTeamService projectTeamService,
                                   final SkillService skillService,
                                   final TeaseStudentMapper teaseStudentMapper,
                                   final TeaseProjectMapper teaseProjectMapper,
                                   final TeaseSkillMapper teaseSkillMapper) {
        this.courseIterationService = courseIterationService;
        this.applicationService = applicationService;
        this.projectTeamService = projectTeamService;
        this.skillService = skillService;
        this.teaseStudentMapper = teaseStudentMapper;
        this.teaseProjectMapper = teaseProjectMapper;
        this.teaseSkillMapper = teaseSkillMapper;
    }

    public List<Project> getProjects(final UUID courseIterationId) {
        final List<ProjectTeam> projectTeams = projectTeamService.findAllByCourseIterationId(courseIterationId);
        return projectTeams.stream().map(projectTeam -> teaseProjectMapper.toTeaseProject(projectTeam)).toList();
    }

    public List<Student> getStudents(final UUID courseIterationId) {
        final List<ApplicationStatus> excludedStatus = Arrays.asList(
                ApplicationStatus.NOT_ASSESSED,
                ApplicationStatus.PENDING_INTERVIEW,
                ApplicationStatus.ACCEPTED,
                ApplicationStatus.DROPPED_OUT,
                ApplicationStatus.INTRO_COURSE_NOT_PASSED,
                ApplicationStatus.REJECTED);
        final List<Application> applications = applicationService
                .findAllApplicationsByCourseIterationAndApplicationTypeAndApplicationStatus(
                        courseIterationId,
                        "developer",
                        Optional.empty())
                .stream()
                .filter(application -> !excludedStatus.contains(application.getAssessment().getStatus()))
                .toList();
        final List<ProjectTeam> projectTeams = projectTeamService.findAllByCourseIterationId(courseIterationId);

        return applications.stream().map(application ->
            teaseStudentMapper.toTeaseStudent((DeveloperApplication) application, projectTeams)
        ).toList();
    }

    public List<Skill> getSkills(final UUID courseIterationId) {
        final List<prompt.ls1.model.Skill> skills = skillService.getByCourseIterationId(courseIterationId);
        return skills.stream().map(teaseSkillMapper::toTeaseSkill).toList();
    }

    public List<Allocation> getAllocations(final UUID courseIterationId) {
        final List<Allocation> allocations = new ArrayList<>();
        final List<ProjectTeam> projectTeams = projectTeamService.findAllByCourseIterationId(courseIterationId);
        projectTeams.forEach(projectTeam -> {
            final Allocation allocation = new Allocation();
            allocation.setProjectId(projectTeam.getName());
            final List<DeveloperApplication> developerApplications =
                    applicationService.findDeveloperApplicationsByProjectTeamId(projectTeam.getId(), Optional.empty());
            allocation.setStudents(developerApplications.stream().map(developerApplication -> developerApplication.getStudent().getId()).toList());
            allocations.add(allocation);
        });

        return allocations;
    }

    public void saveAllocations(final UUID courseIterationId, final List<Allocation> allocations) {
        final List<UUID> assignedStudents = new ArrayList<>();
        allocations.forEach(allocation -> {
            final ProjectTeam projectTeam = projectTeamService.findByName(allocation.getProjectId());
            allocation.getStudents().forEach(studentId -> {
                applicationService.assignStudentToProjectTeam(courseIterationId, studentId, projectTeam.getId());
                assignedStudents.add(studentId);
            });
        });
        final List<ApplicationStatus> excludedStatus = Arrays.asList(
                ApplicationStatus.NOT_ASSESSED,
                ApplicationStatus.PENDING_INTERVIEW,
                ApplicationStatus.ACCEPTED,
                ApplicationStatus.DROPPED_OUT,
                ApplicationStatus.INTRO_COURSE_NOT_PASSED,
                ApplicationStatus.REJECTED);
        final List<Application> applications = applicationService
                .findAllApplicationsByCourseIterationAndApplicationTypeAndApplicationStatus(
                        courseIterationId,
                        "developer",
                        Optional.empty())
                .stream()
                .filter(application -> !excludedStatus.contains(application.getAssessment().getStatus()))
                .toList();
        applications.forEach(application -> {
            if (!assignedStudents.contains(((DeveloperApplication) application).getStudent().getId())) {
                applicationService.removeFromProjectTeam(application.getId());
            }
        });
    }
}
