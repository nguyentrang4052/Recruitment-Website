package vn.iotstar.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="TransactionDetail")
public class TransactionDetail implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "transDetailID")
	private Integer transDetailID;
	
	@Column(name = "quantity", nullable = false)
	private Integer quantity;
	
	@OneToOne
	@JoinColumn(name="transactionID", referencedColumnName = "transactionID")
	private Transaction transaction;
	
	@ManyToMany
	@JoinTable(name = "TransDetailPackage", joinColumns = @JoinColumn(name = "transactionID"), inverseJoinColumns = @JoinColumn(name = "packageID"))
	private List<PostPackage> postPackage;
	
	@Column(name = "expiry_date")
	private LocalDate expiryDate;
	
}
