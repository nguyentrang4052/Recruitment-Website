package vn.iotstar.entity;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "InterviewSession")
public class InterviewSession {

	@Id
	@GeneratedValue
	private UUID id;

	private Integer positionId;
	private String userEmail;
	private String status = "ONGOING";

}
