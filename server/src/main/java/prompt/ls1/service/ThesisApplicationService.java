package prompt.ls1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import prompt.ls1.exception.ResourceInvalidParametersException;
import prompt.ls1.model.Student;
import prompt.ls1.model.ThesisApplication;
import prompt.ls1.model.enums.ApplicationStatus;
import prompt.ls1.repository.StudentRepository;
import prompt.ls1.repository.ThesisApplicationRepository;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ThesisApplicationService {
    private final ThesisApplicationRepository thesisApplicationRepository;
    private final StudentRepository studentRepository;
    private final FileSystemStorageService storageService;

    @Autowired
    public ThesisApplicationService(final ThesisApplicationRepository thesisApplicationRepository,
                                    final StudentRepository studentRepository,
                                    final FileSystemStorageService storageService) {
        this.thesisApplicationRepository = thesisApplicationRepository;
        this.studentRepository = studentRepository;
        this.storageService = storageService;
    }

    public List<ThesisApplication> getAll() {
        return thesisApplicationRepository.findAll();
    }

    public List<ThesisApplication> getAllNotAssessed() {
        return thesisApplicationRepository.findAllNotAssessed();
    }

    public Resource getExaminationReport(final UUID thesisApplicationId) throws IOException {
        final ThesisApplication thesisApplication = findById(thesisApplicationId);
        return storageService.load(thesisApplication.getExaminationReportFilename());
    }

    public Resource getCV(final UUID thesisApplicationId) throws IOException {
        final ThesisApplication thesisApplication = findById(thesisApplicationId);
        return storageService.load(thesisApplication.getCvFilename());
    }

    public Resource getBachelorReport(final UUID thesisApplicationId) throws IOException {
        final ThesisApplication thesisApplication = findById(thesisApplicationId);
        return storageService.load(thesisApplication.getBachelorReportFilename());
    }

    public ThesisApplication create(final ThesisApplication thesisApplication,
                                    final MultipartFile transcriptOfRecords,
                                    final MultipartFile cv,
                                    final MultipartFile bachelorReport) {
        final Student student = thesisApplication.getStudent();
        if (student == null ||
                (student.getTumId() == null && student.getMatriculationNumber() == null && student.getEmail() == null)) {
            throw new IllegalArgumentException(
                    "Student identification information must be provided: tum ID, matriculation number or email address.");
        }
        Optional<Student> existingStudent = findStudent(student.getTumId(), student.getMatriculationNumber(), student.getEmail());

        if (existingStudent.isEmpty()) {
            student.setPublicId(UUID.randomUUID());
            studentRepository.save(student);
        } else {
            thesisApplication.setStudent(checkAndUpdateStudent(existingStudent.get(), thesisApplication.getStudent()));
        }

        final String examinationReportFilename = storageService.store(transcriptOfRecords);
        thesisApplication.setExaminationReportFilename(examinationReportFilename);
        final String cvFilename = storageService.store(cv);
        thesisApplication.setCvFilename(cvFilename);
        if (bachelorReport != null && !bachelorReport.isEmpty()) {
            final String bachelorReportFilename = storageService.store(bachelorReport);
            thesisApplication.setBachelorReportFilename(bachelorReportFilename);
        }

        thesisApplication.setApplicationStatus(ApplicationStatus.NOT_ASSESSED);
        return thesisApplicationRepository.save(thesisApplication);
    }

    public ThesisApplication assess(final UUID thesisApplicationId,
                                    final ApplicationStatus status,
                                    final String assessmentComment) {
        final ThesisApplication thesisApplication = findById(thesisApplicationId);
        thesisApplication.setApplicationStatus(status);
        thesisApplication.setAssessmentComment(assessmentComment);
        return thesisApplicationRepository.save(thesisApplication);
    }

    private ThesisApplication findById(final UUID thesisApplicationId) {
        return thesisApplicationRepository.findById(thesisApplicationId)
                .orElseThrow(() -> new ResourceInvalidParametersException(
                        String.format("Thesis application with id %s not found.", thesisApplicationId)));
    }

    private Optional<Student> findStudent(final String tumId, final String matriculationNumber, final String email) {
        if ((tumId != null && !tumId.isBlank()) || (matriculationNumber != null && !matriculationNumber.isBlank())) {
            return studentRepository.findByTumIdOrMatriculationNumber(tumId, matriculationNumber);
        }
        return studentRepository.findByEmail(email);
    }

    private Student checkAndUpdateStudent(final Student existingStudent, final Student updatedStudent) {
        if (((existingStudent.getTumId() != null && !existingStudent.getTumId().isBlank()) && !existingStudent.getTumId().equals(updatedStudent.getTumId())) ||
                (existingStudent.getMatriculationNumber() != null && !existingStudent.getMatriculationNumber().isBlank()) && !existingStudent.getMatriculationNumber().equals(updatedStudent.getMatriculationNumber())) {
            throw new ResourceInvalidParametersException("Provided TUM ID does not match with the matriculation number you submitted. " +
                    "If You are sure the data is entered correct, please contact the Program Management.");
        }
        existingStudent.setGender(updatedStudent.getGender());
        existingStudent.setFirstName(updatedStudent.getFirstName());
        existingStudent.setLastName(updatedStudent.getLastName());
        existingStudent.setEmail(updatedStudent.getEmail());

        return studentRepository.save(existingStudent);
    }
}
