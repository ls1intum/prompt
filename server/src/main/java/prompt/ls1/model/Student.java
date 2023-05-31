package prompt.ls1.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
@Entity
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = { "public_id" }),
        @UniqueConstraint(columnNames = { "email" }) })
public class Student implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "public_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID publicId;

    @Column
    private String firstName;

    @Column
    private String lastName;

    @Column
    private Gender gender;

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
