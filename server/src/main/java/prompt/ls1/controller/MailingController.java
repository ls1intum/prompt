package prompt.ls1.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import prompt.ls1.service.MailingService;

@RestController
@RequestMapping("/mailing")
public class MailingController {
    private final MailingService mailingService;

    @Autowired
    public MailingController(final MailingService mailingService) {
        this.mailingService = mailingService;
    }

    @GetMapping("/templates/{filename}")
    @PreAuthorize("hasRole('chair-member') || hasRole('prompt-admin')")
    public ResponseEntity<String> getMailTemplate(@PathVariable final String filename) {
        return ResponseEntity.ok(mailingService.getMailTemplate(filename));
    }

    @PostMapping("/templates/{filename}")
    @PreAuthorize("hasRole('chair-member') || hasRole('prompt-admin')")
    public ResponseEntity<String> updateMailTemplate(@PathVariable final String filename,
                                                     @RequestBody final String template) {
        mailingService.updateMailTemplate(filename, template);
        return ResponseEntity.ok("Template updated successfully");
    }
}
