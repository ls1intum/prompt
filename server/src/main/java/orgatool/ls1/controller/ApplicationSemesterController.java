package orgatool.ls1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import orgatool.ls1.model.ApplicationSemester;
import orgatool.ls1.repository.ApplicationSemesterRepository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@RestController
@RequestMapping("/api/application-semesters")
public class ApplicationSemesterController {

    private ApplicationSemesterRepository applicationSemesterRepository;
    private SimpleDateFormat simpleDateFormat;

    @Autowired
    public ApplicationSemesterController(final ApplicationSemesterRepository applicationSemesterRepository) {
        this.applicationSemesterRepository = applicationSemesterRepository;
        this.simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", Locale.GERMAN);
    }

    @GetMapping
    public ResponseEntity<List<ApplicationSemester>> getAllApplicationSemesters(@RequestParam(required = false)
                                                                                    String applicationPeriodDate) {
        if (applicationPeriodDate != null) {
            try {
                return ResponseEntity.ok(applicationSemesterRepository.findAllWithApplicationPeriodIncludes(simpleDateFormat.parse(applicationPeriodDate)));
            } catch (ParseException e) {
                System.out.println(e);
                return new ResponseEntity("Unable to parse application period date string.", HttpStatus.BAD_REQUEST);
            }
        }
        return ResponseEntity.ok(applicationSemesterRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<ApplicationSemester> create(@RequestBody ApplicationSemester applicationSemester) {
        Optional<ApplicationSemester> existingApplicationSemester = applicationSemesterRepository.findBySemesterName(applicationSemester.getSemesterName());
        if (existingApplicationSemester.isPresent()) {
            return new ResponseEntity(String.format("Application semester with name %s already exists.", applicationSemester.getSemesterName()), HttpStatus.CONFLICT);
        }

        return ResponseEntity.ok(applicationSemesterRepository.save(applicationSemester));
    }
}
