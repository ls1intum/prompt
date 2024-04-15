package prompt.ls1.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table
public class DevelopmentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String gitlabUsername;

    private String appleId;

    private String macBookDeviceId;

    @JsonProperty("iPhoneDeviceId")
    private String iPhoneDeviceId;

    @JsonProperty("iPadDeviceId")
    private String iPadDeviceId;

    private String appleWatchDeviceId;

}
