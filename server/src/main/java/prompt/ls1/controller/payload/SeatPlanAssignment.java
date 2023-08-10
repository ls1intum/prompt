package prompt.ls1.controller.payload;

import lombok.Getter;
import lombok.Setter;

import javax.annotation.Nullable;
import java.util.UUID;

@Getter
@Setter
public class SeatPlanAssignment {
    private UUID introCourseParticipationId;
    @Nullable
    private UUID tutorId;
    private String seat;
}
