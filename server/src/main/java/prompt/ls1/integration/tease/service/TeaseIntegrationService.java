package prompt.ls1.integration.tease.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.integration.tease.mapper.TeaseSkillMapper;
import prompt.ls1.integration.tease.mapper.TeaseStudentMapper;
import prompt.ls1.integration.tease.model.Allocation;
import prompt.ls1.integration.tease.model.Skill;
import prompt.ls1.integration.tease.model.Student;
import prompt.ls1.model.ApplicationSemester;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.model.StudentApplication;
import prompt.ls1.service.ApplicationSemesterService;
import prompt.ls1.service.ProjectTeamService;
import prompt.ls1.service.SkillService;
import prompt.ls1.service.StudentApplicationService;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class TeaseIntegrationService {
    private final ApplicationSemesterService applicationSemesterService;
    private final StudentApplicationService studentApplicationService;
    private final ProjectTeamService projectTeamService;
    private final SkillService skillService;
    private final TeaseStudentMapper teaseStudentMapper;
    private final TeaseSkillMapper teaseSkillMapper;

    @Autowired
    public TeaseIntegrationService(final ApplicationSemesterService applicationSemesterService,
                                   final StudentApplicationService studentApplicationService,
                                   final ProjectTeamService projectTeamService,
                                   final SkillService skillService,
                                   final TeaseStudentMapper teaseStudentMapper,
                                   final TeaseSkillMapper teaseSkillMapper) {
        this.applicationSemesterService = applicationSemesterService;
        this.studentApplicationService = studentApplicationService;
        this.projectTeamService = projectTeamService;
        this.skillService = skillService;
        this.teaseStudentMapper = teaseStudentMapper;
        this.teaseSkillMapper = teaseSkillMapper;
    }

    public List<Student> getStudents() {
        final ApplicationSemester applicationSemester = applicationSemesterService.findWithOpenApplicationPeriod();
        final List<StudentApplication> studentApplications = studentApplicationService.findAllByApplicationSemester(applicationSemester.getId());
        final List<ProjectTeam> projectTeams = projectTeamService.findAllByApplicationSemesterId(applicationSemester.getId());

        return studentApplications.stream().map(studentApplication ->
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
                    studentApplicationService.assignProjectTeam(UUID.fromString(student.getId()), projectTeamId));
        });
    }
}
