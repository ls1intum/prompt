package prompt.ls1.integration.tease.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import prompt.ls1.integration.tease.model.Project;
import prompt.ls1.integration.tease.model.StudentSkill;
import prompt.ls1.model.DeveloperApplication;
import prompt.ls1.model.IntroCourseParticipation;
import prompt.ls1.model.enums.Device;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.model.StudentProjectTeamPreference;
import prompt.ls1.repository.IntroCourseParticipationRepository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Component
public class TeaseStudentMapper {
    private final IntroCourseParticipationRepository introCourseParticipationRepository;

    @Autowired
    public TeaseStudentMapper(final IntroCourseParticipationRepository introCourseParticipationRepository) {
        this.introCourseParticipationRepository = introCourseParticipationRepository;
    }

    public prompt.ls1.integration.tease.model.Student toTeaseStudent(final DeveloperApplication developerApplication,
                                                                     final List<ProjectTeam> projectTeams) {
        final prompt.ls1.integration.tease.model.Student teaseStudent = new prompt.ls1.integration.tease.model.Student();
        teaseStudent.setId(developerApplication.getStudent().getId().toString());
        teaseStudent.setFirstName(developerApplication.getStudent().getFirstName());
        teaseStudent.setLastName(developerApplication.getStudent().getLastName());
        // teaseStudent.setImage(student.getImage());
        teaseStudent.setEmail(developerApplication.getStudent().getEmail());
        teaseStudent.setTumId(developerApplication.getStudent().getTumId());
        teaseStudent.setGender(developerApplication.getStudent().getGender().getValue());
        teaseStudent.setNationality(developerApplication.getStudent().getNationality());
        teaseStudent.setStudyDegree(developerApplication.getStudyDegree().getValue());
        teaseStudent.setStudyProgram(developerApplication.getStudyProgram().getValue());
        teaseStudent.setSemester(developerApplication.getCurrentSemester());
        teaseStudent.setGermanLanguageProficiency(developerApplication.getGermanLanguageProficiency().getValue());
        teaseStudent.setEnglishLanguageProficiency(developerApplication.getEnglishLanguageProficiency().getValue());

        final Optional<IntroCourseParticipation> introCourseParticipation =
                introCourseParticipationRepository.findByStudentId(developerApplication.getStudent().getId());
        if (introCourseParticipation.isPresent()) {
            teaseStudent.setIntroSelfAssessment(introCourseParticipation.get().getSelfAssessment().getValue());
            teaseStudent.setSupervisorAssessment(introCourseParticipation.get().getSupervisorAssessment().getValue());
            teaseStudent.setStudentComments(introCourseParticipation.get().getStudentComments());
            teaseStudent.setTutorComments(introCourseParticipation.get().getTutorComments());
        }

        teaseStudent.setDevices(developerApplication.getDevices()
                .stream().map(Device::getValue).toArray(String[]::new));

        teaseStudent.setSkills(developerApplication.getStudentPostKickOffSubmission().getStudentSkills()
                .stream().map(studentSkill -> {
                    final StudentSkill skill = new StudentSkill();
                    skill.setId(studentSkill.getId().toString());
                    skill.setSkillProficiencyLevel(studentSkill.getSkillProficiency().getValue());
                    return skill;
                }).toArray(StudentSkill[]::new));

        teaseStudent.setProjectPriorities(developerApplication.getStudentPostKickOffSubmission().getStudentProjectTeamPreferences()
                .stream()
                .sorted(Comparator.comparingInt(StudentProjectTeamPreference::getPriorityScore))
                .map(preference -> {
                    final Project project = new Project();
                    project.setId(preference.getId().toString());
                    final Optional<ProjectTeam> projectTeam = projectTeams
                            .stream()
                            .filter(pt -> pt.getId().equals(preference.getProjectTeamId())).findFirst();
                    if (projectTeam.isPresent()) {
                        project.setName(projectTeam.get().getCustomer());
                    }
                    return project;
                }).toArray(Project[]::new));
        return teaseStudent;
    }
}
