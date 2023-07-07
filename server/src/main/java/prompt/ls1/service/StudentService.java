package prompt.ls1.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import prompt.ls1.exception.ResourceNotFoundException;
import prompt.ls1.model.Student;
import prompt.ls1.repository.StudentRepository;

import java.util.UUID;

@Service
public class StudentService {
    final StudentRepository studentRepository;

    @Autowired
    public StudentService(final StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student update(UUID studentId, JsonPatch patchStudent) throws JsonPatchException, JsonProcessingException {
        Student existingStudent = findById(studentId);

        final Student patchedStudent = applyPatchToStudent(patchStudent, existingStudent);
        return studentRepository.save(patchedStudent);
    }

    private Student findById(final UUID studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Student with id %s not found,", studentId)));
    }

    private Student applyPatchToStudent(
            JsonPatch patch, Student targetStudent) throws JsonPatchException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode patched = patch.apply(objectMapper.convertValue(targetStudent, JsonNode.class));
        return objectMapper.treeToValue(patched, Student.class);
    }
}
