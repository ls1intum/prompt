package prompt.ls1.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
@Entity
@Table(name = "student")
public class Student implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column
    private String firstName;

    @Column
    private String lastName;

    @Column
    private String gender;

    @Column
    private String nationality;

    @Email
    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String tumId;

    @Column(unique = true)
    private String matriculationNumber;

    @Column
    private Boolean isExchangeStudent;
}
