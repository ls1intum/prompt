package prompt.ls1.integration.tease.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.integration.tease.mapper.TeaseSkillMapper;
import prompt.ls1.integration.tease.mapper.TeaseStudentMapper;
import prompt.ls1.integration.tease.model.Allocation;
import prompt.ls1.integration.tease.model.Skill;
import prompt.ls1.integration.tease.model.Student;
import prompt.ls1.model.CourseIteration;
import prompt.ls1.model.DeveloperApplication;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.service.ApplicationService;
import prompt.ls1.service.CourseIterationService;
import prompt.ls1.service.ProjectTeamService;
import prompt.ls1.service.SkillService;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class TeaseIntegrationService {
    private final CourseIterationService courseIterationService;
    private final ApplicationService applicationService;
    private final ProjectTeamService projectTeamService;
    private final SkillService skillService;
    private final TeaseStudentMapper teaseStudentMapper;
    private final TeaseSkillMapper teaseSkillMapper;

    @Autowired
    public TeaseIntegrationService(final CourseIterationService courseIterationService,
                                   final ApplicationService applicationService,
                                   final ProjectTeamService projectTeamService,
                                   final SkillService skillService,
                                   final TeaseStudentMapper teaseStudentMapper,
                                   final TeaseSkillMapper teaseSkillMapper) {
        this.courseIterationService = courseIterationService;
        this.applicationService = applicationService;
        this.projectTeamService = projectTeamService;
        this.skillService = skillService;
        this.teaseStudentMapper = teaseStudentMapper;
        this.teaseSkillMapper = teaseSkillMapper;
    }

    public List<Student> getStudents() {
        final CourseIteration courseIteration = courseIterationService.findWithOpenApplicationPeriod();
        final List<DeveloperApplication> applications = applicationService.findAllDeveloperApplicationsByCourseIteration(courseIteration.getId(), true);
        final List<ProjectTeam> projectTeams = projectTeamService.findAllByCourseIterationId(courseIteration.getId());

        return applications.stream().map(studentApplication ->
            teaseStudentMapper.toTeaseStudent(studentApplication, projectTeams)
        ).toList();
    }

    public List<Skill> getSkills() {
        final List<prompt.ls1.model.Skill> skills = skillService.getAll();
        return skills.stream().map(teaseSkillMapper::toTeaseSkill).toList();
    }

    public void saveAllocations(final List<Allocation> allocations) {
        allocations.forEach(allocation -> {
            final UUID projectTeamId = UUID.fromString(allocation.getProject().getId());
            Arrays.stream(allocation.getStudents()).toList().forEach(student ->
                    applicationService.assignDeveloperApplicationToProjectTeam(UUID.fromString(student.getId()), projectTeamId));
        });
    }
}
