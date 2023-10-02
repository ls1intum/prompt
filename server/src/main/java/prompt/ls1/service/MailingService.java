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
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.TimeZone;

@Service
public class MailingService {

    private final JavaMailSender javaMailSender;
    private final String sender;
    private final String chairMemberRecipientsList;

    @Autowired
    public MailingService(final JavaMailSender javaMailSender,
                          @Value("${prompt.mail.sender}") String sender,
                          @Value("${prompt.mail.chair-member-recipients}") String chairMemberRecipientsList) {
        this.javaMailSender = javaMailSender;
        this.sender = sender;
        this.chairMemberRecipientsList = chairMemberRecipientsList;
    }

    public void thesisApplicationCreatedEmail(final Student student,
                                              final ThesisApplication thesisApplication) throws MessagingException, IOException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        Arrays.asList(chairMemberRecipientsList.split(";")).forEach(recipient -> {
            try {
                message.addRecipients(MimeMessage.RecipientType.TO, recipient);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        });

        message.setSubject("PROMPT | New Thesis Application");

        String pattern = "dd. MMM yyyy";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);

        String htmlContent = String.format("""
                        <p>Dear LS1 Chair Members,</p>

                        <p>there is a new thesis application submitted by <strong>%s %s</strong>.</p>

                        <p>We received the following thesis application details:</p>

                        <p>&nbsp;</p>

                        <hr />
                        <strong>Name:</strong><p>&nbsp;%s %s</p><br />
                        <strong>Email:</strong><p>&nbsp;<a href="mailto:%s" target="_blank">%s</a></p><br />
                        <strong>TUM ID:</strong><p>&nbsp;%s</p>
                        <strong>Matriculation Number:</strong><p>&nbsp;%s</p>

                        <strong>Study program:</strong><p>&nbsp;%s&nbsp;%s&nbsp;(%s. Semester)</p><br />
                        <strong>Desired Thesis Start Date:</strong><p>&nbsp;%s</p>
                        <br />
                        <strong>Special Skills:&nbsp;</strong>

                        <p>%s</p>

                        <p>&nbsp;</p>

                        <strong>Motivation:&nbsp;</strong>

                        <p>%s</p>
                        
                        <p>&nbsp;</p>

                        <strong>Interests:&nbsp;</strong>

                        <p>%s</p>
                        
                        <p>&nbsp;</p>

                        <strong>Projects:&nbsp;</strong>

                        <p>%s</p>
                        
                        <p>&nbsp;</p>

                        <strong>Thesis Title Suggestion:&nbsp;</strong>

                        <p>%s</p>
                        
                        <p>&nbsp;</p>

                        <strong>Research Areas:&nbsp;</strong>

                        <p>%s</p>
                        
                        <p>&nbsp;</p>

                        <strong>Focus Topics:&nbsp;</strong>

                        <p>%s</p>

                        <br />

                        <strong>You can find the submitted files in the attachment part of this email.</strong>

                        <p>Best regards,<br />
                        PROMPT Mailing Service</p>""",
                student.getFirstName(),
                student.getLastName(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getEmail(),
                student.getTumId(),
                student.getMatriculationNumber(),
                thesisApplication.getStudyProgram().getValue(),
                thesisApplication.getStudyDegree().getValue(),
                thesisApplication.getCurrentSemester(),
                simpleDateFormat.format(thesisApplication.getDesiredThesisStart()),
                thesisApplication.getSpecialSkills(),
                thesisApplication.getMotivation(),
                thesisApplication.getInterests(),
                thesisApplication.getProjects(),
                thesisApplication.getThesisTitle(),
                String.join(",", thesisApplication.getResearchAreas().stream().map(ResearchArea::getValue).toList()),
                String.join(",", thesisApplication.getFocusTopics().stream().map(FocusTopic::getValue).toList()));

        Multipart multipart = new MimeMultipart();

        BodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setContent(htmlContent, "text/html; charset=utf-8");
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

        String htmlContent = String.format("""
                        <p>Dear&nbsp;%s %s,</p>

                        <p>with this email we confirm your application as a developer in the&nbsp;<strong>iPraktikum %s</strong>&nbsp;practical course.</p>

                        <p>We received the following application details:</p>

                        <p>&nbsp;</p>

                        <hr />
                        <p><strong>Name:</strong>&nbsp;%s %s<br />
                        <strong>Email:</strong>&nbsp;<a href="mailto:%s" target="_blank">%s</a><br />
                        <strong>TUM ID:</strong>&nbsp;%s</p>
                        <strong>Matriculation Number:</strong>&nbsp;%s</p>

                        <p><strong>Study program:</strong>&nbsp;%s&nbsp;%s&nbsp;(%s. Semester)<br />
                        <br />
                        <strong>Motivation:&nbsp;</strong></p>

                        <p>%s</p>

                        <p>&nbsp;</p>

                        <p><strong>Experience:&nbsp;</strong></p>

                        <p>%s</p>

                        <hr />
                        <p><br />
                        <strong>Great that you are interested in participating as&nbsp;a developer!&nbsp;<img alt="\uD83D\uDE42" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f642/32.png" /></strong></p>

                        <p>Don&#39;t forget to prioritize the iPraktikum on&nbsp;<a href="https://matching.in.tum.de/" rel="nofollow" target="_blank">matching.in.tum.de</a>.</p>

                        <p>&nbsp;</p>

                        <p><strong>We are looking forward to a great collaboration!</strong></p>

                        <p>Best regards,<br />
                        iPraktikum Program Management Team</p>""",
                student.getFirstName(),
                student.getLastName(),
                courseIteration.getSemesterName(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getEmail(),
                student.getTumId(),
                student.getMatriculationNumber(),
                developerApplication.getStudyDegree().getValue(),
                developerApplication.getStudyProgram().getValue(),
                developerApplication.getCurrentSemester(),
                developerApplication.getMotivation(),
                developerApplication.getExperience());
        message.setContent(htmlContent, "text/html; charset=utf-8");

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

        String htmlContent = String.format("""
                        <p>Dear&nbsp;%s %s,</p>

                        <p>with this email we confirm your application as a coach in the&nbsp;<strong>Agile Project Management %s</strong>&nbsp;practical course.</p>

                        <p>We received the following application details:</p>

                        <p>&nbsp;</p>

                        <hr />
                        <p><strong>Name:</strong>&nbsp;%s %s<br />
                        <strong>Email:</strong>&nbsp;<a href="mailto:%s" target="_blank">%s</a><br />
                        <strong>TUM ID:</strong>&nbsp;%s</p>
                        <strong>Matriculation Number:</strong>&nbsp;%s</p>

                        <p><strong>Study program:</strong>&nbsp;%s&nbsp;%s&nbsp;(%s. Semester)<br />
                        <br />
                        <strong>Motivation:&nbsp;</strong></p>

                        <p>%s</p>

                        <p>&nbsp;</p>
                        
                        <br />
                        <strong>Experience:&nbsp;</strong></p>

                        <p>%s</p>

                        <p>&nbsp;</p>

                        <br />
                        <strong>Solved Challenge:&nbsp;</strong></p>

                        <p>%s</p>

                        <p>&nbsp;</p>

                        <hr />
                        <p><br />
                        <strong>Great that you are interested in participating as&nbsp;a coach!&nbsp;<img alt="\uD83D\uDE42" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f642/32.png" /></strong></p>

                        <p>Don&#39;t forget to prioritize the Agile Project Management course  on&nbsp;<a href="https://matching.in.tum.de/" rel="nofollow" target="_blank">matching.in.tum.de</a>.</p>

                        <p>&nbsp;</p>

                        <p><strong>We are looking forward to a great collaboration!</strong></p>

                        <p>Best regards,<br />
                        Agile Project Management Program Management Team</p>""",
                student.getFirstName(),
                student.getLastName(),
                courseIteration.getSemesterName(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getEmail(),
                student.getTumId(),
                student.getMatriculationNumber(),
                coachApplication.getStudyDegree().getValue(),
                coachApplication.getStudyProgram().getValue(),
                coachApplication.getCurrentSemester(),
                coachApplication.getMotivation(),
                coachApplication.getExperience(),
                coachApplication.getSolvedProblem());
        message.setContent(htmlContent, "text/html; charset=utf-8");

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

        String htmlContent = String.format("""
                        <p>Dear&nbsp;%s %s,</p>

                        <p>with this email we confirm your application as a tutor in the&nbsp;<strong>Teaching iOS %s</strong>&nbsp;practical course.</p>

                        <p>We received the following application details:</p>

                        <p>&nbsp;</p>

                        <hr />
                        <p><strong>Name:</strong>&nbsp;%s %s<br />
                        <strong>Email:</strong>&nbsp;<a href="mailto:%s" target="_blank">%s</a><br />
                        <strong>TUM ID:</strong>&nbsp;%s</p>
                        <strong>Matriculation Number:</strong>&nbsp;%s</p>

                        <p><strong>Study program:</strong>&nbsp;%s&nbsp;%s&nbsp;(%s. Semester)<br />
                        <br />
                        <strong>Motivation:&nbsp;</strong></p>

                        <p>%s</p>

                        <p>&nbsp;</p>
                        
                        <br />
                        <strong>Experience:&nbsp;</strong></p>

                        <p>%s</p>

                        <p>&nbsp;</p>

                        <br />
                        <strong>Reason for Good Tutor:&nbsp;</strong></p>

                        <p>%s</p>

                        <p>&nbsp;</p>

                        <hr />
                        <p><br />
                        <strong>Great that you are interested in participating as&nbsp;a tutor!&nbsp;<img alt="\uD83D\uDE42" src="https://fonts.gstatic.com/s/e/notoemoji/15.0/1f642/32.png" /></strong></p>

                        <p>Don&#39;t forget to prioritize the Teaching iOS course  on&nbsp;<a href="https://matching.in.tum.de/" rel="nofollow" target="_blank">matching.in.tum.de</a>.</p>

                        <p>&nbsp;</p>

                        <p><strong>We are looking forward to a great collaboration!</strong></p>

                        <p>Best regards,<br />
                        Teaching iOS Program Management Team</p>""",
                student.getFirstName(),
                student.getLastName(),
                courseIteration.getSemesterName(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getEmail(),
                student.getTumId(),
                student.getMatriculationNumber(),
                tutorApplication.getStudyDegree().getValue(),
                tutorApplication.getStudyProgram().getValue(),
                tutorApplication.getCurrentSemester(),
                tutorApplication.getMotivation(),
                tutorApplication.getExperience(),
                tutorApplication.getReasonGoodTutor());
        message.setContent(htmlContent, "text/html; charset=utf-8");

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

        String htmlContent = String.format("""
                        <p>Dear %s %s,</p>
                                                
                        <p>you are receiving this email because you applied for the course Agile Project Management in the&nbsp;iPraktikum&nbsp;%s and we would like to invite you to a personal&nbsp;interview.</p>
                                                
                        <p>The&nbsp;interviews&nbsp;will take place on %s.</strong>&nbsp;You can choose your timeslot in the following form (FCFS):&nbsp;<a href="%s" target="_blank">%s</a><br />Please use your full name in the form and ensure that you SAVE your vote!</p>
                                                
                        <p>The&nbsp;interview&nbsp;will be on Zoom:&nbsp;<a href="%s" target="_blank">%s</a><br />
                        Please ensure that you are at least<strong>&nbsp;5 min early!</strong>&nbsp;You will be moved to the&nbsp;interview&nbsp;room as soon as we are ready to talk to you.</p>
                                                
                        <p>&nbsp;</p>
                                                
                        <p>Looking forward to talking to you!</p>
                                                
                        <p><br />
                        Cheers,<br />
                        Agile Project Management Program Management Team</p>
                        """,
                student.getFirstName(),
                student.getLastName(),
                courseIteration.getSemesterName(),
                dayOfWeek,
                courseIteration.getCoachInterviewPlannerLink(),
                courseIteration.getCoachInterviewPlannerLink(),
                courseIteration.getCoachInterviewLocation(),
                courseIteration.getCoachInterviewLocation());
        message.setContent(htmlContent, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendTutorInterviewInvitationEmail(final Student student,
                                                  final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("Teaching iOS %s Interview Invitation", courseIteration.getSemesterName()));

        TimeZone timeZone = TimeZone.getTimeZone("Europe/Paris");
        SimpleDateFormat dateFormat = new SimpleDateFormat("EEEE, dd.MM.yyyy 'starting at' HH.mm");
        dateFormat.setTimeZone(timeZone);
        String dayOfWeek = dateFormat.format(courseIteration.getTutorInterviewDate());

        String htmlContent = String.format("""
                        <p>Dear %s %s,</p>
                                                
                        <p>you are receiving this email because you applied for the course Teaching iOS in the&nbsp;iPraktikum&nbsp;%s and we would like to invite you to a personal&nbsp;interview.</p>
                                                
                        <p>The&nbsp;interviews&nbsp;will take place on %s.</strong>&nbsp;You can choose your timeslot in the following form (FCFS):&nbsp;<a href="%s" target="_blank">%s</a><br />
                        Please use your full name in the form and ensure that you SAVE your vote!</p>
                                                
                        <p>The&nbsp;interview&nbsp;will be on Zoom:&nbsp;<a href="%s" target="_blank">%s</a><br />
                        Please ensure that you are at least<strong>&nbsp;5 min early!</strong>&nbsp;You will be moved to the&nbsp;interview&nbsp;room as soon as we are ready to talk to you.</p>
                                                
                        <p>&nbsp;</p>
                                                
                        <p>Looking forward to talking to you!</p>
                                                
                        <p><br />
                        Cheers,<br />
                        Teaching iOS Program Management Team</p>
                        """,
                student.getFirstName(),
                student.getLastName(),
                courseIteration.getSemesterName(),
                dayOfWeek,
                courseIteration.getTutorInterviewPlannerLink(),
                courseIteration.getTutorInterviewPlannerLink(),
                courseIteration.getTutorInterviewLocation(),
                courseIteration.getTutorInterviewLocation());
        message.setContent(htmlContent, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendCoachApplicationRejectionEmail(final Student student,
                                                  final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("Agile Project Management %s Application Rejection", courseIteration.getSemesterName()));

        String htmlContent = String.format("""
                        <p>Dear %s %s,</p>
                        
                        <p>Thank you for your application! Due to the overwhelming demand for the course Agile Project Management %s, we haven&rsquo;t been able to take your application into account for the coming semester but we put you on our waiting list.</p>
                        
                        <p>We regret that we cannot accept all of the great candidates. However, we hope to offer the courses again next term and we actively encourage you to apply again!</p>
                        
                        <p>Best Regards,<br />
                        Agile Project Management Program Management Team</p>
                        """,
                student.getFirstName(),
                student.getLastName(),
                courseIteration.getSemesterName());
        message.setContent(htmlContent, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendTutorApplicationRejectionEmail(final Student student,
                                                  final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("Teaching iOS %s Application Rejection", courseIteration.getSemesterName()));

        String htmlContent = String.format("""
                        <p>Dear %s %s,</p>
                        
                        <p>Thank you for your application! Due to the overwhelming demand for the course Teaching iOS %s, we haven&rsquo;t been able to take your application into account for the coming semester but we put you on our waiting list.</p>
                        
                        <p>We regret that we cannot accept all of the great candidates. However, we hope to offer the courses again next term and we actively encourage you to apply again!</p>
                        
                        <p>Best Regards,<br />
                        Teaching iOS Program Management Team</p>
                        """,
                student.getFirstName(),
                student.getLastName(),
                courseIteration.getSemesterName());
        message.setContent(htmlContent, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendCoachApplicationAcceptanceEmail(final Student student,
                                                   final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("Agile Project Management %s Application Acceptance", courseIteration.getSemesterName()));

        String htmlContent = String.format("""
                            <table align="left" border="0" cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                        <td><strong>iPraktikum %s APM Accept</strong></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                        <p>Dear %s,</p>
                            
                                        <p>
                                        Congratulations, you have been&nbsp;accepted&nbsp;as a Coach in the&nbsp;iPraktikum!&nbsp;</p>
                            
                                        <p>In order to complete your registration,&nbsp; please log in at&nbsp;<a href="https://lists.ase.in.tum.de/links/DnJKYSWUiH/XpGznUsipz/hOMCKCIxFy/zkcCoueKil" target="_blank">https://matching.in.tum.de</a>&nbsp;and prioritize the &quot;Praktikum&nbsp;- Agile Project Management (IN0012, IN2106, IN2175, IN4087)&quot; - NOT the&nbsp;iPraktikum&nbsp;itself!! It is very important that you give this course the highest priority and that it is the only lab course you prioritize - this means no other courses should be on the list at all.</p>
                            
                                        <p>Best Regards,<br />
                                        Agile Project Management Program Management</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        """,
                courseIteration.getSemesterName(),
                student.getFirstName());
        message.setContent(htmlContent, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendTutorApplicationAcceptanceEmail(final Student student,
                                                   final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("Teaching iOS %s Application Acceptance", courseIteration.getSemesterName()));

        String htmlContent = String.format("""
                            <table align="left" border="0" cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                        <td><strong>Teaching iOS %s Accept</strong></td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                        <p>Dear %s,</p>
                            
                                        <p>
                                        Congratulations, you have been&nbsp;accepted&nbsp;as a Tutor for the Teaching iOS Course!&nbsp;</p>
                            
                                        <p>In order to complete your registration,&nbsp; please log in at&nbsp;<a href="https://lists.ase.in.tum.de/links/DnJKYSWUiH/XpGznUsipz/hOMCKCIxFy/zkcCoueKil" target="_blank">https://matching.in.tum.de</a>&nbsp;and prioritize the &quot;Seminar - Teaching iOS (IN0014, IN2107, IN4741)&quot;! It is very important that you give this course the highest priority and that it is the only lab course you prioritize - this means no other courses should be on the list at all.</p>
                            
                                        <p>Best Regards,<br />
                                        Teaching iOS Program Management</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        """,
                courseIteration.getSemesterName(),
                student.getFirstName());
        message.setContent(htmlContent, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendKickoffSubmissionLinkEmail(final Student student,
                                               final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("iPraktikum %s Kick-off Project Preferences", courseIteration.getSemesterName()));

        String htmlContent = String.format("""
                        <p>Dear&nbsp;%s %s,</p>

                        <p>we sincerely congratulate you on making it so far to the official iPraktikum %s project start.</p>

                        <p>As a follow-up to the Kick-off event, you have a chance to submit your team preferences based on your project interests.</p>

                        <p>&nbsp;</p>

                        <hr />
                        <p>Please, use the following link: <a href="https://prompt.ase.cit.tum.de/kick-off/%s" rel="nofollow" target="_blank">https://prompt.ase.cit.tum.de/kick-off/%s</a></p>
                        <p>Make sure NOT TO SHARE this personal link with any third parties.</p>
                        
                        <br/>
                        
                        <p><strong>You will need your matriculation number to submit the form.</strong></p>

                        <br />

                        <p>&nbsp;</p>

                        <p>Best regards,<br />
                        iPraktikum Program Management Team</p>""",
                student.getFirstName(),
                student.getLastName(),
                courseIteration.getSemesterName(),
                student.getPublicId(),
                student.getPublicId());
        message.setContent(htmlContent, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendTechnicalDetailsSubmissionInvitationEmail(final Student student,
                                                          final CourseIteration courseIteration) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject(String.format("iPraktikum %s Technical Details Submission", courseIteration.getSemesterName()));

        String htmlContent = String.format("""
                        <p>Dear&nbsp;%s %s,</p>

                        <p>with this email we request you to submit some technical details required for the Intro Course and iPraktikum %s participation.</p>

                        <strong>Please make sure to submit the form until Wednesday, 4th of October 23:59.</strong>
                        <br/>
                        <p>Please, use the following link: <a href="https://prompt.ase.cit.tum.de/intro-course/%s/technical-details/%s" rel="nofollow" target="_blank">https://prompt.ase.cit.tum.de/intro-course/%s/technical-details/%s</a></p>
                        <p>Make sure NOT TO SHARE this personal link with any third parties.</p>

                        <p>&nbsp;</p>

                        <p><strong>We are looking forward to a great collaboration!</strong></p>

                        <p>Best regards,<br />
                        iPraktikum Program Management Team</p>""",
                student.getFirstName(),
                student.getLastName(),
                courseIteration.getSemesterName(),
                courseIteration.getSemesterName().toUpperCase(),
                student.getPublicId(),
                courseIteration.getSemesterName().toUpperCase(),
                student.getPublicId());
        message.setContent(htmlContent, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendThesisAcceptanceEmail(final Student student,
                                          final ThesisAdvisor thesisAdvisor) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.CC, "krusche@tum.de");
        message.setSubject("Thesis Application Acceptance");

        String htmlContent = "";
        if (!thesisAdvisor.getEmail().equals("krusche@tum.de")) {
            message.addRecipients(MimeMessage.RecipientType.CC, thesisAdvisor.getEmail());

            htmlContent = String.format("""
                            <p>Dear %s,</p>
                                                        
                            <p>I am delighted to inform you that, after a thorough review of your application and supporting documents, I am impressed by your motivation and would be pleased to supervise your thesis.</p>
                                                        
                            <p>I believe your passion and dedication to your work will bring valuable insights to our research. My doctoral student, %s %s, is also looking forward to advising you throughout your thesis. Please coordinate with %s %s at your earliest convenience. You can connect with %s %s using the following Slack link: <a href="https://join.slack.com/t/ls1tum/shared_invite/zt-1we7pcetx-spme2I6gKn2rCNxX9XDGow">https://join.slack.com/t/ls1tum/shared_invite/zt-1we7pcetx-spme2I6gKn2rCNxX9XDGow</a></p>
                                                        
                            <p>I would like to emphasize that in undertaking this thesis, you will be assuming the role of project manager for your thesis project. This role requires proactive communication, high dedication, and a strong commitment to the successful completion of the project. I have full confidence in your ability to rise to this challenge and produce exemplary work.</p>
                                                        
                            <p>I am excited about the opportunity to work with you and am eager to see the contributions you will make to our field. Please feel free to reach out if you have any questions or need further clarification on any aspect of the project.</p>
                                                        
                            <p>Congratulations once again, and I look forward to embarking on this academic journey with you.</p>
                                                        
                            <p>Kind regards,</p>
                                                        
                            <p>___________________</p>
                                                        
                            <p>Prof. Dr. Stephan Krusche</p>
                                                        
                            <p>Applied Software Engineering<br />
                            Technical University of Munich</p>
                                                        
                            <p><a href="krusche@tum.de">krusche@tum.de</a><br />
                            <a href="http://www.skrusche.de">www.skrusche.de</a></p>
                            """,
                    student.getFirstName(),
                    thesisAdvisor.getFirstName(),
                    thesisAdvisor.getLastName(),
                    thesisAdvisor.getFirstName(),
                    thesisAdvisor.getLastName(),
                    thesisAdvisor.getFirstName(),
                    thesisAdvisor.getLastName());
        } else {
            htmlContent = String.format("""
                            <p>Dear %s,</p>
                                                        
                            <p>I am delighted to inform you that, after a thorough review of your application and supporting documents, I am impressed by your motivation and would be pleased to supervise your thesis.</p>
                                                        
                            <p>I believe your passion and dedication to your work will bring valuable insights to our research. I am looking forward to advising you throughout your thesis. Please coordinate the next steps with me using the following Slack link: <a href="https://join.slack.com/t/ls1tum/shared_invite/zt-1we7pcetx-spme2I6gKn2rCNxX9XDGow">https://join.slack.com/t/ls1tum/shared_invite/zt-1we7pcetx-spme2I6gKn2rCNxX9XDGow</a></p>
                                                        
                            <p>I would like to emphasize that in undertaking this thesis, you will be assuming the role of project manager for your thesis project. This role requires proactive communication, high dedication, and a strong commitment to the successful completion of the project. I have full confidence in your ability to rise to this challenge and produce exemplary work.</p>
                                                        
                            <p>I am excited about the opportunity to work with you and am eager to see the contributions you will make to our field. Please feel free to reach out if you have any questions or need further clarification on any aspect of the project.</p>
                                                        
                            <p>Congratulations once again, and I look forward to embarking on this academic journey with you.</p>
                                                        
                            <p>Kind regards,</p>
                                                        
                            <p>___________________</p>
                                                        
                            <p>Prof. Dr. Stephan Krusche</p>
                                                        
                            <p>Applied Software Engineering<br />
                            Technical University of Munich</p>
                                                        
                            <p><a href="krusche@tum.de">krusche@tum.de</a><br />
                            <a href="http://www.skrusche.de">www.skrusche.de</a></p>
                            """,
                    student.getFirstName());
        }
        message.setContent(htmlContent, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }

    public void sendThesisRejectionEmail(final Student student) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.BCC, "krusche@tum.de");
        message.setSubject("Thesis Application Rejection");

        String htmlContent = String.format("""
                        <p>Dear %s,</p>
                                                
                        <p>Thank you for your interest in pursuing your thesis under my supervision. I have carefully reviewed your application and supporting documents. It is with regret that I inform you that I am unable to accommodate your request to supervise your thesis. The volume of applications received this year was exceptionally high, and I have limited capacity to ensure each student receives the appropriate level of support and guidance. I recommend reaching out to other faculty members who specialize in your area of interest.</p>
                                                
                        <p>Kind regards,<br />
                        Stephan</p>
                                                
                        <hr />
                                                
                        <p>Prof. Dr. Stephan Krusche</p>
                                                
                        <p>Applied Software Engineering<br />
                        Technical University of Munich</p>
                                                
                        <p><a href="krusche@tum.de">krusche@tum.de</a><br />
                        <a href="http://www.skrusche.de">www.skrusche.de</a></p>
                        """,
                student.getFirstName());
        message.setContent(htmlContent, "text/html; charset=utf-8");

        javaMailSender.send(message);
    }
}
