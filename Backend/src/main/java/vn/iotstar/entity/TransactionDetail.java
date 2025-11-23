package vn.iotstar.entity;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "TransactionDetail")
public class TransactionDetail implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transDetailID")
    private Integer transDetailID;
    
    @OneToOne
    @JoinColumn(name = "transactionID", referencedColumnName = "transactionID")
    private Transaction transaction;
    
 
    @Column(name = "expiry_date")
    private LocalDate expiryDate;
    
 
}