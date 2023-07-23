package prompt.ls1.controller.payload;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class TechnicalChallengeScore {
    private UUID developerApplicationId;
    private Double programmingScore;
    private Double quizScore;

}
