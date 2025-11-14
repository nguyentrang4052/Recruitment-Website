package vn.iotstar.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Answer")
public class Answer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private UUID sessionId;
	private Integer questionIndex;
	private String audioUrl;
	@Column(columnDefinition = "TEXT")
	private String transcript;
	private Integer score;
	@Column(columnDefinition = "TEXT")
	private String feedback;

}
