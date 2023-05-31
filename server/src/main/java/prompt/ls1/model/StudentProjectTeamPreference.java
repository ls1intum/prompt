package prompt.ls1.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@Entity
@Table
@NoArgsConstructor
public class StudentProjectTeamPreference implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID projectTeamId;

    private Integer priorityScore;

    @Lob  
    private String reason;

    @ManyToOne(fetch = FetchType.EAGER)
    private StudentProjectTeamPreferencesSubmission studentProjectTeamPreferencesSubmission;
}
