package orgatool.ls1.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
@Entity
@Table(name = "student")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String firstName;

    private String lastName;

    private String gender;

    private String nationality;

    @Email
    private String email;

    private String tumId;

    private String matriculationNumber;

    private boolean isExchangeStudent;
}
