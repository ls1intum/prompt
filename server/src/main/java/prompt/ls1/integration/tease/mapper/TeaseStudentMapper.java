package prompt.ls1.integration.tease.mapper;

import org.springframework.stereotype.Component;
import prompt.ls1.integration.tease.model.Skill;
import prompt.ls1.model.Device;
import prompt.ls1.model.Student;
import prompt.ls1.model.StudentApplication;

@Component
public class TeaseStudentMapper {

    public prompt.ls1.integration.tease.model.Student toTeaseStudent(final Student student,
                                                                     final StudentApplication studentApplication) {
        final prompt.ls1.integration.tease.model.Student teaseStudent = new prompt.ls1.integration.tease.model.Student();
        teaseStudent.setFirstName(student.getFirstName());
        teaseStudent.setLastName(student.getLastName());
        // teaseStudent.setImage(student.getImage());
        teaseStudent.setEmail(student.getEmail());
        teaseStudent.setTumId(student.getTumId());
        teaseStudent.setGender(student.getGender().getValue());
        teaseStudent.setNationality(student.getNationality());
        teaseStudent.setStudyProgram(studentApplication.getStudyProgram());
        teaseStudent.setSemester(studentApplication.getCurrentSemester());
        teaseStudent.setGermanLanguageProficiency(studentApplication.getGermanLanguageProficiency().getValue());
        teaseStudent.setEnglishLanguageProficiency(studentApplication.getEnglishLanguageProficiency().getValue());
        teaseStudent.setIntroSelfAssessment(studentApplication.getIntroCourseParticipation().getIntroCourseSelfAssessment().getValue());
        teaseStudent.setSupervisorAssessment(studentApplication.getIntroCourseParticipation().getSupervisorAssessment().getValue());
        teaseStudent.setDevices((String[]) studentApplication.getDevices()
                .stream().map(Device::getValue).toArray());
        teaseStudent.setSkills((Skill[]) studentApplication.getIntroCourseParticipation().getStudentSkills()
                .stream().map(studentSkill -> {
                    final Skill skill = new Skill();
                    skill.setTitle(studentSkill.getSkill().getTitle());
                    skill.setDescription(studentSkill.getSkill().getDescription());
                    skill.setSkillProficiencyLevel(studentSkill.getSkillProficiency().getValue());
                    return skill;
                }).toArray());
        // Project Priorities

        teaseStudent.setStudentComments(studentApplication.getIntroCourseParticipation().getStudentComments());
        teaseStudent.setTutorComments(studentApplication.getIntroCourseParticipation().getTutorComments());
        return teaseStudent;
    }
}
