package vn.iotstar.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Transaction")
public class Transaction implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer transactionID;
	
	@Column(name = "paymentMethod", nullable = false, length = 255)
	private String paymentMethod;
	
	@Column(name = "createDate")
	private LocalDate createDate = LocalDate.now();
	
	@Column(name = "total", precision = 10, scale = 2)
	private BigDecimal total;
	
	@ManyToOne
	@JoinColumn(name = "employerID")
	private Employer employer;
	
	@OneToOne(mappedBy = "transaction")
	@JsonManagedReference
	private  TransactionDetail transDetail;

}
