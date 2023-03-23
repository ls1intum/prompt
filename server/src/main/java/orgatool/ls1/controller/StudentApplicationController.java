package orgatool.ls1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import orgatool.ls1.model.Student;
import orgatool.ls1.model.StudentApplication;
import orgatool.ls1.model.StudentApplicationNote;
import orgatool.ls1.model.User;
import orgatool.ls1.repository.StudentApplicationNoteRepository;
import orgatool.ls1.repository.StudentApplicationRepository;
import orgatool.ls1.repository.StudentRepository;
import orgatool.ls1.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student-applications")
public class StudentApplicationController {

    @Autowired
    StudentApplicationRepository studentApplicationRepository;
    @Autowired
    StudentApplicationNoteRepository studentApplicationNoteRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    StudentRepository studentRepository;

    @PostMapping
    public StudentApplication create(@RequestBody StudentApplication studentApplication) {
        Optional<Student> existingStudent = Optional.empty();
        Student student = studentApplication.getStudent();
        if (student.getTumId() != null) {
            existingStudent = studentRepository.findByTumId(student.getTumId());
        } else if (student.getFirstName() != null && student.getLastName() != null) {
            existingStudent = studentRepository.findByFirstNameAndLastName(student.getFirstName(), student.getLastName());
        }
        if (existingStudent.isEmpty()) {
            studentRepository.save(student);
        }
        return studentApplicationRepository.save(studentApplication);
    }

    @GetMapping
    public List<StudentApplication> getAllStudents() {
        List<StudentApplication> students = studentApplicationRepository.findAll();
        return students;
    }

    @PostMapping("/{studentApplicationId}/notes")
    public StudentApplicationNote createNote(@PathVariable String studentApplicationId,
                           @RequestBody StudentApplicationNote studentApplicationNote) {
        Optional<StudentApplication> studentApplication = studentApplicationRepository.findById(studentApplicationId);
        Optional<User> user = userRepository.findById(studentApplicationNote.getAuthor().getId());
        if (studentApplication.isPresent() && user.isPresent()) {
            studentApplicationNote.setAuthor(user.get());
            studentApplication.get().getNotes().add(studentApplicationNote);
            return studentApplicationNoteRepository.save(studentApplicationNote);
        }

        return null;
    }

}
