package prompt.ls1.controller;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import prompt.ls1.controller.payload.ThesisApplicationAssessment;
import prompt.ls1.model.ThesisAdvisor;
import prompt.ls1.model.ThesisApplication;
import prompt.ls1.service.MailingService;
import prompt.ls1.service.ThesisApplicationService;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/thesis-applications")
public class ThesisApplicationController {
    private final Bucket bucket;
    private final ThesisApplicationService thesisApplicationService;
    private final MailingService mailingService;

    @Autowired
    public ThesisApplicationController(final ThesisApplicationService thesisApplicationService,
                                       final MailingService mailingService) {
        Bandwidth limit = Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1)));
        this.bucket = Bucket.builder()
                .addLimit(limit)
                .build();
        this.thesisApplicationService = thesisApplicationService;
        this.mailingService = mailingService;
    }

    @GetMapping
    @PreAuthorize("hasRole('chair-member') || hasRole('prompt-admin')")
    public ResponseEntity<List<ThesisApplication>> getAll() {
        return ResponseEntity.ok(thesisApplicationService.getAll());
    }

    @GetMapping("/not-assessed")
    @PreAuthorize("hasRole('chair-member') || hasRole('prompt-admin')")
    public ResponseEntity<List<ThesisApplication>> getAllNotAssessed() {
        return ResponseEntity.ok(thesisApplicationService.getAllNotAssessed());
    }

    @GetMapping("/{thesisApplicationId}/examination-report")
    @PreAuthorize("hasRole('chair-member') || hasRole('prompt-admin')")
    public ResponseEntity<Resource> getExaminationReport(@PathVariable final UUID thesisApplicationId) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=examination_report_%s.pdf", thesisApplicationId))
                .body(thesisApplicationService.getExaminationReport(thesisApplicationId));
    }

    @GetMapping("/{thesisApplicationId}/cv")
    @PreAuthorize("hasRole('chair-member') || hasRole('prompt-admin')")
    public ResponseEntity<Resource> getCV(@PathVariable final UUID thesisApplicationId) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=cv_%s.pdf", thesisApplicationId))
                .body(thesisApplicationService.getCV(thesisApplicationId));
    }

    @GetMapping("/{thesisApplicationId}/bachelor-report")
    @PreAuthorize("hasRole('chair-member') || hasRole('prompt-admin')")
    public ResponseEntity<Resource> getBachelorReport(@PathVariable final UUID thesisApplicationId) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=bachelor_report_%s.pdf", thesisApplicationId))
                .body(thesisApplicationService.getBachelorReport(thesisApplicationId));
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ThesisApplication> create(@RequestPart("thesisApplication") final ThesisApplication thesisApplication,
                                                    @RequestPart(value = "examinationReport") final MultipartFile examinationReport,
                                                    @RequestPart(value = "cv") final MultipartFile cv,
                                                    @RequestPart(value = "bachelorReport", required = false) final MultipartFile bachelorReport) throws MessagingException, IOException {
        if (bucket.tryConsume(1)) {
            final ThesisApplication application = thesisApplicationService
                    .create(thesisApplication, examinationReport, cv, bachelorReport);
            mailingService.thesisApplicationCreatedEmail(application.getStudent(), application);
            mailingService.sendThesisApplicationConfirmationEmail(application.getStudent(), application);
            return ResponseEntity.ok(application);
        }

        log.error("Post request on /thesis-applications was rejected due to exceeded request velocity.");
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }

    @PostMapping("/{thesisApplicationId}/assessment")
    @PreAuthorize("hasRole('chair-member') || hasRole('prompt-admin')")
    public ResponseEntity<ThesisApplication> assess(@PathVariable final UUID thesisApplicationId,
                                           @RequestBody final ThesisApplicationAssessment assessment) {
        return ResponseEntity.ok(thesisApplicationService.assess(thesisApplicationId, assessment.getStatus(), assessment.getAssessmentComment()));
    }

    @GetMapping("/thesis-advisors")
    @PreAuthorize("hasRole('chair-member') || hasRole('prompt-admin')")
    public ResponseEntity<List<ThesisAdvisor>> getAllThesisAdvisors() {
        return ResponseEntity.ok(thesisApplicationService.getAllThesisAdvisors());
    }

    @PutMapping("/thesis-advisors")
    @PreAuthorize("hasRole('chair-member') || hasRole('prompt-admin')")
    public ResponseEntity<List<ThesisAdvisor>> updateThesisAdvisorList(@RequestBody final ThesisAdvisor thesisAdvisor) {
        return ResponseEntity.ok(thesisApplicationService.updateThesisAdvisorList(thesisAdvisor));
    }

    @PostMapping("/{thesisApplicationId}/thesis-advisor/{thesisAdvisorId}")
    @PreAuthorize("hasRole('chair-member') || hasRole('prompt-admin')")
    public ResponseEntity<ThesisApplication> assignThesisAdvisor(@PathVariable final UUID thesisApplicationId,
                                                                  @PathVariable final UUID thesisAdvisorId) {
        return ResponseEntity.ok(thesisApplicationService.assignThesisAdvisor(thesisApplicationId, thesisAdvisorId));
    }

    @PostMapping("/{thesisApplicationId}/accept")
    @PreAuthorize("hasRole('chair-member') || hasRole('prompt-admin')")
    public ResponseEntity<ThesisApplication> acceptThesisApplication(
            @PathVariable final UUID thesisApplicationId,
            @RequestParam(required = false, defaultValue = "false") final boolean notifyStudent) {
        return ResponseEntity.ok(thesisApplicationService.accept(thesisApplicationId, notifyStudent));
    }

    @PostMapping("/{thesisApplicationId}/reject")
    @PreAuthorize("hasRole('chair-member') || hasRole('prompt-admin')")
    public ResponseEntity<ThesisApplication> rejectThesisApplication(
            @PathVariable final UUID thesisApplicationId,
            @RequestParam(required = false, defaultValue = "false") final boolean notifyStudent) {
        return ResponseEntity.ok(thesisApplicationService.reject(thesisApplicationId, notifyStudent));
    }
}
