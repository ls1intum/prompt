package prompt.ls1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.DevelopmentProfile;
import prompt.ls1.model.Student;
import prompt.ls1.repository.StudentRepository;

import java.util.Optional;
import java.util.UUID;

@Service
public class StudentService {
    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(final StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Optional<DevelopmentProfile> getDevelopmentProfile(final UUID studentId) {
        return Optional.ofNullable(studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(String.format("Student with id %s not found.", studentId)))
                .getDevelopmentProfile());
    }

    public DevelopmentProfile saveDevelopmentProfile(final UUID studentId,
                                                       final DevelopmentProfile developmentProfile) {
        final Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Student with id %s not found.",
                        studentId)));

        student.setDevelopmentProfile(developmentProfile);

        return studentRepository.save(student).getDevelopmentProfile();
    }

    public Student findByTumId(final String tumId) {
        return studentRepository.findByTumId(tumId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(String.format("Student with TUM id %s not found.", tumId)));
    }
}
