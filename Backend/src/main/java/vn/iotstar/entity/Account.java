package vn.iotstar.entity;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;
import vn.iotstar.enums.ERole;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Account")
public class Account implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "accountID")
	private int accountID;

	@Column(name = "userName", columnDefinition = "varchar(100) NOT NULL")
	private String userName;

	@Column(name = "passWord", columnDefinition = "varchar(50) NOT NULL")
	private String passWord;

	@Column(name = "email", columnDefinition = "varchar(255) NOT NULL")
	private String email;

	@Column(name = "createDate", columnDefinition = "datetime NULL")
	private LocalDate createDate = LocalDate.now();

	@Column(name = "active", columnDefinition = "int NOT NULL")
	private int active;

	@Enumerated(EnumType.STRING)
	private ERole role;

	@Column(name = "photo", columnDefinition = "varchar(255) NULL")
	private String photo;

}
