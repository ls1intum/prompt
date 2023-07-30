package prompt.ls1.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import prompt.ls1.model.enums.Gender;

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

    @Column(length = 50)
    @Length(max = 50)
    private String firstName;

    @Column(length = 50)
    @Length(max = 50)
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(length = 10)
    @Length(max = 10)
    private String nationality;

    @Email
    @Column(unique = true, length = 100)
    @Length(max = 100)
    private String email;

    @Column(length = 20)
    @Length(max = 20)
    private String tumId;

    @Column(length = 30)
    @Length(max = 30)
    private String matriculationNumber;

    private Boolean isExchangeStudent;

    private Boolean suggestedAsCoach;

    private Boolean suggestedAsTutor;

    private Boolean blockedByPm;

    @Lob
    private String reasonForBlockedByPm;
}
