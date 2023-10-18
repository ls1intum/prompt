package prompt.ls1.controller.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Data

@Getter
@Setter
public class StudentTechnicalDetails implements Serializable {
    private String studentId;
    private String appleId;
    private String macBookDeviceId;
    @JsonProperty("iPhoneDeviceId")
    private String iPhoneDeviceId;
    @JsonProperty("iPadDeviceId")
    private String iPadDeviceId;
    private String appleWatchDeviceId;
}
