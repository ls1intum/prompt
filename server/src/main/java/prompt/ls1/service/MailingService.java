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
}
