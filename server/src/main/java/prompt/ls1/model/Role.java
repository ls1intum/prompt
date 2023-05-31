package prompt.ls1.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RoleType name;

    public Role() {

    }

    public Role(RoleType name) {
        this.name = name;
    }
}
