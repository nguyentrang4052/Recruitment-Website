package vn.iotstar.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PostPackage")
public class PostPackage implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column (name = "packageID")
	private Integer packageID;

	@Column (name = "packageName", nullable = false, length = 255)
	private String packageName;

	@Column(name = "categoryName", nullable = false, length = 255)
	private String categoryName;
	
	@Column(name="price", nullable = false, precision = 10, scale = 2)
	private BigDecimal price;
	
	@ManyToMany(mappedBy="postPackage")
	@JsonManagedReference
	private List<TransactionDetail> transDetail = new ArrayList<>();
	
	@ManyToMany(mappedBy = "postPackage")
	@JsonManagedReference
	private List<TransactionDetail> tranDetails;
}
