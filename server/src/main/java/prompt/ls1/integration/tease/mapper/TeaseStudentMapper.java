package prompt.ls1.integration.tease.mapper;

import org.springframework.stereotype.Component;
import prompt.ls1.integration.tease.model.Project;
import prompt.ls1.integration.tease.model.StudentSkill;
import prompt.ls1.model.Device;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.model.StudentApplication;
import prompt.ls1.model.StudentProjectTeamPreference;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Component
public class TeaseStudentMapper {

    public prompt.ls1.integration.tease.model.Student toTeaseStudent(final StudentApplication studentApplication,
                                                                     final List<ProjectTeam> projectTeams) {
        final prompt.ls1.integration.tease.model.Student teaseStudent = new prompt.ls1.integration.tease.model.Student();
        teaseStudent.setId(studentApplication.getStudent().getId().toString());
        teaseStudent.setFirstName(studentApplication.getStudent().getFirstName());
        teaseStudent.setLastName(studentApplication.getStudent().getLastName());
        // teaseStudent.setImage(student.getImage());
        teaseStudent.setEmail(studentApplication.getStudent().getEmail());
        teaseStudent.setTumId(studentApplication.getStudent().getTumId());
        teaseStudent.setGender(studentApplication.getStudent().getGender().getValue());
        teaseStudent.setNationality(studentApplication.getStudent().getNationality());
        teaseStudent.setStudyDegree(studentApplication.getStudyDegree().getValue());
        teaseStudent.setStudyProgram(studentApplication.getStudyProgram().getValue());
        teaseStudent.setSemester(studentApplication.getCurrentSemester());
        teaseStudent.setGermanLanguageProficiency(studentApplication.getGermanLanguageProficiency().getValue());
        teaseStudent.setEnglishLanguageProficiency(studentApplication.getEnglishLanguageProficiency().getValue());

        if (studentApplication.getIntroCourseParticipation() != null) {
            teaseStudent.setIntroSelfAssessment(studentApplication.getIntroCourseParticipation().getIntroCourseSelfAssessment().getValue());
            teaseStudent.setSupervisorAssessment(studentApplication.getIntroCourseParticipation().getSupervisorAssessment().getValue());
            teaseStudent.setStudentComments(studentApplication.getIntroCourseParticipation().getStudentComments());
            teaseStudent.setTutorComments(studentApplication.getIntroCourseParticipation().getTutorComments());
        }

        teaseStudent.setDevices(studentApplication.getDevices()
                .stream().map(Device::getValue).toArray(String[]::new));

        teaseStudent.setSkills(studentApplication.getStudentPostKickOffSubmission().getStudentSkills()
                .stream().map(studentSkill -> {
                    final StudentSkill skill = new StudentSkill();
                    skill.setId(studentSkill.getId().toString());
                    skill.setSkillProficiencyLevel(studentSkill.getSkillProficiency().getValue());
                    return skill;
                }).toArray(StudentSkill[]::new));

        teaseStudent.setProjectPriorities(studentApplication.getStudentPostKickOffSubmission().getStudentProjectTeamPreferences()
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
