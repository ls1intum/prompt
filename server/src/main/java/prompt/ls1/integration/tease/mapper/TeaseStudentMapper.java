package prompt.ls1.integration.tease.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import prompt.ls1.integration.tease.model.Comment;
import prompt.ls1.integration.tease.model.LanguageProficiency;
import prompt.ls1.integration.tease.model.ProjectPreference;
import prompt.ls1.integration.tease.model.StudentSkill;
import prompt.ls1.model.DeveloperApplication;
import prompt.ls1.model.IntroCourseParticipation;
import prompt.ls1.model.ProjectTeam;
import prompt.ls1.model.StudentProjectTeamPreference;
import prompt.ls1.model.enums.Device;
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

        final LanguageProficiency germanLanguageProficiency = new LanguageProficiency();
        germanLanguageProficiency.setLanguage("de");
        germanLanguageProficiency.setProficiency(developerApplication.getGermanLanguageProficiency().getValue());
        final LanguageProficiency englishLanguageProficiency = new LanguageProficiency();
        englishLanguageProficiency.setLanguage("en");
        englishLanguageProficiency.setProficiency(developerApplication.getEnglishLanguageProficiency().getValue());
        teaseStudent.setLanguages(new LanguageProficiency[]{ germanLanguageProficiency, englishLanguageProficiency });

        final Optional<IntroCourseParticipation> introCourseParticipation =
                introCourseParticipationRepository.findByStudentId(developerApplication.getStudent().getId());
        if (introCourseParticipation.isPresent()) {
            if (introCourseParticipation.get().getSelfAssessment() != null) {
                teaseStudent.setIntroSelfAssessment(introCourseParticipation.get().getSelfAssessment().getValue());
            }
            if (introCourseParticipation.get().getSupervisorAssessment() != null) {
                teaseStudent.setSupervisorAssessment(introCourseParticipation.get().getSupervisorAssessment().getValue());
            }

            if (introCourseParticipation.get().getStudentComments() != null &&
                    introCourseParticipation.get().getStudentComments().length() > 0) {
                Comment comment = new Comment();
                comment.setAuthor(String.format("%s %s",
                        developerApplication.getStudent().getFirstName(),
                        developerApplication.getStudent().getLastName()));
                comment.setText(introCourseParticipation.get().getStudentComments());
                teaseStudent.setStudentComments(new Comment[]{ comment });
            }

            if (introCourseParticipation.get().getTutorComments() != null &&
                    introCourseParticipation.get().getTutorComments().length() > 0) {
                Comment comment = new Comment();
                comment.setText(introCourseParticipation.get().getTutorComments());
                teaseStudent.setTutorComments(new Comment[]{ comment });
            }
        }

        teaseStudent.setDevices(developerApplication.getDevices()
                .stream().map(Device::getValue).toArray(String[]::new));

        teaseStudent.setSkills(developerApplication.getStudentPostKickOffSubmission().getStudentSkills()
                .stream().map(studentSkill -> {
                    final StudentSkill skill = new StudentSkill();
                    skill.setId(studentSkill.getSkill().getId().toString());
                    skill.setProficiency(studentSkill.getSkillProficiency().getValue());
                    return skill;
                }).toArray(StudentSkill[]::new));

        teaseStudent.setProjectPreferences(developerApplication.getStudentPostKickOffSubmission().getStudentProjectTeamPreferences()
                .stream()
                .sorted(Comparator.comparingInt(StudentProjectTeamPreference::getPriorityScore))
                .map(preference -> {
                    final ProjectPreference projectPreference = new ProjectPreference();
                    final Optional<ProjectTeam> projectTeam = projectTeams
                            .stream()
                            .filter(pt -> pt.getId().equals(preference.getProjectTeamId())).findFirst();
                    if (projectTeam.isPresent()) {
                        projectPreference.setProjectId(projectTeam.get().getName());
                    }
                    projectPreference.setPriority(preference.getPriorityScore());

                    return projectPreference;
                }).toArray(ProjectPreference[]::new));
        return teaseStudent;
    }
}
