package prompt.ls1.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import prompt.ls1.model.CoachApplication;
import prompt.ls1.model.CourseIteration;
import prompt.ls1.model.DeveloperApplication;
import prompt.ls1.model.Student;
import prompt.ls1.model.TutorApplication;

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
                        Cheers<br />
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
                        Cheers<br />
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
}
