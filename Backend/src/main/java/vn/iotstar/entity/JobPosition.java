package vn.iotstar.entity;

import java.util.List;

import org.hibernate.annotations.Type;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "JobPosition")
@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
public class JobPosition {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String title;

	@Type(io.hypersistence.utils.hibernate.type.json.JsonBinaryType.class)
	@Column(columnDefinition = "jsonb")
	private List<String> questions;

}
