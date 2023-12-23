package prompt.ls1.service;

import jakarta.mail.BodyPart;
import jakarta.mail.MessagingException;
import jakarta.mail.Multipart;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import prompt.ls1.model.CoachApplication;
import prompt.ls1.model.CourseIteration;
import prompt.ls1.model.DeveloperApplication;
import prompt.ls1.model.Student;
import prompt.ls1.model.ThesisAdvisor;
import prompt.ls1.model.ThesisApplication;
import prompt.ls1.model.TutorApplication;
import prompt.ls1.model.enums.FocusTopic;
import prompt.ls1.model.enums.ResearchArea;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.TimeZone;

@Service
public class MailingService {

    private final JavaMailSender javaMailSender;
    private final FileSystemStorageService storageService;
    private final String environment;
    private final String sender;
    private final String chairMemberRecipientsList;
    private final Path rootLocation;

    @Autowired
    public MailingService(final JavaMailSender javaMailSender,
                          final FileSystemStorageService storageService,
                          @Value("${prompt.environment}") String environment,
                          @Value("${prompt.mail.sender}") String sender,
                          @Value("${prompt.mail.chair-member-recipients}") String chairMemberRecipientsList,
                          @Value("${prompt.storage.mailing-templates-location}") String mailingTemplatesLocation) {
        this.javaMailSender = javaMailSender;
        this.storageService = storageService;
        this.environment = environment;
        this.sender = sender;
        this.chairMemberRecipientsList = chairMemberRecipientsList;
        this.rootLocation = Paths.get(mailingTemplatesLocation);
    }

    public String getMailTemplate(final String filename) {
        return storageService.readFromFile(rootLocation, filename + ".html");
    }

    public void updateMailTemplate(final String filename, final String htmlContents) {
        storageService.writeToFile(rootLocation, filename + ".html", htmlContents);
    }

    public void thesisApplicationCreatedEmail(final Student student,
                                              final ThesisApplication thesisApplication) throws MessagingException, IOException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        Arrays.asList(chairMemberRecipientsList.split(";")).forEach(recipient -> {
            try {
                message.addRecipients(MimeMessage.RecipientType.TO, recipient);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        });

        message.setSubject("PROMPT | New Thesis Application");

        String template = storageService.readFromFile(rootLocation, "thesis-application-created.html");
        template = fillStudentPlaceholders(template, student);
        template = fillThesisApplicationPlaceholders(template, thesisApplication);

        Multipart multipart = new MimeMultipart();

        BodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setContent(template, "text/html; charset=utf-8");
        multipart.addBodyPart(messageBodyPart);

        MimeBodyPart examinationReportAttachment = new MimeBodyPart();
        examinationReportAttachment.attachFile(new File("thesis_application_uploads/" + thesisApplication.getExaminationReportFilename()));
        multipart.addBodyPart(examinationReportAttachment);

        MimeBodyPart cvAttachment = new MimeBodyPart();
        cvAttachment.attachFile(new File("thesis_application_uploads/" + thesisApplication.getCvFilename()));
        multipart.addBodyPart(cvAttachment);

        if (thesisApplication.getBachelorReportFilename() != null && !thesisApplication.getBachelorReportFilename().isBlank()) {
            MimeBodyPart bachelorReportAttachment = new MimeBodyPart();
            bachelorReportAttachment.attachFile(new File("thesis_application_uploads/" + thesisApplication.getBachelorReportFilename()));
            multipart.addBodyPart(bachelorReportAttachment);
        }

        message.setContent(multipart);

        javaMailSender.send(message);
    }

    public void sendThesisApplicationConfirmationEmail(final Student student,
                                              final ThesisApplication thesisApplication) throws MessagingException, IOException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());

        message.setSubject("PROMPT | Thesis Application Confirmation");

        String template = storageService.readFromFile(rootLocation, "thesis-application-confirmation.html");
        template = fillStudentPlaceholders(template, student);
        template = fillThesisApplicationPlaceholders(template, thesisApplication);

        Multipart multipart = new MimeMultipart();

        BodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setContent(template, "text/html; charset=utf-8");
        multipart.addBodyPart(messageBodyPart);

        MimeBodyPart examinationReportAttachment = new MimeBodyPart();
        examinationReportAttachment.attachFile(new File("thesis_application_uploads/" + thesisApplication.getExaminationReportFilename()));
        multipart.addBodyPart(examinationReportAttachment);

        MimeBodyPart cvAttachment = new MimeBodyPart();
        cvAttachment.attachFile(new File("thesis_application_uploads/" + thesisApplication.getCvFilename()));
        multipart.addBodyPart(cvAttachment);

        if (thesisApplication.getBachelorReportFilename() != null && !thesisApplication.getBachelorReportFilename().isBlank()) {
            MimeBodyPart bachelorReportAttachment = new MimeBodyPart();
            bachelorReportAttachment.attachFile(new File("thesis_application_uploads/" + thesisApplication.getBachelorReportFilename()));
            multipart.addBodyPart(bachelorReportAttachment);
        }

        message.setContent(multipart);

        javaMailSender.send(message);
    }

    public void sendDeveloperApplicationConfirmationEmail(final Student student,
                                                          final DeveloperApplication developerApplication,
                                                          final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("iPraktikum %s Application Confirmation", courseIteration.getSemesterName()));

        String template = storageService.readFromFile(rootLocation, "developer-application-confirmation.html");
        template = fillCourseIterationPlaceholders(template, courseIteration);
        template = fillStudentPlaceholders(template, student);
        template = fillDeveloperApplicationPlaceholders(template, developerApplication);

        message.setContent(template, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendCoachApplicationConfirmationEmail(final Student student,
                                                          final CoachApplication coachApplication,
                                                          final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("Agile Project Management %s Application Confirmation", courseIteration.getSemesterName()));

        String template = storageService.readFromFile(rootLocation, "coach-application-confirmation.html");
        template = fillCourseIterationPlaceholders(template, courseIteration);
        template = fillStudentPlaceholders(template, student);
        template = fillCoachApplicationPlaceholders(template, coachApplication);

        message.setContent(template, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendTutorApplicationConfirmationEmail(final Student student,
                                                      final TutorApplication tutorApplication,
                                                      final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("Teaching iOS %s Application Confirmation", courseIteration.getSemesterName()));

        String template = storageService.readFromFile(rootLocation, "tutor-application-confirmation.html");
        template = fillCourseIterationPlaceholders(template, courseIteration);
        template = fillStudentPlaceholders(template, student);
        template = fillTutorApplicationPlaceholders(template, tutorApplication);

        message.setContent(template, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendCoachInterviewInvitationEmail(final Student student,
                                                  final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("Agile Project Management %s Interview Invitation", courseIteration.getSemesterName()));

        TimeZone timeZone = TimeZone.getTimeZone("Europe/Paris");
        SimpleDateFormat dateFormat = new SimpleDateFormat("EEEE, dd.MM.yyyy 'starting at' HH.mm");
        dateFormat.setTimeZone(timeZone);
        String dayOfWeek = dateFormat.format(courseIteration.getCoachInterviewDate());

        String template = storageService.readFromFile(rootLocation, "coach-interview-invitation.html");
        template = fillCourseIterationPlaceholders(template, courseIteration);
        template = fillStudentPlaceholders(template, student);

        message.setContent(template, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendTutorInterviewInvitationEmail(final Student student,
                                                  final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("Teaching iOS %s Interview Invitation", courseIteration.getSemesterName()));

        String template = storageService.readFromFile(rootLocation, "tutor-interview-invitation.html");
        template = fillCourseIterationPlaceholders(template, courseIteration);
        template = fillStudentPlaceholders(template, student);

        message.setContent(template, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendCoachApplicationRejectionEmail(final Student student,
                                                  final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("Agile Project Management %s Application Rejection", courseIteration.getSemesterName()));

        String template = storageService.readFromFile(rootLocation, "coach-application-rejection.html");
        template = fillCourseIterationPlaceholders(template, courseIteration);
        template = fillStudentPlaceholders(template, student);

        message.setContent(template, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendTutorApplicationRejectionEmail(final Student student,
                                                  final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("Teaching iOS %s Application Rejection", courseIteration.getSemesterName()));

        String template = storageService.readFromFile(rootLocation, "tutor-application-rejection.html");
        template = fillCourseIterationPlaceholders(template, courseIteration);
        template = fillStudentPlaceholders(template, student);

        message.setContent(template, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendCoachApplicationAcceptanceEmail(final Student student,
                                                   final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("Agile Project Management %s Application Acceptance", courseIteration.getSemesterName()));

        String template = storageService.readFromFile(rootLocation, "coach-application-acceptance.html");
        template = fillCourseIterationPlaceholders(template, courseIteration);
        template = fillStudentPlaceholders(template, student);

        message.setContent(template, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendTutorApplicationAcceptanceEmail(final Student student,
                                                   final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("Teaching iOS %s Application Acceptance", courseIteration.getSemesterName()));

        String template = storageService.readFromFile(rootLocation, "tutor-application-acceptance.html");
        template = fillCourseIterationPlaceholders(template, courseIteration);
        template = fillStudentPlaceholders(template, student);

        message.setContent(template, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendKickoffSubmissionLinkEmail(final Student student,
                                               final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("iPraktikum %s Kick-off Project Preferences", courseIteration.getSemesterName()));

        String template = storageService.readFromFile(rootLocation, "kick-off-submission-invitation.html");
        template = fillCourseIterationPlaceholders(template, courseIteration);
        template = fillStudentPlaceholders(template, student);

        message.setContent(template, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendTechnicalDetailsSubmissionInvitationEmail(final Student student,
                                                          final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("iPraktikum %s Technical Details Submission", courseIteration.getSemesterName()));

        String template = storageService.readFromFile(rootLocation, "technical-details-submission-invitation.html");
        template = fillCourseIterationPlaceholders(template, courseIteration);
        template = fillStudentPlaceholders(template, student);

        message.setContent(template, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendThesisAcceptanceEmail(final Student student,
                                          final ThesisApplication thesisApplication,
                                          final ThesisAdvisor thesisAdvisor) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        if (environment.equals("prod")) {
            message.addRecipients(MimeMessage.RecipientType.CC, "krusche@tum.de");
        }
        message.addRecipients(MimeMessage.RecipientType.BCC, "valeryia.andraichuk@tum.de");
        message.setSubject("Thesis Application Acceptance");

        String template;
        if (!thesisAdvisor.getEmail().equals("krusche@tum.de")) {
            message.addRecipients(MimeMessage.RecipientType.CC, thesisAdvisor.getEmail());

            template = storageService.readFromFile(rootLocation, "thesis-application-acceptance.html");
            template = fillThesisAdvisorPlaceholders(template, thesisAdvisor);
        } else {
            template = storageService.readFromFile(rootLocation, "thesis-application-acceptance-no-advisor.html");
        }
        template = fillStudentPlaceholders(template, student);
        template = fillThesisApplicationPlaceholders(template, thesisApplication);
        message.setContent(template, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendThesisRejectionEmail(final Student student, final ThesisApplication thesisApplication) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        if (environment.equals("prod")) {
            message.addRecipients(MimeMessage.RecipientType.BCC, "krusche@tum.de");
        }
        message.addRecipients(MimeMessage.RecipientType.BCC, "valeryia.andraichuk@tum.de");
        message.setSubject("Thesis Application Rejection");

        String template = storageService.readFromFile(rootLocation, "thesis-application-rejection.html");
        template = fillStudentPlaceholders(template, student);
        template = fillThesisApplicationPlaceholders(template, thesisApplication);

        message.setContent(template, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public String fillCourseIterationPlaceholders(final String template, final CourseIteration courseIteration) {
        String pattern = "dd. MMM yyyy";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);

        return template.replace("{{course.semesterName}}", courseIteration.getSemesterName())
                .replace("{{course.id}}", courseIteration.getId().toString())
                .replace("{{course.iosTag}}", courseIteration.getIosTag())
                .replace("{{course.developerApplicationPeriodStart}}", simpleDateFormat.format(courseIteration.getDeveloperApplicationPeriodStart()))
                .replace("{{course.developerApplicationPeriodEnd}}", simpleDateFormat.format(courseIteration.getDeveloperApplicationPeriodEnd()))
                .replace("{{course.coachApplicationPeriodStart}}", simpleDateFormat.format(courseIteration.getCoachApplicationPeriodStart()))
                .replace("{{course.coachApplicationPeriodEnd}}", simpleDateFormat.format(courseIteration.getCoachApplicationPeriodEnd()))
                .replace("{{course.tutorApplicationPeriodStart}}", simpleDateFormat.format(courseIteration.getTutorApplicationPeriodStart()))
                .replace("{{course.tutorApplicationPeriodEnd}}", simpleDateFormat.format(courseIteration.getTutorApplicationPeriodEnd()))
                .replace("{{course.coachInterviewDate}}", simpleDateFormat.format(courseIteration.getCoachInterviewDate()))
                .replace("{{course.tutorInterviewDate}}", simpleDateFormat.format(courseIteration.getTutorInterviewDate()))
                .replace("{{course.coachInterviewPlannerLink}}", courseIteration.getCoachInterviewPlannerLink())
                .replace("{{course.tutorInterviewPlannerLink}}", courseIteration.getTutorInterviewPlannerLink())
                .replace("{{course.coachInterviewLocation}}", courseIteration.getCoachInterviewLocation())
                .replace("{{course.tutorInterviewLocation}}", courseIteration.getTutorInterviewLocation())
                .replace("{{course.introCourseStart}}", simpleDateFormat.format(courseIteration.getIntroCourseStart()))
                .replace("{{course.introCourseEnd}}", simpleDateFormat.format(courseIteration.getIntroCourseEnd()))
                .replace("{{course.kickoffSubmissionPeriodStart}}", simpleDateFormat.format(courseIteration.getKickoffSubmissionPeriodStart()));
    }

    private String fillDeveloperApplicationPlaceholders(final String template, final DeveloperApplication developerApplication) {
        return template.replace("{{application.studyDegree}}", developerApplication.getStudyDegree().getValue())
                .replace("{{application.studyProgram}}", developerApplication.getStudyProgram().getValue())
                .replace("{{application.currentSemester}}", developerApplication.getCurrentSemester().toString())
                .replace("{{application.devices}}", String.join(", ", developerApplication.getDevices().stream().map(Enum::toString).toList()))
                .replace("{{application.coursesTaken}}", String.join(", ", developerApplication.getCoursesTaken().stream().map(Enum::toString).toList()))
                .replace("{{application.germanLanguageProficiency}}", developerApplication.getGermanLanguageProficiency().getValue())
                .replace("{{application.englishLanguageProficiency}}", developerApplication.getEnglishLanguageProficiency().getValue())
                .replace("{{application.motivation}}", developerApplication.getMotivation())
                .replace("{{application.experience}}", developerApplication.getExperience());
    }

    private String fillCoachApplicationPlaceholders(final String template, final CoachApplication coachApplication) {
        return template.replace("{{application.studyDegree}}", coachApplication.getStudyDegree().getValue())
                .replace("{{application.studyProgram}}", coachApplication.getStudyProgram().getValue())
                .replace("{{application.currentSemester}}", coachApplication.getCurrentSemester().toString())
                .replace("{{application.devices}}", String.join(", ", coachApplication.getDevices().stream().map(Enum::toString).toList()))
                .replace("{{application.coursesTaken}}", String.join(", ", coachApplication.getCoursesTaken().stream().map(Enum::toString).toList()))
                .replace("{{application.germanLanguageProficiency}}", coachApplication.getGermanLanguageProficiency().getValue())
                .replace("{{application.englishLanguageProficiency}}", coachApplication.getEnglishLanguageProficiency().getValue())
                .replace("{{application.motivation}}", coachApplication.getMotivation())
                .replace("{{application.experience}}", coachApplication.getExperience())
                .replace("{{application.solvedProblem}}", coachApplication.getSolvedProblem());
    }

    private String fillTutorApplicationPlaceholders(final String template, final TutorApplication tutorApplication) {
        return template.replace("{{application.studyDegree}}", tutorApplication.getStudyDegree().getValue())
                .replace("{{application.studyProgram}}", tutorApplication.getStudyProgram().getValue())
                .replace("{{application.currentSemester}}", tutorApplication.getCurrentSemester().toString())
                .replace("{{application.devices}}", String.join(", ", tutorApplication.getDevices().stream().map(Enum::toString).toList()))
                .replace("{{application.coursesTaken}}", String.join(", ", tutorApplication.getCoursesTaken().stream().map(Enum::toString).toList()))
                .replace("{{application.germanLanguageProficiency}}", tutorApplication.getGermanLanguageProficiency().getValue())
                .replace("{{application.englishLanguageProficiency}}", tutorApplication.getEnglishLanguageProficiency().getValue())
                .replace("{{application.motivation}}", tutorApplication.getMotivation())
                .replace("{{application.experience}}", tutorApplication.getExperience())
                .replace("{{application.reasonGoodTutor}}", tutorApplication.getReasonGoodTutor());
    }

    private String fillStudentPlaceholders(final String template, final Student student) {
        return template
                .replace("{{student.publicId}}", student.getPublicId().toString())
                .replace("{{student.firstName}}", student.getFirstName())
                .replace("{{student.lastName}}", student.getLastName())
                .replace("{{student.email}}", student.getEmail())
                .replace("{{student.tumId}}", student.getTumId())
                .replace("{{student.matriculationNumber}}", student.getMatriculationNumber())
                .replace("{{student.gender}}", student.getGender().getValue())
                .replace("{{student.nationality}}", student.getNationality())
                .replace("{{student.isExchangeStudent}}", student.getIsExchangeStudent().toString());
    }

    private String fillThesisApplicationPlaceholders(final String template, final ThesisApplication thesisApplication) {
        String pattern = "dd. MMM yyyy";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);

        return template.replace("{{application.studyProgram}}", thesisApplication.getStudyProgram().getValue())
                .replace("{{application.studyDegree}}", thesisApplication.getStudyDegree().getValue())
                .replace("{{application.currentSemester}}", thesisApplication.getCurrentSemester().toString())
                .replace("{{application.desiredThesisStart}}", simpleDateFormat.format(thesisApplication.getDesiredThesisStart()))
                .replace("{{application.specialSkills}}", thesisApplication.getSpecialSkills())
                .replace("{{application.motivation}}", thesisApplication.getMotivation())
                .replace("{{application.interests}}", thesisApplication.getInterests())
                .replace("{{application.projects}}", thesisApplication.getProjects())
                .replace("{{application.specialSkills}}", thesisApplication.getSpecialSkills())
                .replace("{{application.thesisTitle}}", thesisApplication.getThesisTitle())
                .replace("{{application.researchAreas}}", String.join(", ", thesisApplication.getResearchAreas().stream().map(ResearchArea::getValue).toList()))
                .replace("{{application.focusTopics}}", String.join(", ", thesisApplication.getFocusTopics().stream().map(FocusTopic::getValue).toList()));
    }

    private String fillThesisAdvisorPlaceholders(final String template, final ThesisAdvisor thesisAdvisor) {
        return template.replace("{{advisor.firstName}}", thesisAdvisor.getFirstName())
                .replace("{{advisor.lastName}}", thesisAdvisor.getLastName())
                .replace("{{advisor.email}}", thesisAdvisor.getEmail())
                .replace("{{advisor.tumId}}", thesisAdvisor.getTumId());
    }
}
