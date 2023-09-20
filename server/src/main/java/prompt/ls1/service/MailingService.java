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
import prompt.ls1.model.ThesisApplication;
import prompt.ls1.model.TutorApplication;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.TimeZone;

@Service
public class MailingService {

    private final JavaMailSender javaMailSender;
    private final String sender;

    @Autowired
    public MailingService(final JavaMailSender javaMailSender,
                          @Value("${prompt.mail.sender}") String sender) {
        this.javaMailSender = javaMailSender;
        this.sender = sender;
    }

    public void thesisApplicationCreatedEmail(final Student student,
                                              final ThesisApplication thesisApplication) throws MessagingException, IOException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(sender);
        message.setRecipients(MimeMessage.RecipientType.TO, student.getEmail());
        message.addRecipients(MimeMessage.RecipientType.TO, sender);
        message.setSubject("PROMPT | New Thesis Application");

        String pattern = "yyyy-MM-dd";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);

        String htmlContent = String.format("""
                        <p>Dear LS1 Chair Members,</p>

                        <p>there is a new thesis application submitted by %s %s.</p>

                        <p>We received the following thesis application details:</p>

                        <p>&nbsp;</p>

                        <hr />
                        <p><strong>Name:</strong>&nbsp;%s %s<br />
                        <strong>Email:</strong>&nbsp;<a href="mailto:%s" target="_blank">%s</a><br />
                        <strong>TUM ID:</strong>&nbsp;%s</p>
                        <strong>Matriculation Number:</strong>&nbsp;%s</p>

                        <p><strong>Study program:</strong>&nbsp;%s&nbsp;%s&nbsp;(%s. Semester)<br />
                        <p><strong>Desired Thesis Start Date:</strong>&nbsp;%s</p>
                        <br />
                        <strong>Special Skills:&nbsp;</strong></p>

                        <p>%s</p>

                        <p>&nbsp;</p>

                        <p><strong>Motivation:&nbsp;</strong></p>

                        <p>%s</p>
                        
                        <p>&nbsp;</p>

                        <p><strong>Interests:&nbsp;</strong></p>

                        <p>%s</p>
                        
                        <p>&nbsp;</p>

                        <p><strong>Projects:&nbsp;</strong></p>

                        <p>%s</p>
                        
                        <p>&nbsp;</p>

                        <p><strong>Thesis Title Suggestion:&nbsp;</strong></p>

                        <p>%s</p>

                        <hr />
                        <p><br />

                        <p><strong>You can find the submitted files in the attachment part of this email.</strong></p>

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
                thesisApplication.getStudyProgram(),
                thesisApplication.getStudyDegree(),
                thesisApplication.getCurrentSemester(),
                simpleDateFormat.format(thesisApplication.getDesiredThesisStart()),
                thesisApplication.getSpecialSkills(),
                thesisApplication.getMotivation(),
                thesisApplication.getInterests(),
                thesisApplication.getProjects(),
                thesisApplication.getThesisTitle());

        BodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setContent(htmlContent, "text/html; charset=utf-8");

        MimeBodyPart attachmentPart = new MimeBodyPart();
        attachmentPart.attachFile(new File("thesis_application_uploads/" + thesisApplication.getExaminationReportFilename()));

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);
        multipart.addBodyPart(attachmentPart);

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
}
