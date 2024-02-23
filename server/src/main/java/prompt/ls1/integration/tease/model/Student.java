package prompt.ls1.integration.tease.model;

import lombok.Data;

@Data
public class Student {
    private String id;
    private String firstName;
    private String lastName;
    private String image;
    private String email;
    private String tumId;
    private String gender;
    private String nationality;
    private String studyDegree;
    private String studyProgram;
    private int semester;
    private String germanLanguageProficiency;
    private String englishLanguageProficiency;
    private String introSelfAssessment;
    private String introCourseProficiency;
    private String supervisorAssessment;
    private String[] devices;
    private StudentSkill[] skills;
    private Comment[] studentComments;
    private Comment[] tutorComments;
    private ProjectPreference[] projectPreferences;
}
